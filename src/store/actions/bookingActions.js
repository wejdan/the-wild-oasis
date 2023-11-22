//import {getFirebaseApp} from '../firebaseHelper';

import {
  collection,
  updateDoc,
  orderBy,
  query,
  getDoc,
  onSnapshot,
  serverTimestamp,
  getDocs,
  where,
  doc,
  or,
  and,
  getCountFromServer,
  addDoc,
  deleteDoc,
  limit,
  startAfter,
  endBefore,
  limitToLast,
  startAt,
} from "firebase/firestore";
import { async } from "@firebase/util";
import { auth, database, functions } from "../../firebase";
import { httpsCallable } from "firebase/functions";

async function queryDocumentsByPage({ filter, pageNumber, pageSize, sort }) {
  // Calculate the starting point (offset)
  let q = query(collection(database, "bookings"));
  // Apply filters
  if (filter) {
    Object.keys(filter).forEach((key) => {
      q = query(q, where(key, "==", filter[key]));
    });
  }
  const startIndex = (pageNumber - 1) * pageSize;

  // Reference to the collection

  // Create the base query with ordering
  let baseQuery = query(
    q,
    orderBy(sort.field, sort.order),
    limit(startIndex + pageSize)
  );

  // Get the documents up to the starting point
  const documentSnapshots = await getDocs(baseQuery);

  // Find the starting snapshot
  const startingSnapshot = documentSnapshots.docs[startIndex - 1];

  // If we have a starting point, start the new query from the next document after the starting snapshot
  if (startingSnapshot) {
    baseQuery = query(
      q,
      orderBy(sort.field, sort.order),
      startAt(startingSnapshot),
      limit(pageSize)
    );
  } else {
    // If we don't have a starting snapshot, it means we're requesting the first page
    baseQuery = query(q, orderBy(sort.field, sort.order), limit(pageSize));
  }

  // Execute the final query
  const finalQuerySnapshot = await getDocs(baseQuery);
  const bookingsWithDetails = [];
  for (const docSnap of finalQuerySnapshot.docs) {
    const booking = docSnap.data();

    const cabinRef = doc(database, "cabins", booking.cabinId);
    const guestRef = doc(database, "guests", booking.guestId);

    const [cabinSnapshot, guestSnapshot] = await Promise.all([
      getDoc(cabinRef),
      getDoc(guestRef),
    ]);

    // Check if the documents exist and have the expected data
    if (!cabinSnapshot.exists()) {
      console.log(`No such cabin with ID: ${booking.cabinId}`);
    }
    if (!guestSnapshot.exists()) {
      console.log(`No such guest with ID: ${booking.guestId}`);
    }
    bookingsWithDetails.push({
      id: docSnap.id,
      ...booking,
      cabinName: cabinSnapshot.exists() ? cabinSnapshot.data().name : "---",
      guestFullName: guestSnapshot.exists()
        ? guestSnapshot.data().fullName
        : "---",
      guestEmail: guestSnapshot.exists() ? guestSnapshot.data().email : "---",
    });
  }

  // Prepare the next and previous page tokens
  const newNextPageToken = 1;
  // The first document snapshot is used to go back to the previous page
  const newPrevPageToken = 2;
  return {
    bookingsWithDetails,
    nextPageToken: newNextPageToken,
    prevPageToken: newPrevPageToken,
    numberOfPages: 0,
  };
}

export async function getBookingsWithDetails() {
  try {
    let q = query(collection(database, "bookings"));

    const bookingsSnapshot = await getDocs(q);
    const bookingsWithDetails = [];

    // Store the first document snapshot for potential backward pagination

    for (const docSnap of bookingsSnapshot.docs) {
      const booking = docSnap.data();

      const cabinRef = doc(database, "cabins", booking.cabinId);
      const guestRef = doc(database, "guests", booking.guestId);

      const [cabinSnapshot, guestSnapshot] = await Promise.all([
        getDoc(cabinRef),
        getDoc(guestRef),
      ]);

      // Check if the documents exist and have the expected data
      if (!cabinSnapshot.exists()) {
        console.log(`No such cabin with ID: ${booking.cabinId}`);
      }
      if (!guestSnapshot.exists()) {
        console.log(`No such guest with ID: ${booking.guestId}`);
      }
      bookingsWithDetails.push({
        id: docSnap.id,
        ...booking,
        cabinName: cabinSnapshot.exists() ? cabinSnapshot.data().name : "---",
        guestFullName: guestSnapshot.exists()
          ? guestSnapshot.data().fullName
          : "---",
        guestEmail: guestSnapshot.exists() ? guestSnapshot.data().email : "---",
      });
    }

    // Prepare the next and previous page tokens

    return bookingsWithDetails;
  } catch (error) {
    console.error("An error occurred while fetching bookings", error);
    throw error;
  }
}
export const getNumberOfPages = async (filter, pageSize) => {
  let q = query(collection(database, "bookings"));
  if (filter && filter !== "All") {
    q = query(q, where("status", "==", filter));
  }
  const snapshot = await getCountFromServer(q);
  const count = snapshot.data().count;
  const N = Math.ceil(count / pageSize);
  return N;
};

export const deleteBooking = async ({ id }) => {
  let docRef = doc(database, "bookings", id);
  console.log(docRef, id);

  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error(`The booking with ID ${id} does not exist.`);
  }

  try {
    await deleteDoc(docRef);
  } catch (error) {
    // If deletion fails, throw a custom error message
    console.log(error);
    throw new Error(
      `Failed to delete the booking with ID ${id}. Reason: ${error.message}`
    );
  }
};

