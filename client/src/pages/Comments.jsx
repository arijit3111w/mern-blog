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

const Comments = () => {

    const [refreshData, setRefreshData] = useState(false);


    const {data,loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/comment/get-all-comment`,{
    method: 'GET',
    credentials: 'include',

    },[refreshData]); // Re-fetch data when refreshData changes

    const handleDelete = async (commentid) => {
        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/comment/delete/${commentid}`);
        if(response){
            setRefreshData(!refreshData); // Toggle the refresh state to re-fetch data
            showToast('success','Data deleted successfully');
        }else{
            showToast('error','Failed to delete data');
        }
    }




    if(loading) return <Loading/>;
  return (
    <div>
      <Card>
        <CardContent>
          <Table>
            <TableCaption>All Comments</TableCaption>
            <TableHeader >
              <TableRow >
                <TableHead className="text-gray-500 font-semibold" >Blog</TableHead>
                 <TableHead className="text-gray-500 font-semibold" >Commented By</TableHead>
                <TableHead className="text-gray-500 font-semibold">Comment</TableHead>
                 <TableHead className="text-gray-500 font-semibold" >Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {data && data.comments.length > 0 ? (
                    data.comments.map(comment=>
                        <TableRow key={comment._id} className="hover:bg-gray-100">
                        <TableCell  >
                            {comment?.blogid?.title || 'N/A'}
                        </TableCell>
                        <TableCell  >
                            {comment?.user?.name}
                        </TableCell>
                        <TableCell  >
                            {comment?.comment}
                        </TableCell>
                        <TableCell className='flex gap-3'>
                            <Button onClick={()=>handleDelete(comment._id)} variant='outline' className='hover:text-red-600 ml-2 cursor-pointer' size='icon'>                            
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

export default Comments;
