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
import React, { useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { get, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { data, Link, useNavigate, useParams } from "react-router-dom";
import { RouteSignIn, RouteSignUp } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";

import slugify from "slugify";
import { useFetch } from "@/hooks/useFetch";


const EditCategory = () => {

    const {category_id} = useParams(); // Get the category ID from the URL

    const {  data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/show/${category_id}`, {
        method: 'GET',
        credentials: 'include',
    },[category_id]); // passing as a dependency so that when the category_id changes, the fetch will be triggered again
   
    const formSchema = z.object({
        name: z.string().min(3, "Name must be at least 3 characters"),
        slug: z.string().min(3, "Slug must be at least 3 characters"),
      });
    
      // Define your form
    
      const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
            slug: "",
        },
      });

      const categoryName = form.watch('name');

      useEffect(() => {
        
        if(categoryName){
            const slug = slugify(categoryName, {lower:true})
            form.setValue('slug', slug);

        }
      },[categoryName])

      useEffect(() => {
        // If categoryData is available, set the form values
        if (categoryData) {
          form.setValue('name', categoryData.categories.name);
          form.setValue('slug', categoryData.categories.slug);
        }
      },[ categoryData]);


    
      // 2. Define a submit handler.
      // console.log(getEnv('VITE_API_BASE_URL'));  // to debug getEnv function
      async function onSubmit(values) {
        // console.log(values);
        try {
          const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/update/${category_id}`,{
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(values),
          })
          const data = await response.json();  // to get the response data from the backend
          if(!response.ok) {
            return showToast(error,data.message || 'Something went wrong');
          }

          showToast('success', data.message || 'User registered successfully');
        } catch (error) {
          showToast('error', error.message || 'Something went wrong');
        }
      }






  return (
    <div>
      <Card className="pt-5 max-w-screen-md mx-auto">
        <CardContent>
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
                      <Input placeholder="Enter Category Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input placeholder="Slug....." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full">
                Save
              </Button>
          </form>
        </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditCategory