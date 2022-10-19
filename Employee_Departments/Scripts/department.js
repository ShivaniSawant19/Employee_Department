import DeptImplementation from "../Implementations/DepartmentImplementation.js";
import DepartmentModel from "../Models/DepartmentModel.js";
import PageInfo from "../Models/PageInfo.js";
import Search from "../Implementations/search.js";
import getQueryParams from "../Scripts/employees.js"

let page = new PageInfo('department');
// This page will use the department Implemetation 'departmentImplementation'
/**
 * This will come into effect when the department Page is loaded
 * we need to restore the state it was as before navigation including the page info
 */
function onDepartmentListingPage() {
    console.log("populating table");
    let arr = page.changePage(sessionStorage.getItem('departmentpage') ?? 1);
    populateTabledepartments(document.getElementById('root'), arr);

    // Pagination button events
    document.getElementById('prevPage').addEventListener('click', () => {
        arr = page.prevPage();
        populateTabledepartments(document.getElementById('root'), arr);
    });
    document.getElementById('nextPage').addEventListener('click', () => {
        arr = page.nextPage();
        populateTabledepartments(document.getElementById('root'), arr);
    });
    document.getElementById('firstPage').addEventListener('click', () => {
        arr = page.firstPage();
        populateTabledepartments(document.getElementById('root'), arr);
    });
    document.getElementById('lastPage').addEventListener('click', () => {
        arr = page.lastPage();
        populateTabledepartments(document.getElementById('root'), arr);
    });
    // event listener on edit and delete button
    document.querySelector('#root').addEventListener('click', (e) => {
        // get the id of row to be edited or deleted
        let row_clicked = e.target.parentElement.parentElement.parentElement;
        let row_data = row_clicked.getElementsByTagName('td');
        let dept_edit = {};
        dept_edit.id = row_data[0].innerText;
        dept_edit.name = row_data[1].innerText;
        // check if the event is delete
        if (e.target.classList.contains('delete')) {
            onDepartmentDelete(dept_edit.id);
        }
        // check if the event is edit
        if (e.target.classList.contains('edit')) {
            // store the object of the event clicked in session storage
            let dept_edit_url = `../Pages/department_add_edit.html?id=${dept_edit.id}&name=${dept_edit.name}&editpage=true`;
            //get to the add edit page
            window.location.assign(dept_edit_url)
            onNavigateToAdd_Edit();
        };
    })

    search('department');
}

function search(key) {
    let search_obj = new Search(key);
    document.getElementById('search').addEventListener('keyup', () => {
        let keyword = document.getElementById('search').value;
        localStorage.setItem("search", JSON.stringify(search_obj.search(keyword)));
        let search_page = new PageInfo('search');
        let searchResult = search_page.changePage(1);
        populateTabledepartments(document.getElementById('root'), searchResult);
    });
    document.getElementById('clear-btn').addEventListener('click', () => {
        document.getElementById('search').value = '';
        sessionStorage.removeItem('search');
        onDepartmentListingPage();
    })
}

/**
 * This page will store the current state in session and then navigate to the add_edit page
 * this page is called on edit & add button click
 * if id is passed then its edit else add 
 * example : /department_add_edit/<id passed> 
 * window.redirect : <window.host>://department_add_edit/<id passed>
 */
function onNavigateToAdd_Edit(id) {
    let editInfo = getQueryParams(window.location.href);
    if (window.location.href.includes('editpage=true')) {
        document.getElementById("deptId").hidden = false;
        document.getElementById("cancel").hidden = false;
        document.getElementById("deptId").innerText = "Department ID : " + editInfo.id;
        document.getElementById('deptName').value = editInfo.name;
    } else {
        document.getElementById("deptId").hidden = true;
        document.getElementById("cancel").hidden = true;
    }

    document.querySelector("#mainForm").addEventListener("submit", function (event) {
        event.preventDefault();
        if (window.location.href.includes('editpage=true')) {
            onDepartmentUpdate(event.target, editInfo.id);
            window.location.href = "./departments.html"
        } else {
            onDepartmentAdd(event.target);
        }
        console.log("Done");
    });
}

function populateTabledepartments(tableReference, array_of_departments) {

    //using JS clear the table content
    tableReference.innerHTML = '';
    let objLen = array_of_departments.length;
    //using JS build the tr tags and in loop keep appending the table 

    let data = `<td>
                    <button type="button" class="btn-edit"><i class="fa-solid fa-pen-to-square edit"></i></button>
                    <button type="button" class="btn-delete"><i class="fa-solid fa-trash delete"></i></button>
                </td>`;
    for (let i = 0; i < objLen; i++) {
        let row = `<tr><td>${array_of_departments[i]['id']}</td><td>${array_of_departments[i]['dep_name']}</td>${data}</tr>`;
        tableReference.innerHTML = tableReference.innerHTML + row;
    }

}
// do
function onDepartmentAdd(divControlReference) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new department object and then call the respective 
    //method of 'departmentImplementation' class instance
    console.log("adding");

    let departmentImplementation = new DeptImplementation();
    var formData = new FormData(divControlReference);
    let department = new DepartmentModel();
    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE department Model
    */
    department.dep_name = document.getElementById("deptName").value;
    departmentImplementation.Add(department);
    document.getElementById("deptName").value = "";
}


function onDepartmentUpdate(divControlReference, id) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new department object and then call the respective 
    //method of 'departmentImplementation' class instance
    console.log("udpating");
    let formData = new FormData(divControlReference);
    formData = Object.fromEntries(formData);
    console.log("this is form data : " + formData);

    let departmentImplementation = new DeptImplementation();
    let department_to_be_updated = new DepartmentModel();
    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE department Model
    */
    department_to_be_updated.dep_name = document.getElementById('deptName').value;
    department_to_be_updated.id = id;
    departmentImplementation.Update(id, department_to_be_updated);

    document.getElementById("deptName").value = "";
}


function onDepartmentDelete(id) {
    //read the values from the control 'divControlReference' is the div containing all the 
    //basic text box/radio/list control that holds the value
    // we need to read the values from the 'controls' build a new department object and then call the respective 
    //method of 'departmentImplementation' class instance

    let departmentImplementation = new DeptImplementation();


    /*
    HERE YOU WILL READ FROM CONTROL AND FILL THE VALUES INSIDE department Model
    */

    departmentImplementation.Delete(id);
    document.getElementById('root').innerHTML = '';
    let arr = page.changePage(sessionStorage.getItem('Dpage'));
    populateTabledepartments(document.getElementById('root'), arr);


}

if(window.location.href.includes('department_add_edit')) {
    onNavigateToAdd_Edit();
}

//checking if we are on department listing page
if (window.location.href.includes('departments')) {
    // populating table according to the page number
    onDepartmentListingPage();
}