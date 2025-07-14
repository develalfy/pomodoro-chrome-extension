# 🍅 Pomodoro Timer Chrome Extension

<div align="center">
  
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![Chrome Web Store Version](https://img.shields.io/badge/version-1.0.0-blue)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)

A modern, feature-rich Chrome extension implementing the Pomodoro Technique to boost your productivity and maintain focus.

</div>

## ✨ Features

### Core Features
- ⏰ Customizable work/break intervals (default: 25/5 minutes)
- ⚡ Intuitive start, pause, and reset controls
- 🔄 Automatic mode switching between work and break
- 🔔 Desktop notifications with sound alerts
- 💾 Persistent state across browser sessions

### Advanced Features
- 📊 Progress tracking with visual ring indicator
- 📈 Daily statistics and goal tracking
- 🎯 Daily focus time goals
- 🌙 Dark mode support
- ⚙️ Customizable settings
- 📊 Focus session history

## 🚀 Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/develalfy/pomodoro-chrome-extension.git
   ```

2. **Load in Chrome**
   - Navigate to `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the cloned directory

## 🎯 Usage

1. **Quick Start**
   - Click the extension icon
   - Press "Start" to begin your focus session
   - Work until the break notification appears
   - Take a short break
   - Repeat the cycle

2. **Customization**
   - Click the settings icon to:
     - Adjust timer durations
     - Set daily focus goals
     - Toggle sound notifications
     - Customize theme preferences

3. **Progress Tracking**
   - View your daily focus time
   - Track completed Pomodoros
   - Monitor daily goal progress
   - Check focus session history

## 🛠️ Development

### Tech Stack
- Modern HTML5 & CSS3 with CSS Variables
- Vanilla JavaScript (ES6+)
- Chrome Extension APIs

### Key Components
- `manifest.json`: Extension configuration
- `popup.html/css/js`: Modern UI and interaction
- `background.js`: Core timer logic
- Chrome APIs:
  - `chrome.alarms`
  - `chrome.notifications`
  - `chrome.storage`
  - `chrome.runtime`

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🌟 Acknowledgments

- Inspired by the Pomodoro Technique by Francesco Cirillo
- Icons provided by Heroicons
- Font by Inter
