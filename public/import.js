function readExcelFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const workbook = XLSX.read(event.target.result, { type: 'binary' });
                const sheetName = workbook.SheetNames[0]; // Get the first sheet
                const worksheet = workbook.Sheets[sheetName];

                const jsonData = XLSX.utils.sheet_to_json(worksheet);
                resolve(jsonData);
            } catch (error) {
                reject('Failed to read Excel file: ' + error);
            }
        };
        reader.onerror = (error) => {
            reject('Error reading file: ' + error);
        };
        reader.readAsBinaryString(file);
    });
}

document.getElementById('fileInput').addEventListener('change', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select an Excel file.');
        return;
    }

    try {
        const data = await readExcelFile(file);
        console.log("This is the json data", data[0]);

        let i = 0;

        for (const EachData of data) {
            i++;
            try {
                const response = await fetch('/importExcel', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(EachData),
                });

                if (i === data.length) { // Check if this is the last item
                    if (response.ok) {
                        const responseData = await response.json();
                        if (responseData.redirect) {
                            window.location.href = responseData.redirect; // Redirect to the new URL
                        } else {
                            window.location.href = "/";
                        }
                    } else {
                        console.error('Error in response:', response.status);
                        alert('Error processing data. Please check the console for details.');
                    }
                }
            } catch (err) {
                console.error('Error in fetch request:', err);
            }
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
