# Mind Music AR 🎵🖐️

> **Hand-controlled arpeggiator, drum machine & real-time 3D waveform visualizer — all in your browser, no install required.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-a7a6ff?style=for-the-badge)](https://syogesh999.github.io/Mind-Music/)
[![License: MIT](https://img.shields.io/badge/License-MIT-fbc2eb?style=for-the-badge)](LICENSE)
[![Made with Three.js](https://img.shields.io/badge/Three.js-0.161-64dcff?style=for-the-badge)](https://threejs.org/)
[![Tone.js](https://img.shields.io/badge/Tone.js-latest-84C34E?style=for-the-badge)](https://tonejs.github.io/)

---

## 📖 Project Overview

**Mind Music AR** is an interactive, browser-based music creation platform that leverages **real-time hand tracking** and **AR-style 3D visuals**. Using just a webcam, you can:

- Play and control a **synthesiser arpeggiator** with your left hand
- Trigger **drum sounds** with individual fingers on your right hand
- Watch a **live waveform visualizer** react to every note
- Adjust **BPM, reverb, scale, and drum volume** from the built-in control panel

Simply grant webcam access, raise your hands, and start making music.

---

## ✨ Features

### 🎛️ Core Music Engine
| Feature | Description |
|---------|-------------|
| 🎹 **Hand Arpeggiator** | Left hand pitch (Y-axis) + pinch volume control drives a FM synth arpeggio |
| 🔄 **3 Synth Presets** | Sine wave, Buzzy Sawtooth, Rhodes-like Electric Piano — cycle with a fist |
| 🥁 **Finger Drum Machine** | 4 finger → 4 drum pad mapping on a 16-step sequencer |
| 🎚️ **BPM Control** | Real-time slider, 60–180 BPM, updates Tone.js Transport live |
| 🎛️ **Reverb & Delay** | Adjustable reverb wet, stereo feedback delay chain |
| 🎵 **Scale Selector** | 5 scales: Minor Pentatonic, Major, Blues, Dorian, Chromatic |

### 👁️ Visuals
| Feature | Description |
|---------|-------------|
| 🌊 **3D Waveform Ribbon** | Shader-based mesh updates every frame; colour shifts with pitch |
| 🔵 **Hand Skeleton** | Left hand = lavender `#a7a6ff`, Right hand = cyan `#64dcff` |
| 🔦 **Beat Indicators** | 16 pulsing squares show active drum pattern steps in real-time |
| ✨ **Animated Background** | Animated radial gradient with `hue-rotate` pulse |

### 🎮 Controls & UX
| Feature | Description |
|---------|-------------|
| ⚙️ **Sidebar Panel** | Collapsible controls: arp speed, drum volume, BPM, reverb, scale |
| ✋ **Gesture Guide** | Left panel with emoji guide for every gesture; togglable |
| 🔔 **Toast Notifications** | Slide-up animated toasts for every user action |
| 💬 **Rotating Info Text** | 6 contextual tips cycle with fade transitions every 6 seconds |
| ⌨️ **Keyboard Shortcuts** | Full keyboard control (see table below) |
| 🪬 **Loading Screen** | Animated loading screen with progress bar during MediaPipe init |
| 📱 **Responsive Layout** | Works on mobile; panels reposition on small screens |

---

## 🖐️ Gesture Controls

### Left Hand — Synth
| Gesture | Action |
|---------|--------|
| 🤚 Open hand, move **up/down** | Changes pitch (higher = higher note in selected scale) |
| 👌 **Pinch** thumb + index | Controls volume / note velocity |
| ✊ **Fist** | Cycles to next synth preset (Sine → Sawtooth → Rhodes) |

### Right Hand — Drums
| Finger | Drum Sound |
|--------|-----------|
| ☝️ Index up | **Kick** drum |
| ✌️ Middle up | **Snare** drum |
| 💍 Ring up | **Hi-hat** |
| 🤙 Pinky up | **Clap** |

> Multiple fingers can be raised simultaneously to layer drums.

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `G` | Toggle gesture guide panel |
| `C` | Toggle camera colour / grayscale |
| `R` | Restart hand tracking |
| `Space` | Play / Pause |
| `↑` / `↓` | Volume up / down |

---

## 🖥️ Live Demo

[**Try Mind Music AR Now →**](https://syogesh999.github.io/Mind-Music/)

> Best experienced in **Google Chrome** or **Microsoft Edge** on a desktop/laptop with a good webcam.

---

## ⚙️ Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/syogesh999/Mind-Music.git
cd Mind-Music
```

### 2️⃣ Start a Local Server

This project uses ES modules and webcam APIs — it **must** be served from an HTTP server, not opened as a `file://` URL:

```bash
# Python (built-in, no install needed)
python -m http.server 8000

# Node.js live-server (auto-reloads)
npx live-server

# VS Code: use the "Live Server" extension
```

Open [http://localhost:8000](http://localhost:8000) in your browser.

### 3️⃣ Allow Webcam Access

Click **Allow** when the browser asks for camera permission. The app will load MediaPipe's hand tracking model (~5 MB from CDN) before starting — the loading screen shows live progress.

---

## 📦 Requirements

| Requirement | Detail |
|-------------|--------|
| **Browser** | Latest Chrome or Edge (WebGL + WebAssembly required) |
| **Webcam** | Any USB or built-in camera |
| **Internet** | Required for CDN assets (MediaPipe, Three.js, Tone.js) |
| **Node.js** | Optional — only needed for `npx live-server` |
| **OS** | Windows, macOS, or Linux |

---

## 🛠️ Technology Stack

| Library | Version | Purpose |
|---------|---------|---------|
| [Three.js](https://threejs.org/) | `0.161.0` | 3D rendering, hand skeleton & waveform visualizer |
| [Tone.js](https://tonejs.github.io/) | latest | Web Audio synthesis, sequencer, effects chain |
| [MediaPipe Tasks Vision](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker) | `0.10.14` | Real-time 21-landmark hand tracking |
| [Google Fonts — Inter + Space Grotesk](https://fonts.google.com/) | — | UI typography |
| Vanilla JS (ES Modules) | — | All app logic, no framework |
| HTML5 / CSS3 | — | Structure, glassmorphism UI, animations |

---

## 📂 Project Structure

```
MIND-MUSIC/
├── assets/
│   ├── kick.wav          # Drum sample — kick
│   ├── snare.wav         # Drum sample — snare
│   ├── hihat.wav         # Drum sample — hi-hat
│   ├── clap.wav          # Drum sample — clap
│   ├── demo.png          # Demo screenshot
│   └── siteOGImage.webp  # Open Graph image
│
├── index.html            # Entry point — loading screen + app shell
├── styles.css            # Full UI — glassmorphism, animations, responsive
├── main.js               # Bootstraps the Game class
│
├── game.js               # Core orchestrator — Three.js, MediaPipe, events
├── MusicManager.js       # Tone.js synth, arpeggio, effects chain
├── DrumManager.js        # 16-step drum sequencer, sample players
├── WaveformVisualizer.js # Shader-based ribbon waveform (Three.js)
├── music-controls.js     # UI controls, loading screen, keyboard shortcuts
│
├── README.md
└── LICENSE
```

---

## 🐛 Bug Fixes (v2 — April 2026)

The following bugs were identified and fixed:

| # | File | Bug | Fix |
|---|------|-----|-----|
| 1 | `game.js` | `restartHintText.style.display = 'true'` — invalid CSS value | Changed to `'block'` |
| 2 | `music-controls.js` | Created a second `AudioContext` independent of Tone.js → play/pause did nothing | Removed standalone `AudioContext`; class is now pure UI |
| 3 | `music-controls.js` | `updateTotalTime()` called before `totalTimeEl` was assigned → displayed `NaN` | Fixed call ordering in `bindEnhancedControls()` |
| 4 | `styles.css` | `@keyframes bgmove` animated `background-position` which has no effect on CSS radial-gradients | Replaced with `bgPulse` using `opacity` + `filter: hue-rotate` |
| 5 | `music-controls.js` | All UI button clicks propagated to `renderDiv` → `musicManager.start()` called on every button press | Added `e.stopPropagation()` to all control buttons |
| 6 | `DrumManager.js` | `startSequence()` silently failed after game restart (sequence object still existed) | Added `resetSequence()` export; `_restartGame()` now calls it |
| 7 | `game.js` | No loading feedback during ~10 second MediaPipe model download | Added animated loading screen with live progress updates |

---

## 🚀 Changelog

### v2.0.0 — April 2026

#### New Features
- **Animated Loading Screen** — pulsing logo, gradient title, live status text, and progress bar (0 → 100%)
- **BPM Slider** — 60–180 BPM slider in sidebar, updates `Tone.Transport.bpm` live
- **Reverb Wet Slider** — adjust reverb intensity from 0–100%
- **Drum Volume Slider** — new `setVolume()` export on `DrumManager`
- **Scale Selector** — 5 musical scales: Minor Pentatonic, Major, Blues, Dorian, Chromatic
- **Gesture Guide Panel** — left side panel with emoji-labelled gesture guide; togglable via button or `G` key
- **Camera Colour Toggle** — switch webcam between grayscale and full colour (`C` key or sidebar button)
- **Keyboard Shortcuts** — `G`, `C`, `R`, `Space`, `↑`, `↓`
- **Toast Notification System** — animated slide-up toasts appear for all user actions
- **Rotating Info Text** — 6 tips cycle with fade transitions every 6 seconds
- **Coloured Hand Skeletons** — left hand lavender `#a7a6ff`, right hand cyan `#64dcff`
- **Sidebar Collapse** — arrow button slides sidebar off-screen; floating button to re-open
- **Waveform Toggle** — hide/show waveform visualizer without disposing the mesh
- **Dorian Scale** added to scale options

#### UI / Design Overhaul
- Full CSS rewrite with Google Fonts (`Inter` + `Space Grotesk`)
- Glassmorphism panels with `backdrop-filter: blur(16px)`
- Gradient title text with animated colour shift
- Custom range input thumb with glow shadow
- Improved responsive layout — panels reposition cleanly on mobile
- Beat indicator off-state colour changed from white to `#444466` for better contrast

---

## 📜 License

This project is licensed under the **MIT License**.
You are free to use, modify, and distribute this software, provided you retain the original copyright.

```
MIT License
Copyright (c) 2025 syogesh999
```

---

## 🙌 Acknowledgements

- The **Three.js** team for their robust 3D rendering library
- **Tone.js** for the flexible web audio synthesis engine
- **Google MediaPipe** for real-time hand tracking technology
- **Google Fonts** for Inter and Space Grotesk typefaces
- All open-source contributors who made this project possible
