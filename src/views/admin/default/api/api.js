import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, doc, setDoc, deleteDoc } from 'firebase/firestore';

export const saveOrderToServer = async (order) => {
  try {
    console.log('order', order);
    const docRef = await setDoc(doc(db, 'orders', order.name), order);
    return { id: docRef.id, ...order };
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const loadOrderFromServer = async () => {
  try {
    const q = query(collection(db, 'orders'));
    const querySnapshot = await getDocs(q);
    const orders = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });
    return orders;
  } catch (e) {
    console.error('Error loading documents: ', e);
  }
};

export const deleteOrderFromServer = async (orderName) => {
  try {
    await deleteDoc(doc(db, 'orders', orderName));
    console.log(`Order ${orderName} deleted successfully`);
  } catch (e) {
    console.error('Error deleting document: ', e);
  }
};