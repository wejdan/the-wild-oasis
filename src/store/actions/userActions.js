import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  setDoc,
  doc,
  getDoc,
  collection,
  where,
  query,
  getDocs,
  updateDoc,
  addDoc,
} from "firebase/firestore";
import bcrypt from "bcryptjs";
import { getImageUrl, uploadeImg } from "../../utils";
import { auth, database, functions } from "../../firebase";
import { httpsCallable } from "firebase/functions";

const createUserFunction = httpsCallable(functions, "createUser");
const updateUserPassword = httpsCallable(functions, "updateUserPassword");

export async function createNewUser(email, password, name) {
  try {
    const result = await createUserFunction({ email, password, name });
    const uid = result.data.uid;
    console.log(`User created with UID: ${uid}`);
    return uid;
  } catch (error) {
    console.error(`Error calling createUser: ${error.message}`);
    throw error; // or handle it in another way
  }
}

// export const isUsernameAvailable = async (username) => {
//   const usersCollectionRef = collection(database, "users");

//   try {
//     // Query the collection to check if a user with the specified username exists
//     const q = query(usersCollectionRef, where("name", "==", username));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       // User with the specified username already exists, so we throw an error
//       return false;
//     } else {
//       // Username is available, return true
//       return true;
//     }
//   } catch (error) {
//     // Handle any errors that occur during the Firestore operation
//     console.error("Error checking username existence:", error.message);
//     throw error; // Re-throw the error to handle it in the calling code if needed
//   }
// };

// export const registerUser = async (email, password, name) => {
//   try {
//     // Check if user already exists
//     const usersRef = collection(database, "users");
//     const q = query(usersRef, where("email", "==", email));
//     const querySnapshot = await getDocs(q);

//     if (!querySnapshot.empty) {
//       throw new Error("User already exists with this email.");
//     }

//     // Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Store user in Firestore
//     const directory = "users"; // Replace with your directory name
//     const imageName = "default-avatar-profile.png"; // Replace with your image name

//     const avatar = await getImageUrl(directory, imageName);
//     const newUser = {
//       email,
//       password: hashedPassword,
//       name,
//       avatar,
//     };

//     const docRef = await addDoc(usersRef, newUser);
//     console.log("User added with ID:", docRef.id);
//   } catch (error) {
//     console.error("Error registering user:", error);
//     throw error; // or handle it as per your requirement
//   }
// };

export const authenticateUser = async (email, password) => {
  try {
    // Retrieve user with given email
    console.log("authenticateUser", email, password);
    const usersRef = collection(database, "users");
    const q = query(usersRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      throw new Error("No user found with this email.");
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    // Compare provided password with stored hashed password
    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    console.log("isPasswordCorrect", isPasswordCorrect);

    if (!isPasswordCorrect) {
      throw new Error("Incorrect password.");
    }

    console.log("User logged in successfully.");
    return { userId: userDoc.id, userData: userData }; // or whatever you want to return on successful login
  } catch (error) {
    console.error("Error logging in:", error);
    throw error; // or handle it as per your requirement
  }
};

export const signout = () => {
  signOut(auth).catch((error) => console.log("Error logging out: ", error));
};
export const signUp = async (email, password, name) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);

    const { uid } = result.user;

    await createUser(email, uid, name);
  } catch (error) {
    const errorCode = error.code;
    console.log(error);
    let message = "Something went wrong";
    if (errorCode == "auth/email-already-in-use") {
      message = "This email already in use";
    }
    throw new Error(message);
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    console.log(error);
    const errorCode = error.code;
    let message = "Something went wrong";
    if (
      errorCode === "auth/wrong-password" ||
      errorCode === "auth/user-not-found"
    ) {
      message = "the username or password was incorrect";
    }
    throw new Error(message);
  }
};
const createUser = async (email, userId, name) => {
  console.log("createUser", email, userId);
  const directory = "profileImages"; // Replace with your directory name
  const imageName = "default-avatar-profile.png"; // Replace with your image name

  const imgUrl = await getImageUrl(directory, imageName);

  const userData = {
    email,
    uid: userId,
    name,
    profileImg: imgUrl,
    signUpDate: new Date().toISOString(),
  };
  console.log("createUser", userData);

  const docRef = doc(database, "users", userId);
  await setDoc(docRef, userData);
  return userData;
};

export const getUserData = async (userId) => {
  let docRef = doc(database, "users", userId);
  const docSnap = await getDoc(docRef);
  return { id: userId, ...docSnap.data() };
};

export const updateUserData = async ({ id, data }) => {
  const { avatar, password, confirmPassword, ...newData } = data;

  if (data.password) {
    try {
      // Assuming updateUserPassword is an existing function that updates the password
      await updateUserPassword({ uid: id, newPassword: data.password });
    } catch (error) {
      // Rethrow the error with additional context or throw a new error
      throw new Error(`Failed to update password: ${error.message}`);
    }
  }

  if (data.avatar) {
    console.log("data.avatar", data.avatar);
    try {
      const imgurl = await uploadeImg("users", id, data.avatar);
      newData.avatar = imgurl;
    } catch (error) {
      // Handle or log the error for the image upload
      console.error("Error uploading image:", error);
      // Optionally rethrow or handle this error differently
      throw new Error(`Failed to uploade image: ${error.message}`);
    }
  }

  let docRef = doc(database, "users", id);
  console.log("newData", newData);

  try {
    await updateDoc(docRef, newData);
  } catch (error) {
    // Handle or log error for Firestore update
    console.error("Error updating Firestore document:", error);
    throw new Error(`Failed to updating: ${error.message}`);

    // Optionally rethrow or handle this error differently
  }

  return newData;
};
