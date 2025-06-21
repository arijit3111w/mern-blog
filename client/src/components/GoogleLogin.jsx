import React from "react";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "@/helpers/firebase";
import { RouteIndex } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux"; // Uncomment if you need to use Redux
import { setUser } from "@/redux/user/user.slice";




const GoogleLogin = () => {

  // import redux dispatch 
const dispatch = useDispatch(); // Uncomment if you need to use Redux
    const navigate = useNavigate();

    
  const handleLogin = async () => {
    try {
      const googleResponse = await signInWithPopup(auth, provider);
      const user = googleResponse.user;
      const bodyData={
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
      }
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // to include cookies in the request
          body: JSON.stringify(bodyData), // send the user data to the backend
        }
      );
      const data = await response.json(); // to get the response data from the backend
      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }
      // If the login is successful, set the user data in the Redux store
      dispatch(setUser(data.user)); // Assuming setUser is an action to set user data in Redux

      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  };
  return (
    <div>
      <Button variant="outline" onClick={handleLogin} className="w-full">
        <FcGoogle className="mr-2" />
        Continue in with Google
      </Button>
    </div>
  );
};

export default GoogleLogin;
