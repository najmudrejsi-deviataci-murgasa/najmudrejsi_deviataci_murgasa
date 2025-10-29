// Year in footer


document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Students data (edit this list or load from /data/students.json)
const studentsData = [
{ name: 'Marek K.', nick: 'Kiko', dream: 'Programátor', avatar: 'assets/img/gallery-01.jpg' },
{ name: 'Nina P.', nick: 'Niny', dream: 'Dizajnérka', avatar: 'assets/img/gallery-02.jpg' },
{ name: 'Alex S.', nick: 'Lexo', dream: 'Futbalista', avatar: 'assets/img/gallery-03.jpg' },
{ name: 'Laura T.', nick: 'Lau', dream: 'Učiteľka', avatar: 'assets/img/gallery-04.jpg' },
];


function renderStudents(list){
const grid = document.getElementById('studentsGrid');
grid.innerHTML = list.map(s => `
<article class="student">
<img class="avatar" src="${s.avatar}" alt="${s.name}" loading="lazy" />
<h3>${s.name}${s.nick ? ` • ${s.nick}` : ''}</h3>
<p>${s.dream ? s.dream : ''}</p>
</article>
`).join('');
}


// Try to fetch from JSON if exists; fallback to inline data
fetch('data/students.json').then(r => {
if (!r.ok) throw new Error('no-json');
return r.json();
}).then(json => renderStudents(json))
.catch(() => renderStudents(studentsData));


// Guestbook (localStorage only)
const form = document.getElementById('guestbookForm');
const list = document.getElementById('guestbookList');


function loadMessages(){
const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
list.innerHTML = saved.map(item => `
<li><strong>${escapeHTML(item.name)}</strong><br/>${escapeHTML(item.message)}</li>
`).join('');
}


function escapeHTML(str){
return str.replace(/[&<>"]+/g, (m) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m]));
}


form.addEventListener('submit', (e) => {
e.preventDefault();
const data = new FormData(form);
const name = (data.get('name') || '').toString().trim();
const message = (data.get('message') || '').toString().trim();
if(!name || !message) return;
const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
saved.unshift({ name, message, ts: Date.now() });
localStorage.setItem('guestbook', JSON.stringify(saved));
form.reset();
loadMessages();
});


loadMessages();