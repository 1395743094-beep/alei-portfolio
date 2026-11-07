/* ============================================================
   啊lei啊lei · 2026 作品集 — Shared data + helpers
   ============================================================ */
window.PORTFOLIO = (function () {
  let DATA = null;
  const cache = fetch('assets/js/projects.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(d => { DATA = d; return d; });

  function ready(fn) { cache.then(fn); }

  function get(id) {
    if (!DATA) return null;
    return DATA.projects.find(p => p.id === id) || null;
  }
  function byCat(catId) {
    if (!DATA) return [];
    return catId === 'all' ? DATA.projects : DATA.projects.filter(p => p.category === catId);
  }
  function catMeta(catId) {
    if (!DATA) return null;
    return DATA.categories.find(c => c.id === catId) || null;
  }
  function featured(n) {
    if (!DATA) return [];
    // pick spread across categories, prefer projects with >=2 images
    const pool = DATA.projects.filter(p => p.images.length >= 2);
    const picked = [];
    const byCat = {};
    pool.forEach(p => { (byCat[p.category] = byCat[p.category] || []).push(p); });
    const catOrder = DATA.categories.map(c => c.id);
    let i = 0;
    while (picked.length < n && catOrder.some(c => (byCat[c] || []).length)) {
      const c = catOrder[i % catOrder.length];
      if (byCat[c] && byCat[c].length) picked.push(byCat[c].shift());
      i++;
    }
    if (picked.length < n) {
      DATA.projects.forEach(p => { if (picked.length < n && !picked.includes(p)) picked.push(p); });
    }
    return picked.slice(0, n);
  }
  function esc(s) {
    return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  }
  function pad2(n) { return String(n).padStart(2, '0'); }

  /* ---- reveal on scroll ---- */
  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12 });
    els.forEach(e => io.observe(e));
  }

  /* ---- mobile nav ---- */
  function initNav() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');
    if (burger && menu) {
      burger.addEventListener('click', () => menu.classList.toggle('open'));
    }
  }

  return { ready, get, byCat, catMeta, featured, esc, pad2, initReveal, initNav, get data() { return DATA; } };
})();
