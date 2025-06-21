import React, { useState } from "react";
import logo from "@/assets/images/Mernblog.png";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { VscSignIn } from "react-icons/vsc";
import SearchBox from "./SearchBox";
import { useDispatch, useSelector } from "react-redux"; // Import useSelector to access Redux state

import { CgProfile } from "react-icons/cg";
import { GrBlog } from "react-icons/gr";
import { MdLogout } from "react-icons/md";
import { FaSearch } from "react-icons/fa";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import usericon from "@/assets/images/user.png"; // ✅ correct
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { removeUser } from "@/redux/user/user.slice";
import { RouteBlogAdd, RouteIndex, RouteProfile } from "@/helpers/RouteName";
import { MdMenu } from "react-icons/md";
import { useSidebar } from "./ui/sidebar";

const Topbar = () => {
  const dispatch = useDispatch(); // get the dispatch function from the Redux store
  const navigate = useNavigate(); // get the navigate function from react-router-dom
   const [showSearch, setShowSearch] = useState(false);
    const { toggleSidebar } = useSidebar()
   

  const user = useSelector((state) => state.user); // Access the user state from Redux store

  const handleLogout = async () => {
   
    // call api and clear the cookie
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/logout`,
        {
          method: "GET", // Use GET method for logout
          credentials: "include", // to include cookies in the request
        }
      );
      const data = await response.json(); // to get the response data from the backend
      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }
      // If the logout is successful, clear the user data in the Redux store
      dispatch(removeUser()); // removeUser is an action to clear user data in Redux
      navigate(RouteIndex);
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch); // Toggle the search box visibility
  };

  return (
    <div className="flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b ">
      <div className="flex items-center justify-center gap-2">
        <button type='button' className="md:hidden" onClick={toggleSidebar}>
        <MdMenu/>
        </button>
        <Link to={RouteIndex}>
        <img src={logo} className="md:w-20 w-44" />
        </Link>
      </div>
      <div className="w-[500px]">
        <div
          className={`md:relative md:block absolute bg-white left-0 w-full md:top-0 top-16 md:p-0 p-5 ${
            showSearch ? "block" : "hidden"
          }`}
        >
          <SearchBox />
        </div>
      </div>
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="md:hidden block"
          onClick={toggleSearch}
        >
          <FaSearch size={20} />
        </button>
        {!user.isLoggedIn ? (
          <Button asChild className="rounded-full">
            <Link to="/sign-in" className="flex items-center">
              <VscSignIn className="mr-2" />
              Sign-in
            </Link>
          </Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage src={user?.user?.avatar || usericon} />
                <AvatarFallback>
                  {(user?.user?.name &&
                    user.user.name.charAt(0).toUpperCase()) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>{user?.user?.name}</p>
                <p className="text-xs">{user?.user?.email}</p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={RouteProfile} className="w-full ">
                  <CgProfile className="mr-2" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link to={RouteBlogAdd} className="w-full">
                  <GrBlog className="mr-2" />
                  Add Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="w-full text-red-700"
                >
                  <MdLogout className="mr-2" color="red" />
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default Topbar;
