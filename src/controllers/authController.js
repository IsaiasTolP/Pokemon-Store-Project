import Auth from "../views/authentication.js";

// Tu configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDL4RiEmTV8XrHu2ZwjJ1KMCFWNBk1AnFc",
    authDomain: "compra-pokemon-74d5c.firebaseapp.com",
    projectId: "compra-pokemon-74d5c",
    storageBucket: "compra-pokemon-74d5c.appspot.com",
    messagingSenderId: "556323015298",
    appId: "1:556323015298:web:0e3df360e1ecbe5d79c29b"
};

// Crea una instancia de Auth
const auth = new Auth(firebaseConfig);

// Manejo de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const user = await auth.login(email, password);
        alert('Inicio de sesión exitoso');
        
        // Redirigir a index.html
        window.location.href = 'index.html';
        
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});

// Manejo de registro de usuario
document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('newEmail').value;
    const password = document.getElementById('newPassword').value;

    try {
        const user = await auth.register(email, password);
        alert('Registro exitoso');
        // Redirige a otra página o realiza otra acción
    } catch (error) {
        alert(`Error: ${error.message}`);
    }
});