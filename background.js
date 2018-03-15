import {showModal, addEntry, sendMessage, entries} from "./keyword_access.js";

const menuItemId = "keyword_access_menu_item";

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

//chrome.webRequest.onBeforeRequest.addListener(
//    (details) => {
//        console.log(details);
//        return true;
//    }, {urls: ["*://*/*"]});
