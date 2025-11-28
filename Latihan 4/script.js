// ===== CAROUSEL OTOMATIS =====
const track = document.querySelector('.carousel-track');
const slides = Array.from(document.querySelectorAll('.carousel-slide'));
const nextBtn = document.querySelector('.next');
const prevBtn = document.querySelector('.prev');

let index = 0;

// Tampilkan slide sesuai index
function showSlide(i) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle("active", idx === i);
    slide.style.opacity = idx === i ? "1" : "0";
  });
}

// Tombol Next
nextBtn.onclick = () => {
  index = (index + 1) % slides.length;
  showSlide(index);
  resetAuto();
};

// Tombol Prev
prevBtn.onclick = () => {
  index = (index - 1 + slides.length) % slides.length;
  showSlide(index);
  resetAuto();
};

// ===== AUTO SLIDE =====
let autoSlide = setInterval(() => {
  index = (index + 1) % slides.length;
  showSlide(index);
}, 3000);

// Reset jika user pencet tombol
function resetAuto() {
  clearInterval(autoSlide);
  autoSlide = setInterval(() => {
    index = (index + 1) % slides.length;
    showSlide(index);
  }, 3000);
}

showSlide(index);
