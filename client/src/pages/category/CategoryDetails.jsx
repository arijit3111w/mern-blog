import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link, Route } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";
import Loading from "@/components/Loading";
import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { deleteData } from "@/helpers/handleDelete";
import { showToast } from "@/helpers/showToast";

const CategoryDetails = () => {

    const [refreshData, setRefreshData] = useState(false);


    const {data:categoryData,loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`,{
    method: 'GET',
    credentials: 'include',

    },[refreshData]); // Re-fetch data when refreshData changes

    const handleDelete = async (categoryId) => {
        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/category/delete/${categoryId}`);
        if(response){
            setRefreshData(!refreshData); // Toggle the refresh state to re-fetch data
            showToast('seccess','Data deleted successfully');
        }else{
            showToast('error','Failed to delete data');
        }
    }



    if(loading) return <Loading/>;
  return (
    <div>
      <Card>
        <CardHeader>
          <div>
            <Button>
              <Link to={RouteAddCategory} className="flex items-center gap-2">
                <IoAddCircleOutline className="text-2xl text-white" />
                Add Category
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableCaption>All Categories Available</TableCaption>
            <TableHeader >
              <TableRow >
                <TableHead className="text-gray-500 font-semibold" >Category</TableHead>
                <TableHead className="text-gray-500 font-semibold">Slug</TableHead>
                <TableHead className="text-gray-500 font-semibold">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {categoryData && categoryData.categories.length > 0 ? (
                    categoryData.categories.map(category=>
                        <TableRow key={category._id}>
                        <TableCell  >
                            {category.name}
                        </TableCell>
                        <TableCell  >
                            {category.slug}
                        </TableCell>
                        <TableCell className='flex gap-3'>
                            <Button asChild variant='outline' className='hover:bg-violet-400 hover:text-white'>
                                <Link to={RouteEditCategory(category._id)}>
                                <TiEdit className=" text-xl" />
                                </Link>
                            </Button>
                            <Button onClick={()=>handleDelete(category._id)} variant='outline' className='hover:text-red-600 ml-2 cursor-pointer' size='icon'>                            
                                    <RiDeleteBin6Fill className=" text-xl" />
                            </Button>
                        </TableCell>
                    </TableRow>
                    )               
                 ):(
                    <TableRow>
                        <TableCell colSpan={3} className="text-center">
                            No categories found
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

export default CategoryDetails;
