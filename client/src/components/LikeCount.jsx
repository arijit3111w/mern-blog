import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React, { useEffect, useState } from "react";
import { FaRegHeart } from "react-icons/fa";
import Loading from "./Loading";
import { useSelector } from "react-redux";
import { showToast } from "@/helpers/showToast";
import { FaHeart } from "react-icons/fa";

const LikeCount = ({ props }) => {
  const [likeCount, setLikeCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  const user = useSelector((state) => state.user);
  const {
  data: blogLikeCount,
  loading,
  error,
} = useFetch(
  `${getEnv("VITE_API_BASE_URL")}/blog-like/get-like/${props.blogid}?userid=${user?.user?._id || ""}`,
  {
    method: "GET",
    credentials: "include",
  }
);

  useEffect(() => {
    if (blogLikeCount) {
      setLikeCount(blogLikeCount.likeCount);
      setHasLiked(blogLikeCount.isUserLiked);
    }
  }, [blogLikeCount]);

  const handleLike = async () => {
    try {
      if (!user.isLoggedIn) {
        return showToast("error", "Please Sign In to like the blog");
      }

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/blog-like/do-like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            blogid: props.blogid,
            userid: user.user._id, // ✅ match the backend
          }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        showToast("error", response.statusText || "Something went wrong");
      }
      const responseData = await response.json();

      setLikeCount(responseData.likeCount);
        setHasLiked(!hasLiked);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }

    if (loading) {
      return <Loading />;
    }
  };
  return (
    <button
      onClick={handleLike}
      type="button"
      className="flex justify-between items-center gap-1 cursor-pointer"
    >
        {!hasLiked ? (
            <FaRegHeart />
        ):(<FaHeart fill='red' />)}
       {likeCount}
    </button>
  );
};

export default LikeCount;
