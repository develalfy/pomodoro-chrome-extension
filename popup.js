// Default settings
const DEFAULT_SETTINGS = {
  workDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
};

// State management
let currentSettings = { ...DEFAULT_SETTINGS };
let timeRemaining = currentSettings.workDuration * 60;
let isWorkMode = true;
let isRunning = false;
let sessionCount = 0;
let timerId = null;

// UI Elements
const timerDisplay = document.getElementById('timer');
const modeLabel = document.getElementById('modeLabel');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const settingsBtn = document.getElementById('settingsBtn');
const settingsModal = document.getElementById('settingsModal');
const closeSettingsBtn = document.getElementById('closeSettings');
const saveSettingsBtn = document.getElementById('saveSettings');
const progressRing = document.getElementById('progressIndicator');

// Initialize settings
document.addEventListener('DOMContentLoaded', async () => {
  await loadSettings();
  await loadState();
  
  // Set initial time if not running
  if (!isRunning) {
    timeRemaining = currentSettings.workDuration * 60;
  }
  
  console.log('Loaded settings:', currentSettings);
  console.log('Initial time remaining:', timeRemaining);
  
  updateProgressRing();
  updateUI();
});

// Settings Modal
settingsBtn.addEventListener('click', () => {
  document.getElementById('workDuration').value = currentSettings.workDuration;
  document.getElementById('shortBreakDuration').value = currentSettings.shortBreakDuration;
  document.getElementById('longBreakDuration').value = currentSettings.longBreakDuration;
  document.getElementById('longBreakInterval').value = currentSettings.longBreakInterval;
  settingsModal.style.display = 'block';
});

closeSettingsBtn.addEventListener('click', () => {
  settingsModal.style.display = 'none';
});

settingsModal.addEventListener('click', (e) => {
  if (e.target === settingsModal) {
    settingsModal.style.display = 'none';
  }
});

saveSettingsBtn.addEventListener('click', async () => {
  const newSettings = {
    workDuration: parseInt(document.getElementById('workDuration').value, 10),
    shortBreakDuration: parseInt(document.getElementById('shortBreakDuration').value, 10),
    longBreakDuration: parseInt(document.getElementById('longBreakDuration').value, 10),
    longBreakInterval: parseInt(document.getElementById('longBreakInterval').value, 10),
  };

  // Validate settings
  if (Object.values(newSettings).some(value => isNaN(value) || value <= 0)) {
    alert('Please enter valid numbers greater than 0');
    return;
  }

  currentSettings = newSettings;
  await saveSettings();

  // Send new settings to background script
  chrome.runtime.sendMessage({
    action: 'UPDATE_SETTINGS',
    settings: currentSettings
  });
  
  // Reset timer if it's not running
  if (!isRunning) {
    timeRemaining = currentSettings.workDuration * 60;
    updateUI();
  } else {
    // Update current timer duration based on mode
    const currentMode = isWorkMode ? 'work' : 
      (sessionCount % currentSettings.longBreakInterval === 0 ? 'longBreak' : 'shortBreak');
    
    const newDuration = currentMode === 'work' ? currentSettings.workDuration :
      currentMode === 'longBreak' ? currentSettings.longBreakDuration :
      currentSettings.shortBreakDuration;
    
    timeRemaining = newDuration * 60;
    updateUI();
  }
  
  settingsModal.style.display = 'none';
});

// Timer Controls
startBtn.addEventListener('click', startTimer);
pauseBtn.addEventListener('click', pauseTimer);
resetBtn.addEventListener('click', resetTimer);

function startTimer() {
  isRunning = true;
  startBtn.disabled = true;
  pauseBtn.disabled = false;
  
  // Ensure we're using the correct duration when starting
  if (!timeRemaining || timeRemaining === 0) {
    timeRemaining = currentSettings.workDuration * 60;
  }
  
  console.log('Starting timer with:', {
    settings: currentSettings,
    timeRemaining: timeRemaining,
    isWorkMode: isWorkMode,
    sessionCount: sessionCount
  });
  
  chrome.runtime.sendMessage({ 
    action: 'START',
    settings: currentSettings,
    timeRemaining,
    isWorkMode,
    sessionCount
  });
}

function pauseTimer() {
  isRunning = false;
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  
  chrome.runtime.sendMessage({ action: 'PAUSE' });
}

function resetTimer() {
  isRunning = false;
  isWorkMode = true;
  sessionCount = 0;
  timeRemaining = currentSettings.workDuration * 60;
  
  startBtn.disabled = false;
  pauseBtn.disabled = true;
  
  chrome.runtime.sendMessage({ action: 'RESET' });
  updateUI();
}

// UI Updates
function updateUI() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  modeLabel.textContent = isWorkMode ? 'Work Time' : 'Break Time';
  updateProgressRing();
}

function updateProgressRing() {
  const circle = progressRing;
  const radius = circle.r.baseVal.value;
  const circumference = radius * 2 * Math.PI;
  
  circle.style.strokeDasharray = `${circumference} ${circumference}`;
  circle.style.strokeDashoffset = circumference;
  
  const totalTime = isWorkMode ? currentSettings.workDuration * 60 : 
    (sessionCount % currentSettings.longBreakInterval === 0 ? 
      currentSettings.longBreakDuration * 60 : 
      currentSettings.shortBreakDuration * 60);
      
  const offset = circumference - (timeRemaining / totalTime) * circumference;
  circle.style.strokeDashoffset = offset;
}

// Storage Functions
async function loadSettings() {
  try {
    const result = await chrome.storage.local.get('settings');
    if (result.settings) {
      currentSettings = result.settings;
    }
  } catch (error) {
    console.error('Error loading settings:', error);
  }
}

async function saveSettings() {
  try {
    await chrome.storage.local.set({ settings: currentSettings });
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

async function loadState() {
  try {
    const result = await chrome.storage.local.get(['timeRemaining', 'isRunning', 'isWorkMode', 'sessionCount']);
    if (result.timeRemaining !== undefined) {
      timeRemaining = result.timeRemaining;
      isRunning = result.isRunning;
      isWorkMode = result.isWorkMode;
      sessionCount = result.sessionCount || 0;
      
      if (isRunning) {
        startBtn.disabled = true;
        pauseBtn.disabled = false;
      }
    }
  } catch (error) {
    console.error('Error loading state:', error);
  }
}

// Message handling
chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'TIMER_UPDATE') {
    timeRemaining = message.timeRemaining;
    isWorkMode = message.isWorkMode;
    sessionCount = message.sessionCount;
    updateUI();
  }
});
