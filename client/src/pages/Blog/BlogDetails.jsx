import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteBlogAdd, RouteBlogEdit } from "@/helpers/RouteName";
import { IoAddCircleOutline } from "react-icons/io5";
import Loading from "@/components/Loading";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Fill } from "react-icons/ri";
import moment from "moment";

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false);

  const {
    data: blogData,
    loading,
    error,
  } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/blog/get-all`,
    {
      method: "GET",
      credentials: "include",
    },
    [refreshData]
  ); // Re-fetch data when refreshData changes

  const handleDelete = async (blogid) => {
    const response = deleteData(
      `${getEnv("VITE_API_BASE_URL")}/blog/delete/${blogid}`
    );
    if (response) {
      setRefreshData(!refreshData); // Toggle the refresh state to re-fetch data
      showToast("seccess", "Data deleted successfully");
    } else {
      showToast("error", "Failed to delete data");
    }
  };


  if (loading) return <Loading />;
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button>
              <Link to={RouteBlogAdd} className="flex items-center gap-2">
                <IoAddCircleOutline className="text-2xl text-white" />
                Add Blog
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>All Blogs Available</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-500 font-semibold">
                  Author
                </TableHead>
                <TableHead className="text-gray-500 font-semibold">
                  Category
                </TableHead>
                <TableHead className="text-gray-500 font-semibold">
                  Title
                </TableHead>
                <TableHead className="text-gray-500 font-semibold">
                  Slug
                </TableHead>
                <TableHead className="text-gray-500 font-semibold">
                  Dated
                </TableHead>
                <TableHead className="text-gray-500 font-semibold">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData && blogData.blog.length > 0 ? (
                blogData.blog.map((blog) => (
                  <TableRow key={blog._id}>
                    <TableCell>{blog?.author?.name}</TableCell>
                    <TableCell>{blog?.category?.name}</TableCell>
                    <TableCell>{blog.title}</TableCell>
                    <TableCell>{blog.slug}</TableCell>
                    <TableCell>{moment(blog.createdAt).format('DD-MM-YYYY')}</TableCell>
                    <TableCell className="flex gap-3">
                      <Button
                        asChild
                        variant="outline"
                        className="hover:bg-violet-400 hover:text-white"
                      >
                        <Link to={RouteBlogEdit(blog._id)}>
                          <TiEdit className=" text-xl" />
                        </Link>
                      </Button>
                      <Button
                        onClick={() => handleDelete(blog._id)}
                        variant="outline"
                        className="hover:text-red-600 ml-2 cursor-pointer"
                        size="icon"
                      >
                        <RiDeleteBin6Fill className=" text-xl" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    No Data found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BlogDetails;
