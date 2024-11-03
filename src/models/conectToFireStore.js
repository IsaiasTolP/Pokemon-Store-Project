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
    this.auth = auth; // Asignar auth a una propiedad de la clase
  }

  // Método para verificar el estado de autenticación
  onAuthStateChanged(callback) {
    return onAuthStateChanged(this.auth, callback);
  }

  // Método para cerrar sesión
  async signOut() {
    try {
      await signOut(this.auth);
      console.log("Usuario desconectado");
    } catch (error) {
      console.error("Error al cerrar sesión: ", error);
    }
  }

  // Crear un nuevo documento asociado al usuario
  async create(data) {
    const user = this.auth.currentUser; // Obtiene el usuario actual
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    // Comprobar si ya existe un Pokémon con el mismo ID
    const existingQuery = query(this.collectionRef, where("id", "==", data.id), where("userId", "==", user.uid));
    const existingDocs = await getDocs(existingQuery);

    if (!existingDocs.empty) {
      console.warn(`Pokemon con ID ${data.id} ya existe en la base de datos.`);
      return null; // o puedes lanzar un error o retornar algún mensaje
    }

    // Agrega el ID del usuario a los datos
    const documentData = { ...data, userId: user.uid };
    try {
      const docRef = await addDoc(this.collectionRef, documentData);
      console.log("Documento escrito con ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
      throw e;
    }
  }

  // Leer todos los documentos
  async readAll() {
    const user = this.auth.currentUser; // Obtiene el usuario actual
    if (!user) {
      throw new Error("Usuario no autenticado");
    }

    try {
      // Consulta para obtener solo los documentos del usuario
      const q = query(this.collectionRef, where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      
      // Procesar los documentos obtenidos
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      console.log("Documentos:", dataList);
      return dataList; // Retorna la lista de documentos
    } catch (e) {
      console.error("Error obteniendo documentos: ", e);
      throw e; // Lanza el error para que pueda ser manejado externamente
    }
  }

  // Actualizar un documento por ID
  async update(id, data) {
    try {
      const docRef = doc(this.collectionRef, id);
      await updateDoc(docRef, data);
      console.log("Documento actualizado con ID: ", id);
    } catch (e) {
      console.error("Error actualizando documento: ", e);
    }
  }

  // Eliminar un documento por ID
  async delete(id) {
    console.log(typeof(id))
    try {
      const user = this.auth.currentUser; // Obtiene el usuario actual
      if (!user) {
          throw new Error("Usuario no autenticado");
      }
      // Busca el documento específico del usuario
      const q = query(this.collectionRef, where("id", "==", id), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
          // Si se encuentra el documento, eliminarlo
          const docRef = doc(this.collectionRef, querySnapshot.docs[0].id);
          await deleteDoc(docRef);
          console.log("Documento eliminado con ID: ", id);
      } else {
          console.warn(`No se encontró un Pokémon con ID: ${id} para el usuario actual.`);
          throw new Error("No se encontró el Pokémon para eliminar.");
      }
    } catch (e) {
        console.error("Error eliminando documento: ", e);
        throw e; // Lanza el error para manejarlo externamente si es necesario
    }
}

}

export default ConectToFirebase;