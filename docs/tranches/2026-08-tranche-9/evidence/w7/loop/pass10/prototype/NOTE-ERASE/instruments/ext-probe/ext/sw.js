// insertCSS at USER origin on every 127.0.0.1 tab once it loads
chrome.tabs.onUpdated.addListener((tabId, info) => {
  if (info.status !== 'complete') return;
  chrome.scripting.insertCSS({ target: { tabId }, origin: 'USER', css: '.margin-note-ink.note-leave-active { animation-duration: 900ms !important; } html { --erase10-user: 1; }' });
});
