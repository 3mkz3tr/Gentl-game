const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const OWNER_EMAIL = "zaxxr229@gmail.com";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { maxHttpBufferSize: 1e7 }); // لدعم تسجيلات الصوت

app.use(express.static('public'));
app.use(express.json({ limit: '10mb' }));

const otpStore = {};

// فلتر الكلمات غير اللائقة
const BAD_WORDS_REGEX = /(كلب|حمار|منيوك|قحبة|شرموط|عرص|طيز|كس|زب|يلعن|قواد|زق|سافل|حقير)/i;

app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'حط إيميلك يا الأمير!' });

  const code = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  console.log(`🔑 كود الدخول للإيميل [${email}]: ${code}`);
  res.json({ message: 'تم إرسال الرمز بنجاح!', debugCode: code });
});

app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body;
  const record = otpStore[email];

  if (!record || record.code !== code || Date.now() > record.expires) {
    return res.status(400).json({ error: 'الرمز غلط أو انتهت صلاحيته!' });
  }

  delete otpStore[email];
  const isOwner = (email.trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase());
  res.json({ success: true, email, isOwner });
});

// فحص الاسم
app.post('/api/check-name', (req, res) => {
  const { name } = req.body;
  if (BAD_WORDS_REGEX.test(name)) {
    return res.status(400).json({ 
      error: "لا تستعمل القذف او الشتم هذا اول تحذير اذا عدتها بتاخذ باند خمس دقيق🚨" 
    });
  }
  res.json({ valid: true });
});

// ================= بنك أسئلة لعبة خدعة الأجوبة =================
const BLUFF_QUESTIONS = [
  { q: "وش لون سروال خلف المشهور؟", a: "أصفر منقط بأخضر فسفوري", category: "شاطحة" },
  { q: "وش اسم أول سيارة تسوقها في لعبة GTA San Andreas؟", a: "سيكل BMX", category: "ألعاب" },
  { q: "وش الحيوان اللي ينام وإحدى عينيه مفتوحة؟", a: "الدولفين", category: "ذكاء" },
  { q: "في لعبة كراش، وش اسم القناع الخشبي اللي يصارخ؟", a: "أوكا أوكا", category: "ألعاب" },
  { q: "وش أغرب شي أكله رجل فرنسي ودخل موسوعة غينيس؟", a: "طيارة كاملة نوع سيسنا", category: "شاطحة" },
  { q: "كم قلب يمتلك الأخطبوط؟", a: "ثلاثة قلوب", category: "ذكاء" },
  { q: "أقوى درع في لعبة ماين كرافت مصنوع من مادة؟", a: "النيذرايت (Netherite)", category: "ألعاب" }
];

// بنك ميمز لعبة قلد الصوت
const MEME_SOUNDS = [
  { title: "يا ساتر يا رب! 😱", hint: "صرخة الرعب الشهيرة" },
  { title: "إيييه يا وديع.. خلاص طلقها! 💔", hint: "فيلم مصري أسطوري" },
  { title: "تفحيط كامري 2002 بشارع النخيل 🏎️💨", hint: "ططططط طعععع تن تن" },
  { title: "طير إنت والحمار حقك! 🐴", hint: "عصبية تيك توك" },
  { title: "ألو.. مين معاي؟ طقعان! 📞", hint: "مقلب اتصال قديم" }
];

const rooms = {};

