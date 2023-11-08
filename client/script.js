// Event listener for DOMContentLoaded ensures that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    // Event listener for the search button click
        searchButton.onclick = function() {
        searchSuperheroes(); // Function to initiate superhero search
    };
});
// Event listener for DOMContentLoaded ensures that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const clearButton = document.getElementById('clearSearch');
    clearButton.onclick = function() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
        
    };
});
// Event listener for DOMContentLoaded ensures that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const publisherButton = document.getElementById('displayPublishers');
    publisherButton.onclick = function() {
        showPublisher();
    };
});
// Event listener for DOMContentLoaded ensures that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const infoCheckbox = document.getElementById('supInfoBox');
    const powersCheckbox = document.getElementById('supPowerBox');
    infoCheckbox.addEventListener('change', function() {
        if (this.checked) {
            powersCheckbox.checked = false;
            
        }
    });
    powersCheckbox.addEventListener('change', function() {
        if (this.checked) {
            infoCheckbox.checked = false;
        }
    });
});

let currentDisplayedHeros ="";

// Event listener for DOMContentLoaded ensures that the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    const searchType = document.getElementById('searchType');
    const checkBoxes = document.getElementById('checkboxSection');
  
    searchType.addEventListener('change', function() {
      const selectedValue = this.value;
    
      if(selectedValue === 'id'){
        checkBoxes.style.display = "block";
     }else{
        checkBoxes.style.display = "none";
     }
    });
  });






function showPublisher(){
    const urlPublisher = new URL('/api/superhero-publishers', window.location.origin);
    fetch(urlPublisher) 
    .then(response => response.json())
    .then(publishers => displayPublishers(publishers))
    .catch(error => console.error('Error:', error));
}






// Function that searches for superheroes based on user input
function searchSuperheroes() {
    // Sanitize the search field input to prevent XSS
    let searchField = sanitizeString(document.getElementById('searchField').value);
    console.log(searchField);
    const searchType = document.getElementById('searchType').value;
    console.log(searchType);
    const searchNumValue = document.getElementById('nSearch').value;
    // Ensure the search number is a valid number or undefined
    const searchNum = getNumericValueOrUndefined(searchNumValue);
    console.log(searchNum);

    if (searchType === 'id') {
        // If the search type is 'id', sanitize the input and search by ID
        searchField = encodeURIComponent(searchField);
        searchId(searchField);
    } else {
        // For other search types, construct the URL with sanitized and encoded parameters
        const urlSearch = new URL('/api/superhero-search', window.location.origin);
        if(searchNum ===0){
        const params = { field: searchType, pattern: searchField};
        urlSearch.search = new URLSearchParams(params).toString();
        
        fetch(urlSearch) 
        .then(response => response.json())
        .then(heros => displayHeros(heros))
        .catch(error => console.error('Error:', error));
        }else{
        const params = { field: searchType, pattern: searchField, n: searchNum };
        urlSearch.search = new URLSearchParams(params).toString();
        
        fetch(urlSearch) 
        .then(response => response.json())
        .then(heros => displayHeros(heros))
        .catch(error => console.error('Error:', error)); 
    }
}
}
//function that checks to make sure the user input was a number, if it was not then the value is set to undefined
function getNumericValueOrUndefined(value) {
    const number = Number(value);
    return isNaN(number) ? undefined : number;
  }

function searchId(id){
    const infoCheckbox = document.getElementById('supInfoBox');
    const powersCheckbox = document.getElementById('supPowerBox');
    if(infoCheckbox.checked){
       const urlID = new URL(`/api/superhero-info/${id}`, window.location.origin);
        fetch(urlID) 
        .then(response => response.json())
        .then(heros => displayHerosId(heros))
        .catch(error => console.error('Error:', error)); 
    }else if(powersCheckbox.checked){
        const urlID = new URL(`/api/superhero-powers/${id}`, window.location.origin);
        fetch(urlID) 
        .then(response => response.json())
        .then(heros => displayHerosId(heros))
        .catch(error => console.error('Error:', error)); 
    }    

}
function displayHerosId(heros){
    
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results -- ok to use this as it is not user generated content
    const list = document.createElement('ul');
    currentDisplayedHeros = heros;
    
    for(let key in heros){
        const listItem = document.createElement('li');
        if(heros.hasOwnProperty(key)){
            listItem.textContent = key + " - " + heros[key];
            list.appendChild(listItem);
            
        }
    }
    resultsContainer.appendChild(list);

}

