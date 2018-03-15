import {removeEntry, entries, clearEntries} from "./keyword_access.js";

document.addEventListener('DOMContentLoaded', () => {
    populateStoredEntries("entries-table");

    document.getElementById("button-clear").onclick =
        () => clearEntries()
            .then(() => populateStoredEntries("entries-table"))
            .catch(error => console.error(error));

    document.getElementById("button-debug").onclick =
        () => entries()
            .then(entries => console.table(entries))
            .catch(error => console.error(error));
});

let tableEntries = [];

function populateStoredEntries(tableId) {

    tableEntries.forEach((entryRow) => entryRow.remove());
    tableEntries = [];

    entries().then((items) => {

        let table = document.getElementById(tableId);

        for (let key in items) {

            let row = table.insertRow(-1);
            let cell1 = row.insertCell(0);
            let cell2 = row.insertCell(1);
            let cell3 = row.insertCell(2);
            cell1.innerText = key;
            cell2.innerText = items[key]["url"] || "no url set";

            let button = document.createElement("button");
            button.type = "button";
            button.classList.add('btn');
            button.classList.add('btn-danger');
            button.classList.add('btn-xs');
            button.innerText = "X";

            button.onclick = () => {
                removeEntry(key).then(() => populateStoredEntries(tableId)).catch(error => console.error(error));
            };

            tableEntries.push(row);
            cell3.appendChild(button);
        }
    }).catch(error => console.error(error))
}