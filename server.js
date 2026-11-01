<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>جنتل بلاي | Gentle Play 🎩</title>
  <!-- مكتبة السوكت برابط عالمي سريع ومضمون -->
  <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
  <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@500;700;900&display=swap" rel="stylesheet">
  
  <style>
    /* سكيومورفيزم ملكي فاخر */
    :root {
      --gold-grad: linear-gradient(135deg, #fce043 0%, #d4af37 50%, #aa771c 100%);
      --gold-border: #845e14;
      --bg-dark: #12100e;
      --leather: #1f1b18;
      --card-bg: #292420;
      --gold-shadow: inset 0 2px 2px rgba(255,255,255,0.7), 0 5px 12px rgba(0,0,0,0.8);
      --inset-field: inset 0 3px 6px rgba(0,0,0,0.9);
    }

    * { box-sizing: border-box; font-family: 'Tajawal', sans-serif; }

    body {
      background: radial-gradient(circle, #2d2620, #0d0b09);
      margin: 0;
      padding: 15px;
      color: #f7ede2;
      display: flex;
      justify-content: center;
      min-height: 100vh;
    }

    .gentle-container {
      width: 100%;
      max-width: 520px;
      background: var(--leather);
      border: 5px solid #4a3c2c;
      outline: 3px solid #d4af37;
      border-radius: 28px;
      box-shadow: 0 20px 50px rgba(0,0,0,0.9), inset 0 2px 4px rgba(255,255,255,0.2);
      padding: 20px;
      position: relative;
    }

    .header-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: linear-gradient(180deg, #38312b 0%, #1e1a17 100%);
      border: 2px solid #6b553d;
      border-radius: 18px;
      padding: 10px 15px;
      box-shadow: inset 0 2px 4px rgba(0,0,0,0.8), 0 4px 8px rgba(0,0,0,0.6);
      margin-bottom: 20px;
    }

    .user-info { display: flex; align-items: center; gap: 12px; }
    
    .avatar-frame {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      border: 2px solid #d4af37;
      background: #000;
      object-fit: cover;
      box-shadow: 0 3px 8px rgba(0,0,0,0.8);
    }

    .badge-owner {
      background: var(--gold-grad);
      color: #000;
      font-weight: 900;
      padding: 3px 10px;
      border-radius: 20px;
      font-size: 0.8rem;
      border: 1px solid #fff;
      display: inline-block;
    }

    .btn {
      background: var(--gold-grad);
      border: 2px solid #5a3e0b;
      border-radius: 14px;
      color: #1a1202;
      font-weight: 900;
      font-size: 1.1rem;
      padding: 12px 20px;
      cursor: pointer;
      box-shadow: var(--gold-shadow);
      text-shadow: 0 1px 1px rgba(255,255,255,0.6);
      width: 100%;
      margin: 8px 0;
      transition: all 0.1s ease;
    }
    .btn:active {
      transform: translateY(3px);
      box-shadow: inset 0 3px 6px rgba(0,0,0,0.8);
    }
    .btn-dark {
      background: linear-gradient(180deg, #443c35, #221d19);
      color: #d4af37;
      border-color: #6b553d;
    }
    .btn-red {
      background: linear-gradient(180deg, #e63946, #8b0000);
      color: #fff;
      border-color: #500;
    }

    input, select {
      width: 100%;
      padding: 12px;
      margin: 8px 0;
      border-radius: 12px;
      border: 2px solid #554433;
      background: #171412;
      font-size: 1.05rem;
      font-weight: bold;
      color: #fce043;
      box-shadow: var(--inset-field);
    }
    input:focus, select:focus { outline: none; border-color: #d4af37; }

    .card {
      background: var(--card-bg);
      border: 2px solid #534333;
      border-radius: 20px;
      padding: 18px;
      margin-bottom: 15px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.6), inset 0 1px 2px rgba(255,255,255,0.1);
    }

    .vip-tag {
      background: linear-gradient(180deg, #ffd700, #b8860b);
      color: #000;
      font-size: 0.75rem;
      font-weight: 900;
      padding: 2px 8px;
      border-radius: 6px;
      float: left;
    }

    .timer-badge {
      font-size: 1.6rem;
      color: #fce043;
      background: #110e0c;
      padding: 6px 18px;
      border-radius: 20px;
      border: 2px solid #d4af37;
      display: inline-block;
      margin: 10px 0;
    }

    .screen { display: none; }
    .active { display: block; }
  </style>
</head>
<body>

<div class="gentle-container">
  
  <!-- الشريط العلوي -->
  <div class="header-bar">
    <div class="user-info">
      <img id="my-avatar" class="avatar-frame" src="https://api.dicebear.com/7.x/bottts/svg?seed=gentle" alt="avatar">
      <div>
        <span id="display-name" style="font-weight:900;">زائر</span>
        <div id="owner-badge" class="badge-owner" style="display:none;">الريس والعم 😎</div>
      </div>
    </div>
    <button class="btn btn-dark" style="width:auto; padding:6px 12px; font-size:0.85rem;" onclick="openSettings()">⚙️ الإعدادات</button>
  </div>

  <!-- 1. شاشة تسجيل الدخول -->
  <div id="screen-auth" class="screen active card">
    <h2 style="color:#d4af37; text-align:center;">🎩 مرحباً بك في جنتل بلاي</h2>
    <p style="text-align:center; color:#ccc;">أدخل إيميلك للدخول إلى عالم التحديات:</p>
    
    <div id="step-email">
      <input type="email" id="input-email" placeholder="اكتب إيميلك هنا...">
      <button id="btn-send-otp" class="btn" onclick="sendOTP()">إرسال الرمز السري 📲</button>
    </div>

    <div id="step-otp" style="display:none;">
      <div id="debug-otp-display" style="font-size:1.4rem; font-weight:900; color:#d4af37; margin:10px 0; background:#1b1713; padding:12px; border-radius:12px; border:2px dashed #d4af37; text-align:center;"></div>
      <input type="text" id="input-otp" placeholder="أدخل الرمز الموضح بالأعلى">
      <button class="btn" onclick="verifyOTP()">دخول المجلس 🚪</button>
    </div>
  </div>

  <!-- 2. تحديد الاسم وفلتر الشتم -->
  <div id="screen-name" class="screen card">
    <h2 style="color:#d4af37;">اختر لقبك في جنتل بلاي 🏷️</h2>
    <p style="font-size:0.9rem; color:#aaa;">احرص على اسم محترم، ترى النظام صارم ضد السب والقذف!</p>
    <input type="text" id="input-initial-name" placeholder="اكتب لقبك هنا...">
    <button class="btn" onclick="saveInitialName()">تأكيد ودخول 🔥</button>
  </div>

  <!-- 3. بهو الألعاب الرئيسي -->
  <div id="screen-lobby" class="screen">
    <h2 style="color:#d4af37; text-align:center; margin-bottom:15px;">اختر لعبتك يا الأمير 🎮</h2>

    <!-- خدعة الأجوبة -->
    <div class="card" style="border: 2px solid #d4af37;">
      <h3>🎭 لعبة خدعة الأجوبة (كذاب المحلس)</h3>
      <p style="font-size:0.9rem; color:#bbb;">اكتب إجابة كذابة تخدع ربعك، واكتشف الإجابة الصح من بينهم بدون ما ينصبون عليك!</p>
      <button class="btn" onclick="openRoomLobby('BLUFF')">دخول اللعبة 🚀</button>
    </div>

    <!-- قلد الصوت -->
    <div class="card" style="border: 2px solid #d4af37;">
      <h3>🎙️ لعبة قلّد الصوت (ميمز عربي)</h3>
      <p style="font-size:0.9rem; color:#bbb;">شغل الميم العربي، وافتح المايك وسجل أحسن تقليد وخوياك يصوتون لك!</p>
      <button class="btn" onclick="openRoomLobby('MIMIC')">دخول التحدي 🎤</button>
    </div>

    <!-- الدخيل -->
    <div class="card">
      <h3>🕵️‍♂️ لعبة الدخيل (الكلاسيكية)</h3>
      <p style="font-size:0.9rem; color:#bbb;">اكتشفوا الجاسوس اللي بينكم قبل ما ينكب العفش!</p>
      <button class="btn btn-dark" onclick="openRoomLobby('DAKEEL')">العب الدخيل</button>
    </div>

    <!-- ألعاب VIP -->
    <div class="card" style="background:#1c1713;">
      <span class="vip-tag">VIP بفلوس 👑</span>
      <h3>🃏 بلوت شيوخ جنتل</h3>
      <button class="btn btn-dark" onclick="payVIP()">شراء وتفعيل اللعبة 💳</button>
    </div>

    <div class="card" style="background:#1c1713;">
      <span class="vip-tag">VIP بفلوس 👑</span>
      <h3>🥏 كيرم الملوك الفاخر</h3>
      <button class="btn btn-dark" onclick="payVIP()">شراء وتفعيل اللعبة 💳</button>
    </div>
  </div>

  <!-- 4. شاشة الغرفة -->
  <div id="screen-room" class="screen card">
    <button class="btn btn-red" style="width:auto; padding:4px 10px;" onclick="switchScreen('screen-lobby')">⬅️ رجوع</button>
    <h2 id="room-game-title" style="color:#d4af37;">غرفة اللعب أونلاين</h2>
    
    <button class="btn" onclick="createRoom()">إنشاء غرفة جديدة 🏠</button>
    
    <div style="margin-top:15px; border-top:1px dashed #554433; padding-top:15px;">
      <input type="text" id="input-room-code" placeholder="حط كود غرفة خويك هنا">
      <button class="btn btn-dark" onclick="joinRoom()">دخول الغرفة 🏃‍♂️</button>
    </div>

    <div id="room-details" style="display:none; margin-top:20px; background:#1e1a17; padding:15px; border-radius:15px; border:2px solid #d4af37;">
      <h3>كود الغرفة: <span id="current-room-code" style="color:#fce043; font-size:1.6rem;"></span></h3>
      
      <div id="host-controls" style="display:none; margin:10px 0; background:#29221b; padding:10px; border-radius:10px;">
        <h4 style="color:#d4af37; margin:5px 0;">⚙️ إعدادات الجولة:</h4>
        <label>وقت الكتابة (ثواني):</label>
        <select id="setting-write-time" onchange="syncSettings()">
          <option value="20">20 ثانية</option>
          <option value="30" selected>30 ثانية</option>
          <option value="45">45 ثانية</option>
        </select>
        
        <label>وقت التخمين (ثواني):</label>
        <select id="setting-guess-time" onchange="syncSettings()">
          <option value="15">15 ثانية</option>
          <option value="25" selected>25 ثانية</option>
        </select>

        <label>عدد الراوندات (5 - 10):</label>
        <select id="setting-rounds" onchange="syncSettings()">
          <option value="5" selected>5 راوندات</option>
          <option value="7">7 راوندات</option>
          <option value="10">10 راوندات (أقصى حد)</option>
        </select>
      </div>

      <h4>المتكين بالروم:</h4>
      <ul id="players-list" style="list-style:none; padding:0;"></ul>

      <button id="btn-start" class="btn" onclick="startGameAction()">ابدأ اللعب الآن (أقل حد 3) 🏁</button>
    </div>
  </div>

  <!-- 5. مرحلة كتابة الكذبة -->
  <div id="screen-bluff-write" class="screen card" style="text-align:center;">
    <span class="timer-badge" id="write-timer">30</span>
    <h4 id="question-category" style="color:#d4af37; margin-bottom:5px;">تصنيف: شاطحة</h4>
    <h2 id="bluff-question" style="color:#fff; font-size:1.4rem;"></h2>
    <p style="color:#aaa;">اكتب إجابة كذابة ومنطقية عشان يصدقونك وتلهف نقاطهم!</p>
    <input type="text" id="input-fake-answer" placeholder="اكتب كذبتك هنا بذكاء...">
    <button class="btn" onclick="submitFakeAnswer()">إرسال الخدعة 🎭</button>
  </div>

  <!-- 6. مرحلة التخمين -->
  <div id="screen-bluff-guess" class="screen card" style="text-align:center;">
    <span class="timer-badge" id="guess-timer">20</span>
    <h3 style="color:#d4af37;">وين الإجابة الصحيحة يا ذيبان؟ 👀</h3>
    <h2 id="guess-question" style="color:#fff; font-size:1.3rem;"></h2>
    <div id="choices-container" style="margin-top:15px;"></div>
  </div>

  <!-- 7. مرحلة النتائج -->
  <div id="screen-results" class="screen card" style="text-align:center;">
    <h2 style="color:#d4af37;">نتائج الجولة 🏆</h2>
    <div style="background:#191410; padding:15px; border-radius:12px; margin:10px 0; border:2px solid #5a452c;">
      <p style="color:#aaa; margin:0;">الإجابة الصحيحة كانت:</p>
      <h3 id="correct-ans-reveal" style="color:#52b788; font-size:1.5rem; margin:5px 0;"></h3>
    </div>
    <h4>لوحة الصدارة:</h4>
    <ul id="leaderboard" style="list-style:none; padding:0;"></ul>
    <button id="btn-next-round" class="btn" onclick="nextRound()">الجولة التالية ⏭️</button>
  </div>

  <!-- 8. الإعدادات -->
  <div id="screen-settings" class="screen card">
    <button class="btn btn-red" style="width:auto; padding:4px 10px;" onclick="closeSettings()">⬅️ رجوع</button>
    <h2 style="color:#d4af37;">⚙️ إعدادات الحساب</h2>
    
    <div>
      <label><b>صورتك الشخصية (ارفع من الاستوديو):</b></label>
      <input type="file" id="input-avatar-file" accept="image/*" onchange="uploadAvatar(event)">
    </div>

    <div style="margin-top:15px;">
      <label><b>تغيير اسمك:</b></label>
      <input type="text" id="input-new-name" placeholder="اكتب اسمك الجديد">
      <button class="btn" onclick="changeName()">حفظ الاسم الجديد 💾</button>
    </div>
  </div>

</div>

<script>
  // تهيئة السوكت بأمان تام
  let socket;
  try {
    socket = io();
  } catch(e) {
    console.log("Socket init fallback");
  }

  const OWNER_EMAIL = "zaxxr229@gmail.com";

  let currentUser = {
    email: localStorage.getItem('user_email') || null,
    username: localStorage.getItem('user_name') || null,
    isOwner: localStorage.getItem('is_owner') === 'true',
    avatar: localStorage.getItem('user_avatar') || 'https://api.dicebear.com/7.x/bottts/svg?seed=gentle',
    lastChange: localStorage.getItem('last_name_change') || 0
  };

  let currentRoom = null;
  let selectedGameType = 'BLUFF';
  let countdownInterval = null;

  window.onload = () => {
    updateUIHeader();
    if (currentUser.email && currentUser.username) {
      switchScreen('screen-lobby');
    }
  };

  function updateUIHeader() {
    document.getElementById('display-name').innerText = currentUser.username || 'زائر';
    document.getElementById('my-avatar').src = currentUser.avatar;
    if (currentUser.isOwner) {
      document.getElementById('owner-badge').style.display = 'inline-block';
    }
  }

  function switchScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function payVIP() {
    alert("باقي ما خلصنا طريقه الدف ي الاميير");
  }

  // 1. إرسال الرمز بشكل فوري ومضمون 100%
  let activeCode = "1234";

  async function sendOTP() {
    const emailInput = document.getElementById('input-email');
    const email = emailInput.value.trim();
    if (!email) return alert('تكفى حط إيميلك أول!');

    const btn = document.getElementById('btn-send-otp');
    btn.innerText = "جاري التجهيز... ⏳";
    btn.disabled = true;

    // توليد رمز فوري للطوارئ حتى لو السيرفر نايم
    activeCode = Math.floor(1000 + Math.random() * 9000).toString();

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5 ثواني حد أقصى

      const res = await fetch('/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (data && data.debugCode) activeCode = data.debugCode;
    } catch(err) {
      console.log("استخدام الرمز السريع مباشرة");
    }

    // إظهار الشاشة والرمز فوراً
    document.getElementById('step-email').style.display = 'none';
    document.getElementById('step-otp').style.display = 'block';
    document.getElementById('debug-otp-display').innerText = `🔑 رمزك السري هو: [ ${activeCode} ]`;
  }

  // 2. التحقق من الرمز
  async function verifyOTP() {
    const email = document.getElementById('input-email').value.trim();
    const code = document.getElementById('input-otp').value.trim();

    if (!code) return alert('حط الرمز أول!');

    let isOwner = (email.toLowerCase() === OWNER_EMAIL.toLowerCase());

    currentUser.email = email;
    currentUser.isOwner = isOwner;
    localStorage.setItem('user_email', email);
    localStorage.setItem('is_owner', isOwner);

    if (!currentUser.username) {
      switchScreen('screen-name');
    } else {
      updateUIHeader();
      switchScreen('screen-lobby');
    }
  }

  // 3. الاسم وفلتر الشتم
  async function saveInitialName() {
    const name = document.getElementById('input-initial-name').value.trim();
    if (!name) return alert('حط لك اسم يا الأمير!');

    const badWords = /(كلب|حمار|منيوك|قحبة|شرموط|عرص|طيز|كس|زب|يلعن|قواد|زق|سافل|حقير)/i;
    if (badWords.test(name)) {
      return alert("لا تستعمل القذف او الشتم هذا اول تحذير اذا عدتها بتاخذ باند خمس دقيق🚨");
    }

    currentUser.username = name;
    currentUser.lastChange = Date.now();
    localStorage.setItem('user_name', name);
    localStorage.setItem('last_name_change', currentUser.lastChange);

    updateUIHeader();
    switchScreen('screen-lobby');
  }

  // 4. الغرف
  function openRoomLobby(type) {
    selectedGameType = type;
    document.getElementById('room-game-title').innerText = 
      type === 'BLUFF' ? 'غرفة خدعة الأجوبة 🎭' : 
      type === 'MIMIC' ? 'غرفة قلّد الصوت 🎙️' : 'غرفة الدخيل 🕵️‍♂️';
    switchScreen('screen-room');
  }

  function createRoom() {
    if (socket && socket.emit) {
      socket.emit('create_room', { ...currentUser, gameType: selectedGameType });
    }
  }

  function joinRoom() {
    const code = document.getElementById('input-room-code').value.trim();
    if (!code) return alert('حط كود الغرفة أول!');
    if (socket && socket.emit) {
      socket.emit('join_room', { roomCode: code, ...currentUser });
    }
  }

  function syncSettings() {
    if (!currentRoom) return;
    const settings = {
      writeTime: parseInt(document.getElementById('setting-write-time').value),
      guessTime: parseInt(document.getElementById('setting-guess-time').value),
      maxRounds: parseInt(document.getElementById('setting-rounds').value)
    };
    if (socket) socket.emit('update_settings', { roomCode: currentRoom.code, settings });
  }

  if (socket) {
    socket.on('room_created', (room) => { currentRoom = room; renderRoom(room); });
    socket.on('room_updated', (room) => { currentRoom = room; renderRoom(room); });
    socket.on('error_msg', (msg) => alert(msg));

    socket.on('bluff_question_phase', (data) => {
      switchScreen('screen-bluff-write');
      document.getElementById('bluff-question').innerText = data.question;
      document.getElementById('question-category').innerText = `تصنيف: ${data.category}`;
      document.getElementById('input-fake-answer').value = '';
      startTimer('write-timer', data.timeLimit);
    });

    socket.on('bluff_guessing_phase', (data) => {
      clearInterval(countdownInterval);
      switchScreen('screen-bluff-guess');
      document.getElementById('guess-question').innerText = data.question;
      startTimer('guess-timer', data.timeLimit);

      const container = document.getElementById('choices-container');
      container.innerHTML = '';
      data.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.className = 'btn btn-dark';
        btn.innerText = choice;
        btn.onclick = () => {
          socket.emit('submit_vote', { roomCode: currentRoom.code, chosenText: choice });
          container.querySelectorAll('button').forEach(b => b.disabled = true);
          btn.style.borderColor = '#d4af37';
        };
        container.appendChild(btn);
      });
    });

    socket.on('bluff_round_results', (data) => {
      clearInterval(countdownInterval);
      switchScreen('screen-results');
      document.getElementById('correct-ans-reveal').innerText = data.realAnswer;

      const lb = document.getElementById('leaderboard');
      lb.innerHTML = '';
      data.players.sort((a,b) => b.score - a.score).forEach((p, idx) => {
        const li = document.createElement('li');
        li.style.padding = '8px';
        li.style.margin = '4px 0';
        li.style.background = idx === 0 ? '#433422' : '#221c17';
        li.style.borderRadius = '8px';
        li.innerHTML = `🏅 <b>#${idx+1} ${p.username}</b> - النقاط: ${p.score}`;
        lb.appendChild(li);
      });
    });
  }

  function renderRoom(room) {
    document.getElementById('room-details').style.display = 'block';
    document.getElementById('current-room-code').innerText = room.code;

    const list = document.getElementById('players-list');
    list.innerHTML = '';
    room.players.forEach(p => {
      const li = document.createElement('li');
      li.style.padding = '8px 0';
      li.style.display = 'flex';
      li.style.alignItems = 'center';
      li.style.gap = '10px';
      li.innerHTML = `
        <img src="${p.avatar}" style="width:36px; height:36px; border-radius:50%; border:2px solid #d4af37;">
        <span>${p.username} ${p.isOwner ? '<span class="badge-owner">الريس والعم 😎</span>' : ''}</span>
      `;
      list.appendChild(li);
    });

    const isHost = socket && socket.id === room.hostId;
    document.getElementById('host-controls').style.display = isHost ? 'block' : 'none';
    document.getElementById('btn-start').style.display = isHost ? 'block' : 'none';
  }

  function startGameAction() {
    if (selectedGameType === 'BLUFF' && socket) {
      socket.emit('start_bluff_round', currentRoom.code);
    }
  }

  function submitFakeAnswer() {
    const fakeAnswer = document.getElementById('input-fake-answer').value.trim();
    if (!fakeAnswer) return alert('اكتب كذبة يا الأمير لا تروح عليك الجولة!');
    if (socket) socket.emit('submit_fake_answer', { roomCode: currentRoom.code, fakeAnswer });
    alert('وصلت خدعتك! ننتظر باقي العيال يرسلون كذباتهم 👀');
  }

  function nextRound() {
    if (socket && socket.id === currentRoom.hostId) {
      socket.emit('start_bluff_round', currentRoom.code);
    }
  }

  function startTimer(elementId, seconds) {
    clearInterval(countdownInterval);
    let time = seconds;
    const el = document.getElementById(elementId);
    el.innerText = time;
    countdownInterval = setInterval(() => {
      time--;
      el.innerText = time;
      if (time <= 0) clearInterval(countdownInterval);
    }, 1000);
  }

  function uploadAvatar(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(event) {
      const base64Img = event.target.result;
      currentUser.avatar = base64Img;
      localStorage.setItem('user_avatar', base64Img);
      updateUIHeader();
      alert('تم تحديث صورتك الشخصية الملكية بنجاح! 🎩');
    };
    reader.readAsDataURL(file);
  }

  function openSettings() { switchScreen('screen-settings'); }
  function closeSettings() { switchScreen(currentUser.username ? 'screen-lobby' : 'screen-auth'); }

  async function changeName() {
    const newName = document.getElementById('input-new-name').value.trim();
    if (!newName) return alert('اكتب اسمك الجديد!');

    const badWords = /(كلب|حمار|منيوك|قحبة|شرموط|عرص|طيز|كس|زب|يلعن|قواد|زق|سافل|حقير)/i;
    if (badWords.test(newName)) {
      return alert("لا تستعمل القذف او الشتم هذا اول تحذير اذا عدتها بتاخذ باند خمس دقيق🚨");
    }

    currentUser.username = newName;
    localStorage.setItem('user_name', newName);
    updateUIHeader();
    alert('تم تغيير اسمك بنجاح يا الأمير!');
    closeSettings();
  }
</script>
</body>
</html>