function displayHeros(heros){
    console.log(heros);
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    currentDisplayedHeros = heros;
    if (heros.length === 0) {
        resultsContainer.innerText = 'No Heros found.';
        return;
    } 

    // Create a container for all hero cards
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
        
    heros.forEach(function(hero) {
        // Create a card for each hero
        const card = document.createElement('div');
        card.className = 'card';
        //loop through the attributes for each hero
        for(let key in hero){
            if(hero.hasOwnProperty(key)){
                // Create a paragraph for each attribute
                const para = document.createElement('p');
                para.innerHTML = `<strong>${key}:</strong> ${hero[key]}`;
                card.appendChild(para);
            }
        }

        // Append the card to the container
        cardsContainer.appendChild(card);
    });
    //append all the cards to the results
    resultsContainer.appendChild(cardsContainer);
}


//function responsible for displaying the publishers
function displayPublishers(publishers) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    //if no publsihers are found
    if (publishers.length === 0) {
        resultsContainer.innerText = 'No publishers found.';
        return;
    }

    // Create a list to display the results
    const list = document.createElement('ul');
    //go through the publishers and display each of the publishers
    publishers.forEach(publisher => {
        const listItem = document.createElement('li');
        listItem.textContent = publisher || 'Not specified'; // Display 'Not specified' if the publisher is an empty string
        list.appendChild(listItem);
    });
//append the results
    resultsContainer.appendChild(list);
}



//List functionality
//function to get all the saved lists from the server
function getSavedLists(){
//route to get the saved lists
    const urlSearchLists = new URL('/api/lists', window.location.origin);
    fetch(urlSearchLists) 
    .then(response => response.json())
    .then(data => {
        const listsContainer = document.getElementById('list-display');
        listsContainer.innerHTML = ''; // Clear existing content

        // Iterate over each list and dispay the name of the list
        data.forEach(listName => {
            const listItem = document.createElement('div');
            listItem.textContent = listName;
            listsContainer.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error)); 
}


// Function to sanitize input to protect against XSS
function sanitizeString(str) {
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
}

// Function to validate that the ID is a proper number
function validateAndParseIds(idsString) {
    // Split the string by commas and filter out any non-numeric values
    return idsString.split(',')
        .map(id => id.trim()) // Remove whitespace
        .filter(id => id !== '' && !isNaN(id)) // Keep only valid numbers
        .map(Number); // Convert to numbers
}

// Function that creates a new list
function createList() {
    let listName = document.getElementById('listNameInput').value; // Get the list name from the input field
    let idsToAdd = document.getElementById('listIdInput').value;

    // Sanitize inputs
    listName = sanitizeString(listName);
    const idsArray = validateAndParseIds(idsToAdd);

    // Check if the listName is not empty after sanitization
    if (!listName.trim()) {
        alert('Please enter a valid list name.');
        return;
    }

    // Define the endpoint for the API
    const apiEndpoint = 'http://localhost:3000/api/lists/' + encodeURIComponent(listName);

    // Determine the method based on whether we have IDs to add
    const method = idsArray.length > 0 ? 'PUT' : 'POST';

    // Make the HTTP request to the server
    fetch(apiEndpoint, {
        method: method, // Use PUT if updating with IDs, POST if creating a new list
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ superheroIds: idsArray }) // Send sanitized superhero IDs as part of the request body
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text(); 
    })
    .then(data => {
        console.log('List created or updated:', data);
        // Clear the input fields or update the UI as needed
        document.getElementById('listNameInput').value = '';
        document.getElementById('listIdInput').value = '';
        getSavedLists(); 
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}



//function to search for a list
function searchList() {
    const listName = document.getElementById('searchListInput').value;
    listName = sanitizeString(listName);//sanitize user input
  const resultsContainer = document.getElementById('list-display');
  resultsContainer.innerHTML = ''; // Clear previous results
  const baseURL = `http://localhost:3000/api/lists/${listName}`;

  // Check if checkboxes are checked and fetch data
  const displayIdsChecked = document.getElementById('displayIds').checked;
  const displayInfoChecked = document.getElementById('displayInfo').checked;
  const displayPowersChecked = document.getElementById('displayPowers').checked;

  //based on what check box is selected we search accordingly
  if (displayIdsChecked) {
    fetch(`${baseURL}/ids`)
      .then(response => response.json())
      .then(ids => displayIds(ids))
      .catch(error => console.error('Error fetching IDs:', error));
  }
  
  if (displayInfoChecked) {
    fetch(`${baseURL}/info`)
      .then(response => response.json())
      .then(info => displayListInfo(info))
      .catch(error => console.error('Error fetching info:', error));
  }

  if (displayPowersChecked) {
    fetch(`${baseURL}/powers`)
      .then(response => response.json())
      .then(powers => displayPowers(powers))
      .catch(error => console.error('Error fetching powers:', error));
  }
  
  }


  // Function to display hero information in a card format
  function displayIds(ids) {
    const idsElement = document.createElement('div');
    idsElement.className = 'card';
    idsElement.innerHTML = `<h3>ID List:</h3><p>${ids.join(', ')}</p>`;
    document.getElementById('list-display').appendChild(idsElement);
  }
  //fucntion to display list info
  function displayListInfo(info) {
    const cardsContainer = document.createElement('div');
    cardsContainer.className = 'cards-container';
    info.forEach(hero => {
      const card = createHeroCard(hero);
      cardsContainer.appendChild(card);
    });
    document.getElementById('list-display').appendChild(cardsContainer);
  }
  //function to display powers
  function displayPowers(powersArray) {
    // Assuming powersArray is an array of objects where each object contains the powers of a hero
    const powersElement = document.createElement('div');
    powersElement.className = 'card';
    
    // Generate a list item for each power in each hero's powers object
    let powersListHTML = '';
    powersArray.forEach(powers => {
      for (let [power, value] of Object.entries(powers)) {
        if (value === 'True') {
          powersListHTML += `<li>${power}</li>`;
        }
      }
    });
  
    powersElement.innerHTML = `<h3>Superhero Powers:</h3><ul>${powersListHTML}</ul>`;
    document.getElementById('list-display').appendChild(powersElement);
  }
  //create a hero card for formating with css
  function createHeroCard(hero) {
    const card = document.createElement('div');
    card.className = 'card';
    let cardContent = `<h3>${hero.name}</h3>`;
    Object.keys(hero).forEach(key => {
      if (key !== 'id' && key !== 'name') { // Skipping 'id' and 'name' since 'name' is already shown
        cardContent += `<p><strong>${formatKey(key)}:</strong> ${hero[key]}</p>`;
      }
    });
    card.innerHTML = cardContent;
    return card;
  }
  
  function formatKey(key) {
    // Convert camelCase to Regular Case and capitalize the first letter
    const formatted = key.replace(/([A-Z])/g, ' $1').replace(/^./, function(str){ return str.toUpperCase(); })
    return formatted;
  }
  

//function for deleting a list

function deleteList() {

    const listName = document.getElementById('deleteListInput').value;
    // Define the endpoint for deleting a specific list
    const apiEndpoint = `http://localhost:3000/api/lists/${listName}`;

    // Make the DELETE request to the server
    fetch(apiEndpoint, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); 
    })
    .then(data => {
        console.log('List deleted:', data);
        document.getElementById('deleteListInput').value = '';
        getSavedLists();
    })
    .catch((error) => {
        console.error('Failed to delete the list:', error);
    });
}

