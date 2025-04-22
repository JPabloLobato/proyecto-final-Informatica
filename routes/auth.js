const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Registro
router.post('/register', async (req, res) => {
    try {
        const { name, username, password, email, phone, 'fecha-nacimiento': birthDate, address } = req.body;

        // Comprobar si el usuario ya existe
        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'El usuario o correo ya está registrado'
            });
        }

        // Crear nuevo usuario
        const user = new User({
            name,
            username,
            password,
            email,
            phone,
            birthDate,
            address
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: 'Usuario registrado correctamente',
            redirect: '/inicio'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al registrar usuario',
            error: error.message
        });
    }
});

// Inicio de sesión
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const user = await User.findOne({
            $or: [{ username }, { email: username }]
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Usuario o contraseña incorrectos'
            });
        }

        // Usuario autenticado
        res.status(200).json({
            success: true,
            message: 'Inicio de sesión exitoso',
            redirect: '/dashboard'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al iniciar sesión',
            error: error.message
        });
    }
});

module.exports = router;