export const updateBooking = async (newData, bookingId) => {
  let docRef = doc(database, "bookings", bookingId);

  await updateDoc(docRef, newData);
};
export const addBooking = async (data) => {
  const collectionRef = collection(database, `bookings`);

  await addDoc(collectionRef, data);
};
export const filterBookings = async (status, sortBy) => {
  const collectionRef = collection(database, `bookings`);
  let q;

  // Base query depending on the status
  if (status === "All") {
    q = collectionRef;
  } else {
    q = query(collectionRef, where("status", "==", status));
  }

  // Modify the query based on the sorting criteria
  switch (sortBy) {
    case 0:
      q = query(q, orderBy("startDate", "desc"));
      break;
    case 1:
      q = query(q, orderBy("startDate", "asc"));
      break;
    case 2:
      q = query(q, orderBy("totalPrice", "desc"));
      break;
    case 3:
      q = query(q, orderBy("totalPrice", "asc"));
      break;
    default:
      break;
  }

  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });

  return results;
};

export const filterBookingsByDate = async (filter) => {
  const currentDate = new Date();
  let daysToSubtract;
  switch (filter) {
    case "Last 7 days":
      daysToSubtract = 7;
      break;
    case "Last 30 days":
      daysToSubtract = 30;
      break;
    case "Last 90 days":
      daysToSubtract = 90;
      break;
    default:
      daysToSubtract = 7; // Default to 7 days if no match
  }
  currentDate.setDate(currentDate.getDate() - daysToSubtract);
  currentDate.setHours(0, 0, 0, 0); // Sets hours, minutes, seconds, and milliseconds to zero
  const date = currentDate.toISOString();

  const collectionRef = collection(database, `bookings`);
  let q;
  console.log("filterBookingsByDate", date);
  q = query(
    collectionRef,
    where("created_at", ">=", date),
    orderBy("created_at", "desc")
  );

  // Execute the query
  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });
  console.log("result", results);

  return results;
};

export const filterBookingsByStays = async (filter) => {
  const currentDate = new Date();
  let daysToSubtract;
  switch (filter) {
    case "Last 7 days":
      daysToSubtract = 7;
      break;
    case "Last 30 days":
      daysToSubtract = 30;
      break;
    case "Last 90 days":
      daysToSubtract = 90;
      break;
    default:
      daysToSubtract = 7; // Default to 7 days if no match
  }
  currentDate.setDate(currentDate.getDate() - daysToSubtract);
  currentDate.setHours(0, 0, 0, 0); // Sets hours, minutes, seconds, and milliseconds to zero
  const date = currentDate.toISOString();

  const collectionRef = collection(database, `bookings`);
  let q;
  console.log("filterBookingsByDate", date);
  q = query(
    collectionRef,
    where("startDate", ">=", date),
    orderBy("startDate", "desc")
  );

  // Execute the query
  const querySnapshot = await getDocs(q);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });
  const filteredResults = results.filter(
    (booking) =>
      booking.status === "Checked in" || booking.status === "Checked out"
  );
  return filteredResults;
};

export const getAllBookings = async (onSuccess) => {
  console.log("onSuccess===", onSuccess);
  const collectionRef = collection(database, `bookings`);

  const querySnapshot = await getDocs(collectionRef);
  const results = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    results.push({ id: doc.id, ...doc.data() });
  });
  if (onSuccess) {
    console.log("onSuccess is being called");
    onSuccess();
  }
  return results;
};
export const filterBookingsData = async (
  status,
  sortBy,
  order,
  pageSize,

  pageNumber,
  onSuccess
) => {
  const data = {};
  if (status && status !== "All") {
    data["filter"] = { status: status };
  }
  if (pageSize) {
    data["sort"] = { field: sortBy, order };
  }
  if (pageNumber) {
    data["pageNumber"] = Number(pageNumber);
  }

  if (pageSize) {
    data["pageSize"] = Number(pageSize);
  } else {
    data["pageSize"] = 10;
  }

  try {
    //   const result = await getBookingsWithDetails(data);
    const result = await queryDocumentsByPage(data);
    if (onSuccess) {
      onSuccess();
    }

    return result;
  } catch (error) {
    console.error(`Error retreiving bookings: ${error.message}`);
    throw error; // or handle it in another way
  }
};
export const getBookings = async (id) => {
  try {
    const result = await getBookingsWithDetails();
    return result.data;
  } catch (error) {
    console.error(`Error retreiving bookings: ${error.message}`);
    throw error; // or handle it in another way
  }
};
export const getBookingData = async (id) => {
  let docRef = doc(database, "bookings", id);
  const docSnap = await getDoc(docRef);
  return docSnap.data();
};

export const checkOut = async (id) => {
  let docRef = doc(database, "bookings", id);
  await updateDoc(docRef, { status: "Checked out" });
};

export const updateBookingStatus = async ({ id, status }) => {
  let docRef = doc(database, "bookings", id);
  const newData = { status: status, isPaid: true };

  await updateDoc(docRef, newData);
};

export const checkIn = async ({ id, hasBreakfast, totalPrice }) => {
  let docRef = doc(database, "bookings", id);

  await updateDoc(docRef, {
    status: "Checked in",
    isPaid: true,
    hasBreakfast,
    totalPrice,
  });
};
