document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('modalOverlay');
    const closeModalBtn = document.getElementById('closeModal');

    // Close modal when clicking the close button
    closeModalBtn.addEventListener('click', closeModal);

    // Get all the update buttons by their class (assuming it's .update-btn)
    const updateButtons = document.querySelectorAll('.update-btn');

    // Loop through each update button and add a click event listener
    updateButtons.forEach(button => {
        button.addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default behavior
            
            // Get the vehicle ID from the button's dataset
            const vehicleId = button.dataset.doc;
            console.log("The vehicleId is", vehicleId);

            // Load the content into the modal by fetching vehicle data
            fetch(`/${vehicleId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json(); // Parse JSON response
                })
                .then(values => {
                    console.log("I need this data", values);
                    
                    // Show the modal
                    fetch('views/update-modal.ejs')
                    .then(response => response.text())
                    .then(data => {
                        
                        const modalContent = modal.querySelector('.modal-content');
                        modalContent.innerHTML = data; // Insert the loaded content into the modal

                     
                            modalContent.querySelector('#owner-name').value = values.message.ownerName;
                            modalContent.querySelector('#vehicle-type').value = values.message.vehicleType;
                            modalContent.querySelector('#vehicle-brand').value = values.message.vehicleBrand;
                            modalContent.querySelector('#vehicle-model').value = values.message.vehicleModel;
                            modalContent.querySelector('#registration-number').value = values.message.registrationNumber;
                            modalContent.querySelector('#manufacture-year').value = values.message.manufactureYear;
                            modalContent.querySelector('#color').value = values.message.color;
                        
                       
        

//  When the update buton on the pop-up is clicked.

 const form = document.getElementById('update-form');
 const updateButton = document.getElementById('updateBtn');

 // Add an event listener for the button click
 updateButton.addEventListener('click', async function (event) {
     event.preventDefault(); // Prevent the default form submission
    


// Collect form data manually
const formData = {
    ownerName: form.ownerName.value, // accessing input field by 'name'
    vehicleType: form.vehicleType.value,
    vehicleBrand: form.vehicleBrand.value,
    vehicleModel: form.vehicleModel.value,
    registrationNumber: form.registrationNumber.value,
    manufactureYear: form.manufactureYear.value,
    color: form.color.value,
    id :  values.message._id
};

console.log("This is the formData now", formData);

// Function to send a PUT request
const updateVehicle = async () => {
    try {
        // Send a PUT request using Fetch API
        const response = await fetch('/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Added header for JSON content
            },
            body: JSON.stringify(formData),
        });

        // Check if the response is okay
        if (response.ok) {
            // Parse the response as JSON
            const result = await response.json();

            console.log('Vehicle updated successfully:', result);

            // Redirect if response has a redirect field
            if (result.redirect) {
                window.location.href = result.redirect;
            }

        } else {
            console.error('Error updating vehicle:', response.statusText);
        }
    } catch (error) {
        console.error('Request failed:', error);
    }
};

// Call the function to update the vehicle
updateVehicle();







 })

                        // Attach close function to the close button after loading content
                        const newCloseModalBtn = modalContent.querySelector('#closeModal');
                        newCloseModalBtn.addEventListener('click', closeModal);
                    modal.style.display = 'flex'; 
                    })
                })
                .catch(error => console.error('Error loading vehicle data:', error));
        });
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
    
    // DELETE FUNCTION
    const deleteButtons = document.querySelectorAll('.delete-btn');

    deleteButtons.forEach(button => {
        button.addEventListener('click', function() { 
            const confirmDelete = confirm('Are you sure you want to delete this vehicle?');
            
            // If confirmed, send a delete request to the server
            if (confirmDelete) {
                const vehicleId = button.dataset.doc;

                fetch(`/delete/${vehicleId}`, {
                    method: 'DELETE'
                })
                .then(response => response.json())
                .then((result) => {
                    window.location.href = result.redirect; // Redirect on successful delete
                })
                .catch((err) => console.error('Error:', err));
            }
        });
    });
    
});



//  // Select the form and button elements
//  const form = document.getElementById('updateForm');
//  const updateButton = document.getElementById('updateBtn');

//  // Add an event listener for the button click
//  updateButton.addEventListener('click', async function (event) {
//      event.preventDefault(); // Prevent the default form submission

//      // Collect form data
//      const formData = new FormData(form);

//      // Send a PUT request using Fetch API
//      try {
//          const response = await fetch('/', {
//              method: 'PUT',
//              body: formData,
//          });

//          if (response.ok) {
//              console.log('Vehicle updated successfully');
//          } else {
//              console.error('Error updating vehicle');
//          }
//      } catch (error) {
//          console.error('Request failed', error);
//      }
//  });