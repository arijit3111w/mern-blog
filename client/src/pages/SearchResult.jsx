import BlogCard from "@/components/BlogCard";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { useSearchParams } from "react-router-dom";

const SearchResult = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q");

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/search?q=${q}`, {
    method: "GET",
    credentials: "include",
  },[ q ]);
  if (loading) {
    return <Loading />;
  }
  return (
    <>
      <div className="flex items-center gap-2 mb-5 border-b text-violet-500">
        <h4>Search Result for {q}</h4>
      </div>
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

export default SearchResult;
