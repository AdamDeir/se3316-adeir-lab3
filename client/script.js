document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    searchButton.onclick = function() {
        searchSuperheroes();
        
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
        console.log("yoyoyoy");
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
const urlID = new URL(`/api/superhero-info/${id}`, window.location.origin);
fetch(urlID) // Replace with your actual endpoint
.then(response => response.json())
.then(heros => displayHerosId(heros))
.catch(error => console.error('Error:', error));
}
function displayHerosId(heros){
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results
    const list = document.createElement('ul');

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
    console.log(heros);
    console.log("yo yo y yo y oy");
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (heros.length === 0) {
        resultsContainer.innerText = 'No Heros found.';
        return;
    } 
     
    // Create a list to display the results
    const list = document.createElement('ul');
        
    heros.forEach(function(heros) {

        for(let key in heros){
            const listItem = document.createElement('li');
            if(heros.hasOwnProperty(key)){
                console.log(key + " - " + heros[key]);
                listItem.textContent = key + " - " + heros[key];
                list.appendChild(listItem);
                
            }
        }
        
    });   
    resultsContainer.appendChild(list);

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

    // Don't send an empty name
    if (!listName) {
        alert('Please enter a list name.');
        return;
    }

    // Define the endpoint where the list will be added
    const apiEndpoint = 'http://localhost:3000/api/lists/';

    // Make the HTTP POST request to the server
    fetch(apiEndpoint + encodeURIComponent(listName), {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        //body: JSON.stringify({}) // If you need to send additional data, add it here
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.text();
    })
    .then(data => {
        console.log('List added:', data);
        // Here you can clear the input field or update the UI to reflect the new list
        document.getElementById('listNameInput').value = '';
        // Optionally, refresh the list of lists displayed in the UI
    })
    .catch((error) => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}


function searchList() {
    const listName = document.getElementById('searchListInput').value;

    // Make a GET request to your server to retrieve the list info
}

function deleteList() {
    const listName = document.getElementById('deleteListInput').value;

    // Make a DELETE request to your server to delete the list
}



