let currentURL = '';

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'analyticsSignal') {
    // Log the analytics event to the console
    console.log('Analytics Signal:', request.signal);

    // You can perform any other action with the signal data here, such as displaying it in the popup or storing it in local storage.
  }
});

function processRequests() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    if (tab.url !== currentURL) {
      // URL has changed, stop processing requests
      return;
    }

    chrome.webRequest.onBeforeRequest.addListener(
      function (details) {
        if (details.url.includes('analytics.google.com/g/collect?v=2&tid')) {
          // Extract the URL parameters
          const url = new URL(details.url);
          const params = url.searchParams;

          // Get the "en" parameter value
          const enParam = params.get('en');

          if (enParam) {
            // Extract subparameters starting with "ep."
            const subParams = {};
            params.forEach((value, key) => {
              if (key.startsWith('ep.')) {
                const subParam = key.substring(3); // Remove "ep." prefix
                subParams[subParam] = value;
              }
            });

            // Send the signal with subparameters to the background script
            const signal = {
              type: 'analyticsSignal',
              signal: { en: enParam, subParams: subParams }
            };
            chrome.runtime.sendMessage(signal);
          }
        }
      },
      { urls: ['<all_urls>']},
      ['blocking']
    );
  });
}

function startProcessing() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const tab = tabs[0];
    currentURL = tab.url;
    processRequests();
  });
}

function stopProcessing() {
  chrome.webRequest.onBeforeRequest.removeListener(processRequests);
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  if (changeInfo.url) {
    // Page URL has changed, stop processing requests
    stopProcessing();
  }
});

startProcessing();


  
  