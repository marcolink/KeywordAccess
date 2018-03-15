export function showModal(tab, callback) {
    console.debug(`show modal for tab ${tab.id}`);
    sendMessage(tab.id, "showDialog", {url: tab.url}, (response) => callback(response.value));
}

export function sendMessage(tabId, action, data, callback){
    chrome.tabs.sendMessage(tabId, {
        action: action, ...data
    }, (response) => {
        console.assert(!chrome.runtime.lastError, `response for "${action}" has errors`, chrome.runtime.lastError);
        console.debug(`execute callback for "${action}"`);
        callback(response)
    });
}

export function addEntry(url, id, keyword, callback) {
    entries((items) => {
        items = items || {};
        items[keyword] = {id: id, url: url};
        chrome.storage.local.set({keyword_access: items}, () => callback && callback());
    });
}

export function removeEntry(keyword, callback) {
    entries((items) => {
        delete items[keyword];
        chrome.storage.local.set({keyword_access: items}, () => callback && callback());
    });
}

export function entries(callback) {
    chrome.storage.local.get('keyword_access', (items) =>
        callback(chrome.runtime.lastError ? {} : items["keyword_access"]));
}
