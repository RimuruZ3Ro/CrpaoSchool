const newsImages = document.querySelectorAll('.news-card img');
const lightbox   = document.getElementById('lightbox');
const lightboxImg= document.getElementById('lightbox-img');
const closeBtn   = document.querySelector('.lightbox .close');

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.classList.add('show');
  document.body.classList.add('modal-open');
}

function closeLightbox() {
  lightbox.classList.remove('show');
  document.body.classList.remove('modal-open');
  lightboxImg.src = '';
}

newsImages.forEach(img => {
  img.addEventListener('click', () => openLightbox(img.src));
});

closeBtn.addEventListener('click', closeLightbox);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();   // คลิกฉากหลังเพื่อปิด
});
