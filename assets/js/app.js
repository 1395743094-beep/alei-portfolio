/* ============================================================
   啊lei啊lei · 2026 作品集 — Shared data + interactions (Noir Luxe)
   数据层 + 自定义光标 / 波纹 / 滚动进度 / 卡片倾斜 / 导航变深
   ============================================================ */
window.PORTFOLIO = (function () {
  let DATA = null;
  const cache = fetch('assets/js/projects.json', { cache: 'no-cache' })
    .then(r => r.json())
    .then(d => { DATA = d; return d; });

  function ready(fn) { cache.then(fn); }
  function get(id) { return DATA ? (DATA.projects.find(p => p.id === id) || null) : null; }
  function byCat(catId) {
    if (!DATA) return [];
    return catId === 'all' ? DATA.projects : DATA.projects.filter(p => p.category === catId);
  }
  function catMeta(catId) { return DATA ? (DATA.categories.find(c => c.id === catId) || null) : null; }
  function featured(n) {
    if (!DATA) return [];
    const pool = DATA.projects.filter(p => p.images.length >= 2);
    const picked = []; const byCat = {};
    pool.forEach(p => { (byCat[p.category] = byCat[p.category] || []).push(p); });
    const order = DATA.categories.map(c => c.id);
    let i = 0;
    while (picked.length < n && order.some(c => (byCat[c] || []).length)) {
      const c = order[i % order.length];
      if (byCat[c] && byCat[c].length) picked.push(byCat[c].shift());
      i++;
    }
    if (picked.length < n) DATA.projects.forEach(p => { if (picked.length < n && !picked.includes(p)) picked.push(p); });
    return picked.slice(0, n);
  }
  function esc(s) { return String(s || '').replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m])); }
  function pad2(n) { return String(n).padStart(2, '0'); }

  function initReveal() {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach(e => e.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    els.forEach(e => io.observe(e));
  }
  function initNav() {
    const burger = document.querySelector('.burger');
    const menu = document.querySelector('.menu');
    if (burger && menu) {
      burger.addEventListener('click', () => {
        menu.classList.toggle('open');
        burger.classList.toggle('open');
      });
    }
  }

  /* ============================================================
     自定义光标 —— 外圈跟随 + 内点 + hover 放大
     ============================================================ */
  function initCursor() {
    if (window.matchMedia('(hover: none)').matches) return;
    const dot = document.createElement('div');
    const ring = document.createElement('div');
    dot.className = 'cursor-dot';
    ring.className = 'cursor-ring';
    document.body.appendChild(dot);
    document.body.appendChild(ring);

    let rx = 0, ry = 0, dx = 0, dy = 0, tx = 0, ty = 0;
    let visible = false;

    document.addEventListener('mousemove', (e) => {
      tx = e.clientX; ty = e.clientY;
      if (!visible) { visible = true; dot.style.opacity = '1'; ring.style.opacity = '1'; }
    });
    document.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; visible = false; });
    document.addEventListener('mouseenter', () => { if (!visible) { dot.style.opacity = '1'; ring.style.opacity = '1'; visible = true; } });

    function tick() {
      // 内点紧跟
      dx += (tx - dx) * 0.9;
      dy += (ty - dy) * 0.9;
      dot.style.left = dx + 'px';
      dot.style.top = dy + 'px';
      // 外圈缓动跟随
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.left = rx + 'px';
      ring.style.top = ry + 'px';
      requestAnimationFrame(tick);
    }
    tick();

    // hover 可交互元素时外圈放大
    const hoverSel = 'a, button, .chip, .sub-chip, .proj-card, .feat-card, .cat-tile, .skill-card, .c-box, .nav-cta, .btn';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(hoverSel)) ring.classList.add('hover');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(hoverSel)) ring.classList.remove('hover');
    });
    // 点击缩放反馈
    document.addEventListener('mousedown', () => ring.classList.add('click'));
    document.addEventListener('mouseup', () => ring.classList.remove('click'));
  }

  /* ============================================================
     点击波纹 —— 金色波纹从点击点扩散
     ============================================================ */
  function initRipple() {
    document.addEventListener('click', (e) => {
      const target = e.target.closest('.btn, .nav-cta, .chip, .sub-chip');
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const r = document.createElement('span');
      r.className = 'ripple';
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      r.style.width = r.style.height = Math.max(rect.width, rect.height) + 'px';
      target.appendChild(r);
      setTimeout(() => r.remove(), 700);
    });
  }

  /* ============================================================
     滚动进度条 + 导航变深
     ============================================================ */
  function initScroll() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const nav = document.querySelector('.nav');

    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const p = max > 0 ? (h.scrollTop / max) * 100 : 0;
      bar.style.width = p + '%';
      if (nav) {
        if (h.scrollTop > 30) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     卡片 3D 倾斜 —— 事件委托，支持动态渲染的卡片
     ============================================================ */
  function initTilt() {
    if (window.matchMedia('(hover: none)').matches) return;
    const sel = '.feat-card, .proj-card, .cat-tile, .skill-card, .c-box';
    let active = null;
    document.addEventListener('mousemove', (e) => {
      const el = e.target.closest(sel);
      if (el !== active) {
        if (active) active.style.transform = '';
        active = el;
      }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = 'translateY(-8px) perspective(900px) rotateX(' + (-py * 6).toFixed(2) + 'deg) rotateY(' + (px * 8).toFixed(2) + 'deg)';
    });
    document.addEventListener('mouseleave', () => {
      if (active) { active.style.transform = ''; active = null; }
    });
  }

  return {
    ready, get, byCat, catMeta, featured, esc, pad2,
    initReveal, initNav, initCursor, initRipple, initScroll, initTilt,
    get data() { return DATA; }
  };
})();

/* 页面加载后统一启动全局交互（不依赖数据） */
document.addEventListener('DOMContentLoaded', function () {
  PORTFOLIO.initCursor();
  PORTFOLIO.initRipple();
  PORTFOLIO.initScroll();
  PORTFOLIO.initTilt();
});
