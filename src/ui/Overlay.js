// src/ui/Overlay.js
// The HUD overlay — chapter title, lede, frame index, rail ticks.
// Updates whenever the world progress crosses a chapter boundary.

const CHAPTERS = [
  { title: 'Awakening',  lede: 'A new year opens with a single, quiet light in the dark.' },
  { title: 'Drift',      lede: 'Snow falls on cities that have not yet learned to listen.' },
  { title: 'Approach',   lede: 'A voice finds its way through the noise of an old world.' },
  { title: 'Undertow',   lede: 'The river of consensus begins to bend, slowly, against itself.' },
  { title: 'Descent',    lede: 'Crowds gather. The square fills with the sound of a single question.' },
  { title: 'Turn',       lede: 'What was once a fringe becomes the loudest thing in the room.' },
  { title: 'Cross',      lede: 'An ocean crossed. A continent answered. The arithmetic is the same.' },
  { title: 'Ascent',     lede: 'Steps climbed, hands joined, the year turning into a verdict.' },
  { title: 'Bloom',      lede: 'Where there was one, there are millions. The season changes.' },
  { title: 'Hush',       lede: 'Even the loudest movements must learn to be still.' },
  { title: 'Echo',       lede: 'The words travel further than the speaker ever will.' },
  { title: 'Return',     lede: 'A year older, a year closer — and the light is still on.' },
];

export class Overlay {
  constructor() {
    this.titleEl  = document.getElementById('chapter-title');
    this.ledeEl   = document.getElementById('chapter-lede');
    this.indexEl  = document.getElementById('frame-index');
    this.chapterEl = document.getElementById('chapter');
    this.progressEl = document.getElementById('rail-progress');
    this.railEl     = document.getElementById('rail');

    this.currentChapter = -1;
    this._buildTicks();
  }

  _buildTicks() {
    const ticks = document.getElementById('rail-ticks');
    if (!ticks) return;
    ticks.innerHTML = '';
    for (let i = 0; i < CHAPTERS.length; i++) {
      const el = document.createElement('span');
      el.className = 'tick';
      el.textContent = String(i + 1).padStart(2, '0');
      el.addEventListener('click', () => {
        if (this.onJump) this.onJump(i / (CHAPTERS.length - 1));
      });
      ticks.appendChild(el);
    }
    this.tickEls = Array.from(ticks.querySelectorAll('.tick'));
  }

  onJumpToChapter(cb) {
    this.onJump = cb;
  }

  update(progress) {
    // progress
    if (this.progressEl) {
      this.progressEl.style.width = `${(progress * 100).toFixed(2)}%`;
    }

    // chapter
    const idx = Math.min(CHAPTERS.length - 1, Math.floor(progress * CHAPTERS.length * 0.9999));
    if (idx !== this.currentChapter) {
      this.currentChapter = idx;
      const ch = CHAPTERS[idx];
      this.titleEl.textContent = ch.title;
      this.ledeEl.textContent = ch.lede;
      this.indexEl.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(CHAPTERS.length).padStart(2, '0')}`;

      this.chapterEl.classList.remove('is-visible');
      // force reflow then re-add for transition
      void this.chapterEl.offsetWidth;
      requestAnimationFrame(() => this.chapterEl.classList.add('is-visible'));

      this.tickEls.forEach((el, i) => el.classList.toggle('is-active', i === idx));
    }
  }
}
