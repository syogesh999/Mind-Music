/**
 * Enhanced Music Controls Module — Mind Music AR
 * ─────────────────────────────────────────────────────────────
 * Provides:
 *  • Animated loading screen management
 *  • Sidebar controls (BPM, reverb, scale, camera toggle)
 *  • Gesture guide panel with toggle
 *  • Bottom player bar (prev/play/next, progress, volume, shuffle, repeat)
 *  • Toast notification system
 *  • Keyboard shortcut handler
 */

export class MusicControls {
  constructor() {
    this.isPlaying   = false;
    this.volume      = 0.7;
    this.currentTime = 0;
    this.duration    = 120; // seconds — updated dynamically by the synth session
    this.tracks = [
      { name: 'Synthwave Journey',  artist: 'Neon Dreams'   },
      { name: 'Cosmic Pulse',       artist: 'Orbital Beats'  },
      { name: 'Digital Dawn',       artist: 'Circuit Mind'   },
      { name: 'Ambient Storm',      artist: 'Mindscape'      },
    ];
    this.currentTrackIndex = 0;
    this.shuffleEnabled    = false;
    this.repeatEnabled     = false;
    this.gestureGuideOpen  = true;
    this.controlsPanelOpen = true;
    this.grayscale         = true; // matches the initial video filter

    // ── Scales ──────────────────────────────────────────────
    this.scales = {
      'Minor Pentatonic': ['C3','Eb3','F3','G3','Bb3','C4','Eb4','F4','G4','Bb4','C5','Eb5'],
      'Major':            ['C3','D3','E3','F3','G3','A3','B3','C4','D4','E4','F4','G4'],
      'Blues':            ['C3','Eb3','F3','Gb3','G3','Bb3','C4','Eb4','F4','Gb4','G4','Bb4'],
      'Dorian':           ['C3','D3','Eb3','F3','G3','A3','Bb3','C4','D4','Eb4','F4','G4'],
      'Chromatic':        ['C3','C#3','D3','D#3','E3','F3','F#3','G3','G#3','A3','A#3','B3'],
    };
    this.currentScale = 'Minor Pentatonic';

    this._buildUI();
    this._bindControls();
    this._bindKeyboard();
    this._startProgressTimer();
    this.updateTrackInfo();
  }

  /* ── Loading Screen ──────────────────────────────────────── */

  setLoadingStatus(text, progress = null) {
    const el = document.getElementById('loading-status-text');
    if (el) {
      el.style.opacity = '0';
      setTimeout(() => {
        el.textContent = text;
        el.style.opacity = '1';
      }, 200);
    }
    if (progress !== null) {
      const fill = document.getElementById('loading-progress-fill');
      if (fill) fill.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    }
  }

  hideLoadingScreen() {
    const screen = document.getElementById('loading-screen');
    if (screen) {
      screen.classList.add('hidden');
      // Remove from DOM after transition
      setTimeout(() => screen.remove(), 800);
    }
  }

  /* ── Build UI ────────────────────────────────────────────── */

