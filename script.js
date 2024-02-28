const users = {
    user1: { password: 'user', balance: 0, coins: { Baselcoin: { amount: 4, price: 1.00 } } },
    user2: { password: 'user', balance: 0, coins: { Baselcoin: { amount: 5, price: 1.00 } } },
    user3: { password: 'user', balance: 0, coins: { Baselcoin: { amount: 10, price: 1.00 } } },
    admin: { password: 'admin', balance: 0, isAdmin: true }
};

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginContainer = document.querySelector('.login-container');
    const balanceContainer = document.getElementById('balanceContainer');
    const userNameElement = document.getElementById('userName');
    const coinsTableBody = document.getElementById('coinsTableBody');
    const adminForm = document.getElementById('adminForm'); // Neues Element für das Admin-Formular hinzugefügt
    const addUserButton = document.getElementById('addUser'); // Neuer Button für "Neuen Benutzer anlegen"

    // Logout-Button Funktionalität für den Admin-Bereich
    document.getElementById('logout').addEventListener('click', function() {
        loginContainer.style.display = 'block';
        balanceContainer.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        adminForm.style.display = 'none'; // Verstecke das Admin-Formular beim Abmelden
        addUserButton.style.display = 'none'; // Verstecke den "Neuen Benutzer anlegen"-Button beim Abmelden
    });

    // Überprüfung, ob der Benutzer existiert und das Passwort korrekt ist
    if (users[username] && users[username].password === password) {
        loginContainer.style.display = 'none';
        balanceContainer.style.display = 'block';
        userNameElement.textContent = username; // Setze den Namen des Benutzers

        // Fülle die Tabelle mit den Coin-Daten
        if (users[username].isAdmin) {
            // Wenn der Benutzer ein Admin ist, zeige nur den Kontostand an
            let balances = 'Kontostände:\n';
            for (const user in users) {
                if (!users[user].isAdmin) {
                    balances += `${user}: ${users[user].balance.toFixed(2)} Basel Coins\n`;
                }
            }
            coinsTableBody.innerHTML = `<tr><td colspan="4">${balances.replace(/\n/g, '<br>')}</td></tr>`;
            adminForm.style.display = 'block'; // Zeige das Admin-Formular an
            addUserButton.style.display = 'block'; // Zeige den "Neuen Benutzer anlegen"-Button für Admin an
        } else {
            // Fülle die Tabelle mit den Coin-Daten für den normalen Benutzer (Annahme: Nur Baselcoin existiert)
            const coinName = 'Baselcoin';
            const coinData = { amount: 1, price: 1.00 }; // Annahme: Ein Benutzer hat immer einen Baselcoin mit einer Anzahl von 1 und einem Preis von 1.00
            const tableRow = `<tr>
                                <td>${coinName}</td>
                                <td>${coinData.amount}</td>
                                <td>${coinData.price.toFixed(2)}</td>
                                <td>${(coinData.amount * coinData.price).toFixed(2)}</td>
                              </tr>`;
            coinsTableBody.innerHTML = tableRow;
            adminForm.style.display = 'none'; // Verstecke das Admin-Formular
            addUserButton.style.display = 'none'; // Verstecke den "Neuen Benutzer anlegen"-Button für normale Benutzer
        }
    } else {
        alert('Ungültiger Benutzername oder Passwort.');
    }

    // Logout-Button Funktionalität für den normalen Benutzer-Bereich
    document.getElementById('logout').addEventListener('click', function() {
        loginContainer.style.display = 'block';
        balanceContainer.style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        adminForm.style.display = 'none'; // Verstecke das Admin-Formular beim Abmelden
        addUserButton.style.display = 'none'; // Verstecke den "Neuen Benutzer anlegen"-Button beim Abmelden
    });
});

// Event Listener für den "Benutzer anlegen"-Button
document.getElementById('createUser').addEventListener('click', function() {
    const newUsername = document.getElementById('newUsername').value;
    const newPassword = document.getElementById('newPassword').value;

    // Überprüfe, ob der Benutzername bereits existiert
    if (users[newUsername]) {
        alert('Benutzername bereits vergeben. Bitte wählen Sie einen anderen.');
    } else {
        // Füge neuen Benutzer hinzu und gebe ihm 2 Baselcoins
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

        // Manuelle Anmeldung mit dem neuen Benutzer
        loginContainer.style.display = 'none';
        balanceContainer.style.display = 'block';
        userNameElement.textContent = newUsername; // Setze den Namen des neuen Benutzers

        // Fülle die Tabelle mit den Coin-Daten für den normalen Benutzer
        const coinData = users[newUsername].coins[coinName];
        const tableRow = `<tr>
                            <td>${coinName}</td>
                            <td>${coinData.amount}</td>
                            <td>${coinData.price.toFixed(2)}</td>
                            <td>${(coinData.amount * coinData.price).toFixed(2)}</td>
                          </tr>`;
        coinsTableBody.innerHTML = tableRow;
        adminForm.style.display = 'none'; // Verstecke das Admin-Formular
        addUserButton.style.display = 'none'; // Verstecke den "Neuen Benutzer anlegen"-Button für normale Benutzer
    }

const sessionTimeout = 1 * 60 * 1000; // 1 Minuten in Millisekunden
let idleTimeout; // Variable zur Speicherung des Idle-Timeout-Timers
let absoluteTimeout; // Variable zur Speicherung des absoluten Timeout-Timers

function startSession() {
    // Setze den Idle-Timeout-Timer beim Start der Sitzung
    idleTimeout = setTimeout(logout, sessionTimeout);

    // Setze den absoluten Timeout-Timer
    absoluteTimeout = setTimeout(logout, sessionTimeout + sessionTimeout); // Absolute Zeitüberschreitung nach doppelter Sitzungszeit
}

function resetSession() {
    // Wenn der Benutzer aktiv ist, setze den Idle-Timeout zurück
    clearTimeout(idleTimeout);
    
    // Setze den Idle-Timeout-Timer erneut
    idleTimeout = setTimeout(logout, sessionTimeout);
}

function logout() {
    // Hier kannst du die Aktionen für den Logout durchführen
    alert('Sitzung abgelaufen. Bitte erneut einloggen.');
    
    // Führe hier die Aktionen für den Logout durch, z.B. zurück zum Anmeldebildschirm
    // ...

    // Zurücksetzen der Timer und Anzeige des Anmeldebildschirms
    clearTimeout(idleTimeout);
    clearTimeout(absoluteTimeout);
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('balanceContainer').style.display = 'none';
}

// Füge Event Listener hinzu, um die Sitzung bei Benutzeraktivität zurückzusetzen
document.addEventListener('mousemove', resetSession);
document.addEventListener('keypress', resetSession);

// Starte die Sitzung beim Laden der Seite
startSession();

});

// ...
