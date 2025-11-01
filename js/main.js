// Year in footer


(function () {
	'use strict';

	// Run after DOM is ready (script is loaded with `defer`, but keep the listener to be safe)
	document.addEventListener('DOMContentLoaded', () => {

		// set footer year if present
		const yearEl = document.getElementById('year');
		if (yearEl) yearEl.textContent = new Date().getFullYear();

		// IntersectionObserver for reveal animations
		const observer = new IntersectionObserver((entries, obs) => {
			entries.forEach(entry => {
				if (entry.isIntersecting) {
					entry.target.classList.add('revealed');
					obs.unobserve(entry.target);
				}
			});
		}, { threshold: 0.08 });

		document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

		// Students data (fallback list)
		const studentsData = [
			{ name: 'Marek K.', nick: 'Kiko', dream: 'Programátor', avatar: 'assets/img/gallery-01.jpg' },
			{ name: 'Nina P.', nick: 'Niny', dream: 'Dizajnérka', avatar: 'assets/img/gallery-02.jpg' },
			{ name: 'Alex S.', nick: 'Lexo', dream: 'Futbalista', avatar: 'assets/img/gallery-03.jpg' },
			{ name: 'Laura T.', nick: 'Lau', dream: 'Učiteľka', avatar: 'assets/img/gallery-04.jpg' },
		];

		function renderStudents(list) {
			const grid = document.getElementById('studentsGrid');
			if (!grid) return;
			grid.innerHTML = list.map(s => `
				<article class="student">
					<img class="avatar" src="${s.avatar}" alt="${escapeHTML(s.name)}" loading="lazy" />
					<h3>${escapeHTML(s.name)}${s.nick ? ` • ${escapeHTML(s.nick)}` : ''}</h3>
					<p>${s.dream ? escapeHTML(s.dream) : ''}</p>
				</article>
			`).join('');
		}

		// Try to load students from JSON, fallback to inline list
		fetch('data/students.json').then(r => {
			if (!r.ok) throw new Error('no-json');
			return r.json();
		}).then(json => renderStudents(json))
		  .catch(() => renderStudents(studentsData));

		// Guestbook (localStorage only)
		const form = document.getElementById('guestbookForm');
		const listEl = document.getElementById('guestbookList');

		function escapeHTML(str) {
			const s = String(str || '');
			return s.replace(/[&<>"']/g, ch =>
				({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch] || ch)
			);
		}

		function loadMessages() {
			if (!listEl) return;
			const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
			listEl.innerHTML = saved.map(item => `
				<li><strong>${escapeHTML(item.name)}</strong><br/>${escapeHTML(item.message)}</li>
			`).join('');
		}

		if (form) {
			form.addEventListener('submit', (e) => {
				e.preventDefault();
				const data = new FormData(form);
				const name = (data.get('name') || '').toString().trim();
				const message = (data.get('message') || '').toString().trim();
				if (!name || !message) return;
				const saved = JSON.parse(localStorage.getItem('guestbook') || '[]');
				saved.unshift({ name, message, ts: Date.now() });
				localStorage.setItem('guestbook', JSON.stringify(saved));
				form.reset();
				loadMessages();
			});
		}

		loadMessages();
	});
})();