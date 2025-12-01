// ============================
// script.js — Clean & functional
// ============================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Utilities ---------- */
  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function qs(selector) { return document.querySelector(selector); }
  function qsa(selector) { return Array.from(document.querySelectorAll(selector)); }

  /* ---------- Header nav: click -> smooth scroll ---------- */
  qsa('nav a').forEach(a => {
    a.addEventListener('click', e => {
      e.preventDefault();
      const target = a.getAttribute('href').replace('#', '');
      scrollToSection(target);
    });
  });

  /* ---------- Explore button ---------- */
  const exploreBtn = document.getElementById('exploreBtn');
  if (exploreBtn) exploreBtn.addEventListener('click', () => scrollToSection('courses'));

  /* ---------- Nav active state while scrolling ---------- */
  const sections = qsa('main section[id]');
  const navLinks = qsa('nav a');
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(n => n.classList.remove('active'));
        const targetLink = qs(`nav a[href="#${entry.target.id}"]`);
        if (targetLink) targetLink.classList.add('active');
      }
    });
  }, { threshold: 0.5 });

  sections.forEach(s => navObserver.observe(s));

  /* ---------- Fade-up reveal ---------- */
  const faders = qsa('.fade-up');
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  faders.forEach(f => fadeObserver.observe(f));

  /* ---------- Contact form handler (fake send) ---------- */
  window.sendMessage = function (evt) {
    evt.preventDefault();
    const name = (qs('#name')||{}).value || '';
    const email = (qs('#email')||{}).value || '';
    const msg = (qs('#msg')||{}).value || '';
    if (!name.trim() || !email.trim() || !msg.trim()) {
      toast('Please fill all required fields.');
      return false;
    }
    // Show modal success (no backend)
    showModal('Message Received', `Thanks <strong>${escapeHtml(name)}</strong> — I will reply to <em>${escapeHtml(email)}</em> soon.`, true);
    evt.target.reset();
    return false;
  };

  function escapeHtml(s){ return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

  function toast(text){
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = text;
    Object.assign(t.style, {position:'fixed',right:'18px',bottom:'18px',background:'#021025',color:'#fff',padding:'10px 14px',borderRadius:'8px',zIndex:1200});
    document.body.appendChild(t);
    setTimeout(()=> t.remove(),2400);
  }

  /* ---------- Modal utility ---------- */
  function showModal(title, htmlContent, autoClose=false){
    const modal = document.createElement('div');
    modal.className = 'site-modal';
    modal.innerHTML = `
      <div class="modal-backdrop"></div>
      <div class="modal-card">
        <h3>${title}</h3>
        <div class="modal-body">${htmlContent}</div>
        <div class="modal-actions"><button class="btn primary" id="modalClose">Close</button></div>
      </div>`;
    document.body.appendChild(modal);
    const closeBtn = qs('#modalClose');
    closeBtn.focus();
    closeBtn.addEventListener('click', () => modal.remove());
    modal.querySelector('.modal-backdrop').addEventListener('click', () => modal.remove());
    if (autoClose) setTimeout(()=> modal.remove(), 3000);
  }

  /* ---------- Quick sample message filler ---------- */
  window.prefillMessage = function(){
    const school = qs('#school');
    if (school) school.value = 'Grace School Gbagada';
    const msg = qs('#msg');
    if (msg) msg.value = 'Hi Mr Darasimi, I want to register 30 students for HTML Essentials starting next month. Please advise.';
    toast('Sample message added. Edit as needed and send.');
  };

  /* ---------- Keyboard shortcut: E -> courses ---------- */
  document.addEventListener('keydown', ev => {
    if (ev.key.toLowerCase() === 'e' && !ev.ctrlKey && !ev.metaKey) scrollToSection('courses');
  });

  /* ---------- Project filter ---------- */
  qsa('.filter').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      qsa('.filter').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      qsa('.project').forEach(p=>{
        if (filter === 'all' || p.dataset.type === filter) {
          p.style.display = '';
        } else {
          p.style.display = 'none';
        }
      });
    });
  });

  /* ---------- small niceties ---------- */
  // footer year
  const yearEl = qs('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme / glow toggle - toggles a class you can style if wanted
  const themeToggle = qs('#themeToggle');
  if (themeToggle) themeToggle.addEventListener('click', ()=>{
    document.documentElement.classList.toggle('glow');
    themeToggle.textContent = document.documentElement.classList.contains('glow') ? 'Glow: ON' : 'Glow';
  });

});
