export function showModal(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {
        action: "showDialog",
        url: tab.url
    }, (keyword) => callback(keyword));
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
