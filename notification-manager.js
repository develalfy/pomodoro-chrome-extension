// Notification manager
class NotificationManager {
  static async showNotification(title, message, requireInteraction = true) {
    const notificationId = 'pomodoro-notification-' + Date.now();
    
    // Clear existing notifications
    const notifications = await chrome.notifications.getAll();
    Object.keys(notifications).forEach(id => {
      chrome.notifications.clear(id);
    });

    // Create new notification
    return chrome.notifications.create(notificationId, {
      type: 'basic',
      iconUrl: 'icon.png',
      title: title,
      message: message,
      priority: 2,
      requireInteraction: requireInteraction,
      buttons: [{ title: 'OK, Got it!' }],
      silent: false
    });
  }

  static handleTimerComplete(isWorkMode, sessionCount, settings) {
    let title = 'Pomodoro Timer';
    let message = '';

    if (isWorkMode) {
      message = 'Time to focus! Start your work session.';
    } else {
      if (sessionCount % settings.longBreakInterval === 0) {
        message = `Great job! Take a longer break (${settings.longBreakDuration} minutes)`;
      } else {
        message = `Well done! Take a short break (${settings.shortBreakDuration} minutes)`;
      }
    }

    this.showNotification(title, message);
  }
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  chrome.notifications.clear(notificationId);
});

export default NotificationManager;
