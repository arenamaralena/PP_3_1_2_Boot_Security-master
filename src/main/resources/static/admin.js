const apiUrl = '/api/admin';

async function fetchRoles() {
    const response = await fetch(apiUrl + '/roles');
    if (!response.ok) throw new Error('Failed to load roles');
    return await response.json();
}

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
        <td>
            <button class="btn btn-info btn-sm edit-btn" data-id="${user.id}">Edit</button>
            <button class="btn btn-danger btn-sm delete-btn" data-id="${user.id}">Delete</button>
        </td>
    `;
    return tr;
}

async function loadUsers() {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error('Failed to load users');
    const users = await response.json();

    const tbody = document.getElementById('usersTableBody');
    tbody.innerHTML = '';
    users.forEach(user => tbody.appendChild(createRow(user)));

    if (users.length > 0) {
        updateHeader(users[0]);
    }
}

function updateHeader(user) {
    document.getElementById('header-email').textContent = user.username;
    document.getElementById('header-roles').textContent = user.roles.map(r => r.name.replace('ROLE_', '')).join(', ');
}

async function fillRolesSelect(selectElement) {
    const roles = await fetchRoles();
    selectElement.innerHTML = '';
    roles.forEach(role => {
        const option = document.createElement('option');
        option.value = role.id;
        option.textContent = role.name.replace('ROLE_', '');
        selectElement.appendChild(option);
    });
}

document.getElementById('newUserForm').addEventListener('submit', async e => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const age = +document.getElementById('age').value;
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rolesSelect = document.getElementById('roles');
    const selectedRoles = Array.from(rolesSelect.selectedOptions).map(opt => ({ id: +opt.value }));

    const user = { firstName, lastName, age, username, password, roles: selectedRoles };

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    });

    if (response.ok) {
        await loadUsers();
        e.target.reset();
    } else {
        alert('Failed to add user');
    }
});

document.getElementById('usersTableBody').addEventListener('click', async e => {
    if (e.target.classList.contains('edit-btn')) {
        const userId = e.target.dataset.id;
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) {
            alert('Failed to fetch user');
            return;
        }
        const user = await response.json();

        document.getElementById('modalUserId').value = user.id;
        document.getElementById('modalUserIdDisplay').value = user.id;
        document.getElementById('modalFirstName').value = user.firstName;
        document.getElementById('modalLastName').value = user.lastName;
        document.getElementById('modalAge').value = user.age;
        document.getElementById('modalUsername').value = user.username;

        const modalRolesSelect = document.getElementById('modalRoles');
        await fillRolesSelect(modalRolesSelect);

        Array.from(modalRolesSelect.options).forEach(option => {
            option.selected = user.roles.some(role => role.id === +option.value);
        });

        const editModal = new bootstrap.Modal(document.getElementById('editUserModal'));
        editModal.show();
    }

    if (e.target.classList.contains('delete-btn')) {
        const userId = e.target.dataset.id;
        const response = await fetch(`${apiUrl}/${userId}`);
        if (!response.ok) {
            alert('Failed to fetch user');
            return;
        }
        const user = await response.json();

        document.getElementById('deleteModalUserId').value = user.id;
        document.getElementById('deleteModalUserIdDisplay').value = user.id;
        document.getElementById('deleteModalFirstName').value = user.firstName;
        document.getElementById('deleteModalLastName').value = user.lastName;
        document.getElementById('deleteModalAge').value = user.age;
        document.getElementById('deleteModalUsername').value = user.username;

        const modalRolesSelect = document.getElementById('deleteModalRoles');
        await fillRolesSelect(modalRolesSelect);

        Array.from(modalRolesSelect.options).forEach(option => {
            option.selected = user.roles.some(role => role.id === +option.value);
        });

        const deleteModal = new bootstrap.Modal(document.getElementById('deleteUserModal'));
        deleteModal.show();

        document.getElementById('confirmDeleteBtn').onclick = async () => {
            const delResponse = await fetch(`${apiUrl}/${user.id}`, {
                method: 'DELETE'
            });
            if (delResponse.ok) {
                await loadUsers();
                deleteModal.hide();
            } else {
                alert('Failed to delete user');
            }
        };
    }
});

document.getElementById('editUserForm').addEventListener('submit', async e => {
    e.preventDefault();
    const userId = document.getElementById('modalUserId').value;
    const userDetails = {
        firstName: document.getElementById('modalFirstName').value,
        lastName: document.getElementById('modalLastName').value,
        age: document.getElementById('modalAge').value,
        username: document.getElementById('modalUsername').value,
        roles: Array.from(document.getElementById('modalRoles').selectedOptions).map(option => ({ id: option.value }))
    };

    const response = await fetch(`${apiUrl}/${userId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userDetails)
    });

    if (response.ok) {
        await loadUsers();
        const editModal = bootstrap.Modal.getInstance(document.getElementById('editUserModal'));
        editModal.hide();
    } else {
        alert('Failed to update user');
    }
});

window.addEventListener('DOMContentLoaded', async () => {
    await loadUsers();

    const rolesSelect = document.getElementById('roles');
    await fillRolesSelect(rolesSelect);
});
