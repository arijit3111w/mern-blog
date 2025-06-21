import React, { useState } from "react";
import { FaRegComments } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { Textarea } from "./ui/textarea";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { RouteSignIn } from "@/helpers/RouteName";
import CommentList from "./CommentList";

const Comment = ({ props }) => {
  const [newComment, setNewComment] = useState(null);
  const user = useSelector((state) => state.user);

  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters"),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    try {
      const newValues = {
        ...values,
        blogid: props.blogid,
        user: user.user._id,
      };

      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newValues),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }

      setNewComment({
  ...data.comment,
  user: {
    _id: user.user._id,
    name: user.user.name,
    avatar: user.user.avatar,
    role: user.user.role,
  },
}); // append new comment
      form.reset(); // reset the form
      showToast("success", data.message || "Comment added successfully");
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold">
        <FaRegComments className="text-violet-500" />
        Comments
      </h4>

      {user && user.isLoggedIn ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4 space-y-4">
            <FormField
              control={form.control}
              name="comment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Comment</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Type your comment..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="bg-violet-600 hover:bg-violet-700">
              Submit
            </Button>
          </form>
        </Form>
      ) : (
        <Button asChild className="mt-4">
          <Link to={RouteSignIn}>Sign in to comment</Link>
        </Button>
      )}

      <div className="border-t mt-6 pt-6">
        <CommentList props={{ blogid: props.blogid, newComment }} />
      </div>
    </div>
  );
};

export default Comment;
