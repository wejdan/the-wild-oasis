import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebase";
import { uploadeImg } from "../../utils";

export const updateCabin = async ({ id, data }) => {
  const newData = { ...data };
  delete newData.image;

  if (data.image) {
    console.log("data.image", data.image);
    const imgurl = await uploadeImg("cabins", id, data.image);
    newData.image = imgurl;
    console.log("imgurl", imgurl);
  }
  let docRef = doc(database, "cabins", id);
  console.log(docRef, id, data);
  return await updateDoc(docRef, newData);
};
export const deleteCabin = async ({ id }) => {
  let docRef = doc(database, "cabins", id);
  console.log(docRef, id);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error(`The cabin with ID ${id} does not exist.`);
  }

  try {
    await deleteDoc(docRef);
  } catch (error) {
    // If deletion fails, throw a custom error message
    console.log(error);
    throw new Error(
      `Failed to delete the cabin with ID ${id}. Reason: ${error.message}`
    );
  }
};

export const getCabins = async () => {
  const collectionRef = collection(database, `cabins`);
  const q = query(collectionRef, orderBy("createdAt", "desc"));
  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });
  return results;
};
export const isNameAvailable = async (name) => {
  const usersCollectionRef = collection(database, "cabins");

  try {
    // Query the collection to check if a user with the specified username exists
    const q = query(usersCollectionRef, where("name", "==", name));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      // User with the specified username already exists, so we throw an error
      throw new Error("Name is already taken choose another name!");
    } else {
      // Username is available, return true
      return true;
    }
  } catch (error) {
    // Handle any errors that occur during the Firestore operation
    console.error("Error checking username existence:", error.message);
    throw error; // Re-throw the error to handle it in the calling code if needed
  }
};
export const addCabin = async ({ cabinData }) => {
  const { image, ...data } = cabinData;
  let newDocRef;

  try {
    await isNameAvailable(data.name);
    const docRef = collection(database, "cabins");
    const createdAt = new Date();
    const dataWithTimestamp = {
      ...data,
      createdAt: Timestamp.fromDate(createdAt),
    };

    newDocRef = await addDoc(docRef, dataWithTimestamp);

    // Get the ID of the new document
    const newDocId = newDocRef.id;

    try {
      // Use the new ID to upload the image
      const imgurl = await uploadeImg("cabins", newDocId, image);
      await updateDoc(newDocRef, { image: imgurl });
    } catch (imgError) {
      // If image upload fails, delete the previously created cabin document
      await deleteDoc(newDocRef);
      throw new Error(
        `Failed to upload the image. Reason: ${imgError.message}`
      );
    }
  } catch (error) {
    throw error; // Re-throw the error to handle it in the calling code if needed
  }
};

export const duplicateCabin = async ({ cabinData }) => {
  const docRef = collection(database, "cabins");
  const createdAt = new Date();

  const dataWithTimestamp = {
    ...cabinData,
    name: `Copy of ${cabinData.name}`,
    createdAt: Timestamp.fromDate(createdAt),
  };
  return await addDoc(docRef, dataWithTimestamp);
};
