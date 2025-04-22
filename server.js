const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Importar rutas
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, 'public')));

// Rutas API
app.use('/api', authRoutes);

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