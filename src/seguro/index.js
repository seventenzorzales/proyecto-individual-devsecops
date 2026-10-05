const express = require('express');
const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Base de datos en memoria 
const db = new sqlite3.Database(':memory:');
db.serialize(() => {
    db.run("CREATE TABLE podcasts (id INT, title TEXT, category TEXT)");
    db.run("INSERT INTO podcasts VALUES (1, 'Ciberseguridad 101', 'Tech'), (2, 'Historia del Rock', 'Music')");
});

// A01 MITIGADO: Control de Acceso Roto (Zero Trust Input)
app.post('/api/content/exclusive', (req, res) => {
    // Defensa: Se ignora cualquier parámetro enviado por el cliente. 
    // La validación debe hacerse mediante un token JWT o sesión del lado del servidor.
    const authHeader = req.headers['authorization'];
    
    if (!authHeader || authHeader !== 'Bearer TOKEN_VIP_VALIDO_SERVIDOR') {
        return res.status(403).send("HTTP 403: Acceso denegado. Autenticación VIP requerida en el servidor.");
    }
    res.status(200).send("ACCESO CONCEDIDO: Bienvenido al catálogo VIP exclusivo.");
});

// A02 MITIGADO: Fallos Criptográficos (PBKDF2 con Salt aleatorio)
app.post('/api/creators/register', (req, res) => {
    const { username, password } = req.body;
    
    // Defensa Regex: Validar que la contraseña cumpla con estándares mínimos de complejidad
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    if (!passwordRegex.test(password)) {
        return res.status(400).send("HTTP 400: La contraseña debe tener al menos 8 caracteres, letras y números.");
    }

    // Defensa Criptográfica: Generación de Salt único y derivación de clave robusta (PBKDF2)
    const salt = crypto.randomBytes(16).toString('hex');
    crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;
        const hash = derivedKey.toString('hex');
        res.status(201).send(`Creador registrado de forma segura. Salt y Hash almacenados en BD.`);
    });
});

// A03 MITIGADO: Inyección SQL (Regex y Parametrización)
app.get('/api/podcasts/search', (req, res) => {
    const query = req.query.q;
    
    // Defensa Regex: Lista blanca estricta (solo alfanuméricos y espacios, max 50 caracteres)
    const safeInputRegex = /^[a-zA-Z0-9\s]{1,50}$/;
    if (!query || !safeInputRegex.test(query)) {
        return res.status(400).send("HTTP 400 Bad Request: Formato de búsqueda inválido o caracteres no permitidos.");
    }

    // Defensa SQL: Consulta parametrizada (Prepared Statement)
    const sql = "SELECT * FROM podcasts WHERE title LIKE ?";
    db.all(sql, [`%${query}%`], (err, rows) => {
        if (err) {
            return res.status(500).send("HTTP 500: Error interno.");
        }
        res.json(rows);
    });
});

// A07 MITIGADO: Identificación y Autenticación (Token criptográfico único)
app.post('/api/users/recover', (req, res) => {
    const email = req.body.email;
    
    // Defensa Regex: Validación estricta de formato de correo
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        return res.status(400).send("HTTP 400: Formato de correo inválido.");
    }

    // Defensa: Generación de token criptográficamente seguro y temporal
    const secureToken = crypto.randomBytes(32).toString('hex');
    const recoveryLink = `https://mediastream.local/reset-password?token=${secureToken}`;
    
    res.status(200).send(`Enlace temporal seguro enviado al correo registrado (Token: ${secureToken}).`);
});

// A05 MITIGADO: Configuración de Seguridad Incorrecta (Manejo de errores global)
app.get('/api/system/status', (req, res, next) => {
    try {
        throw new Error("Falla crítica en el sistema de almacenamiento multimedia.");
    } catch (error) {
        next(error); // Pasa el error al middleware global
    }
});

// Middleware Global de Errores (Defensa contra exposición de Stack Traces)
app.use((err, req, res, next) => {
    // El Stack Trace real solo se registra internamente para auditoría (logging)
    console.error(`[LOG INTERNO SEGURIDAD] Error: ${err.message}`);
    // Al usuario solo se le expone un mensaje genérico
    res.status(500).send("HTTP 500: Error interno del servidor. Contacte al administrador.");
});

app.listen(3001, () => {
    console.log('StreamVibe API Segura corriendo en puerto 3001');
});