import { Card, CardContent } from "@/components/ui/card";
import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useFetch } from "@/hooks/useFetch";
import Loading from "@/components/Loading";

import { LuCamera } from "react-icons/lu";
import Dropzone from "react-dropzone";
import { setUser } from "@/redux/user/user.slice";

const Profile = () => {
  const dispatch = useDispatch(); // get the dispatch function from the Redux store

  const [filePreview, setFilePreview] = useState(); // State to hold the file preview
  const [file, setFile] = useState(); // State to hold the file

  const user = useSelector((state) => state.user); // Access the user state from Redux store

  const {
    data: userData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/user/get-user/${user?.user?._id}`,
    { method: "GET", credentials: "include" }
  ); // Access the user state from Redux store

  // 1. Define your form schema using Zod.
  const formSchema = z.object({
    name: z.string().min(3, "Name must have atleast 3 characters"),
    email: z.string().email("Invalid email address"),
    bio: z.string().optional(),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .optional(),
  });

  // Define your form

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      bio: "",
      password: "",
    },
  });

  useEffect(() => {
    if (userData && userData.success) {
      // If userData is successfully fetched, set the form default values
      form.reset({
        name: userData.user.name,
        email: userData.user.email,
        bio: userData.user.bio,
      });
    }
  }, [userData]);

  // 2. Define a submit handler.
  async function onSubmit(values) {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("data", JSON.stringify(values));
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/user/update-user/${userData.user._id}`,
        {
          method: "PUT", // Use PUT method for updating user
          credentials: "include", // to include cookies in the request
          body: formData, // send the form data to the backend
        }
      );
      const data = await response.json(); // to get the response data from the backend
      if (!response.ok) {
        return showToast("error", data.message || "Something went wrong");
      }
      // If the login is successful, set the user data in the Redux store
      dispatch(setUser(data.user)); // Assuming setUser is an action to set user data in Redux
      showToast("success", data.message);
    } catch (error) {
      showToast("error", error.message || "Something went wrong");
    }
  }

   const handleFileSelection = (files) =>{
        const file= files[0];
        const preview = URL.createObjectURL(file);
        setFile(file); // Set the file state
        setFilePreview(preview); // Set the file preview state
   }

  if (loading) {
    return <Loading />;
  }

  return (
    <Card className="max-w-screen-md mx-auto ">
      <CardContent>
        <div className="flex justify-center items-center mt-10">
          <Dropzone onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}>
            {({ getRootProps, getInputProps }) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Avatar className="w-28 h-28 relative group">
                    <AvatarImage
                      src={ filePreview? filePreview : userData?.user?.avatar} // use the avatar from userData or user.user
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = usericon; // fallback to local icon
                      }}
                    />
                    <div className="absolute z-50 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  items-center justify-center rounded-full bg-black opacity-20 cursor-pointer group-hover:flex hidden">
                      <LuCamera className="text-white" />
                    </div>
                    <AvatarFallback>
                      {userData?.user?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </section>
            )}
          </Dropzone>
        </div>

        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Enter your bio" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-5">
                <Button type="submit" className="w-full">
                  Update Profile
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default Profile;
