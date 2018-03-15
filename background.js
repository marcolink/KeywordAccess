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
    console.debug("####################################################")
    console.log("1 request clicked element");

    sendMessage(tab.id, "getInputSelector", null)
        .then(response => showModal(tab))
        .then(response => addEntry(tab.url, "tbd", response.value)) // response should be added as 2. param
        .then(() => entries())
        .then((data) => console.table(data))
        .catch(error => console.error(error));
}

//chrome.webRequest.onBeforeRequest.addListener(
//    (details) => {
//        console.log(details);
//        return true;
//    }, {urls: ["*://*/*"]});
