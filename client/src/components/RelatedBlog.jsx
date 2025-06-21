import { getEnv } from "@/helpers/getEnv";
import { RouteBlogDetails } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Link } from "react-router-dom";

const RelatedBlog = ({ props }) => {
  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-related-blog/${props.category}/${props.currentBlog}`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="my-3 rounded-lg shadow-md bg-white p-4">
      <h2 className="text-xl md:text-2xl font-semibold mb-4 border-b pb-2 text-gray-800">
        Related Blogs
      </h2>

      <div className="space-y-4">
        {Array.isArray(data?.relatedBlog) && data.relatedBlog.length > 0 ? (
          data.relatedBlog.map((blog) => (
            <Link key={blog._id} to={RouteBlogDetails(props.category, blog.slug)} className="block">
            <div
              key={blog._id}
              className="flex gap-3 items-start rounded-md overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <img
                src={blog.featuredImage}
                alt={blog.title}
                className="w-20 h-20 object-cover rounded-md flex-shrink-0"
              />
              <div className="flex flex-col justify-between">
                <h4 className="text-sm font-medium text-gray-700 line-clamp-2">
                  {blog.title}
                </h4>
                <span className="text-xs text-gray-400 mt-1">Read more →</span>
              </div>
            </div>
            </Link> 
          ))
        ) : (
          <div className="text-center text-gray-500">
            No related blogs found
          </div>
        )}
      </div>
    </div>
  );
};

export default RelatedBlog;
