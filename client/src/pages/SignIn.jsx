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
import { Input } from "@/components/ui/input";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { RouteIndex, RouteSignIn, RouteSignUp } from "@/helpers/RouteName";
import { showToast } from "@/helpers/showToast";
import { getEnv } from "@/helpers/getEnv";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice";
import GoogleLogin from "@/components/GoogleLogin";



const SignIn = () => {


  const dispatch = useDispatch(); // get the dispatch function from the form


  const navigate = useNavigate();

  // 1. Define your form schema using Zod.
  const formSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  });

  // Define your form

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values) {

    // console.log(values);
    try {
      const response = await fetch(
        `${getEnv("VITE_API_BASE_URL")}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // to include cookies in the request
          body: JSON.stringify(values),
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
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5 ">
          Login into Account
        </h1>
        <div className="">
          <GoogleLogin />
          <div className="border-1 my-5 flex justify-center items-center relative">
            <span className="absolute bg-white text-sm">Or</span>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
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
                Sign In
              </Button>
              <div className="mt-5 text-sm flex items-center justify-center gap-2">
                <p>Don&apos;t have an account?</p>
                <Link
                  className="text-blue-500 hover:underline"
                  to={RouteSignUp}
                >
                  Sign Up
                </Link>
                <Link
                  className="text-blue-500 hover:underline"
                  to={RouteIndex}
                >
                  Back To Home
                </Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default SignIn;
