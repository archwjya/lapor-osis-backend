const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const Report = require('../models/report');
const logger = require('../utils/logger');

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState('baileys_auth');
  const sock = makeWASocket({ auth: state });

  sock.ev.on('messages.upsert', async ({ messages }) => {
    for (const msg of messages) {
      if (!msg.message?.conversation) continue;
      const text = msg.message.conversation;
      const sender = msg.key.remoteJid;
      logger.bot(`Received: ${text} from ${sender}`);
      let reply = '';
      if (text === '/reports') {
        const reports = await Report.find().limit(5);
        reply = reports.map(r => `${r._id}: ${r.type} [${r.status}]`).join('\n') || 'No reports.';
      } else if (text.startsWith('/report ')) {
        const id = text.split(' ')[1];
        const report = await Report.findById(id);
        reply = report ? JSON.stringify(report, null, 2) : 'Report not found.';
      } else if (text.startsWith('/assign ')) {
        const [_, id, teacher] = text.split(' ');
        const report = await Report.findByIdAndUpdate(id, { assignedTo: teacher, status: 'assigned' }, { new: true });
        reply = report ? `Assigned to ${teacher}` : 'Report not found.';
      } else if (text.startsWith('/resolve ')) {
        const id = text.split(' ')[1];
        const report = await Report.findByIdAndUpdate(id, { status: 'resolved' }, { new: true });
        reply = report ? 'Report resolved.' : 'Report not found.';
      } else {
        reply = 'Unknown command.';
      }
      await sock.sendMessage(sender, { text: reply });
      logger.bot(`Replied: ${reply} to ${sender}`);
    }
  });

  sock.ev.on('creds.update', saveCreds);
}

module.exports = { startBot };
