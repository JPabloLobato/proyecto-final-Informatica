const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

const USUARIOS_FILE = path.join(__dirname, '../data/usuarios.json');

// Función para leer el archivo de usuarios
function leerUsuarios() {
    try {
        // Verificar si el archivo existe
        if (fs.existsSync(USUARIOS_FILE)) {
            const data = fs.readFileSync(USUARIOS_FILE, 'utf8');
            return JSON.parse(data);
        }
        return [];
    } catch (error) {
        console.error("Error al leer usuarios:", error);
        return [];
    }
}

// Función para guardar en el archivo de usuarios
function guardarUsuarios(usuarios) {
    // Crear la carpeta data si no existe
    const dirPath = path.dirname(USUARIOS_FILE);
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }

    fs.writeFileSync(USUARIOS_FILE, JSON.stringify(usuarios, null, 2));
}

// Registrar un nuevo usuario
async function registrarUsuario(username, email, password) {
    const usuarios = leerUsuarios();

    // Verificar si el usuario o email ya existen
    const usuarioExiste = usuarios.some(u => u.username === username || u.email === email);
    if (usuarioExiste) {
        throw new Error('El usuario o correo ya están registrados');
    }

    // Hashear la contraseña
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Agregar nuevo usuario
    usuarios.push({
        username,
        email,
        password_hash
    });

    // Guardar usuarios actualizados
    guardarUsuarios(usuarios);

    return { success: true, message: 'Usuario registrado con éxito' };
}

// Verificar credenciales de un usuario
async function verificarUsuario(username, password) {
    const usuarios = leerUsuarios();

    // Buscar usuario por username o email
    const usuario = usuarios.find(u => u.username === username || u.email === username);

    if (!usuario) {
        throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña
    const coincide = await bcrypt.compare(password, usuario.password_hash);

    if (!coincide) {
        throw new Error('Contraseña incorrecta');
    }

    return { success: true, message: 'Inicio de sesión exitoso' };
}

module.exports = {
    registrarUsuario,
    verificarUsuario
};