import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useParams } from "react-router-dom";
import { BiCategoryAlt } from "react-icons/bi";

const BlogByCategory = () => {
  const { category } = useParams();

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/get-blog-by-category/${category}`, {
    method: "GET",
    credentials: "include",
  },[category]);

 
  if (loading) {
    return <Loading />;
  }
  return (
    <>
    <div className="flex items-center gap-2 mb-5 border-b text-violet-500"><BiCategoryAlt /> <h1 className="text-2xl font-bold">{blogData && blogData?.categoryData?.name}</h1></div>
    <div className="grid lg:grid-cols-3 grid-cols-1 gap-10">
      {blogData && blogData.blog.length > 0 ? (
        blogData.blog.map((blog) => <BlogCard key={blog._id} props={blog} />)
      ) : (
        <div className="flex items-center justify-center h-screen">
          <h1 className="text-2xl font-bold">No Blogs Found</h1>
        </div>
      )}
    </div>
    </>
  );
};

export default BlogByCategory;
