const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.static('../client'));
const superHeroInfo = require('./superhero_info.json');
const superHeroPowers = require('./superhero_powers.json');
const fs = require('fs');

//route to get all super info
app.get('/api/superhero-info' ,(req, res)=>{
res.send(superHeroInfo);
});

//route to get all super powers
app.get('/api/superhero-powers', (req, res)=>{
    res.send(superHeroPowers);
})
//tell app to start listening on port 
const port = process.env.PORT || 3000
app.listen(port, ()=> console.log(`listening on port ${port}`));

function getSupInfoByID(sId){
    const superhero = superHeroInfo.find(hero => hero.id === sId);
    return superhero || null;
}

app.get('/api/superhero-info/:id', (req, res) =>{
    const supID = parseInt(req.params.id);
    const superhero = getSupInfoByID(supID);
    if(superhero){
        res.send(superhero);
    }else{
        res.status(404).send('Super Hero Not Found!');
    }
});

function getSupPowersByName(name){
    const supPowers = superHeroPowers.find(hero => hero.hero_names === name);
    return supPowers || null;
}

app.get('/api/superhero-powers/:id', (req, res) =>{
    const supID = parseInt(req.params.id);
    const superhero = getSupInfoByID(supID);
   const supPowers = getSupPowersByName(superhero.name)
    if(supPowers){
        res.send(supPowers);
    }else{
        res.status(404).send('Super Hero Not Found!');
    }
});

function getPublishers(){
    const publishers = [...new Set(superHeroInfo.map(hero => hero.Publisher))];
    return publishers || null
}

app.get('/api/superhero-publishers', (req, res) =>{
    const publishers = getPublishers();
    if(publishers){
        res.send(publishers);
    }
});

function getMatchingSup(field, pattern, n){
const regPattern = new RegExp(pattern, 'i')//making the pattern case insensitive
const filteredSups = superHeroInfo.filter(hero=> regPattern.test(hero[field]));
//if n is provided and a number then we return n matches, otherwise return all matches
return typeof n === 'number' ? filteredSups.slice(0,n) : filteredSups;
}

app.get('/api/superhero-search', (req, res)=>{

    const {field, pattern, n } = req.query;

    //validate input
    if(!field || !pattern){
        return res.status(400).send('Field and pattern are required');
    }


    if(!superHeroInfo.every(hero=> field in hero) && !superHeroPowers.every(hero=> field in hero)){
        return res.status(400).send('Invalid field');
    }

      // Parse 'n' as integer if provided
  const limit = n ? parseInt(n, 10) : undefined;
  if (n && isNaN(limit)) {
    return res.status(400).send('Invalid limit number');
  }
const matches = getMatchingSup(field, pattern, limit);
return res.send(matches);    

})



const DATA_FILE = './superHeroLists.json';

// Function to load lists from the file
function loadLists() {
    if (fs.existsSync(DATA_FILE)) {
        const rawData = fs.readFileSync(DATA_FILE);
        return JSON.parse(rawData);
    }
    return {};
}

// Function to save lists to the file
function saveLists(superHeroLists) {
    const data = JSON.stringify(superHeroLists, null, 2);
    fs.writeFileSync(DATA_FILE, data);
}

// Usage within Express endpoints
app.post('/api/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const superHeroLists = loadLists(); // Load existing lists

    if (superHeroLists[listName]) {
        return res.status(400).send('List name already exists');
    }

    superHeroLists[listName] = [];
    saveLists(superHeroLists); // Save updated lists
    res.status(201).send('List created');
});

app.put('/api/lists/:listName', (req, res) => {
    const listName = req.params.listName;
    const superheroIds = req.body.superheroIds;
    const superHeroLists = loadLists(); // Load existing lists

    if (!superHeroLists[listName]) {
        return res.status(404).send('List name does not exist.');
    }

    superHeroLists[listName] = superheroIds;
    saveLists(superHeroLists); // Save updated lists
    res.status(200).send('List updated successfully.');
});

app.get('/api/lists', (req, res) => {
    const superHeroLists = loadLists(); // Load existing lists from the file
    const listNames = Object.keys(superHeroLists); // Get all list names
    res.send(listNames); // Send the list names as a response
});

app.get('/api/lists/:listName/ids', (req, res) => {
    const listName = req.params.listName; // Get the list name from the URL parameter
    const superHeroLists = loadLists(); // Load all lists from the file

    // Check if the list exists
    if (superHeroLists[listName]) {
        res.send(superHeroLists[listName]); // Send the array of IDs
    } else {
        res.status(404).send('List not found.'); // If the list doesn't exist, send a 404 error
    }
});

app.get('/api/lists/:listName/info', (req, res) => {
    const listName = req.params.listName; // Get the list name from the URL parameter
    const superHeroLists = loadLists(); // Load all lists from the file

    // Check if the list exists
    if (superHeroLists[listName]) {
        // For each ID in the list, fetch the superhero information
        const superHeroesInfo = superHeroLists[listName].map(id => getSupInfoByID(id)).filter(hero => hero !== null);
        
        // If any IDs were invalid (not found), handle appropriately
        if (superHeroesInfo.length !== superHeroLists[listName].length) {
            return res.status(404).send('One or more Superhero IDs not found.');
        }
        
        res.send(superHeroesInfo); // Send the array of superhero info objects
    } else {
        res.status(404).send('List not found.'); // If the list doesn't exist, send a 404 error
    }
});

app.get('/api/lists/:listName/powers', (req, res) => {
    const listName = req.params.listName; // Get the list name from the URL parameter
    const superHeroLists = loadLists(); // Load all lists from the file

    // Check if the list exists
    if (superHeroLists[listName]) {
        // For each ID in the list, fetch the superhero powers
        const superHeroesPowers = superHeroLists[listName].map(id => {
            const superhero = getSupInfoByID(id);
            return superhero ? getSupPowersByName(superhero.name) : null;
        }).filter(powers => powers !== null);

        // If any IDs were invalid (not found), handle appropriately
        if (superHeroesPowers.length !== superHeroLists[listName].length) {
            return res.status(404).send('One or more Superhero IDs not found or do not have powers listed.');
        }
        
        res.send(superHeroesPowers); // Send the array of superhero powers objects
    } else {
        res.status(404).send('List not found.'); // If the list doesn't exist, send a 404 error
    }
});


