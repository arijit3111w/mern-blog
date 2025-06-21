import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RouteAddCategory, RouteEditCategory } from "@/helpers/RouteName";
import React, { useState } from "react";
import { IoAddCircleOutline } from "react-icons/io5";
import { Link, Route, useNavigate } from "react-router-dom";
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
import usericon from '@/assets/images/user.png';
import moment from "moment";


const User = () => {

    const [refreshData, setRefreshData] = useState(false);

    const navigate = useNavigate();


    const {data,loading, error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/user/get-all-user`,{
    method: 'GET',
    credentials: 'include',

    },[refreshData]); // Re-fetch data when refreshData changes

    const handleDelete = async (id) => {
        const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/user/delete/${id}`);
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
            <TableCaption>All User</TableCaption>
            <TableHeader >
              <TableRow >
                <TableHead className="text-gray-500 font-semibold" >Role</TableHead>
                 <TableHead className="text-gray-500 font-semibold" >Name</TableHead>
                <TableHead className="text-gray-500 font-semibold">Email</TableHead>
                <TableHead className="text-gray-500 font-semibold" >Avatar</TableHead>
                <TableHead className="text-gray-500 font-semibold" >Dated</TableHead>
                 <TableHead className="text-gray-500 font-semibold" >Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
                {data && data.user?.length > 0 ? (
                    data.user?.map(user=>
                        <TableRow key={user?._id} className="hover:bg-gray-100">
                        <TableCell  >
                            {user?.role || 'N/A'}
                        </TableCell>
                        <TableCell  >
                            {user?.name}
                        </TableCell>
                        <TableCell  >
                            {user?.email}
                        </TableCell>
                        <TableCell  >
                            <img src={user?.avatar || usericon} className="w-10 h-10 rounded-full"/>
                        </TableCell>
                        <TableCell  >
                            {moment(user?.createdAt).format('DD-MM-YYYY') || 'N/A'}
                        </TableCell>
                        <TableCell className='flex gap-3'>
                            <Button onClick={()=>handleDelete(user._id)} variant='outline' className='hover:text-red-600 ml-2 cursor-pointer' size='icon'>                            
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

export default User;
