
const filterByType = document.getElementById('filter-by-type');
//https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=3;
let state = [];
const brewType = ['micro', 'regional', 'brewpub'];
function setState(updatedState) {
    Object.keys(updatedState).forEach((prop) => {

        state[prop] = updatedState[prop];

    });
    createListOfBrewery(state);
    rander();
}
function rander() {
    listenToSearhByState();
    listenToselectOnSuggestState();
    listenToStateSubmit();
    listenToFilterType()
   

}
function getByState(state) {

    console.log('getByState', state);
    //`hello world, My name is ${isBold ? '<b>Kitty Coder</b>' : 'Kitty Coder'}`;
    fetch(`https://api.openbrewerydb.org/breweries?by_state=` + state)
        .then(function (response) {
            console.log('get response', response);
            return response.json();
        })
        .then(function (data) {

            const filterByType = data.filter(function (item) {
                if(brewType.includes(item.brewery_type)){
                    return item;
                }
            })
            setState(filterByType);

        });
}
function getAllStates() {
    fetch(`https://api.openbrewerydb.org/breweries?by_state`)
        .then(function (response) {
            console.log('get response', response);
            return response.json();
        })
        .then(function (data) {
            const filterByType = data.filter(function (item) {
                if(brewType.includes(item.brewery_type)){
                    return item;
                }
            })
            setState(filterByType);

        });
}
function clearStateSuggest() {
    const stateSuggest = document.getElementById("autocompete-state");
    stateSuggest.innerHTML = "";
}
function listenToSearhByState() {

    const search_terms = state.map(function (state) {
        return state.state;
    })
    //console.log('search_terms', search_terms);

    const stateSuggest = document.getElementById("autocompete-state");

    const searchByState = document.getElementById('select-state');
    searchByState.addEventListener('input', function (event) {
        const input = event.target.value;
        stateSuggest.innerHTML = "";
        const reg = new RegExp(input)
        const suggestList = search_terms.filter(function (term) {
            //console.log('term', term);
            if (term.match(reg)) {
                return term;
            }
        });
        const newSuggest = [...new Set(suggestList)]
        newSuggest.forEach(function (term) {
            const option = document.createElement('option');
            option.innerHTML = term;
            //console.log('term: ' + term);
            stateSuggest.appendChild(option);
        });

    });

}
function listenToselectOnSuggestState() {
    const stateSuggest = document.getElementById("autocompete-state");
   
    const stateForm = document.getElementById("select-state-form");
    stateSuggest.addEventListener("click", function (event) {
        const searchByState = document.getElementById('select-state');
        const input = event.target.value;
        searchByState.innerHTML = input;
        stateForm.appendChild(searchByState);
        //need to set to input form
    });
}
function listenToStateSubmit() {
  
    const stateForm = document.getElementById("select-state-form");

    stateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const state = event.target[2].value;

        getByState(state);
    });

}
function listenToFilterType() {
    const filterByType = document.getElementById("filter-by-type");
    filterByType.addEventListener("change", function (event) {
        const type = event.target.value;
        const filter = state.filter(function (element) {


            if (element.brewery_type === type) {
                return element;
            }
        });

        setState(filter);
    });
}

function createListOfBrewery(state) {
   console.log('State in listOfBrewery: ', state);
   const ulEl = document.getElementById("breweries-list");
   ulEl.innerHTML ="";
   state.forEach(function(item) {
   
    const li = document.createElement("li");
    ulEl.appendChild(li);

    const h2 = document.createElement("h2");
    h2.innerHTML = item.name;
    li.appendChild(h2);

    const type = document.createElement("div");
    type.innerHTML = item.brewery_type;
    type.setAttribute("class","type");
    li.appendChild(type);

    const sectionAddress = document.createElement("section");
    sectionAddress.setAttribute("class", "address");
    li.appendChild(sectionAddress);
    const h3_address = document.createElement("h3");
    h3_address.innerHTML = "Address: ";
    sectionAddress.appendChild(h3_address);
    const p_street = document.createElement("p");
    p_street.innerHTML = item.street;
    sectionAddress.appendChild(p_street);
    const p_city = document.createElement("p");
    p_city.innerHTML = item.city+' '+item.state;
    sectionAddress.appendChild(p_city);

    const sectionPhone = document.createElement("section");
    sectionPhone.setAttribute("class", "phone");
    li.appendChild(sectionPhone);
    const h3_phone = document.createElement("h3");
    h3_phone.innerHTML = "Phone : ";
    sectionAddress.appendChild(h3_phone);
    const p_phone = document.createElement("p");
    if(item.phone === null){
        item.phone = "N/A";
    }
    p_phone.innerHTML = item.phone;
    sectionAddress.appendChild(p_phone);

    const sectionLink = document.createElement("section");
    sectionLink.setAttribute("class", "link");
    li.appendChild(sectionLink);
    const a = document.createElement("a");
    a.setAttribute("href", item.website_url);
    a.innerHTML = 'Visit Website';

    sectionLink.appendChild(a);
   });

}
function init() {
    getAllStates();
}

init();