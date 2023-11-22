import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  query,
  updateDoc,
} from "firebase/firestore";
import { database } from "../../firebase";

export const updateSettingsAction = async ({ data }) => {
  // Get a reference to the settings collection
  const settingsQuery = query(collection(database, "settings"), limit(1));

  // Query the single document in the collection
  const snapshot = await getDocs(settingsQuery);

  // If no documents exist, throw an error
  if (snapshot.empty) {
    throw new Error("No settings document found.");
  }

  // Get the document ID of the first (and only) document in the snapshot
  const docId = snapshot.docs[0].id;

  // Use the document ID to update the document
  const settingsDocRef = doc(database, "settings", docId);
  return await updateDoc(settingsDocRef, data);
};
export const readSettings = async () => {
  // Get a reference to the settings collection
  const settingsQuery = query(collection(database, "settings"), limit(1));

  // Query the single document in the collection
  const snapshot = await getDocs(settingsQuery);

  // If no documents exist, throw an error
  if (snapshot.empty) {
    throw new Error("No settings document found.");
  }

  // Return the data of the first (and only) document in the snapshot
  return snapshot.docs[0].data();
};
