const listUsersURL = 'http://localhost:8080/admin/users';
const adminURL = 'http://localhost:8080/admin/getInfoAboutAdmin';
const newUserURL = 'http://localhost:8080/admin/newUser';
const findUserURL = 'http://localhost:8080/admin/';
const listRolesURL = 'http://localhost:8080/admin/roles';
const editUserURL = 'http://localhost:8080/admin/editUser';
const deleteUserURL = 'http://localhost:8080/admin/deleteUser/';

function getAllUsers() {
    fetch(listUsersURL)
        .then(response => response.json())
        .then(data => {
            loadTable(data)
        })
}

function loadTable(listAllUsers) {
    let res = ``;
    for (let user of listAllUsers) {
        res +=
            `<tr>
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.email}</td>
                <td>${user.roles.map(r => r.role.replace('ROLE_', '')).join(' ')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" type="button"
                    data-bs-toggle="modal" data-bs-target="#editModal"
                    onclick="editModal(${user.id})">Edit</button></td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button"
                    data-bs-toggle="modal" data-bs-target="#deleteModal"
                    onclick="deleteModal(${user.id})">Delete</button></td>
            </tr>`
    }
    document.getElementById('tableBodyAdmin').innerHTML = res;
}

function newUserTab() {
    document.getElementById('newUserForm').addEventListener('submit', (e) => {
        e.preventDefault()

        let formNewUser = document.forms["newUserForm"];
        let rolesForNewUser = [];
        for (let i = 0; i < formNewUser.roles.options.length; i++) {
            if (formNewUser.roles.options[i].selected)
                rolesForNewUser.push({
                    id: formNewUser.roles.options[i].value,
                    role: "ROLE_" + formNewUser.roles.options[i].text
                });
        }

        fetch(newUserURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify({
                firstName: document.getElementById('newFirstName').value,
                lastName: document.getElementById('newLastName').value,
                age: document.getElementById('newAge').value,
                email: document.getElementById('newEmail').value,
                password: document.getElementById('newPassword').value,
                roles: rolesForNewUser
            })
        })
            .then(response => {
                if (response.ok) {
                    document.getElementById('newFirstName').value = '';
                    document.getElementById('newLastName').value = '';
                    document.getElementById('newAge').value = '';
                    document.getElementById('newEmail').value = '';
                    document.getElementById('newPassword').value = '';
                    document.getElementById('usersTableTab').click()
                    getAllUsers();
                }
            })
    })
}

function loadRolesForNewUser() {
    let selectNewRoles = document.getElementById("newRoles");
    selectNewRoles.innerHTML = "";

    fetch(listRolesURL)
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role.replace('ROLE_', '');
                selectNewRoles.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", loadRolesForNewUser);

function closeModal() {
    document.querySelectorAll(".btn-close").forEach((btn) => btn.click())
}


function editModal(id) {
    let findId = findUserURL + id;
    fetch(findId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(response => {
        response.json().then(user => {
            document.getElementById('editId').value = user.id;
            document.getElementById('editFirstName').value = user.firstName;
            document.getElementById('editLastName').value = user.lastName;
            document.getElementById('editAge').value = user.age;
            document.getElementById('editEmail').value = user.email;
            document.getElementById('editPassword').value = '';
        })
    });
    loadRolesForEdit();
}

function loadRolesForEdit() {
    let selectEdit = document.getElementById("editRoles");
    selectEdit.innerHTML = "";

    fetch(listRolesURL)
        .then(response => response.json())
        .then(data => {
            data.forEach(role => {
                let option = document.createElement("option");
                option.value = role.id;
                option.text = role.role.replace('ROLE_', '');
                selectEdit.appendChild(option);
            });
        })
        .catch(error => console.error(error));
}

window.addEventListener("load", loadRolesForEdit);


async function editUser() {
    let formEdit = document.forms["modalEdit"];

    let idEditValue = document.getElementById('editId').value;
    let firstNameEditValue = document.getElementById('editFirstName').value;
    let lastNameEditValue = document.getElementById('editLastName').value;
    let ageEditValue = document.getElementById('editAge').value;
    let emailEditValue = document.getElementById('editEmail').value;
    let passwordEditValue = document.getElementById('editPassword').value;
    let rolesEditValue = [];
    for (let i = 0; i < formEdit.roles.options.length; i++) {
        if (formEdit.roles.options[i].selected) rolesEditValue.push({
            id: formEdit.roles.options[i].value,
            role: "ROLE_" + formEdit.roles.options[i].text
        });
    }
    let user = {
        id: idEditValue,
        firstName: firstNameEditValue,
        lastName: lastNameEditValue,
        age: ageEditValue,
        email: emailEditValue,
        password: passwordEditValue,
        roles: rolesEditValue
    }
    await fetch(editUserURL, {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify(user)
    });
    closeModal()
    getInformationAboutAdmin()
    getAllUsers()
}


function deleteModal(id) {
    let delId = findUserURL + id;
    fetch(delId, {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        }
    }).then(response => {
        response.json().then(user => {
            document.getElementById('deleteId').value = user.id;
            document.getElementById('deleteFirstName').value = user.firstName;
            document.getElementById('deleteLastName').value = user.lastName;
            document.getElementById('deleteAge').value = user.age;
            document.getElementById('deleteEmail').value = user.email;
        })
    });
}

async function deleteUser() {
    let urlDel = deleteUserURL + document.getElementById('deleteId').value;
    let method = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    fetch(urlDel, method).then(() => {
        closeModal()
        getAllUsers()
    })
}


function getInformationAboutAdmin() {
    fetch(adminURL)
        .then(response => response.json())
        .then(user => {
            user.roles.map(r => {
                if (r.role.replace('ROLE_', '') === 'ADMIN') {
                    getAllUsers()
                    newUserTab()
                }
            })
            document.getElementById('userInformationPage').innerHTML = `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(r => r.role.replace('ROLE_', '')).join(' ')}</td>
        </tr>`;

            document.getElementById('navbarAdmin').innerHTML =
                `<b><span>${user.email}</span></b>
                <span>with roles:</span>
                <span>${user.roles.map(r => r.role.replace('ROLE_', '')).join(' ')}</span>`;
        })
}

getInformationAboutAdmin();