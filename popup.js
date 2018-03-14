import {deleteEntry, getStoredItems} from "./keyword_access.js";

document.addEventListener('DOMContentLoaded', () => {
    populateStoredEntries("entries-table");
});

function populateStoredEntries(tableId) {

    getStoredItems((items) => {
        let table = document.getElementById(tableId);
        for (let key in items) {
            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerText = key;
            cell2.innerText = items[key]["url"];

            let button = document.createElement("button");
            button.type = "button";
            button.classList.add('btn');
            button.classList.add('btn-danger');
            button.classList.add('btn-xs');
            button.innerText = "X";
            button.onclick = () => {
                deleteEntry(key, () => {
                    //repopulate table
                })
            };
            cell3.appendChild(button);
        }
    });
}