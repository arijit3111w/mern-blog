import { getEnv } from '@/helpers/getEnv';
import { useFetch } from '@/hooks/useFetch';
import React from 'react'
import { FaRegComment } from "react-icons/fa6";
import Loading from './Loading';

const CommentCount = ({props}) => {
    const {data, loading, error} = useFetch(`${getEnv("VITE_API_BASE_URL")}/comment/get-count/${props.blogid}`, {
        method: "GET",
        credentials: "include",
    });
    if (loading) {
        return <Loading/>;
    }
  return (
    <button type ="button" className="flex justify-between items-center gap-1 bg-gray-100 px-3 py-1 rounded-md hover:bg-gray-200 transition-colors">
        <FaRegComment /> {data && data.commentCount}
    </button>
  )
}

export default CommentCount