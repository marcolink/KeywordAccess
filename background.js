import {showModal, addEntry, sendMessage, entries} from "./keyword_access.js";

const menuItemId = "keyword_access_menu_item";
let futureAccess = null;

chrome.contextMenus.create({
    title: "Add keyword access",
    id: menuItemId,
    contexts: ["editable"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === menuItemId) {
        addKeywordAccessItem(tab)
    }
});

function addKeywordAccessItem(tab) {

    let selector = null;
    sendMessage(tab.id, "getInputSelector", null)
        .then(response => {
            selector = response.value;
            showModal(tab)
                .then(response => addEntry(tab.url, selector, response.value))
                .catch(error => console.error(error));
        })
        .catch(error => console.error(error));
}

function executeSearch(url, frameId) {
    chrome.tabs.update(frameId, {url:url}, tab => {
        console.debug("updated");
    })
}

chrome.webNavigation.onCompleted.addListener(details => {
    console.debug("onComplete");
    if(futureAccess){

        // todo check why query is not returning node!

        console.debug(futureAccess.id)
        let node = document.querySelector(futureAccess.id);
        console.debug(node);
    }
    futureAccess = null;
});

chrome.webNavigation.onBeforeNavigate.addListener(details => {
    let url = details.url;
    extractInput(url).then(result => {
        result.forEach(kv => {
            maybeGetConfiguration(kv.key).then(configuration => {
                if (configuration) {
                    futureAccess = {keyword: kv.key, value: kv.value, ...configuration};
                    executeSearch(futureAccess.url, details.tabId);
                }
            })
        })

    }).catch(error => console.error(error));
});

function extractInput(url) {
    return new Promise(resolve => {

        let params = getParams(url);
        let result = [];

        Object.values(params).forEach(value => {
            if (value.includes(" ")) {
                let groups = value.match(/^(\w+)\s(.*)$/);
                result.push({key: groups[1], value: groups[2]});
            }
        });

        resolve(result);
    });
}

function maybeGetConfiguration(keyword) {
    return new Promise(resolve => {
        entries().then(items => {
            resolve(Object.keys(items).includes(keyword) ? items[keyword] : null);
        });
    })
}

const getParams = query => {
    if (!query) {
        return {};
    }

    return (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
            let [key, value] = param.split('=');
            params[key] = value ? decodeURIComponent(value.replace(/\+/g, ' ')) : '';
            return params;
        }, {});
};