// Back.js
(function () {
  // --- DOM refs ---
  const track   = document.getElementById('sliderTrack');
  const dotsBox = document.getElementById('sliderDots');
  const prevBtn = document.querySelector('.slider-arrows .prev');
  const nextBtn = document.querySelector('.slider-arrows .next');

  if (!track || !dotsBox || !prevBtn || !nextBtn) return;

  // --- state ---
  let perView   = 3;      // จำนวนการ์ดต่อหน้า (จะคำนวณใหม่ตามจอ)
  let pages     = 1;      // จำนวนหน้า = ceil(totalCards/perView)
  let current   = 0;      // หน้าปัจจุบัน (0-based)
  let autoTimer = null;   // autoplay timer
  let animRAF   = null;   // requestAnimationFrame handler

  // ---------- Utils ----------
  const getPerView = () =>
    window.innerWidth <= 640 ? 1 : (window.innerWidth <= 1024 ? 2 : 3);

  const clampPage = (i) => (i + pages) % pages;

  const setActiveDot = () => {
    dotsBox.querySelectorAll('button').forEach((b, i) => {
      b.classList.toggle('active', i === current);
    });
  };

  const stopAuto = () => { clearInterval(autoTimer); autoTimer = null; };
  const startAuto = () => {
    stopAuto();
    autoTimer = setInterval(() => goTo(current + 1), 8000);
  };

  // Easing: เร่งตอนต้น ชะลอตอนท้าย
  const easeInOutQuad = (t) => (t < 0.5 ? 2*t*t : -1 + (4 - 2*t)*t);

  // ---------- Core animation ----------
  const animateTo = (targetIndex, duration = 1500) => {
    // ยกเลิก animation เดิมถ้ามี
    if (animRAF) cancelAnimationFrame(animRAF);

    const from = current * 100;
    const to   = targetIndex * 100;
    const start = performance.now();

    const step = (now) => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = easeInOutQuad(progress);
      const pos      = from + (to - from) * eased;

      track.style.transform = `translateX(-${pos}%)`;

      if (progress < 1) {
        animRAF = requestAnimationFrame(step);
      } else {
        current = targetIndex;
        setActiveDot();
      }
    };

    animRAF = requestAnimationFrame(step);
  };

  const goTo = (index, animate = true) => {
    const target = clampPage(index);
    if (animate) animateTo(target);
    else {
      current = target;
      track.style.transform = `translateX(-${current * 100}%)`;
      setActiveDot();
    }
    startAuto();
  };

  const next = () => goTo(current + 1);
  const prev = () => goTo(current - 1);

  // ---------- Build / Rebuild ----------
  const buildDots = () => {
    const totalCards = track.querySelectorAll('.slide-card').length;
    pages = Math.ceil(totalCards / perView);

    dotsBox.innerHTML = '';
    for (let i = 0; i < pages; i++) {
      const dot = document.createElement('button');
      dot.type = 'button';
      dot.addEventListener('click', () => goTo(i));
      dotsBox.appendChild(dot);
    }
    setActiveDot();
  };

  const rebuild = () => {
    perView = getPerView();
    buildDots();
    goTo(current, /*animate*/ false); // คงหน้าเดิมเมื่อ layout เปลี่ยน
  };

  // ---------- Events ----------
  prevBtn.addEventListener('click', () => { prev(); });
  nextBtn.addEventListener('click', () => { next(); });

  // ป้องกัน resize ถี่ๆ
  let resizeTO = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTO);
    resizeTO = setTimeout(rebuild, 150);
  });

  // ---------- Init ----------
  rebuild();
  startAuto();
})();
