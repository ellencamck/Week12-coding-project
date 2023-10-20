var existingData = []; // Declare existingData in a higher scope

document.addEventListener("DOMContentLoaded", function() {
    // Fetch the initial data from the API
    $.ajax({
        url: 'https://65307f8a6c756603295eb0f7.mockapi.io/api/week12/dogs',
        method: 'GET',
        success: function(data) {
            // Check the response in the console to verify the data structure
            console.log('API Response Data:', data);

            // Store the initial data in the existingData array
            existingData = data;

            // Process the data and display it
            displayDogs(existingData);
        },
        error: function(xhr, status, error) {
            // Handle errors
            console.error('Error:', error);
        }
    });
});


function displayDogs(data) {
    var dogApp = $('#dog-app')
    if (Array.isArray(data) && data.length > 0) {
        // Loop through the data and append each dog
        $.each(data, function(index, dog) {
             dogApp.append(
                '<div class="card" style="width: 18rem;">' +
                '<div class="card-body">' +
                '<h5 class="card-title">' + dog.breed + '</h5>' +
                '<p class="card-text">Shed Level: ' + dog.shedLevel + '</p>' +
                '<button class="btn btn-danger delete-dog" data-id="' + dog.id + '">Delete</button>' +
                '</div></div>'
            );
        });
    }
}

$('#add-dog-button').on('click', function() {
    
    // Get the values of the new dog from the input fields
    var breed = $('#dog-breed-input').val();
    var shedLevel = $('#shed-level-input').val();

    // Post the new dog to the API
    $.ajax({
        url: 'https://65307f8a6c756603295eb0f7.mockapi.io/api/week12/dogs',
        method: 'POST',
        data: {
            breed: breed,
            shedLevel: shedLevel,
        },
        success: function(response) {
            // Assuming 'existingData' is your existing data array
            // Append the new dog to the existing data
            existingData.push(response);

            // Clear the input fields
            $('#dog-breed-input').val('');
            $('#shed-level-input').val('');

            // Display the updated data
            displayDogs(existingData);
        },
        error: function(xhr, status, error) {
            // Handle errors here
            console.error(error);
        }
    });
});

// Delete a dog
$(document).on('click', '.delete-dog', function() {
    var dogId = $(this).data('id').toString(); // Convert dogId to the same data type as your object ID (e.g., string)

    // Confirm with the user before deleting
    if (confirm('Are you sure you want to delete this dog?')) {
        // Find the index of the object to be deleted
        var indexToDelete = existingData.findIndex(function(dog) {
            return dog.id.toString() === dogId; // Match the object ID with dogId
        });

        if (indexToDelete !== -1) {
            // Remove the object from the existingData array using splice
            existingData.splice(indexToDelete, 1);

            // Perform the DELETE request to the API to delete the dog
            $.ajax({
                url: 'https://65307f8a6c756603295eb0f7.mockapi.io/api/week12/dogs/' + dogId,
                method: 'DELETE',
                cache: false, // Disable caching
                success: function(response) {
                    // Handle success (if needed)
                    // After successful delete, refresh the data
                    location.reload();
                },
                error: function(xhr, status, error) {
                    // Handle errors (if needed)
                    console.error('DELETE request error', error);
                }
            });
        }

        // Update the display immediately
        displayDogs(existingData);
    }
});

