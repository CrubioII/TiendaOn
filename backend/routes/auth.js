// frontend/js/auth.js

/**
 * =============================================
 * FUNCIÓN PARA REGISTRAR UN NUEVO USUARIO
 * =============================================
 * @param {string} email 
 * @param {string} password 
 */
async function registerUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Error en el registro");
        }

        // Registro exitoso
        alert("¡Registro exitoso! Por favor inicia sesión.");
        window.location.href = "login.html";

    } catch (error) {
        console.error("Error en registerUser:", error);
        alert(`Error: ${error.message}`);
    }
}

/**
 * =============================================
 * FUNCIÓN PARA INICIAR SESIÓN
 * =============================================
 * @param {string} email 
 * @param {string} password 
 */
async function loginUser(email, password) {
    try {
        const response = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Credenciales incorrectas");
        }

        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('userRole', data.role);

        // Redirigir según el rol
        if (data.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'customer.html';
        }

    } catch (error) {
        console.error("Error en loginUser:", error);
        alert(`Error: ${error.message}`);
    }
}

/**
 * =============================================
 * FUNCIÓN PARA CERRAR SESIÓN
 * =============================================
 */
function logoutUser() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

/**
 * =============================================
 * MANEJADORES DE EVENTOS PARA FORMULARIOS
 * =============================================
 */

// 1. Manejador para el formulario de REGISTRO
if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validaciones del frontend
        if (password !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        await registerUser(email, password);
    });
}

// 2. Manejador para el formulario de LOGIN
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        await loginUser(email, password);
    });
}

// 3. Manejador para el botón de LOGOUT
if (document.getElementById('logoutBtn')) {
    document.getElementById('logoutBtn').addEventListener('click', (e) => {
        e.preventDefault();
        logoutUser();
    });
}

/**
 * =============================================
 * FUNCIÓN PARA VERIFICAR AUTENTICACIÓN
 * (Usar en páginas protegidas)
 * =============================================
 */
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');

    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Verificar token expirado (opcional)
    try {
        // Aquí podrías agregar lógica para verificar el token JWT
        return { isAuthenticated: true, role: userRole };
    } catch (error) {
        logoutUser();
        return { isAuthenticated: false };
    }
}

// Ejemplo de uso en páginas protegidas:
// document.addEventListener('DOMContentLoaded', () => {
//     const auth = checkAuth();
//     if (!auth.isAuthenticated) return;
// });