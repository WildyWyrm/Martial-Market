import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseconfig";

export async function obtenerProductos() {
  const productosRef = collection(db, "productos");
  const snapshot = await getDocs(productosRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}
