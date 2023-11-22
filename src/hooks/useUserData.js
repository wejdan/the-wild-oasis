// src/useUserData.js
import { useQuery } from "react-query";
import { useAuth } from "./useAuth";
import { getUserData, signout } from "../store/actions/userActions";

const useUserData = () => {
  const { userId } = useAuth();

  return useQuery("userData", () => getUserData(userId), {
    enabled: !!userId, // only run query if currentUser is not null
  });
};
export default useUserData;
