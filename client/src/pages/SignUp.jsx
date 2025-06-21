
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
import { get, useForm } from "react-hook-form";
import { Card } from "@/components/ui/card";
import { data, Link, useNavigate } from "react-router-dom";
import { RouteSignIn, RouteSignUp } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";


const SignUp = () => {

    const navigate = useNavigate();

    const formSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        email: z.string().email("Invalid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        confirmPassword: z.string().refine(data =>data.password === data.confirmPassword, 'Passwords must match'),
      });
    
      // Define your form
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        },
      });
    
      // 2. Define a submit handler.
      // console.log(getEnv('VITE_API_BASE_URL'));  // to debug getEnv function
      async function onSubmit(values) {
        // console.log(values);
        try {
          const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`,{
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          const data = await response.json();  // to get the response data from the backend
          if(!response.ok) {
            return showToast(error,data.message || 'Something went wrong');
          }
           navigate(RouteSignIn);
          showToast('success', data.message || 'User registered successfully');
        } catch (error) {
          showToast('error', error.message || 'Something went wrong');
        }
      }
    
  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gray-100">
      <Card className="w-[400px] p-5">
        <h1 className="text-2xl font-bold text-center mb-5 ">
          Create Your Account
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UserName</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className="mt-5 text-sm flex items-center justify-center gap-2">
                <p>Already have an account?</p>
                <Link className="text-blue-500 hover:underline" to={RouteSignIn}>Sign In</Link>
              </div>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp