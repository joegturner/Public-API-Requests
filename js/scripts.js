/******************************************
Treehouse Techdegree:
FSJS project 5 - Public API Requests
******************************************/
  
// by: Joe Turner
// Going for Exceeds!
// Rev 0: 2-19-2020 (peer review submission on Slack)


// ------------------------------------------
//  GLOBAL VARIABLES
// ------------------------------------------
const gallery = document.getElementById('gallery');
const body = document.getElementsByTagName('body')[0];
const searchDiv = document.getElementsByClassName('search-container')[0];
let employees = [{}];


// ------------------------------------------
//  FETCH FUNCTIONS
// ------------------------------------------

/**
 * fetches random employee from API
 * @param {string} url 
 * @returns {JSON string} fetch response json
 */
async function fetchRandomEmployee(url) {
    try {
        const response = await fetch(url);
        return await response.json();
    } catch(e) {
        console.log('Looks like there was a problem', e);
        throw(e);
    }
}

fetchRandomEmployee('https://randomuser.me/api/?results=12&nat=au,br,ca,ch,de,dk,es,fi,fr,gb,ie,no,nl,nz,tr,us')
    .then(data => generateEmployees(data.results))
    .then(data => generateCards(data))
    .then(generateModalHandlers)


// ------------------------------------------
//  HELPER FUNCTIONS
// ------------------------------------------


/**
 * puts fetch response data into employees array
 * @param {objects} data 
 * @return {objects} employees
 */
function generateEmployees(data = {}) {
    console.log(data);
    for(let i = 0; i < data.length; i++) {
        let employee = {};
        employee.username = data[i].login.username;
        employee.firstName = data[i].name.first;
        employee.lastName = data[i].name.last;
        employee.picture = data[i].picture.medium;
        employee.email = data[i].email;
        employee.city = data[i].location.city;
        employee.state = data[i].location.state;
        employee.cell = data[i].cell;
        employee.address = `
            ${data[i].location.street.number} ${data[i].location.street.name}, 
            ${data[i].location.city}, ${data[i].location.state}, 
            ${data[i].location.country}, ${data[i].location.postcode}
            `;
        employee.birthday = `
            ${data[i].dob.date.split('-')[1]} /
            ${data[i].dob.date.split('-')[2].split('T')[0]} /
            ${data[i].dob.date.split('-')[0]}
        `; 
        employees.push(employee);
    }
    return employees;
}

/**
 * generates innerHTML for gallery Div
 * @param {objects} employees
 */
function generateCards(employees = {}) {
    let html = ``;
    for(let i = 1; i < employees.length; i++) {
        html += `
            <div id="${employees[i].username}" class="card">
            <div class="card-img-container">
                            <img class="card-img" src="${employees[i].picture}" alt="profile picture">
                        </div>
                        <div class="card-info-container">
                            <h3 id="name" class="card-name cap">${employees[i].firstName} ${employees[i].lastName}</h3>
                            <p class="card-text">${employees[i].email}</p>
                            <p class="card-text cap">${employees[i].city}, ${employees[i].state}</p>
                        </div>
                    </div>
        `;
    }
    gallery.innerHTML = html;
}

/**
 * adds event listener to each employee card
 */
function generateModalHandlers() {
    const cards = gallery.getElementsByClassName('card');
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', (event) => {
            const target = event.target;
            if (target.className === 'card'){
                generateModals(target.id);
            } else if (target.className === 'card-img-container' || target.className === 'card-info-container') {
                generateModals(target.parentNode.id);
            } else if (target.className === 'card-img' || target.className === 'card-name cap' || target.className === 'card-text' || target.className === 'card-text cap') {
                generateModals(target.parentNode.parentNode.id);
            }
        })
    }
}

/**
 * generates modal html
 * adds event listener to close, prev, next buttons on modal
 * @param {string} username 
 * @param {int} index
 */
function generateModals(username, index) {

    if (index != 'undefined') {
        for (let i = 1; i < employees.length; i++) {
            if (employees[i].username === username) {
                index = i;
            }
        }
    }
    const modal = document.createElement('div');
    modal.className = 'modal-container';
    modal.innerHTML = `
            <div class="modal">
                <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
                <div class="modal-info-container">
                    <img class="modal-img" src="${employees[index].picture}" alt="profile picture">
                    <h3 id="name" class="modal-name cap">${employees[index].firstName} ${employees[index].lastName}</h3>
                    <p class="modal-text">${employees[index].email}</p>
                    <p class="modal-text cap">${employees[index].city}</p>
                    <hr>
                    <p class="modal-text">${employees[index].cell}</p>
                    <p class="modal-text">${employees[index].address}</p>
                    <p class="modal-text">Birthday: ${employees[index].birthday}</p>
                </div>
            </div>
            <div class="modal-btn-container">
                <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
                <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
    `;
    body.append(modal);

    const modalDiv = document.getElementsByClassName('modal-container')[0];
    document.getElementById('modal-close-btn').addEventListener('click', () => {
        body.removeChild(modalDiv);
    })
    document.getElementById('modal-prev').addEventListener('click', () => {
        if (index >= 2) {
            body.removeChild(modalDiv);
            generateModals(null, index - 1);
        }
    })
    document.getElementById('modal-next').addEventListener('click', () => {
        if (index <= 11) {
            body.removeChild(modalDiv);
            generateModals(null, index + 1);
        }
    })
}

/**
 * filters employees based on search
 * @param {event target value} input 
 */
function search(input) {
    for (let i = 1; i < employees.length; i++) {
        let name = employees[i].firstName.toLowerCase() + employees[i].lastName.toLowerCase();
        let username = employees[i].username;
        
        if (input.length != 0 && name.includes(input)) {
            document.getElementById(username).style.display = '';
        } else if (input.length === 0) {
            document.getElementById(username).style.display = '';
        }
        else {
            document.getElementById(username).style.display = 'none';
        }
    }
}


// ------------------------------------------
//  SEARCH DIV JS
// ------------------------------------------

searchDiv.innerHTML = `
    <form action="#" method="get">
    <input type="search" id="search-input" class="search-input" placeholder="Search...">
    <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
    </form>
    `;
const searchInput = document.getElementById('search-input');
searchInput.addEventListener('keyup', (event) => {
    search(event.target.value);
})
document.getElementById('search-submit').addEventListener('click', (event) => {
    search(searchInput.value);
})
