import React, { useEffect, useState } from "react";
import { getEnv } from "@/helpers/getEnv";
import Loading from "./Loading";
import { Avatar, AvatarImage } from "./ui/avatar";
import usericon from "@/assets/images/user.png";
import moment from "moment";

const CommentList = ({ props }) => {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial comments
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`${getEnv("VITE_API_BASE_URL")}/comment/get/${props.blogid}`, {
          method: "GET",
          credentials: "include",
        });
        const data = await res.json();
        if (data?.comment) {
          setAllComments(data.comment);
        }
      } catch (err) {
        console.error("Failed to fetch comments:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [props.blogid]);

  // Append new comment if present
  useEffect(() => {
    if (props.newComment) {
      setAllComments((prev) => [props.newComment, ...prev]);
    }
  }, [props.newComment]);

  if (loading) return <Loading />;

  return (
    <div>
      <h4 className="text-xl font-bold mb-5">
        {allComments.length} Comment{allComments.length !== 1 && "s"}
      </h4>

      <div className="space-y-6">
        {allComments.map((comment) => (
          <div key={comment._id} className="flex gap-4">
            <Avatar>
              <AvatarImage src={comment?.user?.avatar || usericon} />
            </Avatar>
            <div className="bg-white border rounded-lg p-4 shadow-sm w-full">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-base">{comment?.user?.name}</p>
                <p className="text-sm text-gray-500">
                  {moment(comment?.createdAt).format("DD-MM-YYYY")}
                </p>
              </div>
              <p className="text-gray-700 mt-2">{comment?.comment}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentList;
