const userURL = 'http://localhost:8080/userInfo';

function getPage() {
    fetch(userURL).then(response => response.json()).then(user =>
        getInformation(user))
}

function getInformation(user) {

    document.getElementById('tableUser').innerHTML = `<tr>
            <td>${user.id}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.age}</td>
            <td>${user.email}</td>
            <td>${user.roles.map(r => r.role.replace('ROLE_', '')).join(' ')}</td>
        </tr>`;

    document.getElementById('navbarUser').innerHTML =
        `<b><span>${user.email}</span></b>
         <span>with roles:</span>
         <span>${user.roles.map(r => r.role.replace('ROLE_', '')).join(' ')}</span>`;

}

getPage();