  _buildUI() {
    const renderDiv = document.getElementById('renderDiv');
    if (!renderDiv) return;

    // ── Sidebar (right) ──────────────────────────────────────
    const sidebar = document.createElement('div');
    sidebar.id = 'controls-container';
    sidebar.innerHTML = `
      <div class="controls-header">
        <h3>⚙ Controls</h3>
        <button class="collapse-btn" id="collapse-sidebar-btn" title="Hide controls">◀</button>
      </div>

      <label>
        <div class="ctrl-row">
          <span>Arp Speed</span>
          <span class="ctrl-value" id="arp-speed-val">8</span>
        </div>
        <input type="range" id="arp-speed" min="1" max="16" value="8" step="1">
      </label>

      <label>
        <div class="ctrl-row">
          <span>Drum Volume</span>
          <span class="ctrl-value" id="drum-vol-val">80%</span>
        </div>
        <input type="range" id="drum-volume" min="0" max="100" value="80">
      </label>

      <label>
        <div class="ctrl-row">
          <span>BPM</span>
          <span class="ctrl-value" id="bpm-val">100</span>
        </div>
        <input type="range" id="bpm-control" min="60" max="180" value="100" step="1">
      </label>

      <label>
        <div class="ctrl-row">
          <span>Reverb</span>
          <span class="ctrl-value" id="reverb-val">80%</span>
        </div>
        <input type="range" id="reverb-control" min="0" max="100" value="80">
      </label>

      <div class="ctrl-divider"></div>

      <label>
        <span>Scale</span>
        <select id="scale-select">
          <option value="Minor Pentatonic" selected>Minor Pentatonic</option>
          <option value="Major">Major</option>
          <option value="Blues">Blues</option>
          <option value="Dorian">Dorian</option>
          <option value="Chromatic">Chromatic</option>
        </select>
      </label>

      <div class="ctrl-divider"></div>

      <button id="toggle-camera-color-btn">🎨 Toggle Camera Color</button>
      <button id="toggle-visualizer">🌊 Toggle Waveform</button>
      <button id="toggle-guide-btn">✋ Gesture Guide</button>
    `;
    renderDiv.appendChild(sidebar);

    // Toggle button (shown when sidebar is collapsed)
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'controls-toggle-btn';
    toggleBtn.title = 'Show controls';
    toggleBtn.innerHTML = '⚙';
    renderDiv.appendChild(toggleBtn);

    // ── Gesture Guide (left) ─────────────────────────────────
    const guide = document.createElement('div');
    guide.id = 'gesture-guide';
    guide.innerHTML = `
      <h3>✋ Gesture Guide</h3>

      <span class="gesture-hand-label left">Left Hand — Synth</span>
      <div class="gesture-row">
        <span class="gesture-icon">🤚</span>
        <div class="gesture-desc">
          <strong>Open Hand</strong>
          <span>Move up/down to change pitch. Pinch distance controls volume.</span>
        </div>
      </div>
      <div class="gesture-row">
        <span class="gesture-icon">✊</span>
        <div class="gesture-desc">
          <strong>Fist</strong>
          <span>Cycles to the next synth preset.</span>
        </div>
      </div>

      <div class="ctrl-divider"></div>

      <span class="gesture-hand-label right">Right Hand — Drums</span>
      <div class="gesture-row">
        <span class="gesture-icon">☝️</span>
        <div class="gesture-desc">
          <strong>Index Up</strong>
          <span>Kick drum</span>
        </div>
      </div>
      <div class="gesture-row">
        <span class="gesture-icon">✌️</span>
        <div class="gesture-desc">
          <strong>Middle Up</strong>
          <span>Snare drum</span>
        </div>
      </div>
      <div class="gesture-row">
        <span class="gesture-icon">🤟</span>
        <div class="gesture-desc">
          <strong>Ring Up</strong>
          <span>Hi-hat</span>
        </div>
      </div>
      <div class="gesture-row">
        <span class="gesture-icon">🤙</span>
        <div class="gesture-desc">
          <strong>Pinky Up</strong>
          <span>Clap</span>
        </div>
      </div>
    `;
    renderDiv.appendChild(guide);

    // ── Bottom Player Bar ────────────────────────────────────
    const player = document.createElement('div');
    player.className = 'enhanced-controls';
    player.innerHTML = `
      <div class="enhanced-controls-container">
        <div class="track-info">
          <span id="current-track-name">Mind Music AR</span>
          <span id="current-artist">Interactive Experience</span>
        </div>

        <div class="playback-controls">
          <button id="prev-track" class="control-btn" title="Previous track" aria-label="Previous track">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
            </svg>
          </button>

          <button id="play-pause" class="control-btn play-btn" title="Play / Pause" aria-label="Play or pause">
            <svg id="play-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg id="pause-icon" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style="display:none">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>

          <button id="next-track" class="control-btn" title="Next track" aria-label="Next track">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6 18l8.5-6L6 6v12zm2-8.14L11.03 12 8 14.14V9.86zM16 6h2v12h-2z"/>
            </svg>
          </button>
        </div>

        <div class="progress-section">
          <input type="range" id="progress-slider" class="progress-slider" min="0" max="100" value="0" aria-label="Playback progress">
          <div class="time-info">
            <span id="current-time">0:00</span>
            <span id="total-time">2:00</span>
          </div>
        </div>

        <div class="volume-section">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
            <path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>
          </svg>
          <input type="range" id="volume-control" class="volume-control" min="0" max="100" value="70" aria-label="Volume">
          <span id="vol-display" style="font-size:0.7rem;color:rgba(255,255,255,0.45);min-width:2.5em;text-align:right">70%</span>
        </div>

        <div class="mode-controls">
          <button id="shuffle-mode" class="mode-btn" title="Shuffle" aria-pressed="false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
            </svg>
            Shuffle
          </button>
          <button id="repeat-mode" class="mode-btn" title="Repeat" aria-pressed="false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
              <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
            Repeat
          </button>
        </div>
      </div>
    `;
    renderDiv.appendChild(player);
  }

