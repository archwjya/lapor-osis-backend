// Dynamic questions config. Can be loaded from DB for full dynamic capability.
module.exports = [
  { type: 'bullying', questions: [
    { question: 'Where did the incident happen?', type: 'text' },
    { question: 'Who was involved?', type: 'text' },
    { question: 'Describe what happened.', type: 'textarea' }
  ] },
  { type: 'facility', questions: [
    { question: 'Which facility?', type: 'text' },
    { question: 'What is the issue?', type: 'textarea' }
  ] }
];
