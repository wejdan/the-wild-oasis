/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
const admin = require("firebase-admin");

admin.initializeApp();

const functions = require("firebase-functions");

exports.createUser = functions.https.onCall(async (data, context) => {
  const { email, password, name } = data;

  try {
    // Create the user using Firebase Admin SDK
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    const uid = userRecord.uid;

    // Additional setup for storing user data in Firestore

    const imgUrl =
      "https://firebasestorage.googleapis.com/v0/b/the-wild-oasis-ea54c.appspot.com/o/users%2Fdefault-avatar-profile.png?alt=media&token=9c533b6d-6773-4373-8fca-ce6b37e8fa51&_gl=1*10pkjr5*_ga*MjIxMzM4MTAyLjE2OTE0MjE0MDk.*_ga_CW55HF8NVT*MTY5ODE3MDA0OC4xNTguMS4xNjk4MTcyNzEwLjYwLjAuMA.."; // Assuming you have an `getImageUrl` function in this context

    const userData = {
      email,
      uid: uid,
      name,
      avatar: imgUrl,
      signUpDate: new Date().toISOString(),
    };

    // Firestore reference to the 'users' collection
    const firestore = admin.firestore();
    const userDocRef = firestore.collection("users").doc(uid);

    // Set data to Firestore
    await userDocRef.set(userData);

    return { success: true, uid: uid };
  } catch (error) {
    // Handle error
    throw new functions.https.HttpsError("unknown", error.message);
  }
});
exports.getBookingsWithDetails = functions.https.onCall(
  async (data, context) => {
    // Assuming the user must be authenticated to view bookings
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "You must be signed in to view bookings."
      );
    }

    const { filter, sort, pageSize, pageToken } = data; // Include pageSize and pageToken in data

    try {
      let query = admin.firestore().collection("bookings");

      // Apply filters
      if (filter) {
        Object.keys(filter).forEach((key) => {
          query = query.where(key, "==", filter[key]);
        });
      }

      // Apply sorting
      if (sort && sort.field && sort.order) {
        query = query.orderBy(sort.field, sort.order);
      }

      // Apply pagination
      if (pageSize) {
        query = query.limit(pageSize);
      }
      if (pageToken) {
        // Assume pageToken is a document snapshot ID for the last document in the previous page
        const lastDocSnapshot = await admin
          .firestore()
          .collection("bookings")
          .doc(pageToken)
          .get();
        if (lastDocSnapshot.exists) {
          query = query.startAfter(lastDocSnapshot);
        }
      }

      const bookingsSnapshot = await query.get();
      const bookingsWithDetails = [];
      let lastVisible = null;

      for (const doc of bookingsSnapshot.docs) {
        const booking = doc.data();
        const [cabinSnapshot, guestSnapshot] = await Promise.all([
          admin.firestore().collection("cabins").doc(booking.cabinId).get(),
          admin.firestore().collection("guests").doc(booking.guestId).get(),
        ]);

        bookingsWithDetails.push({
          id: doc.id,
          ...booking,
          cabinName: cabinSnapshot.data()?.name,
          guestFullName: guestSnapshot.data()?.fullName,
          guestEmail: guestSnapshot.data()?.email,
        });

        lastVisible = doc; // Keep track of the last document
      }

      // Prepare the next page token
      const nextPageToken = lastVisible ? lastVisible.id : null;

      return {
        bookingsWithDetails,
        nextPageToken, // Return the next page token
      };
    } catch (error) {
      throw new functions.https.HttpsError(
        "unknown",
        "An error occurred while fetching bookings",
        error
      );
    }
  }
);

exports.updateUserPassword = functions.https.onCall((data, context) => {
  // Check if request is made by an authenticated user
  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = data.uid; // The UID of the user whose password is to be updated
  const newPassword = data.newPassword; // The new password

  // Validate the input
  if (!uid || !newPassword) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "The function must be called with two arguments uid and newPassword."
    );
  }

  // Update the password
  return admin
    .auth()
    .updateUser(uid, {
      password: newPassword,
    })
    .then(() => {
      return { result: "Password updated successfully" };
    })
    .catch((error) => {
      throw new functions.https.HttpsError(
        "unknown",
        "Failed to update password",
        error
      );
    });
});
