/**
 * Enhanced Music Controls Module for Mind Music AR
 * Provides UI controls for audio playback, volume, and track management
 */
export class MusicControls {
  constructor() {
    this.audioContext = null;
    this.gainNode = null;
    this.isPlaying = false;
    this.volume = 0.7;
    this.currentTime = 0;
    this.duration = 30; // Example duration for demo purposes
    this.tracks = [
      { name: "Synthwave Journey", artist: "Neon Dreams" },
      { name: "Cosmic Pulse", artist: "Orbital Beats" },
      { name: "Digital Dawn", artist: "Circuit Mind" },
    ];
    this.currentTrackIndex = 0;
    this.shuffleEnabled = false;
    this.repeatEnabled = false;

    this.initializeAudio();
    this.bindExistingControls();
    this.createEnhancedControls();
    this.updateTrackInfo();
  }

  initializeAudio() {
    // Create audio context and element
    this.audioContext = new (window.AudioContext ||
      window.webkitAudioContext)();

    // Create gain node for volume control
    this.gainNode = this.audioContext.createGain();
    this.gainNode.connect(this.audioContext.destination);
    this.gainNode.gain.value = this.volume;
  }

  bindExistingControls() {
    // Bind existing HTML controls
    const arpSpeedSlider = document.getElementById("arp-speed");
    const drumVolumeSlider = document.getElementById("drum-volume");
    const toggleVisualizerBtn = document.getElementById("toggle-visualizer");

    if (arpSpeedSlider) {
      arpSpeedSlider.addEventListener("input", (e) => {
        const value = parseInt(e.target.value);
        window.dispatchEvent(
          new CustomEvent("arpSpeedChange", { detail: value })
        );
      });
    }

    if (drumVolumeSlider) {
      drumVolumeSlider.addEventListener("input", (e) => {
        const value = parseInt(e.target.value) / 100;
        window.dispatchEvent(
          new CustomEvent("drumVolumeChange", { detail: value })
        );
      });
    }

    if (toggleVisualizerBtn) {
      toggleVisualizerBtn.addEventListener("click", () => {
        window.dispatchEvent(new CustomEvent("toggleVisualizer"));
      });
    }
  }

