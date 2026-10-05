const express = require('express');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE podcasts (id INT, title TEXT, category TEXT)");
    db.run("INSERT INTO podcasts VALUES (1, 'Ciberseguridad 101', 'Tech')");
});

app.post('/api/content/exclusive', (req, res) => {
    if (req.body.is_vip === true || req.body.is_vip === 'true') {
        res.status(200).send("ACCESO CONCEDIDO VIP.");
    } else {
        res.status(403).send("Error: Se requiere suscripción VIP.");
    }
});

app.post('/api/creators/register', (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = crypto.createHash('md5').update(password).digest('hex');
    res.status(201).send(`Creador registrado. MD5: ${hashedPassword}`);
});

app.get('/api/podcasts/search', (req, res) => {
    const query = req.query.q;
    const sql = "SELECT * FROM podcasts WHERE title LIKE '%" + query + "%'";
    db.all(sql, [], (err, rows) => {
        if (err) res.status(500).send(err.message);
        else res.json(rows);
    });
});

app.post('/api/users/recover', (req, res) => {
    const email = req.body.email;
    res.status(200).send(`Enlace: https://mediastream.local/reset-password/${email}`);
});

app.get('/api/system/status', (req, res) => {
    throw new Error("Falla crítica en el sistema. Exponiendo Express.");
});

app.listen(3000, () => console.log('API Vulnerable puerto 3000'));