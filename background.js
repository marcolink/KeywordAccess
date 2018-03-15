import {showModal, addEntry} from "./keyword_access.js";

const menuItemId = "keyword_access_menu_item";

chrome.contextMenus.create({
    title: "Add keyword access",
    id: menuItemId,
    contexts: ["editable"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    console.log("1");

    if (info.menuItemId === menuItemId) {
        console.log("2");
        addKeywordAccessItem(tab)
    }
});

function addKeywordAccessItem(tab) {
    chrome.tabs.sendMessage(tab.id, "getClickedElement", (clickedElement) => {
        showModal(tab, (response) => {
            console.log("send it");
            console.table(response);
            addEntry(tab.url, clickedElement.value, response.value)
        });
    });
}

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        console.log(details);
        return true;
    }, {urls: ["*://*/*"]});