//sort functionality

// Event listener for the sort button
document.getElementById('applySort').addEventListener('click', function() {
    // Clear previous results
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = '';

    // Determine which property to sort by based on the checked checkbox
    let propertyToSortBy = null;
    if (document.getElementById('sortByName').checked) propertyToSortBy = 'name';
    if (document.getElementById('sortByRace').checked) propertyToSortBy = 'Race'; // Case-sensitive
    if (document.getElementById('sortByPublisher').checked) propertyToSortBy = 'Publisher'; // Case-sensitive
    

    if (propertyToSortBy) {
        displaySortedHeros(propertyToSortBy);
    }
});

function displaySortedHeros(property) {
    // Sort heroes by the specified property
    const sortedHeros = [...currentDisplayedHeros].sort((a, b) => {
        // Use toString to handle non-string properties
        return a[property].toString().localeCompare(b[property].toString(), undefined, { numeric: true, sensitivity: 'base' });
    });

    // Create a container for the sorted property display
    const propertyContainer = document.createElement('div');
    propertyContainer.className = 'property-container';

    // Add sorted heroes to the container
    sortedHeros.forEach(hero => {
        const para = document.createElement('p');
        para.className = 'hero-property';
        // Display the property value with a label, making sure to check for undefined values
        para.innerHTML = `<strong>${property.charAt(0).toUpperCase() + property.slice(1)}:</strong> ${hero[property] || 'N/A'}`;
        propertyContainer.appendChild(para);
    });

    // Append the sorted results to the results container
    document.getElementById('searchResults').appendChild(propertyContainer);
}



