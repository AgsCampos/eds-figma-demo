/**
 * Hero Slider — Sparta
 * Full-bleed image slider with circular prev/next arrows, progress bars and
 * overlaid call-to-action buttons.
 *
 * Authored content contract: each top-level row of the block is one slide.
 *   - Cell 1: the slide image. Optionally wrapped in a link (the image link).
 *   - Cells 2..N: each holds one link, rendered as an overlaid button.
 * The image link and every button link are independent of each other.
 *
 * @param {Element} block The block element
 */

const AUTOPLAY_INTERVAL = 6000;
const TRANSITION_MS = 500;

const CHEVRON_SVG = `
<svg viewBox="0 0 10 5" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M1 4 L5 1 L9 4" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

function goToSlide(block, index) {
  const slides = block.querySelectorAll('.hero-slider-slide');
  const total = slides.length;
  if (!total) return;
  const next = (index + total) % total;
  block.dataset.activeSlide = next;

  const track = block.querySelector('.hero-slider-track');
  track.style.transform = `translateX(-${next * 100}%)`;

  slides.forEach((slide, i) => {
    slide.setAttribute('aria-hidden', i !== next);
    slide.querySelectorAll('a').forEach((link) => {
      if (i !== next) link.setAttribute('tabindex', '-1');
      else link.removeAttribute('tabindex');
    });
  });

  block.querySelectorAll('.hero-slider-bar').forEach((bar, i) => {
    bar.classList.toggle('active', i === next);
    bar.setAttribute('aria-current', i === next ? 'true' : 'false');
  });
}

function buildArrow(block, direction) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `hero-slider-arrow ${direction}`;
  button.setAttribute(
    'aria-label',
    direction === 'prev' ? 'Slide anterior' : 'Slide siguiente',
  );
  button.innerHTML = CHEVRON_SVG;
  button.addEventListener('click', () => {
    const current = parseInt(block.dataset.activeSlide || '0', 10);
    goToSlide(block, direction === 'prev' ? current - 1 : current + 1);
    block.dataset.autoplay = 'off';
  });
  return button;
}

function buildSlide(row, index) {
  const slide = document.createElement('div');
  slide.className = 'hero-slider-slide';
  slide.dataset.slideIndex = index;
  slide.setAttribute('role', 'group');
  slide.setAttribute('aria-roledescription', 'Slide');

  const cells = [...row.children];

  // Cell 1 → slide media (image, optionally wrapped in its own link).
  const media = document.createElement('div');
  media.className = 'hero-slider-media';
  if (cells[0]) {
    [...cells[0].childNodes].forEach((node) => media.append(node));
  }
  slide.append(media);

  // Cells 2..N → overlaid CTA buttons, each its own link.
  const links = cells
    .slice(1)
    .flatMap((cell) => [...cell.querySelectorAll('a')]);
  if (links.length) {
    const group = document.createElement('div');
    group.className = 'hero-slider-buttons';
    links.forEach((link) => {
      link.classList.add('hero-slider-button');
      group.append(link);
    });
    slide.append(group);
  }

  return slide;
}

export default function decorate(block) {
  const rows = [...block.children];

  const viewport = document.createElement('div');
  viewport.className = 'hero-slider-viewport';

  const track = document.createElement('div');
  track.className = 'hero-slider-track';

  rows.forEach((row, i) => {
    track.append(buildSlide(row, i));
    row.remove();
  });

  viewport.append(track);

  const slidesCount = track.children.length;
  if (slidesCount > 1) {
    viewport.append(buildArrow(block, 'prev'));
    viewport.append(buildArrow(block, 'next'));
  }

  block.append(viewport);

  if (slidesCount > 1) {
    const bars = document.createElement('nav');
    bars.className = 'hero-slider-bars';
    bars.setAttribute('aria-label', 'Controles del slider');
    for (let i = 0; i < slidesCount; i += 1) {
      const bar = document.createElement('button');
      bar.type = 'button';
      bar.className = 'hero-slider-bar';
      bar.setAttribute('aria-label', `Ir al slide ${i + 1} de ${slidesCount}`);
      bar.addEventListener('click', () => {
        goToSlide(block, i);
        block.dataset.autoplay = 'off';
      });
      bars.append(bar);
    }
    block.append(bars);
  }

  goToSlide(block, 0);

  // Smooth transition only after the first paint to avoid an initial jump.
  requestAnimationFrame(() => {
    track.style.transition = `transform ${TRANSITION_MS}ms ease`;
  });

  // Autoplay, paused on hover and after manual interaction.
  if (slidesCount > 1) {
    block.dataset.autoplay = 'on';
    setInterval(() => {
      if (block.dataset.autoplay === 'off') return;
      if (block.matches(':hover')) return;
      const current = parseInt(block.dataset.activeSlide || '0', 10);
      goToSlide(block, current + 1);
    }, AUTOPLAY_INTERVAL);
  }
}
