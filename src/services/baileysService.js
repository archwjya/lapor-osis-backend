const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Report = require('../models/report');
const logger = require('../utils/logger');



let qrCode = null;
let sockInstance = null;


async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');
  const sock = makeWASocket({ auth: state });
  sockInstance = sock;

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message?.conversation) continue;
      const text = msg.message.conversation.trim();
      const sender = msg.key.remoteJid;
      logger.bot(`Received: ${text} from ${sender}`);
      let reply = '';

      // /reports (type: xls, text | default: text) (page: number | default 1)
      if (text.startsWith('/reports')) {
        const [, type = 'text', page = '1'] = text.split(' ');
        const pageNum = parseInt(page) || 1;
        const pageSize = 5;
        const reports = await Report.find().skip((pageNum - 1) * pageSize).limit(pageSize);
        if (type === 'xls') {
          const ExcelJS = require('exceljs');
          const workbook = new ExcelJS.Workbook();
          const sheet = workbook.addWorksheet('Reports');
          sheet.columns = [
            { header: 'Tracking Code', key: 'trackingCode', width: 20 },
            { header: 'Title', key: 'title', width: 30 },
            { header: 'Category', key: 'category', width: 20 },
            { header: 'Status', key: 'status', width: 15 },
            { header: 'Urgency', key: 'urgency', width: 10 },
            { header: 'Location', key: 'location', width: 20 },
            { header: 'Anonymous', key: 'anonymous', width: 10 },
            { header: 'Contact', key: 'contact', width: 20 }
          ];
          reports.forEach(r => {
            sheet.addRow({
              trackingCode: r.trackingCode || r._id,
              title: r.title,
              category: r.category,
              status: r.status,
              urgency: r.urgency,
              location: r.location,
              anonymous: r.anonymous ? 'Yes' : 'No',
              contact: r.contact || ''
            });
          });
          const buffer = await workbook.xlsx.writeBuffer();
          await sock.sendMessage(sender, {
            document: buffer,
            mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            fileName: `reports_page_${pageNum}.xlsx`
          });
          reply = 'XLS file sent.';
        } else {
          reply = reports.map(r => `${r.trackingCode || r._id}: ${r.title} [${r.status}]`).join('\n') || 'No reports.';
          reply += `\nPage ${pageNum}`;
        }
      }
      // /search (id | report title)
      else if (text.startsWith('/search ')) {
        const query = text.replace('/search ', '').trim();
        let report = await Report.findOne({ $or: [ { trackingCode: query }, { title: new RegExp(query, 'i') } ] });
        reply = report ? JSON.stringify(report, null, 2) : 'Report not found.';
      }
      // /set status (id) (waiting, on process, cancel, finished)
      else if (text.startsWith('/set status ')) {
        const [, , id, status] = text.split(' ');
        const validStatus = ['waiting', 'on process', 'cancel', 'finished'];
        if (!validStatus.includes(status)) {
          reply = 'Invalid status.';
        } else {
          const report = await Report.findOneAndUpdate({ $or: [{ _id: id }, { trackingCode: id }] }, { status }, { new: true });
          reply = report ? `Status set to ${status}` : 'Report not found.';
        }
      }
      // /resolve (id)
      else if (text.startsWith('/resolve ')) {
        const id = text.split(' ')[1];
        const report = await Report.findOneAndUpdate({ $or: [{ _id: id }, { trackingCode: id }] }, { status: 'finished' }, { new: true });
        reply = report ? 'Report resolved.' : 'Report not found.';
      }
      // /evidence (id)
      else if (text.startsWith('/evidence ')) {
        const id = text.split(' ')[1];
        const report = await Report.findOne({ $or: [{ _id: id }, { trackingCode: id }] });
        if (!report || !report.evidenceFiles || report.evidenceFiles.length === 0) {
          reply = 'No evidence files.';
        } else {
          reply = report.evidenceFiles.map(f => `api/files/${f.name}?key=${report.trackingCode || report._id}`).join('\n');
        }
      }
      else {
        reply = 'Unknown command.';
      }
      await sock.sendMessage(sender, { text: reply });
      logger.bot(`Replied: ${reply} to ${sender}`);
    }
  });

  // Send new report notification to group 'Laporan-Osis'
  Report.watch().on('change', async (change) => {
    if (change.operationType === 'insert') {
      const report = change.fullDocument;
      const groupName = 'Laporan-Osis';
      // Find group and send message (placeholder, implement group search if needed)
      // await sock.sendMessage(groupJid, { text: `New report: ${report.title}\nTracking: ${report.trackingCode}` });
      logger.bot(`New report notification for group: ${report.title}`);
    }
  });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', (update) => {
    if (update.qr) {
      qrCode = update.qr;
    } else if (update.connection === 'open' || update.connection === 'close') {
      qrCode = null;
    }
  });
}

function getQrCode() {
  return qrCode;
}

module.exports = { startBot, getQrCode };
