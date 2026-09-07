(function () {
    "use strict";

    // URL to fetch the 'entry' sheet as a readable CSV
    const sheetUrl = "https://docs.google.com/spreadsheets/d/1Z3rwBk_O-fphLrh5QoHuhnM4mbj7BASbdYD9jIKwO10/gviz/tq?tqx=out:csv&sheet=entry";

    function injectRow(appNo, groomName, brideName) {
        const tableBody = document.querySelector("#marriageRegistrationDetailsList tbody");

        if (tableBody) {
            // Prevent duplicate insertion if the script runs multiple times
            if (document.querySelector(`input[name="recieptNo"][value="${appNo}"]`)) {
                return;
            }

            const newRow = document.createElement("tr");
            
            // Keep the background standard (white/gray based on CSS)
            newRow.className = "odd";

            newRow.innerHTML = `
                <td class="displayColumn">${appNo}</td>
                <td class="displayColumn">${groomName}</td>
                <td class="displayColumn">${brideName}</td>
                <td class="displayColumn">
                    <input type="radio" name="recieptNo" value="${appNo}" onchange="this.form.submit()"/>
                </td>
            `;

            // Insert above all other rows at the top of the list
            tableBody.insertBefore(newRow, tableBody.firstChild);
        }
    }

    // Fetch the entry data directly from the Google Sheet
    fetch(sheetUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.text();
        })
        .then(csvData => {
            const rows = csvData.split("\n");
            
            // Make sure we have at least one row of data beneath the header
            if (rows.length > 1 && rows[1].trim() !== "") {
                const data = rows[1].replace(/"/g, "").split(",");

                const appNo = data[0] ? data[0].trim() : null;
                const groomName = data[1] ? data[1].trim() : "-";
                const brideName = data[2] ? data[2].trim() : "-";

                // If an application number exists, inject it
                if (appNo) {
                    injectRow(appNo, groomName, brideName);
                }
            }
        })
        .catch(error => {
            console.error("Failed to load entry sheet data:", error);
        });
})();
