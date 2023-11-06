document.addEventListener('DOMContentLoaded', function () {
    const searchButton = document.getElementById('searchButton');
    searchButton.onclick = function() {
        searchSuperheroes();
        //console.log("yp yp yp");
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

