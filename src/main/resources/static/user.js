function createRow(user) {
    const tr = document.createElement('tr');
    tr.dataset.userid = user.id;

    tr.innerHTML = `
        <td>${user.id}</td>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.age}</td>
        <td>${user.username}</td>
        <td>${user.roles.map(r => r.name.replace('ROLE_', '')).join(', ')}</td>
    `;
    return tr;
}

function fillTable(users) {
    const tbody = document.getElementById('userTableBody');
    tbody.innerHTML = '';

    users.forEach(user => {
        const row = createRow(user);
        tbody.appendChild(row);
    });
}

function updateHeader(user) {
    document.getElementById('header-email').textContent = user.username;
    document.getElementById('header-roles').textContent = user.roles.map(r => r.name.replace('ROLE_', '')).join(', ');
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
