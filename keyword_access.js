export function showModal(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {
        action: "showDialog",
        url: tab.url
    }, (keyword) => callback(keyword));
}

export function storeEntry(url, id, keyword) {
    getStoredItems((items) => {
        items[keyword] = {id: id, url: url};
        chrome.storage.local.set({keyword_access: items}, () => console.log(items));
    });
}

export function deleteEntry(keyword, callback) {
    getStoredItems((items) => {
        delete items[keyword];
        chrome.storage.local.set({keyword_access: items}, () => callback());
    });
}

export function getStoredItems(callback) {
    chrome.storage.local.get('keyword_access', (items) =>
        callback(chrome.runtime.lastError ? {} : items["keyword_access"]));
}
