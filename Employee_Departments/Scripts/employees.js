import EmployeeImplementation from "../Implementations/EmployeeImplementation.js";
import EmployeeModel from "../Models/EmployeeModel.js"
import PageInfo from "../Models/PageInfo.js";
import Search from "../Implementations/search.js"

let page = new PageInfo('employee');
/**
 * This will come into effect when the Employee Page is loaded
 * we need to restore the state it was as before navigation including the page info
 */
function onEmployeeListingPage() {
    console.log("populating table");
    let arr = page.changePage(sessionStorage.getItem('employeepage') ?? 1);
    populateTableEmployees(document.getElementById('root'), arr);

    // Pagination button events
    document.getElementById('prevPage').addEventListener('click', () => {
        arr = page.prevPage();
        populateTableEmployees(document.getElementById('root'), arr);
    });
    document.getElementById('nextPage').addEventListener('click', () => {
        arr = page.nextPage();
        populateTableEmployees(document.getElementById('root'), arr);
    });
    document.getElementById('firstPage').addEventListener('click', () => {
        arr = page.firstPage();
        populateTableEmployees(document.getElementById('root'), arr);
    });
    document.getElementById('lastPage').addEventListener('click', () => {
        arr = page.lastPage();
        populateTableEmployees(document.getElementById('root'), arr);
    });
    // event listener on edit and delete button
    document.querySelector('#root').addEventListener('click', (e) => {
        // get the id of row to be edited or deleted
        let row_clicked = e.target.parentElement.parentElement.parentElement;
        let row_data = row_clicked.getElementsByTagName('td');
        let emp_edit = {};
        emp_edit.id = row_data[0].innerText;
        emp_edit.name = row_data[1].innerText;
        emp_edit.age = row_data[2].innerText;
        // check if the event is delete
        if (e.target.classList.contains('delete')) {
            onEmployeeDelete(emp_edit.id);
        }
        // check if the event is edit
        if (e.target.classList.contains('edit')) {
            // store the object of the event clicked in session storage
            let employee_edit_url = `../Pages/employee_add_edit.html?id=${emp_edit.id}&name=${emp_edit.name}&age=${emp_edit.age}&editpage=true`;
            //get to the add edit page
            window.location.assign(employee_edit_url)
            onNavigateToAdd_Edit();
        };
    })

    search('employee');
}

export default function getQueryParams(url) {
    const paramArr = url.slice(url.indexOf('?') + 1).split('&');
    const params = {};
    paramArr.map(param => {
        const [key, val] = param.split('=');
        params[key] = decodeURIComponent(val);
    })
    return params;
}

function search(key) {
    let search_obj = new Search(key);
    document.getElementById('search').addEventListener('keyup', () => {
        let keyword = document.getElementById('search').value;
        localStorage.setItem("search", JSON.stringify(search_obj.search(keyword)));
        let search_page = new PageInfo('search');
        let searchResult = search_page.changePage(1);
        populateTableEmployees(document.getElementById('root'), searchResult);
    });
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('search').value = '';
        localStorage.removeItem('search');
        onEmployeeListingPage();
    })
}

/**
 * This page will store the current state in session and then navigate to the add_edit page
 * this page is called on edit & add button click
 * if id is passed then its edit else add 
 * example : /employee_add_edit/<id passed> 
 * window.redirect : <window.host>://employee_add_edit/<id passed>
 */
function onNavigateToAdd_Edit() {
    let editInfo = getQueryParams(window.location.href);
    if (window.location.href.includes('editpage=true')) {
        document.getElementById("empId").hidden = false;
        document.getElementById("cancel").hidden = false;
        document.getElementById("empId").innerText = "Employee ID : " + editInfo.id;
        document.getElementById('empName').value = editInfo.name;
        document.getElementById('empAge').value = editInfo.age;
    } else {
        document.getElementById("empId").hidden = true;
        document.getElementById("cancel").hidden = true;
    }

    document.querySelector("#mainForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (window.location.href.includes('editpage=true')) {
            onEmployeeUpdate(event.target, editInfo.id);
            window.location.href = "./employees.html"
        } else {
            onEmployeeAdd(event.target);
        }
        console.log("Done");
    });
}

function populateTableEmployees(tableReference, array_of_employees) {

    //using JS clear the table content
    tableReference.innerHTML = '';
    let objLen = array_of_employees.length;
    //using JS build the tr tags and in loop keep appending the table 

    let data = `<td>
                    <button type="button" class="btn-edit"><i class="fa-solid fa-pen-to-square edit"></i></button>
                    <button type="button" class="btn-delete"><i class="fa-solid fa-trash delete"></i></button>
                </td>`;
    for (let i = 0; i < objLen; i++) {
        let row = `<tr><td>${array_of_employees[i]['id']}</td><td>${array_of_employees[i]['name']}</td><td>${array_of_employees[i]['age']}</td>${data}</tr>`;
        tableReference.innerHTML = tableReference.innerHTML + row;
    }
}

function onEmployeeAdd(divControlReference) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new employee object and then call the respective 
    //method of 'EmployeeImplementation' class instance
    console.log("adding");

    let employeeImplementation = new EmployeeImplementation();
    var formData = new FormData(divControlReference);
    let employee = new EmployeeModel();
    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE Employee Model
    */
    employee.name = document.getElementById("empName").value;
    employee.age = document.getElementById("empAge").value;
    // employee.empName = formData.entr
    // employee.id = employeeImplementation.FindMaxId() + 1;
    employeeImplementation.Add(employee);
    document.getElementById("empName").value = "";
}

function onEmployeeUpdate(divControlReference, id) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new employee object and then call the respective 
    //method of 'EmployeeImplementation' class instance
    console.log("udpating");
    let formData = new FormData(divControlReference);
    formData = Object.fromEntries(formData);
    console.log(formData);

    let employeeImplementation = new EmployeeImplementation();
    let employee_to_be_updated = new EmployeeModel();
    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE Employee Model
    */
    employee_to_be_updated.name = document.getElementById('empName').value;
    employee_to_be_updated.age = document.getElementById('empAge').value;
    employee_to_be_updated.id = id;
    employeeImplementation.Update(id, employee_to_be_updated);

    document.getElementById("empName").value = "";
}


function onEmployeeDelete(id) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new employee object and then call the respective 
    //method of 'EmployeeImplementation' class instance

    let employeeImplementation = new EmployeeImplementation();
    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE Employee Model
    */
    employeeImplementation.Delete(id);
    document.getElementById('root').innerHTML = '';
    let arr = page.changePage(sessionStorage.getItem('Epage'));
    populateTableEmployees(document.getElementById('root'), arr);


}

if (window.location.href.includes('employee_add_edit')) {
    onNavigateToAdd_Edit();
    // document.querySelector("#showTable").addEventListener('click', onEmployeeListingPage);
}

//checking if we are on employee listing page
if (window.location.href.includes('employees')) {
    // populating table according to the page number
    onEmployeeListingPage();

}