io.on('connection', (socket) => {
  
  // إنشاء غرفة
  socket.on('create_room', ({ username, email, isOwner, avatar, gameType }) => {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    rooms[roomCode] = {
      code: roomCode,
      hostId: socket.id,
      gameType: gameType || 'BLUFF', // 'BLUFF', 'MIMIC', 'DAKEEL'
      settings: { writeTime: 30, guessTime: 20, maxRounds: 5 },
      round: 0,
      state: 'LOBBY',
      players: [{ id: socket.id, username, email, isOwner, avatar, score: 0 }],
      currentQ: null,
      submittedAnswers: {},
      votes: {}
    };

    socket.join(roomCode);
    socket.emit('room_created', rooms[roomCode]);
  });

  // الانضمام
  socket.on('join_room', ({ roomCode, username, email, isOwner, avatar }) => {
    const room = rooms[roomCode?.toUpperCase()];
    if (!room) return socket.emit('error_msg', 'الكود غلط يا الحبيب ما فيه غرفة كذا!');
    if (room.state !== 'LOBBY') return socket.emit('error_msg', 'اللعب بادي، انتظر للجولة الجاية!');

    room.players.push({ id: socket.id, username, email, isOwner, avatar, score: 0 });
    socket.join(room.code);
    io.to(room.code).emit('room_updated', room);
  });

  // تحديث إعدادات الغرفة من راعي الروم
  socket.on('update_settings', ({ roomCode, settings }) => {
    const room = rooms[roomCode];
    if (room && socket.id === room.hostId) {
      room.settings = { ...room.settings, ...settings };
      io.to(roomCode).emit('settings_updated', room.settings);
    }
  });

  // ================= لعبة خدعة الأجوبة =================
  socket.on('start_bluff_round', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (room.players.length < 3) {
      return socket.emit('error_msg', 'الماب ما يكفي! لازم 3 متكين على الأقل في جنتل بلاي!');
    }

    room.state = 'BLUFF_WRITING';
    room.submittedAnswers = {};
    room.votes = {};
    room.round++;

    // اختيار سؤال
    const qIndex = Math.floor(Math.random() * BLUFF_QUESTIONS.length);
    room.currentQ = BLUFF_QUESTIONS[qIndex];

    io.to(roomCode).emit('bluff_question_phase', {
      question: room.currentQ.q,
      category: room.currentQ.category,
      timeLimit: room.settings.writeTime,
      round: room.round
    });
  });

  // استلام الإجابة الكذابة من اللاعب
  socket.on('submit_fake_answer', ({ roomCode, fakeAnswer }) => {
    const room = rooms[roomCode];
    if (!room) return;

    room.submittedAnswers[socket.id] = fakeAnswer.trim();

    // إذا كل اللاعبين أرسلوا كذباتهم، ننقلهم للتخمين فوراً
    if (Object.keys(room.submittedAnswers).length === room.players.length) {
      startGuessingPhase(room);
    }
  });

  function startGuessingPhase(room) {
    room.state = 'BLUFF_GUESSING';
    const choices = [];

    // إضافة الإجابة الحقيقية
    choices.push({ text: room.currentQ.a, authorId: 'REAL' });

    // إضافة كذبات اللاعبين
    for (const pid in room.submittedAnswers) {
      choices.push({ text: room.submittedAnswers[pid], authorId: pid });
    }

    // خلط الإجابات عشوائياً
    choices.sort(() => Math.random() - 0.5);
    room.currentChoices = choices;

    io.to(room.code).emit('bluff_guessing_phase', {
      question: room.currentQ.q,
      choices: choices.map(c => c.text),
      timeLimit: room.settings.guessTime
    });
  }

  // تصويت اللاعب على الإجابة
  socket.on('submit_vote', ({ roomCode, chosenText }) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.votes[socket.id] = chosenText;

    if (Object.keys(room.votes).length === room.players.length) {
      calculateBluffResults(room);
    }
  });

  function calculateBluffResults(room) {
    const realAns = room.currentQ.a;
    const scoresGained = {};
    room.players.forEach(p => scoresGained[p.id] = 0);

    // حساب النقاط
    for (const voterId in room.votes) {
      const vote = room.votes[voterId];
      if (vote === realAns) {
        scoresGained[voterId] += 500; // اللي جاب الصح له 500
      } else {
        // إذا اختار كذبة أحد
        for (const [authorId, fakeText] of Object.entries(room.submittedAnswers)) {
          if (fakeText === vote && authorId !== voterId) {
            scoresGained[authorId] += 300; // اللي خدع خويّه له 300
          }
        }
      }
    }

    // تحديث السكور
    room.players.forEach(p => p.score += (scoresGained[p.id] || 0));

    io.to(room.code).emit('bluff_round_results', {
      realAnswer: realAns,
      players: room.players,
      scoresGained
    });
  }

  // ================= لعبة قلد الصوت =================
  socket.on('start_mimic_round', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    if (room.players.length < 3) return socket.emit('error_msg', 'لازم 3 لاعبين على الأقل!');

    const randomMeme = MEME_SOUNDS[Math.floor(Math.random() * MEME_SOUNDS.length)];
    io.to(roomCode).emit('mimic_challenge', randomMeme);
  });

  // مشاركة تسجيل الصوت بين الجوالات
  socket.on('send_voice_mimic', ({ roomCode, audioData, username }) => {
    io.to(roomCode).emit('broadcast_voice', { audioData, username });
  });

  // الخروج
  socket.on('disconnect', () => {
    for (const code in rooms) {
      const room = rooms[code];
      room.players = room.players.filter(p => p.id !== socket.id);
      if (room.players.length === 0) delete rooms[code];
      else io.to(code).emit('room_updated', room);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎩 سيرفر جنتل بلاي الفخم شغال على المنفذ: ${PORT}`);
});
