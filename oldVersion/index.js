
const filterByType = document.getElementById('filter-by-type');
//https://api.openbrewerydb.org/breweries?by_state=new_york&per_page=3;
let state = [];
let originalState = [];
let cityState = [];
let visitState = [];
let currentPage = [];

let page = 0;
let pageNow = 1;

const brewType = ['micro', 'regional', 'brewpub'];
function clearState() {
    state = [];
}
function setState(updatedState) {
    state = updatedState;

    createListOfBrewery(state); const next_page = document.getElementById('next_page');
    next_page.innerHTML = "";
    if (page > 1) {
        if (page-pageNow>1) {
            const button_next = document.createElement("button");
            button_next.innerHTML = 'Next';
            button_next.setAttribute("id", "next");
            next_page.appendChild(button_next);
            listenToNextPage(button_next);

        }
        if (pageNow - 1 >= 0) {
            const button_back = document.createElement("button");
            button_back.innerHTML = 'Back';
            button_back.setAttribute("id", "back");
            next_page.appendChild(button_back);
            listenToBackPage(button_back);
        }


    }

    rander();
}

function findPage() {
    //if there are morethan 10 go to the next page

    const numberOfPages = Math.ceil(originalState.length / 10);
    page = numberOfPages;

    for (let i = 0; i < numberOfPages; i++) {
        let itemInPage = [];
        //next_page
        const starter = i * 10;
        let end = starter + 10;
        if(end>originalState.length ){
            end = originalState.length;
        }
        for (let j = starter; j < end; j++) {
            console.log('originalState[j] ', originalState[j]);
            itemInPage.push(originalState[j]);
        }
        console.log('itemInPage: ', itemInPage);
        currentPage.push(itemInPage);
    }
    setState(currentPage[0]);
}
function setPage(pageNow) {


    setState(currentPage[pageNow]);
}
function listenToNextPage(next_button) {

    next_button.addEventListener('click', function (event) {

            pageNow++;
    
        setPage(pageNow);
    });

}
function listenToBackPage(back_button) {

    back_button.addEventListener('click', function (event) {
        if (pageNow === 1) {
            pageNow = 0;
        } else {
            pageNow--;
        }

        setPage(pageNow);
    });

}
function setOriginalState(updatedState) {
    originalState = updatedState;
    console.log('originalState', originalState);
    createListOfBrewery(originalState);
    rander();
}
function setCityState(updatedState) {
    cityState.push(...updatedState);
    console.log('cityState', cityState);
    createListOfBrewery(cityState);
    rander();

}
function setvisitState(item) {
    const match = visitState.some(element => element.name === item.name);
    console.log('match', match);
    if (!match) {
        visitState.push(item)
    }
    createListOfvisit(visitState)
    //createListOfBrewery(state);
    rander();

}
function updateVisitState(updateState) {
    visitState = updateState;
    createListOfvisit(visitState)
    //createListOfBrewery(state);
    rander();

}
function createListOfvisit(visitState) {
    const visit = document.getElementById('visit');
    visit.innerHTML = "";
    const h3 = document.createElement('h3');
    h3.innerHTML = "My Favourite Breweries";
    h3.setAttribute('id', 'visit-heading');
    visit.appendChild(h3);
    const ulEl = document.createElement('ul');
    ulEl.setAttribute('id', 'visit-list');
    visit.appendChild(ulEl);
    visitState.forEach(item => {
        const name = item.name.split(' ');
        const div = document.createElement('div');
        div.setAttribute('class', 'wrap');
        ulEl.appendChild(div);

        const li_link = document.createElement('a');
        li_link.setAttribute('href', item.website_url);
        li_link.innerHTML = name[0] + ' ' + name[1];
        div.appendChild(li_link);

        const li_remove = document.createElement('a');
        li_remove.setAttribute('id', 'remove-' + item.id);
        li_remove.style.color = 'red';
        li_remove.innerHTML = 'Remove';
        div.appendChild(li_remove);
        listenToRemoveVisit(li_remove);


    });
    //visit-list


}

function rander() {

    listenToSearhByState();
    listenToselectOnSuggestState();
    listenToSubmitState();
    listenToFilterByType();
    listenToSearhByBrewriesName();


}
function getByState(state) {
    //https://api.openbrewerydb.org/breweries?page=15&per_page=3
    console.log('getByState', state);
    fetch(`https://api.openbrewerydb.org/breweries?by_state=${state}&per_page=50`)
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
            //setState(filterByType);
            setOriginalState(filterByType);
            findPage();

        });
}
function getAllStates() {
    fetch(`https://api.openbrewerydb.org/breweries?&per_page=50`)
        .then(function (response) {
            //console.log('get response', response);
            return response.json();
        })
        .then(function (data) {
            console.log('date length', data.length);
            const filterByType = data.filter(function (item) {
                if (brewType.includes(item.brewery_type)) {
                    return item;
                }
            })
            //setState(filterByType);
            setOriginalState(filterByType);
            findPage();


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

        const removeDuplicate = [...new Set(suggestList)]
        removeDuplicate.forEach(function (term) {
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
function listenToFilterByType() {
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
function listenToFilterByCity(filterByCity) {
    filterByCity.addEventListener("change", function (event) {
        const city = event.target.value;
        const filtered_by_city = originalState.filter(function (element) {

            if (element.city === city) {
                console.log('element city: ' + element.city);
                return element;
            }
        });
        console.log('filtered_by_city', filtered_by_city);
        setCityState(filtered_by_city);
    });

}
function listenToaddToVisit(addToVisit) {
    addToVisit.addEventListener("click", function (event) {
        const id = event.target.id;
        const info = state.find(element => element.id === id);
        setvisitState(info);
    });


}
function listenToRemoveVisit(remove) {
    remove.addEventListener("click", function (event) {
        const id = event.target.id;
        const removeId = id.replace('remove-', '');
        const updateState = visitState.filter(element => element.id !== removeId);
        updateVisitState(updateState);
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

        const addToVisit = document.createElement("a");
        addToVisit.setAttribute("href", "#");
        addToVisit.setAttribute("id", item.id);
        addToVisit.setAttribute("class", "save-like");
        addToVisit.innerHTML = 'Add to visit';
        li.appendChild(addToVisit);
        listenToaddToVisit(addToVisit);

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
    const cityForm = document.getElementById('filter-by-city-form');
    cityForm.innerHTML = "";
    const filtered_by_city = originalState.map(function (item) {
        return item.city
    });

    filtered_by_city.forEach(function (name) {
        createCityElement(name)
    });


    listenToClearAllCity();
}
function createCityElement(name) {
    const cityForm = document.getElementById('filter-by-city-form');

    const input = document.createElement('input');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('name', name);
    input.setAttribute('id', name);
    input.setAttribute('value', name);
    cityForm.appendChild(input);
    listenToFilterByCity(input);

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