  /* ── Bind All Controls ───────────────────────────────────── */

  _bindControls() {
    // ── Arp Speed ────────────────────────────────────────────
    const arpSpeed = document.getElementById('arp-speed');
    if (arpSpeed) {
      arpSpeed.addEventListener('input', (e) => {
        const v = parseInt(e.target.value);
        document.getElementById('arp-speed-val').textContent = v;
        window.dispatchEvent(new CustomEvent('arpSpeedChange', { detail: v }));
      });
    }

    // ── Drum Volume ───────────────────────────────────────────
    const drumVol = document.getElementById('drum-volume');
    if (drumVol) {
      drumVol.addEventListener('input', (e) => {
        const v = parseInt(e.target.value);
        document.getElementById('drum-vol-val').textContent = `${v}%`;
        window.dispatchEvent(new CustomEvent('drumVolumeChange', { detail: v / 100 }));
      });
    }

    // ── BPM ──────────────────────────────────────────────────
    const bpmCtrl = document.getElementById('bpm-control');
    if (bpmCtrl) {
      bpmCtrl.addEventListener('input', (e) => {
        const v = parseInt(e.target.value);
        document.getElementById('bpm-val').textContent = v;
        window.dispatchEvent(new CustomEvent('bpmChange', { detail: v }));
      });
    }

    // ── Reverb ───────────────────────────────────────────────
    const reverbCtrl = document.getElementById('reverb-control');
    if (reverbCtrl) {
      reverbCtrl.addEventListener('input', (e) => {
        const v = parseInt(e.target.value);
        document.getElementById('reverb-val').textContent = `${v}%`;
        window.dispatchEvent(new CustomEvent('reverbChange', { detail: v / 100 }));
      });
    }

    // ── Scale ────────────────────────────────────────────────
    const scaleSelect = document.getElementById('scale-select');
    if (scaleSelect) {
      scaleSelect.addEventListener('change', (e) => {
        this.currentScale = e.target.value;
        const notes = this.scales[this.currentScale];
        window.dispatchEvent(new CustomEvent('scaleChange', { detail: { name: this.currentScale, notes } }));
        this._toast(`Scale: ${this.currentScale}`);
      });
    }

    // ── Camera Color Toggle ───────────────────────────────────
    const camBtn = document.getElementById('toggle-camera-color-btn');
    if (camBtn) {
      camBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleCamera();
      });
    }

    // ── Visualizer Toggle ────────────────────────────────────
    const vizBtn = document.getElementById('toggle-visualizer');
    if (vizBtn) {
      vizBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('toggleVisualizer'));
        this._toast('Waveform toggled');
      });
    }

    // ── Gesture Guide Toggle (in sidebar) ───────────────────
    const guideBtn = document.getElementById('toggle-guide-btn');
    if (guideBtn) {
      guideBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._toggleGuide();
      });
    }

    // ── Sidebar Collapse / Expand ─────────────────────────────
    const collapseBtn = document.getElementById('collapse-sidebar-btn');
    if (collapseBtn) {
      collapseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._collapseSidebar();
      });
    }

    const openBtn = document.getElementById('controls-toggle-btn');
    if (openBtn) {
      openBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this._expandSidebar();
      });
    }

    // ── Bottom Player Controls ────────────────────────────────
    this.playPauseBtn   = document.getElementById('play-pause');
    this.prevBtn        = document.getElementById('prev-track');
    this.nextBtn        = document.getElementById('next-track');
    this.progressSlider = document.getElementById('progress-slider');
    this.volumeControl  = document.getElementById('volume-control');
    this.shuffleBtn     = document.getElementById('shuffle-mode');
    this.repeatBtn      = document.getElementById('repeat-mode');
    this.currentTimeEl  = document.getElementById('current-time');
    this.totalTimeEl    = document.getElementById('total-time');
    this.volDisplay     = document.getElementById('vol-display');

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlayPause();
      });
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.previousTrack();
      });
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.nextTrack();
      });
    }

    if (this.progressSlider) {
      this.progressSlider.addEventListener('input', (e) => {
        e.stopPropagation();
        this.seekTo(parseInt(e.target.value));
      });
    }

    if (this.volumeControl) {
      this.volumeControl.value = this.volume * 100;
      this.volumeControl.addEventListener('input', (e) => {
        e.stopPropagation();
        const v = parseInt(e.target.value);
        this.setVolume(v / 100);
        if (this.volDisplay) this.volDisplay.textContent = `${v}%`;
      });
    }

    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleShuffle();
      });
    }

    if (this.repeatBtn) {
      this.repeatBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleRepeat();
      });
    }

    // Update total time display now that elements exist
    this._updateTotalTimeDisplay();
  }

  /* ── Keyboard Shortcuts ──────────────────────────────────── */

  _bindKeyboard() {
    document.addEventListener('keydown', (e) => {
      // Don't intercept if typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

      switch (e.key.toLowerCase()) {
        case 'g':
          this._toggleGuide();
          break;
        case 'c':
          this._toggleCamera();
          break;
        case 'r':
          window.dispatchEvent(new CustomEvent('restartGame'));
          this._toast('Restarting tracking…');
          break;
        case ' ':
          e.preventDefault();
          this.togglePlayPause();
          break;
        case 'arrowup':
          e.preventDefault();
          this.setVolume(Math.min(1, this.volume + 0.05));
          if (this.volumeControl) {
            this.volumeControl.value = this.volume * 100;
            if (this.volDisplay) this.volDisplay.textContent = `${Math.round(this.volume * 100)}%`;
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          this.setVolume(Math.max(0, this.volume - 0.05));
          if (this.volumeControl) {
            this.volumeControl.value = this.volume * 100;
            if (this.volDisplay) this.volDisplay.textContent = `${Math.round(this.volume * 100)}%`;
          }
          break;
      }
    });
  }

  /* ── Progress Timer ──────────────────────────────────────── */

  _startProgressTimer() {
    this._progressInterval = setInterval(() => this._tickProgress(), 1000);
  }

  _tickProgress() {
    if (!this.isPlaying) return;
    this.currentTime += 1;
    if (this.currentTime >= this.duration) {
      if (this.repeatEnabled) {
        this.currentTime = 0;
      } else {
        this.nextTrack();
        return;
      }
    }
    this._updateProgressUI();
  }

  /* ── Playback Control Methods ────────────────────────────── */

  togglePlayPause() {
    this.isPlaying ? this.pause() : this.play();
  }

  play() {
    this.isPlaying = true;
    this._updatePlayButton();
    window.dispatchEvent(new CustomEvent('musicPlay'));
    this._toast('Playing…');
  }

  pause() {
    this.isPlaying = false;
    this._updatePlayButton();
    window.dispatchEvent(new CustomEvent('musicPause'));
    this._toast('Paused');
  }

  previousTrack() {
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.currentTime = 0;
    this.updateTrackInfo();
    this._updateProgressUI();
    window.dispatchEvent(new CustomEvent('previousTrack', { detail: { track: this.tracks[this.currentTrackIndex] } }));
    this._toast(`◀ ${this.tracks[this.currentTrackIndex].name}`);
  }

  nextTrack() {
    if (this.shuffleEnabled) {
      let next;
      do { next = Math.floor(Math.random() * this.tracks.length); }
      while (next === this.currentTrackIndex && this.tracks.length > 1);
      this.currentTrackIndex = next;
    } else {
      this.currentTrackIndex = (this.currentTrackIndex + 1) % this.tracks.length;
    }
    this.currentTime = 0;
    this.updateTrackInfo();
    this._updateProgressUI();
    window.dispatchEvent(new CustomEvent('nextTrack', { detail: { track: this.tracks[this.currentTrackIndex] } }));
    this._toast(`▶ ${this.tracks[this.currentTrackIndex].name}`);
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    window.dispatchEvent(new CustomEvent('volumeChange', { detail: this.volume }));
  }

  seekTo(percentage) {
    this.currentTime = (percentage / 100) * this.duration;
    this._updateProgressUI();
    window.dispatchEvent(new CustomEvent('musicSeek', { detail: { time: this.currentTime } }));
  }

  toggleShuffle() {
    this.shuffleEnabled = !this.shuffleEnabled;
    this.shuffleBtn?.classList.toggle('active', this.shuffleEnabled);
    this.shuffleBtn?.setAttribute('aria-pressed', String(this.shuffleEnabled));
    window.dispatchEvent(new CustomEvent('toggleShuffle', { detail: { enabled: this.shuffleEnabled } }));
    this._toast(this.shuffleEnabled ? '🔀 Shuffle On' : 'Shuffle Off');
  }

  toggleRepeat() {
    this.repeatEnabled = !this.repeatEnabled;
    this.repeatBtn?.classList.toggle('active', this.repeatEnabled);
    this.repeatBtn?.setAttribute('aria-pressed', String(this.repeatEnabled));
    window.dispatchEvent(new CustomEvent('toggleRepeat', { detail: { enabled: this.repeatEnabled } }));
    this._toast(this.repeatEnabled ? '🔁 Repeat On' : 'Repeat Off');
  }

  updateTrackInfo() {
    const trackNameEl = document.getElementById('current-track-name');
    const artistEl    = document.getElementById('current-artist');
    if (trackNameEl) trackNameEl.textContent = this.tracks[this.currentTrackIndex].name;
    if (artistEl)    artistEl.textContent    = this.tracks[this.currentTrackIndex].artist;
    this._updateTotalTimeDisplay();
  }

  /* ── UI Update Helpers ───────────────────────────────────── */

  _updatePlayButton() {
    const playIcon  = document.getElementById('play-icon');
    const pauseIcon = document.getElementById('pause-icon');
    if (!playIcon || !pauseIcon) return;
    if (this.isPlaying) {
      playIcon.style.display  = 'none';
      pauseIcon.style.display = 'block';
    } else {
      playIcon.style.display  = 'block';
      pauseIcon.style.display = 'none';
    }
  }

  _updateProgressUI() {
    if (this.progressSlider) {
      this.progressSlider.value = (this.currentTime / this.duration) * 100;
    }
    if (this.currentTimeEl) {
      this.currentTimeEl.textContent = this._formatTime(this.currentTime);
    }
  }

  _updateTotalTimeDisplay() {
    const el = document.getElementById('total-time');
    if (el) el.textContent = this._formatTime(this.duration);
  }

  _formatTime(seconds) {
    const s = Math.floor(seconds);
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  }

  /* ── Camera Toggle ───────────────────────────────────────── */

  _toggleCamera() {
    this.grayscale = !this.grayscale;
    window.dispatchEvent(new CustomEvent('toggleCameraColor', { detail: { grayscale: this.grayscale } }));
    this._toast(this.grayscale ? '📷 Grayscale camera' : '🎨 Colour camera');
  }

  /* ── Gesture Guide ───────────────────────────────────────── */

  _toggleGuide() {
    this.gestureGuideOpen = !this.gestureGuideOpen;
    const guide = document.getElementById('gesture-guide');
    if (guide) guide.classList.toggle('hidden', !this.gestureGuideOpen);
    this._toast(this.gestureGuideOpen ? 'Gesture guide shown' : 'Gesture guide hidden');
  }

  /* ── Sidebar Collapse ────────────────────────────────────── */

  _collapseSidebar() {
    this.controlsPanelOpen = false;
    const sidebar  = document.getElementById('controls-container');
    const openBtn  = document.getElementById('controls-toggle-btn');
    if (sidebar) sidebar.classList.add('collapsed');
    if (openBtn) openBtn.classList.add('visible');
  }

  _expandSidebar() {
    this.controlsPanelOpen = true;
    const sidebar = document.getElementById('controls-container');
    const openBtn = document.getElementById('controls-toggle-btn');
    if (sidebar) sidebar.classList.remove('collapsed');
    if (openBtn) openBtn.classList.remove('visible');
  }

  /* ── Toast Notifications ─────────────────────────────────── */

  _toast(message) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);

    // Auto-remove after animation
    setTimeout(() => toast.remove(), 2700);
  }

  /* ── Public helpers for game.js to call ─────────────────── */

  /** Called by game.js when info-text should update */
  setInfoText(text, pulse = false) {
    const el = document.getElementById('info-text');
    if (!el) return;
    el.textContent = text;
    if (pulse) {
      el.classList.remove('info-pulse');
      void el.offsetWidth; // force reflow
      el.classList.add('info-pulse');
    }
  }

  /** Returns the currently selected scale notes array */
  getCurrentScaleNotes() {
    return this.scales[this.currentScale];
  }

  /* ── Cleanup ─────────────────────────────────────────────── */

  destroy() {
    clearInterval(this._progressInterval);
  }
}

// ── Bootstrap ────────────────────────────────────────────────
window._musicControls = new MusicControls();
