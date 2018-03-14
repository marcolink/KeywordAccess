const dialogId = "keyword_access_dialog";
let clickedElement = null;

window.addEventListener("mousedown", function (event) {
    if (event.button === 2) {
        clickedElement = event.target;
    }
}, true);

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request === "getClickedElement") {
        //if (clickedElement === null) {
        //  alert("sorry, we couldn't detect what input you want to use. make sure you first focus the right input field.")
        //} else {
        sendResponse({value: "lst-ib"});
        /*clickedElement.id*/
        //}
    }
    else if (typeof request === 'object' && request.action === "showDialog") {
        showDialog(request.url, (keyword) => sendResponse({value: keyword}));
    }

    return true; /* this marks an asynchronous listener */
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
        callback(input.value);
        document.getElementById(dialogId).close();
    };

    return container;
}

function showDialog(url, callback) {
    let dialog = document.getElementById(dialogId) ||
        createDialog(getKeywordForm(url, dialogId, (keyword) => callback(keyword)));
    dialog.open = false; /* kinda hacky, but needed */
    dialog.showModal();
}


