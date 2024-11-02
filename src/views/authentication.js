import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

export default class Auth {
    constructor(firebaseConfig) {
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
    }

    async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            console.log("Inicio de sesión exitoso", user);
            return user;
        } catch (error) {
            console.error("Error en el inicio de sesión", error);
            throw error;
        }
    }

    async register(email, password) {
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            const user = userCredential.user;
            console.log("Registro exitoso", user);
            return user;
        } catch (error) {
            console.error("Error en el registro", error);
            throw error;
        }
    }
}