import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

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

class ConectToFirebase {
  constructor() {
    this.collectionRef = collection(db, "pokemon");
  }

  // Crear un nuevo documento
  async create(data) {
    try {
      const docRef = await addDoc(this.collectionRef, data);
      console.log("Documento escrito con ID: ", docRef.id);
      return docRef.id;
    } catch (e) {
      console.error("Error añadiendo documento: ", e);
    }
  }

  // Leer todos los documentos
  async readAll() {
    try {
      const querySnapshot = await getDocs(this.collectionRef);
      const dataList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("Documentos:", dataList);
      return dataList;
    } catch (e) {
      console.error("Error obteniendo documentos: ", e);
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
    try {
      const docRef = doc(this.collectionRef, id);
      await deleteDoc(docRef);
      console.log("Documento eliminado con ID: ", id);
    } catch (e) {
      console.error("Error eliminando documento: ", e);
    }
  }
}

export default ConectToFirebase;
