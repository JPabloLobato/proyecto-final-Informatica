const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const fs = require('fs'); // Importamos fs

// Cargar variables de entorno
dotenv.config();

// Importar funciones de gestión de usuarios
const { registrarUsuario, verificarUsuario } = require('./routes/gestionUsuarios');

const app = express();
const PORT = process.env.PORT || 3001;

// Crear la carpeta data si no existe
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
}

// Crear el archivo de usuarios vacío si no existe
const usuariosFile = path.join(dataDir, 'usuarios.json');
if (!fs.existsSync(usuariosFile)) {
    fs.writeFileSync(usuariosFile, JSON.stringify([]));
}

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.post('/api/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const resultado = await registrarUsuario(username, email, password);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const resultado = await verificarUsuario(username, password);
        res.json(resultado);
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
});

// Redirecciones para SPA
app.get('/inicio', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

app.get('/registro', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'registro.html'));
});

// Ruta por defecto
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inicio.html'));
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});