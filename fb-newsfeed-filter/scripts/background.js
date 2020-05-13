// match pattern for the URLs to redirect
//add the links to be blocked here dynamically/manually
var pattern = ["https://www.facebook.com/lalsalu.page/posts/2769601203135709",
              "https://www.facebook.com/groups/brahmanbarian2017/permalink/3068719746521623/",
              "https://www.facebook.com/mh.mon.94/videos/638619193593343/",
              "https://*.bing.com/*",
              "https://www.facebook.com/mh.mon.94/*",
              "https://*.bing.com/*"];
var currenturl = ""

//post request to server
var serverData;
var xmlhttp = new XMLHttpRequest();
var url = "https://coronafactcheck.herokuapp.com/covid19/api/get_blacklist";
//collect all the blacklisted urls in this urlList
var urlList = [];
xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
         serverData = JSON.parse(this.responseText);
         //console.log(serverData)
         for(i=0; i<serverData.length; i++){
            //console.log(serverData[i]['url'])
            urlList.push(serverData[i]['url'])
         };
         console.log(urlList)
         //console.log(pattern)
    };
};
xmlhttp.open("POST", url, false);
xmlhttp.send();

var requestedURL;
// cancel function returns an object
// which contains a property `cancel` set to `true`
function cancel(requestDetails) {
   console.log("working: " +urlList)
   console.log("pattern: " +pattern)
  //TODO: handle www or w/o www
  console.log("Canceling: " + requestDetails.url);
  //display custom popup message
  //chrome.tabs.update({url: "https://example.com"});
  requestedURL = requestDetails.url;

  // return {redirectUrl: chrome.extension.getURL("templates/blockmsg.html") };
  return {redirectUrl: chrome.extension.getURL("templates/blockmsg.html"+"?&from="+currenturl+"&blocked="+requestedURL)};

  return {cancel: true};
}


// add the listener,
// passing the filter argument and "blocking" 
chrome.webRequest.onBeforeRequest.addListener(cancel, {urls: urlList}, ["blocking"]);

// listen to tab changes event and page loading complete event
// capture the current url, then pass onto the blockmsg.html for "go back" button
function temp(req){
  chrome.tabs.query({active: true, lastFocusedWindow: true, currentWindow: true}, function (tabs) {
    console.log("CURRENT TAB "+tabs[0].url);
    currenturl = tabs[0].url;
  });
}

chrome.webRequest.onCompleted.addListener(temp,{urls: ["<all_urls>"]});
chrome.tabs.onActivated.addListener(temp)
