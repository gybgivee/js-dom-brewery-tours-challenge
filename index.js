
const filterByType = document.getElementById('filter-by-type');
//https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=3;
let state = [];
let originalState = [];


const brewType = ['micro', 'regional', 'brewpub'];
function clearState() {
    state = [];
}
function setState(updatedState) {
    state = updatedState;
    // Object.keys(updatedState).forEach((prop) => {
    //     state[prop] = updatedState[prop];
    //   });
    createListOfBrewery(state);
    rander();
}
function setOriginalState(updatedState) {
    originalState = updatedState;
    console.log('originalState', originalState);
    createListOfBrewery(originalState);
    rander();
}

function rander() {
    listenToSearhByState();
    listenToselectOnSuggestState();
    listenToSubmitState();
    listenToFilterType();
    listenToSearhByBrewriesName();

}
function getByState(state) {

    console.log('getByState', state);
    //`hello world, My name is ${isBold ? '<b>Kitty Coder</b>' : 'Kitty Coder'}`;
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}`)
        .then(function (response) {
            //console.log('get response', response);
            return response.json();
        })
        .then(function (data) {

            const filterByType = data.filter(function (item) {
                if (brewType.includes(item.brewery_type)) {
                    return item;
                }
            })
            setState(filterByType);
            setOriginalState(filterByType);

        });
}
function getAllStates() {
    fetch(`https://api.openbrewerydb.org/breweries?by_state`)
        .then(function (response) {
            //console.log('get response', response);
            return response.json();
        })
        .then(function (data) {
            const filterByType = data.filter(function (item) {
                if (brewType.includes(item.brewery_type)) {
                    return item;
                }
            })
            setState(filterByType);
            setOriginalState(filterByType);

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



    stateSuggest.addEventListener("click", function (event) {
        const searchByState = document.getElementById('select-state');
        const input = event.target.value;
        searchByState.innerHTML = input;
        searchByState.value = input; //So by setting innnerHTML it actually update the html but not the value itself

    });
}
function listenToSubmitState() {

    const stateForm = document.getElementById("select-state-form");

    stateForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const searchByState = document.getElementById('select-state');
        const state = searchByState.value;

        getByState(state);
        listenToSearhByCity();
    });

}
function listenToFilterType() {
    const filterByType = document.getElementById("filter-by-type");

    filterByType.addEventListener("change", function (event) {
        const type = event.target.value;

        const filtered_by_type = originalState.filter(function (element) {
            if (element.brewery_type === type) {
                return element;
            }
        });

        setState(filtered_by_type);

    });
}

function createListOfBrewery(state) {
    console.log('State in listOfBrewery: ', state);
    const ulEl = document.getElementById("breweries-list");
    ulEl.innerHTML = "";
    state.forEach(function (item) {

        const li = document.createElement("li");
        ulEl.appendChild(li);

        const h2 = document.createElement("h2");
        h2.innerHTML = item.name;
        li.appendChild(h2);

        const type = document.createElement("div");
        type.innerHTML = item.brewery_type;
        type.setAttribute("class", "type");
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
        p_city.innerHTML = item.city + ' ' + item.state;
        sectionAddress.appendChild(p_city);

        const sectionPhone = document.createElement("section");
        sectionPhone.setAttribute("class", "phone");
        li.appendChild(sectionPhone);
        const h3_phone = document.createElement("h3");
        h3_phone.innerHTML = "Phone : ";
        sectionAddress.appendChild(h3_phone);
        const p_phone = document.createElement("p");
        if (item.phone === null) {
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
function listenToSearhByBrewriesName() {
    const filterByName = document.getElementById('search-breweries');
    filterByName.addEventListener('click', function (event) {
        console.log('listenToSearhByBrewriesName ', event.target.value);
        const name = event.target.value;
        if (name === '') {
            setState(originalState);
        }
        const nameEnd = name.length;
        const filtered_by_name = state.filter(function (item) {

            if (item.name.slice(0, nameEnd) === name) {
                return item;
            }
        });
        setState(filtered_by_name);

    })
}
function listenToSearhByCity() {
    const filtered_by_city = originalState.map(function (item) {
        return item.city
    });
    console.log('filter', filtered_by_city);
    filtered_by_city.forEach(function (name) {
        createCityElement(name)
    });

    listenToClearAllCity();
}
function createCityElement(name) {
    const cityForm = document.getElementById('filter-by-city-form');
    /*
    <input type="checkbox" name="cincinnati" value="cincinnati" />
    <label for="cincinnati">Cincinnati</label>*/
    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', name);
    input.setAttribute('value', name);
    cityForm.appendChild(input);

    const label = document.createElement('label');
    label.setAttribute('for', name);
    label.innerHTML = name;
    cityForm.appendChild(label);


}
function listenToClearAllCity() {
    //clear-all-btn
    const clearAllCity = document.getElementById('clear-all-city');

    clearAllCity.addEventListener('click', function (event) {
        console.log(' clearAllCity event', event);
        const checkboxs = document.getElementById('filter-by-city-form').getElementsByTagName("input");
        for (const checkbox of checkboxs) {
            checkbox.checked = false;
        }
    });

}
function init() {
    getAllStates();
}


init();