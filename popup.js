// Listen for messages from the background script

let currentURL = window.location.href;


chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'analyticsSignal') {
    // Display the analytics signal in the popup
    const signalList = document.getElementById('signal-list');
    
    // Create a new list item for the "en" parameter
    const enListItem = document.createElement('li');
    enListItem.textContent = `en: ${request.signal.en}`;
    signalList.appendChild(enListItem);
    
    // Add a paragraph to separate the "en" parameter and subparameters
    signalList.appendChild(document.createElement('hr'));
    
    // Display each subparameter in a list item
    for (const [subParam, value] of Object.entries(request.signal.subParams)) {
      const subParamListItem = document.createElement('li');
      subParamListItem.textContent = `${subParam}: ${value}`;
      signalList.appendChild(subParamListItem);
    }
    
    // Add a paragraph after the list
    signalList.appendChild(document.createElement('hr'));
  }
});


  