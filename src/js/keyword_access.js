export function showModal(tab) {
    console.debug(`show modal for tab ${tab.id}`);
    return sendMessage(tab.id, "showDialog", {url: tab.url});
}

export function sendMessage(tabId, action, data) {
    return new Promise((resolve, reject) => {
        chrome.tabs.sendMessage(tabId, {
            action: action, ...data
        }, (response) => {
            let error = chrome.runtime.lastError;
            if (error) {
                reject(error);
            } else {
                resolve(response)
            }
        });
    });
}

export function addEntry(url, id, keyword) {
    return entries()
        .then(items => {
            items[keyword] = {id: id, url: url};
            return items;
        })
        .then(items => chrome.storage.promise.local.set({keyword_access: items}))
        .catch(error => console.error(error));
}

export function removeEntry(keyword) {
    return entries()
        .then(items => {
            delete items[keyword];
            return items;
        })
        .then(items => chrome.storage.promise.local.set({keyword_access: items}))
        .catch(error => console.error(error));
}

export function clearEntries() {
    return chrome.storage.promise.local.clear();
}

export function entries() {
    return chrome.storage.promise.local.get('keyword_access')
        .then(items => {
            return items && items["keyword_access"] ? items["keyword_access"] : {};
        })
        .catch(error => console.error(error));
}
