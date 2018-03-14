export function showModal(tab, callback) {
    chrome.tabs.sendMessage(tab.id, {
        action: "showDialog",
        url: tab.url
    }, (keyword) => callback(keyword));
}

export function storeEntry(url, id, keyword) {
    console.log("store");
    getStoredItems((items) => {

        if (items === undefined) {
            items = {};
        }

        items[keyword] = {id: id, url: url};
        console.table(items);
        chrome.storage.local.set({keyword_access: items}, () => alert("stored " + url));
    });
}

export function deleteEntry(keyword, callback) {
    console.log("store", keyword);
    getStoredItems((items) => {
        delete items[keyword];
        chrome.storage.local.set({keyword_access: items}, () => callback && callback());
    });
}

export function getStoredItems(callback) {
    console.log("get");
    chrome.storage.local.get('keyword_access', (items) =>
        callback(chrome.runtime.lastError ? {} : items["keyword_access"]));
}
