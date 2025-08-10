# Mind Music AR 🎵🖐️

## 📖 Project Overview

**Mind Music AR** is an interactive, browser-based music creation platform that leverages **hand tracking** and **augmented reality (AR) visuals**. Control an arpeggiator, drum machine, and real-time waveform visualizer — all through intuitive hand gestures.  
Simply grant webcam access, raise your hands, and start making music with natural movements.

### ✨ Key Features

- 🎹 **Hand-Controlled Arpeggiator:** Change notes and instruments using gestures.
- 🥁 **Gesture-Based Drum Machine:** Trigger drum sounds with specific finger movements.
- 🎨 **3D Real-Time Waveform Visualizer:** Powered by Three.js for immersive visuals.
- ⚡ **No Installation Required:** Runs directly in your browser.

## 🖐️ Gesture Controls

- **Raise left hand:** Plays and changes arpeggiator notes
- **Close left fist:** Switches to the next synth preset
- **Raise right hand fingers:**
  - Index finger → Kick
  - Middle finger → Snare
  - Ring finger → Clap
  - Pinky → Hi-hat
- **Move hand vertically:** Changes pitch
- **Pinch fingers:** Adjusts note velocity (volume)

## 🖥️ Live Demo

[**Try Mind Music AR Now**](https://syogesh999.github.io/Mind-Music/)  
_Best experienced in Google Chrome on desktop._

---

## ⚙️ Development Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/syogesh999/Mind-Music.git
cd Mind-Music
```

### 2️⃣ Start a Local Server

This project uses ES modules and webcam APIs, so it must be served from a local server:

```bash
# Using Python
python -m http.server 8000

# Or using Node.js live-server
npx live-server
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

### 3️⃣ Enable Webcam Access

Allow your browser to access your webcam when prompted.

---

## 📦 Requirements

- **Browser:** Latest Chrome or Edge with Webcam & WebGL support
- **Node.js:** (Optional, for development tools)
- **Local HTTP Server:** Required to avoid CORS issues with modules
- **Internet Connection:** Some assets and libraries are loaded from CDNs

---

## 🛠️ Technologies Used

- **[Three.js](https://threejs.org/):** 3D graphics and visualization
- **[Tone.js](https://tonejs.github.io/):** Web Audio API music synthesis
- **[MediaPipe Hands](https://developers.google.com/mediapipe/solutions/vision/hand_landmarker):** Real-time hand tracking
- **Vanilla JavaScript (ES Modules):** Core application logic
- **HTML5 / CSS3:** Structure and styling

---

## 📂 Project Structure

```bash
MIND-MUSIC/
├── .vscode/
│   └── settings.json
├── assets/
│   ├── clap.wav
│   ├── demo.png
│   ├── hihat.wav
│   ├── kick.wav
│   ├── siteOGImage.webp
│   └── snare.wav
├── DrumManager.js
├── game.js
├── index.html
├── LICENSE
├── main.js
├── music-controls.js
├── MusicManager.js
├── README.md
├── styles.css
└── WaveformVisualizer.js
```

---

## 📜 License

This project is licensed under the **MIT License**.  
You are free to use, modify, and distribute this software, provided you retain the original copyright.

```
MIT License

Copyright (c) 2025 syogesh999

Permission is hereby granted, free of charge, to any person obtaining a copy
...
```

---

## 🙌 Acknowledgements

- The **Three.js** team for their robust 3D library.
- **Tone.js** for the flexible audio synthesis engine.
- **MediaPipe** for real-time hand tracking technology.
- All open-source contributors who made this project possible.
