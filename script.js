document.addEventListener('DOMContentLoaded', () => {
    const userList = document.getElementById('userList');
    const addUserBtn = document.getElementById('addUserBtn');
    const addModal = document.getElementById('addModal');
    const editModal = document.getElementById('editModal');
    const closeAdd = document.getElementById('closeAdd');
    const closeEdit = document.getElementById('closeEdit');

    let users = [];
    let selectedUserIndex = null;

    function fetchUsers() {
        fetch('http://localhost:3000/users')
            .then(response => response.json())
            .then(data => {
                users = data;
                renderUsers();
            })
            .catch(error => console.error('Error fetching users:', error));
    }

    function renderUsers() {
        userList.innerHTML = '';
        users.forEach((user, index) => {
            const li = document.createElement('li');
            li.className = 'user-card';
            li.innerHTML = `
                <div class="user-info">
                    <img src="${user.imageUrl}" alt="user image" />
                    <p><strong>${user.name}</strong></p>
                    <p>Email: ${user.email}</p>
                </div>
                <div class="user-actions">
                    <button onclick="openEditPopup(${index})">Edit</button>
                    <button onclick="deleteUser('${user._id}')">Delete</button>
                </div>
            `;
            userList.appendChild(li);
        });
    }

    window.openAddPopup = function() {
        addModal.style.display = 'block';
    };

    closeAdd.onclick = function() {
        addModal.style.display = 'none';
    };

    addUserBtn.onclick = openAddPopup;

    window.openEditPopup = function(index) {
        selectedUserIndex = index;
        const user = users[index];
        document.getElementById('editName').value = user.name;
        document.getElementById('editEmail').value = user.email;
        editModal.style.display = 'block';
    };

    closeEdit.onclick = function() {
        editModal.style.display = 'none';
    };

    document.getElementById('addForm').onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('addName').value;
        const email = document.getElementById('addEmail').value;
        const image = document.getElementById('addImage').files[0];
        
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (image) {
            formData.append('imageUrl', image);
        }

        fetch('http://localhost:3000/post', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            users.push(data);
            renderUsers();
            closeAdd.click();
        })
        .catch(error => console.error('Error adding user:', error));
    };

    document.getElementById('editForm').onsubmit = function(event) {
        event.preventDefault();
        const name = document.getElementById('editName').value;
        const email = document.getElementById('editEmail').value;
        const image = document.getElementById('editImage').files[0];

        const user = users[selectedUserIndex];
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        if (image) {
            formData.append('imageUrl', image);
        } else {
            formData.append('imageUrl', user.imageUrl); // keep the old image if none is uploaded
        }

        fetch(`http://localhost:3000/update/${user._id}`, {
            method: 'PATCH',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            users[selectedUserIndex] = data;
            renderUsers();
            closeEdit.click();
        })
        .catch(error => console.error('Error updating user:', error));
    };

    window.deleteUser = function(userId) {
        fetch(`http://localhost:3000/delete/${userId}`, {
            method: 'DELETE',
        })
        .then(() => {
            users = users.filter(user => user._id !== userId);
            renderUsers();
        })
        .catch(error => console.error('Error deleting user:', error));
    };

    fetchUsers();
});
