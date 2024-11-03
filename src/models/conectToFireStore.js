import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDL4RiEmTV8XrHu2ZwjJ1KMCFWNBk1AnFc",
  authDomain: "compra-pokemon-74d5c.firebaseapp.com",
  projectId: "compra-pokemon-74d5c",
  storageBucket: "compra-pokemon-74d5c.appspot.com",
  messagingSenderId: "556323015298",
  appId: "1:556323015298:web:0e3df360e1ecbe5d79c29b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);
const auth = getAuth(app);

class ConectToFirebase {
  constructor() {
    this.collectionRef = collection(db, "pokemon");
    this.buyCollection = collection(db, "compras")
    this.auth = auth;
  }

  getCurrentUser() {
    return this.auth.currentUser
  }

  // Método para verificar el estado de autenticación
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Método para cerrar sesión
  async signOut() {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  }

  // Crear un nuevo documento asociado al usuario
  async create(data) {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    // Comprobar si ese pokemon ya esta en la lista de deseos
    const existingQuery = query(this.collectionRef, where("id", "==", data.id), where("userId", "==", user.uid));
    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      console.warn(`Pokemon con ID ${data.id} ya existe en la base de datos.`);
      return null;
    }

    try {
      const docRef = await addDoc(this.collectionRef, data);
      return docRef.id;
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
      throw e;
    }
  }

  async createPurchase(data){
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }
    try {
      const docRef = await addDoc(this.buyCollection, data);
      return docRef.id;
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
      throw e;
    }
  }

  // Recupera la lista de deseos del usuario
  async readAll() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      const q = query(this.collectionRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return dataList;
    } catch (e) {
      console.error("Error obteniendo documentos: ", e);
      throw e;
    }
  }
  // Recupera todas las compras del usuario
  async readAllPurchases() {
    const user = this.auth.currentUser;
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      const q = query(this.buyCollection, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return dataList;
    } catch (e) {
      console.error("Error obteniendo documentos: ", e);
      throw e;
    }
  }

  // Eliminar un documento por ID
  async delete(id) {
    try {
      const user = this.auth.currentUser;
      if (!user) {
          throw new Error("Usuario no autenticado");
      }
      const q = query(this.collectionRef, where("id", "==", id), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          const docRef = doc(this.collectionRef, querySnapshot.docs[0].id);
          await deleteDoc(docRef);
      } else {
          console.warn(`No se encontró un Pokémon con ID: ${id} para el usuario actual.`);
          throw new Error("No se encontró el Pokémon para eliminar.");
      }
    } catch (e) {
        console.error("Error eliminando documento: ", e);
        throw e;
    }
}

}

export default ConectToFirebase;