import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { formatDistance } from "date-fns";
export function formatDate(dateStr) {
  const options = { month: "short", day: "numeric", year: "numeric" };
  return new Date(dateStr).toLocaleDateString(undefined, options);
}

export function TimeElapsed(fromDate) {
  const timeElapsed = formatDistance(
    new Date(fromDate), // The date you want to compare
    new Date(), // Current date
    { addSuffix: true } // This adds a suffix like "about 2 months ago"
  );

  return timeElapsed;
}
export function daysBetweenDates(dateString1, dateString2) {
  // Convert string dates to Date objects
  const date1 = new Date(dateString1);
  const date2 = new Date(dateString2);

  // Calculate the time difference in milliseconds
  const timeDifference = Math.abs(date2 - date1);

  // Convert the time difference to days (1 day = 24 * 60 * 60 * 1000 milliseconds)
  const daysDifference = Math.ceil(timeDifference / (24 * 60 * 60 * 1000));

  return daysDifference;
}
export function formatPrice(price) {
  return price.toLocaleString("en-US", {
    style: "decimal",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
export function getSalesDateRange(bookings) {
  if (bookings.length === 0) {
    return "No sales data available";
  }

  const dates = bookings.map((booking) => new Date(booking.created_at));
  const sortedDates = dates.sort((a, b) => a - b);
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];

  const formatDate = (date) =>
    date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  return `Sales from ${formatDate(firstDate)} - ${formatDate(lastDate)}`;
}
export const uploadeImg = async (folder, name, img) => {
  const storage = getStorage();
  const storageRef = ref(storage, `${folder}/${name}`);
  await uploadBytes(storageRef, img);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
};

export async function getImageUrl(directory, imageName) {
  const storage = getStorage();

  const storageRef = ref(storage, `${directory}/${imageName}`);

  try {
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error("Error getting image URL:", error);
    return null;
  }
}
