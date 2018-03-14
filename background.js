import {showModal, storeEntry} from "./keyword_access.js";

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
    chrome.tabs.sendMessage(tab.id, "getClickedElement", (clickedElement) => {
        showModal(tab, (response) => storeEntry(tab.url, clickedElement.value, response.value));
    });
}

