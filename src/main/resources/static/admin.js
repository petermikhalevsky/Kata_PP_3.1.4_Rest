const URL = "http://localhost:8080/users";
let userURL = "http://localhost:8080/user";
const tabTrigger = new bootstrap.Tab(document.getElementById('users-table'))

//// get-запросом получим и сохраним роли USER и ADMIN в отдельные переменные, для использования в форме редактирования и создания нового пользователя
fetch(URL + "/roles").then(res => res.json()).then(roles => roles.forEach(role => {
    if (role.role.includes("user")) {
        window.userRole = role;
    } else if (role.role.includes("admin")) {
        window.adminRole = role;
    }
}));


////FORMING ALL-USERS TAB
//сформируем таблицу и сохраним список пользователей в переменную для дальнейшего использования
async function formUsersTable() {
    let users = await fetch(URL).then(res => res.json());
    let result = " ";
    users.forEach(user => {
        result += `<tr><td>${user.id}</td>
                        <td>${user.login}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.email}</td><td>`;
        user.roles.forEach(role => {
            result += `<span>${role.role} </span>`
        });
        result += `</td><td><button class="button button1" onclick="editButton(${user.id})" data-bs-toggle="modal" data-bs-target="#editModal">Edit</button></td>
                   <td><button class="button button2" onclick="deleteButton(${user.id})" data-bs-toggle="modal" data-bs-target="#deleteModal">Delete</button></td></tr>`
    });
    document.getElementById("users-list").innerHTML = result;
}

formHeader();
formUsersTable();

////FORM PAGE HEADER
async function formHeader() {
    const currentUser = await fetch(userURL).then(res => res.json());
    document.getElementById("headerEmail").innerHTML = currentUser.email;
    let roleString = " ";
    currentUser.roles.forEach(role => {
        roleString += role.role + " ";
    });
    document.getElementById("headerRoles").innerHTML = roleString;
}


////EDIT-FORM
//по клику кнопки edit заполненим форму редактирования пользователя из существующих значений полей
async function editButton(userId) {
    let editURL = URL + "/" + userId;
    let user = await fetch(editURL).then(res => res.json());
    $("#idE").val(user.id);
    $("#loginE").val(user.login);
    $("#firstNameE").val(user.firstName);
    $("#lastNameE").val(user.lastName);
    $("#emailE").val(user.email);
    $("#passwordE").val(user.password);
    let roles = user.roles;
    $("#selectRoleUserE").attr("selected", false);
    $("#selectRoleAdminE").attr("selected", false);
    roles.forEach(role => {
        if (role.role.includes("user")) {
            $("#selectRoleUserE").attr("selected", "selected")
        } else if (role.role.includes("admin")) {
            $("#selectRoleAdminE").attr("selected", "selected");
        }
    });
}

//по ивенту submit получим данные из формы, добавим роли, сформируем объект user, сконвертируем его в JSON, отправим PUT запрос
let editForm = document.getElementById("editForm");
editForm.addEventListener("submit", async (editUser) => {
    editUser.preventDefault()
    let editFormData = new FormData(editForm);
    let updatedUser = {roles: []};
    editFormData.forEach(function(value, key) {
        updatedUser[key] = value;
    });
    $("#roleE").val().forEach(value => {
        if (value.includes("user")) {
            updatedUser.roles.push(userRole)
        }
        if (value.includes("admin")) {
            updatedUser.roles.push(adminRole)
        }
    })
    const data = await fetch("http://localhost:8080/usersEdit", {method: "PUT", headers: {"Accept": "application/json", "Content-Type": "application/json; charset=UTF-8", "Referer": null}, body: JSON.stringify(updatedUser)}).catch((e) => console.error(e))
    formUsersTable();
    tabTrigger.show()
    $("#editModal").modal("hide");
});


////DELETE FORM
//по клику кнопки delete заполненим форму удаления пользователя, сохраним ID пользователя для передачи в DELETE метод
let deleteUserId;
async function deleteButton(userId) {
    deleteUserId = userId;
    let deleteURL = URL + "/" + userId;
    let user = await fetch(deleteURL).then(res => res.json());
    $('#idD').val(user.id);
    $("#loginD").val(user.login);
    $("#firstNameD").val(user.firstName);
    $("#lastNameD").val(user.lastName);
    $("#emailD").val(user.email);
    $("#passwordD").val(user.password);
    $("#selectRoleUserD").attr("selected", false);
    $("#selectRoleAdminD").attr("selected", false);
    let roles = user.roles;
    roles.forEach(role => {
        if (role.role.includes("user")) {
            $("#selectRoleUserD").attr("selected", "selected")
        } else if (role.role.includes("admin")) {
            $("#selectRoleAdminD").attr("selected", "selected");
        }
    });
}

//по ивенту submit отправим DELETE запрос
let deleteForm = document.getElementById("deleteModal")
deleteForm.addEventListener("submit", async (removeUser) => {
    await fetch(URL + "/" + deleteUserId, {method: 'DELETE'}).then(deletedUserId => deleteUser(deletedUserId));
    formUsersTable();
})

////NEW USER FORM
//по ивенту submit пользователя для передачи в POST метод
const newUserForm = document.getElementById("newUserForm")
newUserForm.addEventListener("submit",async (event) => {
    event.preventDefault();
    let newFormData = new FormData(newUserForm);
    let newUser = {roles: []};
    newFormData.forEach(function(value, key) {
        newUser[key] = value;
    });
    $("#roleN").val().forEach(value => {
        if (value.includes("user")) {
            newUser.roles.push(window.userRole)
        }
        if (value.includes("admin")) {
            newUser.roles.push(window.adminRole)
        }
    })
    const data = await fetch(URL, {method: "POST", headers: {"Accept": "application/json", "Content-Type": "application/json; charset=UTF-8", "Referer": null}, body: JSON.stringify(newUser)})
        .then(() => newUserForm.reset())
        .catch((e) => console.error(e))
    formUsersTable();
    tabTrigger.show()
});


//// FORM USER-INFO TAB FOR ADMIN PANEL
document.getElementById("user-panel").addEventListener("click", (show => {
    fetch(userURL).then(res => res.json()).then(data => document.getElementById("userInfo").innerHTML = formUserInfoTable(data));
    function formUserInfoTable(user) {
        let result = " ";
        result = `<tr><td>${user.id}</td>
                        <td>${user.login}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.email}</td><td>`;
        user.roles.forEach(role => {
            result += `<span>${role.role} </span>`
        });
        result += `</td></tr>`;
        return result;
    }
}))