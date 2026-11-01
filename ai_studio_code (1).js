const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

// 🔥 إيميل الريس والعم الرسمي والوحيد 🔥
const OWNER_EMAIL = "zaxxr229@gmail.com";

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// قراءة مجلد الملفات الثابتة (واجهة الموقع)
app.use(express.static('public'));
app.use(express.json());

// حفظ الرموز المؤقتة في الذاكرة
const otpStore = {};

// طلب رمز التحقق (OTP)
app.post('/api/send-otp', (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'وين الإيميل يا الحبيب؟' });

  // توليد رمز سري عشوائي من 4 أرقام
  const code = Math.floor(1000 + Math.random() * 9000).toString();
  otpStore[email] = { code, expires: Date.now() + 5 * 60 * 1000 };

  console.log(`\n========================================`);
  console.log(`🔑 رمز الدخول للإيميل [${email}]: ${code}`);
  console.log(`========================================\n`);

  res.json({ message: 'تم إرسال الرمز بنجاح!', debugCode: code });
});

// التحقق من رمز الدخول
app.post('/api/verify-otp', (req, res) => {
  const { email, code } = req.body;
  const record = otpStore[email];

  if (!record || record.code !== code || Date.now() > record.expires) {
    return res.status(400).json({ error: 'الرمز غلط أو انتهت مدته، حاول ثانية!' });
  }

  delete otpStore[email];
  // التحقق هل المسجل هو الريس والعم
  const isOwner = (email.trim().toLowerCase() === OWNER_EMAIL.trim().toLowerCase());
  res.json({ success: true, email, isOwner });
});

// ================= نظام الغرف ولعبة الدخيل =================
const rooms = {};
const WORDS = [
  { word: "كبسة حاشي", hint: "أكلة سعودية معروفة" },
  { word: "شاورما دجاج", hint: "عشاء آخر الليل" },
  { word: "سيفين ونخلة", hint: "شعار فخم" },
  { word: "بلكونة", hint: "مكان في البيت" },
  { word: "طعوس الثمامة", hint: "كشتات وتطعيس" },
  { word: "فكسار 2007", hint: "موتر الطيبين" }
];

io.on('connection', (socket) => {
  // إنشاء غرفة جديدة
  socket.on('create_room', ({ username, email, isOwner }) => {
    const roomCode = Math.random().toString(36).substring(2, 6).toUpperCase();
    rooms[roomCode] = {
      code: roomCode,
      hostId: socket.id,
      state: 'LOBBY',
      players: [{ id: socket.id, username, email, isOwner, role: null }],
      word: null,
      imposterId: null
    };

    socket.join(roomCode);
    socket.emit('room_created', { roomCode, room: rooms[roomCode] });
  });

  // دخول خويك للغرفة بالكود
  socket.on('join_room', ({ roomCode, username, email, isOwner }) => {
    const code = roomCode.toUpperCase();
    const room = rooms[code];

    if (!room) {
      return socket.emit('error_msg', 'ما فيه غرفة بهذا الكود يا بعدي!');
    }
    if (room.state !== 'LOBBY') {
      return socket.emit('error_msg', 'الجيم بادي من زمان، انتظرهم يخلصون!');
    }

    room.players.push({ id: socket.id, username, email, isOwner, role: null });
    socket.join(code);

    io.to(code).emit('room_updated', room);
  });

  // بدء الجيم (شرط 3 لاعبين فأكثر)
  socket.on('start_game', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;

    if (socket.id !== room.hostId) {
      return socket.emit('error_msg', 'بس راعي الروم هو اللي يقدر يبدأ!');
    }

    if (room.players.length < 3) {
      return socket.emit('error_msg', 'الماب ما يكفي! لازم 3 متكين على الأقل عشان تبدون!');
    }

    // توزيع الأدوار عشوائياً
    room.state = 'PLAYING';
    const randomItem = WORDS[Math.floor(Math.random() * WORDS.length)];
    const imposterIndex = Math.floor(Math.random() * room.players.length);

    room.players.forEach((p, idx) => {
      if (idx === imposterIndex) {
        p.role = 'IMPOSTER';
        io.to(p.id).emit('game_started', {
          isImposter: true,
          hint: randomItem.hint,
          players: room.players
        });
      } else {
        p.role = 'CITIZEN';
        io.to(p.id).emit('game_started', {
          isImposter: false,
          secretWord: randomItem.word,
          hint: randomItem.hint,
          players: room.players
        });
      }
    });
  });

  // كشف الدخيل ونهاية الجولة
  socket.on('reveal_imposter', (roomCode) => {
    const room = rooms[roomCode];
    if (!room) return;
    const imposter = room.players.find(p => p.role === 'IMPOSTER');
    io.to(roomCode).emit('game_ended', { imposterName: imposter ? imposter.username : 'مجهول' });
    room.state = 'LOBBY';
  });

  // خروج لاعب من الروم
  socket.on('disconnect', () => {
    for (const code in rooms) {
      const room = rooms[code];
      const index = room.players.findIndex(p => p.id === socket.id);
      if (index !== -1) {
        room.players.splice(index, 1);
        if (room.players.length === 0) {
          delete rooms[code];
        } else {
          if (room.hostId === socket.id) {
            room.hostId = room.players[0].id;
          }
          io.to(code).emit('room_updated', room);
        }
        break;
      }
    }
  });
});

// المنفذ الخاص بـ Render أو التشغيل المحلي
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 السيرفر شغال وتمام التمام على المنفذ: ${PORT}`);
});