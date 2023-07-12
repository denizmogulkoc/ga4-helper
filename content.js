// Listen for network requests
chrome.webRequest.onCompleted.addListener(function (details) {
    if (details.type === 'xmlhttprequest' && details.url.includes('analytics.google.com/g/collect?v=2&tid')) {
      // Extract the request body
      const requestBody = decodeURIComponent(String.fromCharCode.apply(null, new Uint8Array(details.requestBody.raw[0].bytes)));
  
      // Parse the request body to extract analytics signals
      const urlParams = new URLSearchParams(requestBody);
      const signals = {
        type: 'analyticsSignal',
        signal: urlParams.get('en') // Assuming 'ea' is the parameter containing the event name
      };
  
      // Send the signal to the background script
      chrome.runtime.sendMessage(signals);
    }
  }, { urls: ['<all_urls>'] });
  