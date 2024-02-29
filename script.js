const users = {
    eins: { password: 'user', balance: 2, coins: { Baselcoin: { amount: 2, price: 1.00 } } },
    zwei: { password: 'user', balance: 2, coins: { Baselcoin: { amount: 2, price: 1.00 } } },
    drei: { password: 'user', balance: 2, coins: { Baselcoin: { amount: 2, price: 1.00 } } },
    admin: { password: 'admin', balance: 0, isAdmin: true }
};

// Restlicher Code bleibt unverändert


const logMessages = [];

function logEvent(eventType, username, action) {
    const timestamp = new Date().toLocaleString();
    const logMessage = `${timestamp} - ${eventType} - Benutzer: ${username} - Aktion: ${action}`;
    logMessages.push(logMessage);
    console.log(logMessage);
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Überprüfung, ob der Benutzername und das Passwort nur Buchstaben enthalten
    if (!isValidInput(username) || !isValidInput(password)) {
        alert('Ungültige Zeichen im Benutzernamen oder Passwort. Bitte verwenden Sie nur Buchstaben.');
        return;
    }

// Funktion zum Überprüfen, ob der Text nur Buchstaben enthält
function isValidInput(text) {
    const regex = /^[a-zA-Z]+$/;
    return regex.test(text);
}

    const loginContainer = document.querySelector('.login-container');
    const balanceContainer = document.getElementById('balanceContainer');
    const userNameElement = document.getElementById('userName');
    const coinsTableBody = document.getElementById('coinsTableBody');
    const adminForm = document.getElementById('adminForm');
    const addUserButton = document.getElementById('addUser');

    document.getElementById('logout').addEventListener('click', function() {
        loginContainer.style.display = 'block';
        balanceContainer.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        adminForm.style.display = 'none';
        addUserButton.style.display = 'none';
    });

    if (users[username] && users[username].password === password) {
        loginContainer.style.display = 'none';
        balanceContainer.style.display = 'block';
        userNameElement.textContent = username;

        if (users[username].isAdmin) {
            let balances = 'Kontostände:\n';
            for (const user in users) {
                if (!users[user].isAdmin) {
                    balances += `${user}: ${users[user].balance.toFixed(2)} Basel Coins\n`;
                }
            }
            coinsTableBody.innerHTML = `<tr><td colspan="4">${balances.replace(/\n/g, '<br>')}</td></tr>`;
            adminForm.style.display = 'block';
            addUserButton.style.display = 'block';
        } else {
            const coinName = 'Baselcoin';
            const coinData = { amount: 3, price: 1.00 };
            const tableRow = `<tr>
                                <td>${coinName}</td>
                                <td>${coinData.amount}</td>
                                <td>${coinData.price.toFixed(2)}</td>
                                <td>${(coinData.amount * coinData.price).toFixed(2)}</td>
                              </tr>`;
            coinsTableBody.innerHTML = tableRow;
            adminForm.style.display = 'none';
            addUserButton.style.display = 'none';
        }
    } else {
        alert('Ungültiger Benutzername oder Passwort.');
    }

    document.getElementById('logout').addEventListener('click', function() {
        loginContainer.style.display = 'block';
        balanceContainer.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        adminForm.style.display = 'none';
        addUserButton.style.display = 'none';
    });
});

document.getElementById('createUser').addEventListener('click', function() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Überprüfung, ob der Benutzername und das Passwort nur Buchstaben enthalten
    if (!isValidInput(newUsername) || !isValidInput(newPassword)) {
        alert('Ungültige Zeichen im Benutzernamen oder Passwort. Bitte verwenden Sie nur Buchstaben.');
        return;
    }

    if (users[newUsername]) {
        alert('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
    } else {
        const coinName = 'Baselcoin';
        const initialAmount = 2;
        const pricePerCoin = 1.00;

        users[newUsername] = {
            password: newPassword,
            balance: initialAmount * pricePerCoin,
            coins: {
                [coinName]: { amount: initialAmount, price: pricePerCoin }
            }
        };

        alert(`Benutzer ${newUsername} wurde erfolgreich angelegt.`);

        loginContainer.style.display = 'none';
        balanceContainer.style.display = 'block';
        userNameElement.textContent = newUsername;

        const coinData = users[newUsername].coins[coinName];
        const tableRow = `<tr>
                            <td>${coinName}</td>
                            <td>${coinData.amount}</td>
                            <td>${coinData.price.toFixed(2)}</td>
                            <td>${(coinData.amount * coinData.price).toFixed(2)}</td>
                          </tr>`;
        coinsTableBody.innerHTML = tableRow;
        adminForm.style.display = 'none';
        addUserButton.style.display = 'none';
    }
});

const inactivityTimeout = 5 * 60 * 1000;
let inactivityTimer;

function startInactivityTimer() {
    inactivityTimer = setTimeout(() => {
        logEvent('INACTIVITY_TIMEOUT', currentUsername, 'Inaktivität - automatischer Logout');
        logout();
    }, inactivityTimeout);
}

function resetInactivityTimer() {
    clearTimeout(inactivityTimer);
    startInactivityTimer();
}

document.addEventListener('mousemove', () => resetInactivityTimer());
document.addEventListener('keypress', () => resetInactivityTimer());

function logout() {
    logEvent('LOGOUT', currentUsername, 'Benutzer abgemeldet');
    clearTimeout(inactivityTimer);
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('balanceContainer').style.display = 'none';
}



const authenticatedUsername = 'tatsächlicherBenutzername';
startSession(authenticatedUsername);
startInactivityTimer();
