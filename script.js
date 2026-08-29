// =========================================
// 1. Swiper Setup & Smart GIF Toggle
// =========================================
if (document.querySelector(".mySwiper")) {
  var swiper = new Swiper(".mySwiper", {
    effect: "cards",
    grabCursor: true,
    speed: 400,
    touchRatio: 1.2,
    cardsEffect: {
      perSlideRotate: 4,
      perSlideOffset: 10,
    },
    on: {
      init: function () {
        playActiveGif(this);
      },
      slideChange: function () {
        document.querySelectorAll('.card-inner').forEach(card => {
          card.classList.remove('flipped');
        });
        playActiveGif(this);
      }
    }
  });

  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  if (prevBtn) prevBtn.addEventListener('click', () => swiper.slidePrev());
  if (nextBtn) nextBtn.addEventListener('click', () => swiper.slideNext());

  document.querySelectorAll('.swiper-slide').forEach(slide => {
    slide.addEventListener('click', function () {
      if (this.classList.contains('swiper-slide-active')) {
        const cardInner = this.querySelector('.card-inner');
        if (cardInner) {
          cardInner.classList.toggle('flipped');
        }
      }
    });
  });
}

// دالة تشغيل الـ GIF للكارت النشط فقط إذا كان يحتوي على data-gif
function playActiveGif(swiperInstance) {
  // إرجاع كافة الصور لملفاتها الثابتة الأصلية
  document.querySelectorAll('.card-image').forEach(img => {
    if (img.dataset.staticSrc) {
      img.src = img.dataset.staticSrc;
    }
  });

  // تشغيل الـ GIF للكارت النشط حالياً فقط
  const activeSlide = swiperInstance.slides[swiperInstance.activeIndex];
  const activeImg = activeSlide ? activeSlide.querySelector('.card-image') : null;

  if (activeImg && activeImg.dataset.gif) {
    if (!activeImg.dataset.staticSrc) {
      activeImg.dataset.staticSrc = activeImg.src; // حفظ رابط الصورة الثابتة
    }
    // إعادة تحميل الـ GIF ليبدأ الحركة فوراً
    activeImg.src = activeImg.dataset.gif + '?t=' + new Date().getTime();
  }
}

// =========================================
// 2. Background Music Controller
// =========================================
const bgMusic = document.getElementById("bgMusic");

function playAudioOnInteraction() {
  if (!bgMusic) return;

  const isPlaying = localStorage.getItem("musicPlaying");
  const savedTime = parseFloat(localStorage.getItem("musicTime") || "0");

  if (isPlaying === "true") {
    bgMusic.currentTime = savedTime;
    bgMusic.muted = false;

    let promise = bgMusic.play();

    if (promise !== undefined) {
      promise.catch(() => {
        const startAudio = () => {
          bgMusic.play();
          document.removeEventListener('click', startAudio);
          document.removeEventListener('touchstart', startAudio);
        };
        document.addEventListener('click', startAudio);
        document.addEventListener('touchstart', startAudio);
      });
    }
  }
}

window.addEventListener("DOMContentLoaded", playAudioOnInteraction);

setInterval(() => {
  if (bgMusic && !bgMusic.paused) {
    localStorage.setItem("musicTime", bgMusic.currentTime);
  }
}, 300);

// =========================================
// 3. Glitter Effect
// =========================================
function launchBirthdayGlitter() {
  if (typeof confetti === 'function') {
    var duration = 3 * 1000;
    var end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6b1d2f', '#d8a7b1', '#ffd700', '#ffffff']
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6b1d2f', '#d8a7b1', '#ffd700', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

if (document.querySelector('.page-center') && document.getElementById('startBtn')) {
  window.addEventListener('load', launchBirthdayGlitter);
}

// =========================================
// 4. Envelope Controller
// =========================================
const envelope = document.getElementById("sealedEnvelope");
const letter = document.getElementById("fullLetter");
const darkOverlay = document.getElementById("darkOverlay");
const backBtn = document.getElementById("backLink");

if (envelope) {
  envelope.addEventListener("click", function () {
    envelope.classList.add("fade-out");
    
    setTimeout(() => {
      envelope.style.display = "none";
      if (darkOverlay) darkOverlay.classList.add("active");
      
      if (letter) {
        letter.classList.remove("hidden-letter");
        letter.classList.add("fade-in");
      }

      if (backBtn) {
        backBtn.classList.add("is-visible");
      }

      if (typeof startTypewriter === 'function' && typeof messageText !== 'undefined') {
        startTypewriter(messageText, 0);
      }
    }, 500);
  });
}