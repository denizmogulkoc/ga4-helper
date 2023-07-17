window.addEventListener("DOMContentLoaded", function () {
  var urlList = document.getElementById("urlList");
  var parameterCounts = {}; // Initialize parameter count dictionary

  function resetList() {
    urlList.innerHTML = ""; // Clear the list
    parameterCounts = {}; // Reset parameter count dictionary
  }

  function updateList(response) {
    var filteredUrls = response.filter(function (url) {
      return url.includes("analytics.google.com/g/collect?v=2&tid") && url.includes("&en=");
    });

    resetList();

    filteredUrls.reverse().forEach(function (url, index) {
      var queryStartIndex = url.indexOf("en=");
      var queryEndIndex = url.indexOf("&", queryStartIndex);
      var queryValue = "";

      if (queryEndIndex !== -1) {
        queryValue = url.substring(queryStartIndex + 3, queryEndIndex);
      } else {
        queryValue = url.substring(queryStartIndex + 3);
      }

      if (parameterCounts.hasOwnProperty(queryValue)) {
        parameterCounts[queryValue]++; // Increment count if parameter exists
      } else {
        parameterCounts[queryValue] = 1; // Initialize count if parameter doesn't exist
      }

      var listItem = document.createElement("li");
      listItem.innerHTML = `
        <span class="parameter-number">${filteredUrls.length - index}</span>
        <span class="parameter-name">event: ${queryValue}</span>
      `;
      listItem.setAttribute("data-count", parameterCounts[queryValue]);
      urlList.appendChild(listItem);
    });
  }

  chrome.runtime.sendMessage({ action: "getLoggedUrls" }, function (response) {
    updateList(response); // Initial handling for the current page
  });

  // Continuously update the popup when new URLs are logged
  setInterval(function () {
    chrome.runtime.sendMessage({ action: "getLoggedUrls" }, function (response) {
      updateList(response);
    });
  }, 1000); // Adjust the interval time (in milliseconds) as needed

  // Handle button click event
  var moreButton = document.getElementById("moreButton");
  moreButton.addEventListener("click", function () {
    window.open("https://ga4helper.com", "_blank");
  });
});
