function createRow(user) {
    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.textContent = user.id;
    tr.appendChild(idTd);

    const firstNameTd = document.createElement("td");
    firstNameTd.textContent = user.firstName;
    tr.appendChild(firstNameTd);

    const lastNameTd = document.createElement("td");
    lastNameTd.textContent = user.lastName;
    tr.appendChild(lastNameTd);

    const ageTd = document.createElement("td");
    ageTd.textContent = user.age;
    tr.appendChild(ageTd);

    const emailTd = document.createElement("td");
    emailTd.textContent = user.username;
    tr.appendChild(emailTd);

    const rolesTd = document.createElement("td");
    if (Array.isArray(user.roles)) {
        rolesTd.textContent = user.roles.map(role => role.name ? role.name : role).join(", ");
    } else {
        rolesTd.textContent = user.roles || "";
    }
    tr.appendChild(rolesTd);

    return tr;
}

function fillTable(users) {
    const tbody = document.querySelector("tbody");
    tbody.innerHTML = "";

    users.forEach(user => {
        const row = createRow(user);
        tbody.appendChild(row);
    });
}

function updateHeader(user) {
    const headerEmail = document.getElementById("header-email");
    const headerRoles = document.getElementById("header-roles");

    headerEmail.textContent = user.username || "";
    if (Array.isArray(user.roles)) {
        headerRoles.textContent = user.roles.map(role => role.name ? role.name : role).join(", ");
    } else {
        headerRoles.textContent = user.roles || "";
    }
}
fetch('/api/user')
    .then(response => {
        if (!response.ok) {
            throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        return response.json();
    })
    .then(userData => {
        if (Array.isArray(userData)) {
            fillTable(userData);
            if (userData.length > 0) {
                updateHeader(userData[0]);
            }
        } else {
            fillTable([userData]);
            updateHeader(userData);
        }
    })
    .catch(error => {
        console.error('Ошибка при загрузке пользователя:', error);
    });
