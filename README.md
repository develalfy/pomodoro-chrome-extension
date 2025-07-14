# Pomodoro Timer Chrome Extension

A simple and elegant Chrome extension that implements the Pomodoro Technique to help you stay focused and productive.

## Features

- 25-minute work timer and 5-minute break timer
- Start, pause, and reset functionality
- Automatic switching between work and break modes
- Desktop notifications when timers complete
- Persistent state (saves timer state when browser is closed)
- Clean, modern UI with clear visual feedback

## Installation

1. Clone this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" in the top right
4. Click "Load unpacked" and select the cloned directory
5. The extension icon should appear in your Chrome toolbar

## Usage

1. Click the extension icon to open the timer
2. Click "Start" to begin a 25-minute work session
3. Work until the timer ends
4. Take a 5-minute break when notified
5. Repeat the cycle

## Development

The extension is built with:
- HTML/CSS for the popup UI
- JavaScript for timer logic
- Chrome Extension APIs:
  - alarms
  - notifications
  - storage
  - background service worker