  createEnhancedControls() {
    // Create enhanced music controls container
    const controlsContainer = document.createElement("div");
    controlsContainer.className = "enhanced-controls";
    controlsContainer.innerHTML = `
      <div class="enhanced-controls-container">
        <div class="track-info">
          <span id="current-track-name">Mind Music AR</span>
          <span id="current-artist">Interactive Experience</span>
        </div>
        
        <div class="playback-controls">
          <button id="prev-track" class="control-btn" title="Previous">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 20L9 12l10-8v16z"/>
              <path d="M7 4h2v16H7z"/>
            </svg>
          </button>
          
          <button id="play-pause" class="control-btn play-btn" title="Play/Pause">
            <svg id="play-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z"/>
            </svg>
            <svg id="pause-icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" style="display: none;">
              <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
            </svg>
          </button>
          
          <button id="next-track" class="control-btn" title="Next">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M5 4l10 8-10 8V4z"/>
              <path d="M19 5h2v14h-2z"/>
            </svg>
          </button>
        </div>
        
        <div class="progress-section">
          <input type="range" id="progress-slider" class="progress-slider" min="0" max="100" value="0">
          <div class="time-info">
            <span id="current-time">0:00</span>
            <span id="total-time">0:00</span>
          </div>
        </div>
        
        <div class="volume-section">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z"/>
          </svg>
          <input type="range" id="volume-control" class="volume-control" min="0" max="100" value="70">
        </div>
        
        <div class="mode-controls">
          <button id="shuffle-mode" class="mode-btn" title="Shuffle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 3h3v3M9 21H6v-3M21 16v3h-3M3 9V6h3"/>
            </svg>
          </button>
          
          <button id="repeat-mode" class="mode-btn" title="Repeat">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 1l4 4-4 4"/>
              <path d="M3 11V9a4 4 0 014-4h14"/>
              <path d="M7 23l-4-4 4-4"/>
              <path d="M21 13v2a4 4 0 01-4 4H3"/>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Insert into DOM
    const canvasContainer = document.getElementById("canvas-container");
    if (canvasContainer) {
      canvasContainer.appendChild(controlsContainer);
    }

    this.bindEnhancedControls();
    this.updateTotalTime();
  }

  bindEnhancedControls() {
    // Enhanced control bindings
    this.playPauseBtn = document.getElementById("play-pause");
    this.prevBtn = document.getElementById("prev-track");
    this.nextBtn = document.getElementById("next-track");
    this.progressSlider = document.getElementById("progress-slider");
    this.volumeControl = document.getElementById("volume-control");
    this.shuffleBtn = document.getElementById("shuffle-mode");
    this.repeatBtn = document.getElementById("repeat-mode");
    this.currentTimeEl = document.getElementById("current-time");
    this.totalTimeEl = document.getElementById("total-time");

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener("click", () => this.togglePlayPause());
    }

    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.previousTrack());
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextTrack());
    }

    if (this.progressSlider) {
      this.progressSlider.addEventListener("input", (e) =>
        this.seekTo(parseInt(e.target.value))
      );
    }

    if (this.volumeControl) {
      this.volumeControl.value = this.volume * 100;
      this.volumeControl.addEventListener("input", (e) =>
        this.setVolume(parseInt(e.target.value) / 100)
      );
    }

    if (this.shuffleBtn) {
      this.shuffleBtn.addEventListener("click", () => this.toggleShuffle());
    }

    if (this.repeatBtn) {
      this.repeatBtn.addEventListener("click", () => this.toggleRepeat());
    }

    // Update progress every second
    this.progressInterval = setInterval(() => this.updateProgress(), 1000);
  }

  // Control methods
  togglePlayPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  play() {
    if (this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }

    this.isPlaying = true;
    this.updatePlayButton();
    window.dispatchEvent(new CustomEvent("musicPlay"));
  }

  pause() {
    this.isPlaying = false;
    this.updatePlayButton();
    window.dispatchEvent(new CustomEvent("musicPause"));
  }

  previousTrack() {
    this.currentTrackIndex =
      (this.currentTrackIndex - 1 + this.tracks.length) % this.tracks.length;
    this.updateTrackInfo();
    this.resetProgress();
    window.dispatchEvent(
      new CustomEvent("previousTrack", {
        detail: { track: this.tracks[this.currentTrackIndex] },
      })
    );
  }

  nextTrack() {
    if (this.shuffleEnabled) {
      this.currentTrackIndex = Math.floor(Math.random() * this.tracks.length);
    } else {
      this.currentTrackIndex =
        (this.currentTrackIndex + 1) % this.tracks.length;
    }
    this.updateTrackInfo();
    this.resetProgress();
    window.dispatchEvent(
      new CustomEvent("nextTrack", {
        detail: { track: this.tracks[this.currentTrackIndex] },
      })
    );
  }

  setVolume(volume) {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.setValueAtTime(
        this.volume,
        this.audioContext.currentTime
      );
    }
  }

  seekTo(percentage) {
    const time = (percentage / 100) * this.duration;
    this.currentTime = time;
    this.updateProgressUI();

    window.dispatchEvent(
      new CustomEvent("musicSeek", {
        detail: { time },
      })
    );
  }

  updatePlayButton() {
    const playIcon = document.getElementById("play-icon");
    const pauseIcon = document.getElementById("pause-icon");

    if (this.isPlaying) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  toggleShuffle() {
    this.shuffleEnabled = !this.shuffleEnabled;
    this.shuffleBtn.classList.toggle("active", this.shuffleEnabled);
    window.dispatchEvent(
      new CustomEvent("toggleShuffle", {
        detail: { enabled: this.shuffleEnabled },
      })
    );
  }

  toggleRepeat() {
    this.repeatEnabled = !this.repeatEnabled;
    this.repeatBtn.classList.toggle("active", this.repeatEnabled);
    window.dispatchEvent(
      new CustomEvent("toggleRepeat", {
        detail: { enabled: this.repeatEnabled },
      })
    );
  }

  updateProgress() {
    if (this.isPlaying) {
      this.currentTime += 1;

      if (this.currentTime >= this.duration) {
        if (this.repeatEnabled) {
          this.currentTime = 0;
        } else {
          this.nextTrack();
        }
      }

      this.updateProgressUI();
    }
  }

  updateProgressUI() {
    if (this.progressSlider) {
      this.progressSlider.value = (this.currentTime / this.duration) * 100;
    }

    if (this.currentTimeEl) {
      this.currentTimeEl.textContent = this.formatTime(this.currentTime);
    }
  }

  updateTotalTime() {
    if (this.totalTimeEl) {
      this.totalTimeEl.textContent = this.formatTime(this.duration);
    }
  }

  updateTrackInfo() {
    const trackNameEl = document.getElementById("current-track-name");
    const artistEl = document.getElementById("current-artist");

    if (trackNameEl && artistEl) {
      trackNameEl.textContent = this.tracks[this.currentTrackIndex].name;
      artistEl.textContent = this.tracks[this.currentTrackIndex].artist;
    }
  }

  resetProgress() {
    this.currentTime = 0;
    this.updateProgressUI();
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  // Clean up on exit
  destroy() {
    clearInterval(this.progressInterval);
    this.pause();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
