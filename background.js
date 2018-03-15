import {showModal, addEntry, sendMessage} from "./keyword_access.js";

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
    console.debug("####################################################")
    console.log("1 request clicked element");
    sendMessage(tab.id, "getInputSelector", null, (response) => {
        console.log("2 request model");
        showModal(tab, (keyword) => {
            console.log("3 store");
            addEntry(tab.url, response.value, keyword)
        });
    });
}

//chrome.webRequest.onBeforeRequest.addListener(
//    (details) => {
//        console.log(details);
//        return true;
//    }, {urls: ["*://*/*"]});
