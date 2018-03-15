//Remember tab URLs
var tabsInfo = {};
function completedLoadingUrlInTab(details) {
    //console.log('details:',details);
    //We have completed loading a URL.
    createTabRecordIfNeeded(details.tabId);
    if(details.frameId !== 0){
        //Only record inforamtion for the main frame
        return;
    }
    //Remember the newUrl so we can check against it the next time
    //  an event is fired.
    tabsInfo[details.tabId].priorCompleteUrl = tabsInfo[details.tabId].completeUrl;
    tabsInfo[details.tabId].completeUrl = details.url;
}

function InfoForTab(_url,_priorUrl) {
    this.completeUrl = (typeof _url !== 'string') ? "" : _url;
    this.priorCompleteUrl = (typeof _priorUrl !== 'string') ? "" : _priorUrl;
}

function createTabRecordIfNeeded(tabId) {
    if(!tabsInfo.hasOwnProperty(tabId) || typeof tabsInfo[tabId] !== 'object') {
        //This is the first time we have encountered this tab.
        //Create an object to hold the collected info for the tab.
        tabsInfo[tabId] = new InfoForTab();
    }
}


//Block URLs
function blockUrlIfMatch(details){
    createTabRecordIfNeeded(details.tabId);
    if(/^[^:/]+:\/\/[^/]*stackexchange\.[^/.]+\//.test(details.url)){
        //Block this URL by navigating to the already current URL
        console.log('Blocking URL:',details.url);
        console.log('Returning to URL:',tabsInfo[details.tabId].completeUrl);
        if(details.frameId !==0){
            //This navigation is in a subframe. We currently handle that  by
            //  navigating to the page prior to the current one.
            //  Probably should handle this by changing the src of the frame.
            //  This would require injecting a content script to change the src.
            //  Would also need to handle frames within frames.
            //Must navigate to priorCmpleteUrl as we can not load the current one.
            tabsInfo[details.tabId].completeUrl = tabsInfo[details.tabId].priorCompleteUrl;
        }
        var urlToUse = tabsInfo[details.tabId].completeUrl;
        urlToUse = (typeof urlToUse === 'string') ? urlToUse : '';
        chrome.tabs.update(details.tabId,{url: urlToUse},function(tab){
            if(chrome.runtime.lastError){
                if(chrome.runtime.lastError.message.indexOf('No tab with id:') > -1){
                    //Chrome is probably loading a page in a tab which it is expecting to
                    //  swap out with a current tab.  Need to decide how to handle this
                    //  case.
                    //For now just output the error message
                    console.log('Error:',chrome.runtime.lastError.message)
                } else {
                    console.log('Error:',chrome.runtime.lastError.message)
                }
            }
        });
        //Notify the user URL was blocked.
        notifyOfBlockedUrl(details.url);
    }
}

function notifyOfBlockedUrl(url){
    //This will fail if you have not provided an icon.
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'blockedUrl.png',
        title:'Blocked URL',
        message:url
    });
}


//Startup
chrome.webNavigation.onCompleted.addListener(completedLoadingUrlInTab);
chrome.webNavigation.onBeforeNavigate.addListener(blockUrlIfMatch);

//Get the URLs for all current tabs when add-on is loaded.
//Block any currently matching URLs.  Does not check for URLs in frames.
chrome.tabs.query({},tabs => {
    tabs.forEach(tab => {
        createTabRecordIfNeeded(tab.id);
        tabsInfo[tab.id].completeUrl = tab.url;
        blockUrlIfMatch({
            tabId : tab.id,
            frameId : 1, //use 1. This will result in going to '' at this time.
            url : tab.url
        });

    });
});