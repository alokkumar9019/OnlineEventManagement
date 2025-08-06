
/* ========== Data ========== */
const sessions = [
  {
    time: "09:00 AM",
    title: "Opening Keynote",
    speaker: "Olivia Smith"
  },
  {
    time: "10:00 AM",
    title: "Product Design Workshop",
    speaker: "Alex Lee"
  },
  {
    time: "11:30 AM",
    title: "Tech Innovations Panel",
    speaker: "Priya Shah"
  },
  {
    time: "02:00 PM",
    title: "Marketing Strategy Session",
    speaker: "Sara Kim"
  }
];

const speakers = [
  { name: "Olivia Smith", bio: "Event Organizer and Keynote Speaker", photo: "" },
  { name: "Alex Lee", bio: "Product Designer and Workshop Leader", photo: "" },
  { name: "Priya Shah", bio: "Tech Innovator and Panel Moderator", photo: "" },
  { name: "Sara Kim", bio: "Marketing Expert and Session Host", photo: "" }
];

const breakoutSessions = [
  {
    topic: "Product Design",
    moderator: "Alex Lee",
    agenda: "Discuss UI/UX trends and collaborative workflows."
  },
  {
    topic: "Tech Innovations",
    moderator: "Priya Shah",
    agenda: "Brainstorm latest in AI, DevOps, and Cloud technologies."
  },
  {
    topic: "Marketing Strategy",
    moderator: "Sara Kim",
    agenda: "Share experiences on digital marketing campaigns & analytics."
  }
];

/* ======== Registration Form ======== */
document.getElementById('registrationForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const ticketType = form.ticketType.value;

  if (!name || !email || !ticketType) {
    alert('Please fill all fields');
    return;
  }

  // Normally here you would send data to backend or send confirmation email
  document.getElementById('regConfirmation').textContent = 
    `Thank you ${name} for registering with a ${ticketType} ticket. Confirmation email sent!`;

  form.reset();
});

/* ======== Schedule & Bookmark ======== */
function renderSchedule() {
  const tbody = document.getElementById('scheduleBody');
  tbody.innerHTML = '';
  sessions.forEach((session, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${session.time}</td>
      <td>${session.title}</td>
      <td>${session.speaker}</td>
      <td><button class="bookmark-btn" data-idx="${idx}">Bookmark</button></td>
    `;
    tbody.appendChild(tr);
  });

  document.querySelectorAll('.bookmark-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = btn.getAttribute('data-idx');
      bookmarkSession(sessions[idx]);
    });
  });
}

let bookmarks = [];

function bookmarkSession(session){
  if(bookmarks.find(s => s.title === session.title)) return; // prevent duplicates
  bookmarks.push(session);
  renderBookmarks();
}

function renderBookmarks() {
  const ul = document.getElementById('bookmarksList');
  ul.innerHTML = '';
  bookmarks.forEach(session => {
    const li = document.createElement('li');
    li.textContent = `${session.title} by ${session.speaker} at ${session.time}`;
    ul.appendChild(li);
  });
}

/* ======= Live Poll ======= */
const pollData = { };

function pollVote(option){
  pollData[option] = (pollData[option] || 0) + 1;
  const resultsDiv = document.getElementById('pollResults');
  resultsDiv.textContent = Object.entries(pollData)
    .map(([opt, count]) => `${opt}: ${count} vote${count !== 1 ? 's' : ''}`)
    .join('\n');
}

/* ======= Q&A Form ======= */
document.getElementById('qaForm').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('qaInput');
  const question = input.value.trim();
  if (!question) return;

  const ul = document.getElementById('qaList');
  const li = document.createElement('li');
  li.textContent = question;
  ul.appendChild(li);

  input.value = '';
});

/* ======= Attendee Chat (Demo only) ======= */
function sendChatMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(!msg) return;
  const box = document.getElementById('chatBox');
  const p = document.createElement('p');
  p.textContent = msg;
  box.appendChild(p);
  box.scrollTop = box.scrollHeight;
  input.value = '';
}

/* ======= Speakers List ======= */
function renderSpeakers() {
  const container = document.getElementById('speakersList');
  container.innerHTML = '';
  speakers.forEach(speaker => {
    const div = document.createElement('div');
    div.style.background = '#f9faff';
    div.style.padding = '10px';
    div.style.borderRadius = '6px';
    div.style.boxShadow = '0 1px 5px rgba(0,0,0,0.1)';
    div.innerHTML = `
      <h3>${speaker.name}</h3>
      <p>${speaker.bio}</p>
    `;
    container.appendChild(div);
  });
}

/* ======= Feedback Form ======= */
document.getElementById('feedbackForm').addEventListener('submit', e => {
  e.preventDefault();
  const rating = e.target.rating.value;
  const comments = e.target.comments.value.trim();
  if(!rating){
    alert('Please select a rating');
    return;
  }
  // Here you would save feedback to backend or localStorage

  const msg = document.getElementById('feedbackMsg');
  msg.textContent = "Thank you for your feedback!";
  e.target.reset();
});

/* ======= Breakout Sessions ======= */
let breakoutChats = breakoutSessions.map(() => []);
let currentBreakout = null;

function renderBreakoutList() {
  const container = document.getElementById('breakoutList');
  container.innerHTML = '';
  breakoutSessions.forEach((session, idx) => {
    const div = document.createElement('div');
    div.style.background = '#def0ff';
    div.style.padding = '10px';
    div.style.marginBottom = '10px';
    div.style.borderRadius = '6px';
    div.innerHTML = `<strong>${session.topic}</strong><br>
                     Moderator: ${session.moderator}<br>
                     Agenda: ${session.agenda}<br>
                     <button onclick="joinBreakout(${idx})">Join Breakout</button>`;
    container.appendChild(div);
  });
}

function joinBreakout(idx){
  currentBreakout = idx;
  // Hide list, show room
  document.getElementById('breakoutList').style.display = 'none';
  document.getElementById('breakoutRoom').style.display = 'block';

  const room = breakoutSessions[idx];
  document.getElementById('roomTitle').textContent = room.topic;
  document.getElementById('roomModerator').textContent = room.moderator;
  document.getElementById('roomAgenda').textContent = room.agenda;

  renderBreakoutChat();
}

function leaveBreakout(){
  currentBreakout = null;
  document.getElementById('breakoutRoom').style.display = 'none';
  document.getElementById('breakoutList').style.display = 'block';
}

function sendBreakoutMessage() {
  const input = document.getElementById('breakoutChatInput');
  let msg = input.value.trim();
  if(!msg || currentBreakout === null) return;
  breakoutChats[currentBreakout].push(msg);
  input.value = '';
  renderBreakoutChat();
}

function renderBreakoutChat(){
  const chatBox = document.getElementById('breakoutChatBox');
  if (currentBreakout === null) return;
  chatBox.innerHTML = breakoutChats[currentBreakout]
    .map(m => `<p>${m}</p>`).join('');
  chatBox.scrollTop = chatBox.scrollHeight;
}

/* ===== Init ===== */
function init(){
  renderSchedule();
  renderSpeakers();
  renderBreakoutList();
}

document.addEventListener('DOMContentLoaded', init);