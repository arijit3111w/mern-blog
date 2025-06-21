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
import React, { use, useEffect, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { get, useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { data, Link, useNavigate } from "react-router-dom";
import { RouteBlog, RouteSignIn, RouteSignUp } from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/GoogleLogin";
import slugify from "slugify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFetch } from "@/hooks/useFetch";
import Dropzone from "react-dropzone";
import Editor from "@/components/Editor";
import { useSelector } from "react-redux";





const AddBlog = () => {
  const navigate = useNavigate();

  const user = useSelector((state) => state.user); // Access the user state from Redux store

   const [filePreview, setPreview] = useState(); // State to hold the file preview
    const [file, setFile] = useState(); // State to hold the file

  const {
    data: categoryData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
    method: "GET",
    credentials: "include",
  }); // Re-fetch data when refreshData changes

  const formSchema = z.object({
    category: z.string(),
    title: z.string().min(3, "Title must be at least 3 characters"),
    slug: z.string().min(3, "Slug must be at least 3 characters"),
    blogContent: z
      .string()
      .min(10, "Blog content must be at least 10 characters"),
  });

  // Define your form

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "",
      title: "",
      slug: "",
      blogContent: "",
    },
  });

  const blogTitle = form.watch("title");

  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true });
      form.setValue("slug", slug);
    }
  }, [blogTitle]);

  // 2. Define a submit handler.
  // console.log(getEnv('VITE_API_BASE_URL'));  // to debug getEnv function
  async function onSubmit(values) {
    const newValues={...values,author:user.user._id}; // Add author to the values
    if (!file) {
      return showToast("error", "Featured image is required");
    }
    try {
           const formData = new FormData();
           formData.append("file", file);
           formData.append("data", JSON.stringify(newValues));
         const response = await fetch(
           `${getEnv("VITE_API_BASE_URL")}/blog/add`,
           {
             method: "POST", // Use PUT method for updating user
             credentials: "include", // to include cookies in the request
             body: formData, // send the form data to the backend
           }
         );
         const data = await response.json(); // to get the response data from the backend
         if (!response.ok) {
           return showToast("error", data.message || "Something went wrong");
         }
         // If the login is successful, set the user data in the Redux store
         form.reset(); // Reset the form after successful submission
         setFile()
         setPreview()
         navigate(RouteBlog)
         showToast("success", data.message);
       } catch (error) {
         showToast("error", error.message || "Something went wrong");
       }
  }

   const handleFileSelection = (files) =>{
        const file= files[0];
        const preview = URL.createObjectURL(file);
        setFile(file); // Set the file state
        setPreview(preview); // Set the file preview state
   }

    const handleEditorData = (event,editor) => {
        const data = editor.getData();
        form.setValue("blogContent", data); // Set the blog content in the form

    }

  return (
    <div>
      <Card className="pt-5 ">
        <CardContent className="overflow-visible">
            <h1 className="text-2xl font-semibold mb-4">Add Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (

                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <FormControl>
                       <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categoryData &&
                              categoryData.categories.length > 0 &&
                              categoryData.categories.map((category) => (
                                <SelectItem
                                  key={category._id}
                                  value={category._id}
                                >
                                  {category.name}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Blog Title" {...field} />
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
              <div className="mb-3">
                <span className="mb-2 block">Upload Image</span>
                <Dropzone
                  onDrop={(acceptedFiles) => handleFileSelection(acceptedFiles)}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <div className="flex justify-center items-center w-36 h-28 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer">
                            <img className="max-w-full max-h-full object-contain" src={filePreview}/>
                        </div>
                        
                      </div>
                    </section>
                  )}
                </Dropzone>
              </div>
              <div className="mb-3">
                <FormField
                  control={form.control}
                  name="BlogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edit Your Blog Here</FormLabel>
                      <FormControl>
                        <div className="max-h-[400px] max-w-full overflow-auto border rounded-md">
                        <Editor props={{initialData:'',onChange:handleEditorData}}/>
                        </div>
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
  );
};

export default AddBlog;
