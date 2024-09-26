document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalOverlay');
    const openModalBtn = document.getElementById('openModal');
    const closeModalBtn = document.getElementById('closeModal');


    // Export excel button function
document.getElementById('exportExcelBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior
    
    // Make a request to the backend endpoint
    fetch('/exports')
        .then(response => {
            if (response.ok) {
                return response.blob(); // Convert response to blob
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'vehicles.xlsx'; // Set filename
            document.body.appendChild(a);
            a.click(); // Trigger the download
            window.URL.revokeObjectURL(url); // Clean up
        })
        .catch(error => {
            console.error('Error downloading the file:', error);
        });
});



// Export pdf button function
document.getElementById('exportPdfBtn').addEventListener('click', function(event) {
    event.preventDefault(); // Prevent default anchor behavior

    // Make a request to the backend endpoint
    fetch('/pdf')
        .then(response => {
            if (response.ok) {
                return response.blob(); // Convert response to blob
            }
            throw new Error('Network response was not ok.');
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'vehicles.pdf'; // Set filename
            document.body.appendChild(a);
            a.click(); // Trigger the download
            window.URL.revokeObjectURL(url); // Clean up
        })
        .catch(error => {
            console.error('Error downloading the file:', error);
        });
});

    // Function to open the modal
    openModalBtn.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent link default behavior

        // Load the content into the modal
        fetch('views/register-modal.ejs')
            .then(response => response.text())
            .then(data => {
                const modalContent = modal.querySelector('.modal-content');
                modalContent.innerHTML = data; // Insert the loaded content into the modal

                // Attach close function to the close button after loading content
                const newCloseModalBtn = modalContent.querySelector('#closeModal');
                newCloseModalBtn.addEventListener('click', closeModal);

                modal.style.display = 'flex'; // Show the modal
            })
            .catch(error => console.error('Error loading modal content:', error));
    });

    // Function to close the modal popup
    function closeModal() {
        modal.style.display = 'none'; // Hide the modal
    }

    // Close modal when clicking outside of the modal content
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            closeModal(); // Hide the modal
        }
    });
});



// Importing excel to the database button function.
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




// FUNCTION FOR THE VIEW VEHICLE CHART BUTTON.
// Function to redirect to '/chart'
function redirectToChart() {
            // Get the current hostname and port
    const currentLocation = window.location.origin;
            // Redirect to /chart
            window.location.href = `${currentLocation}/chart`;
        }

        // Add click event listener to the button
document.getElementById('ChartBtn').addEventListener('click', redirectToChart);