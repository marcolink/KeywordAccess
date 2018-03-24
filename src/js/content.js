const OptimalSelect = require("optimal-select");
const dialogId = "keyword_access_dialog";
let clickedElement = null;

window.addEventListener("mousedown", function (event) {
    if (event.button === 2) {
        let selector = OptimalSelect.select(event.target);
        clickedElement = selector;
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {

    let asynchronously = false;

    if (typeof request === 'object' && request.action) {
        switch (request.action) {

            case "showDialog":
                showDialog(request.url, (keyword) => {
                    sendResponse({value: keyword})
                });
                asynchronously = true;
                break;

            case "getInputSelector":
                sendResponse({value: clickedElement});
                break;

            case "performSearch":
                let node = document.querySelector(request.id);
                if (node) {
                    node.innerText = request.value;
                    node.value = request.value;
                    node.form.submit();
                }
                sendResponse({value: node !== undefined});
                break;

            default:
                console.assert(false, `unknown action ${request.action}`)
        }
    }

    return asynchronously;
});

function addElement(parent, type) {
    let element = document.createElement(type);
    parent.appendChild(element);
    return element;
}

function createDialog(content) {
    let dialog = document.createElement("dialog");
    dialog.appendChild(content);
    document.getElementsByTagName("body")[0].appendChild(dialog);

    dialog.id = dialogId;
    dialog.style.top = "10px";
    dialog.style.padding = "15px";

    return dialog;
}

function getKeywordForm(url, dialogId, callback) {
    let container = document.createElement("div");

    let headline = addElement(container, "h4");
    headline.innerText = "Set keyword";

    let text = addElement(container, "p");
    text.innerText = url;

    let form = addElement(container, "form");
    form.method = "dialog";

    let input = addElement(form, "input");
    input.type = "text";
    input.name = "keyword";
    input.style.marginRight = "10px";

    let button = addElement(form, "button");
    button.type = "submit";
    button.innerText = "save";
    form.appendChild(button);

    form.onsubmit = () => {
        callback(input.value.trim());
        document.getElementById(dialogId).close();
    };

    return container;
}

function showDialog(url, callback) {
    let dialog = document.getElementById(dialogId) ||
        createDialog(getKeywordForm(url, dialogId, (keyword) => {
            callback(keyword)
        }));
    dialog.getElementsByTagName("form").item(0).reset();
    dialog.open = false;
    /* kinda hacky, but needed */
    dialog.showModal();
}


