const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Por favor, usa un correo electrónico válido']
    },
    phone: {
        type: String,
        trim: true
    },
    birthDate: {
        type: Date
    },
    address: {
        type: String,
        trim: true
    },
    registeredAt: {
        type: Date,
        default: Date.now
    }
});

// Encriptar contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;