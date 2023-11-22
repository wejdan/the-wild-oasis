import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { database } from "../../firebase";

export const getGuests = async () => {
  const collectionRef = collection(database, `guests`);
  const querySnapshot = await getDocs(collectionRef);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
};
