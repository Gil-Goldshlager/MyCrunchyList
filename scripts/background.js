/* Set page action */
chrome.runtime.onInstalled.addListener(function() {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { hostContains: 'crunchyroll.com' }
          }),
          new chrome.declarativeContent.PageStateMatcher({
			pageUrl: { hostContains: 'myanimelist.net' }
          })
        ],
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});