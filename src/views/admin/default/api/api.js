import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

export const saveOrderToServer = async (order) => {
  try {
    const docRef = await addDoc(collection(db, 'orders'), order);
    return { id: docRef.id, ...order };
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const loadOrderFromServer = async () => {
  const q = query(collection(db, 'orders'));
  const querySnapshot = await getDocs(q);
  const orders = [];
  querySnapshot.forEach((doc) => {
    orders.push({ id: doc.id, ...doc.data() });
  });
  return orders;
};