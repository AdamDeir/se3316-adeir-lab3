document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    searchButton.onclick = function() {
        searchSuperheroes();
        
    };
});
document.addEventListener('DOMContentLoaded', function () {
    const clearButton = document.getElementById('clearSearch');
    clearButton.onclick = function() {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
        
    };
});

document.addEventListener('DOMContentLoaded', function () {
    const publisherButton = document.getElementById('displayPublishers');
    publisherButton.onclick = function() {
        showPublisher();
    };
});

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






function searchSuperheroes() {
    const searchField = document.getElementById('searchField').value;
    const searchType = document.getElementById('searchType').value;
    const searchNumValue = document.getElementById('nSearch').value;
    const searchNum = getNumericValueOrUndefined(searchNumValue);
    console.log(searchNum);

    if(searchType === 'id'){
       searchId(searchField);
    }else{
         // Assuming '/api/superhero-search'
    const urlSearch = new URL('/api/superhero-search', window.location.origin);

    if(searchNum ===0){
        const params = { field: searchType, pattern: searchField};
        urlSearch.search = new URLSearchParams(params).toString();
        
        }else{
          const params = { field: searchType, pattern: searchField, n: searchNum };
          console.log(searchType,searchField, searchNum);
          urlSearch.search = new URLSearchParams(params).toString();  
        }
    
    fetch(urlSearch) 
    .then(response => response.json())
    .then(heros => displayHeros(heros))
    .catch(error => console.error('Error:', error)); 
    }
}

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
    resultsContainer.innerHTML = ''; // Clear previous results
    const list = document.createElement('ul');
    currentDisplayedHeros = heros;
    
    for(let key in heros){
        const listItem = document.createElement('li');
        if(heros.hasOwnProperty(key)){
            console.log(key + " - " + heros[key]);
            listItem.textContent = key + " - " + heros[key];
            list.appendChild(listItem);
            
        }
    }
    resultsContainer.appendChild(list);

}

function displayHeros(heros){
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

    resultsContainer.appendChild(cardsContainer);
}



function displayPublishers(publishers) {
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    
    if (publishers.length === 0) {
        resultsContainer.innerText = 'No publishers found.';
        return;
    }

    // Create a list to display the results
    const list = document.createElement('ul');
    publishers.forEach(publisher => {
        const listItem = document.createElement('li');
        listItem.textContent = publisher || 'Not specified'; // Display 'Not specified' if the publisher is an empty string
        list.appendChild(listItem);
    });

    resultsContainer.appendChild(list);
}



//List functionality

function getSavedLists(){

    const urlSearchLists = new URL('/api/lists', window.location.origin);
    fetch(urlSearchLists) 
    .then(response => response.json())
    .then(data => {
        console.log(data);
        // Assuming 'data' is an object where keys are list names
        const listsContainer = document.getElementById('list-display');
        listsContainer.innerHTML = ''; // Clear existing content

        // Iterate over each list
        data.forEach(listName => {
            const listItem = document.createElement('div');
            listItem.textContent = listName;
            // Optionally, you can add buttons or links for other actions (delete, view, etc.)
            listsContainer.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error:', error)); 
}



function createList() {
    const listName = document.getElementById('listNameInput').value; // Get the list name from the input field
    const idsToAdd = document.getElementById('listIdInput').value;

    // Only split the idsToAdd and map to integers if it's not an empty string
    const idsArray = idsToAdd ? idsToAdd.split(',').map(id => parseInt(id.trim(), 10)) : [];

    // Check if the listName is not empty
    if (!listName.trim()) {
        alert('Please enter a list name.');
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
        body: JSON.stringify({ superheroIds: idsArray }) // Send superhero IDs as part of the request body
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



function searchList() {
    const listName = document.getElementById('searchListInput').value;
    const displayIdsChecked = document.getElementById('displayIds').checked;
    const displayInfoChecked = document.getElementById('displayInfo').checked;
    const displayPowersChecked = document.getElementById('displayPowers').checked;
  
    if (!listName) {
      alert('Please enter a list name to search.');
      return;
    }
  
    // Clear previous results
    const resultsContainer = document.getElementById('list-display');
    resultsContainer.innerHTML = '';
  
    // Define the base URL for the API
    const baseURL = `http://localhost:3000/api/lists/${listName}`;
  
    // Fetch IDs if checkbox is checked
    if (displayIdsChecked) {
      fetch(`${baseURL}/ids`)
        .then(response => response.json())
        .then(ids => {
          const idsElement = document.createElement('div');
          idsElement.textContent = `IDs: ${ids.join(', ')}`;
          resultsContainer.appendChild(idsElement);
        });
    }
  
    // Fetch info if checkbox is checked
    if (displayInfoChecked) {
      fetch(`${baseURL}/info`)
        .then(response => response.json())
        .then(info => {
          const infoElement = document.createElement('div');
          infoElement.textContent = 'Info: ' + JSON.stringify(info, null, 2);
          resultsContainer.appendChild(infoElement);
        });
    }
  
    // Fetch powers if checkbox is checked
    if (displayPowersChecked) {
      fetch(`${baseURL}/powers`)
        .then(response => response.json())
        .then(powers => {
          const powersElement = document.createElement('div');
          powersElement.textContent = 'Powers: ' + JSON.stringify(powers, null, 2);
          resultsContainer.appendChild(powersElement);
        });
    }
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



