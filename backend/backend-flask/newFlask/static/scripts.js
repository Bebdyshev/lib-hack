let selectedUserId = '';
let chatUsername = '';
let usersMap = {};  // Хранилище соответствий userId -> username

function loadUsers() {
    fetch('/users')  // Запрашиваем список пользователей
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';  // Очищаем предыдущий список
            data.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user.username;
                userItem.onclick = () => startChat(user.userId, user.username);
                usersMap[user.userId] = user.username;  // Сохраняем соответствие userId -> username
                usersList.appendChild(userItem);  // Добавляем каждого пользователя в список
            });
        })
        .catch(error => {
            console.error('Error loading users:', error);
        });
}

function startChat(userId, username) {
    selectedUserId = userId;
    chatUsername = username;
    document.getElementById('chat-username').textContent = username;
    document.getElementById('chat-section').style.display = 'block';

    fetch(`/messages/${userId}`)
        .then(response => response.json())
        .then(data => {
            const chatBox = document.getElementById('chat-box');
            chatBox.innerHTML = '';
            data.forEach(message => {
                const fromUsername = usersMap[message.from_user] || message.from_user;

                // Проверяем, является ли timestamp объектом Firestore Timestamp
                let timestamp = 'Unknown time';
                if (message.timestamp && message.timestamp.seconds) {
                    timestamp = new Date(message.timestamp.seconds * 1000).toLocaleString();  // Преобразуем timestamp в локальное время
                } else if (typeof message.timestamp === 'string') {
                    timestamp = message.timestamp;  // Если это уже строка
                }

                const messageDiv = document.createElement('div');
                messageDiv.textContent = `${fromUsername} (${timestamp}): ${message.message}`;  // Отображаем имя пользователя, время и сообщение
                chatBox.appendChild(messageDiv);
            });
        })
        .catch(error => {
            console.error('Error loading messages:', error);
        });
}

function searchUsers() {
    const searchInput = document.getElementById('search-input').value;
    if (!searchInput) {
        alert('Please enter a username to search.');
        return;
    }
    
    fetch(`/search_users?username=${encodeURIComponent(searchInput)}`)
        .then(response => response.json())
        .then(data => {
            const usersList = document.getElementById('users-list');
            usersList.innerHTML = '';  // Очистить предыдущий список
            data.forEach(user => {
                const userItem = document.createElement('li');
                userItem.textContent = user.username;
                userItem.onclick = () => startChat(user.userId, user.username);
                usersList.appendChild(userItem);
            });
        })
        .catch(error => {
            console.error('Error searching users:', error);
        });
}


function sendMessage() {
    const messageInput = document.getElementById('message-input');
    const message = messageInput.value;
    if (!message || !selectedUserId) {
        alert('Please enter a message and select a user.');
        return;
    }
    fetch('/send_message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to_user: selectedUserId,
            message: message,
        }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'Message sent successfully') {
            messageInput.value = '';
            startChat(selectedUserId, chatUsername);
        } else {
            console.error('Error sending message:', data.error);
        }
    })
    .catch(error => {
        console.error('Error sending message:', error);
    });
}
