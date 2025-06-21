import React from "react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "@/components/ui/badge";
import { useSelector } from "react-redux";
import { Avatar, AvatarImage } from "./ui/avatar";
import { FaCalendarAlt } from "react-icons/fa";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ props }) => {
  return (
    <div>
      <Link to={RouteBlogDetails(props.category.slug, props.slug)}>
        <Card className="pt-5 rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-900">
          <CardContent className="space-y-4 px-5 pb-5">
            {/* Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={props.author.avatar || usericon} />
                </Avatar>
                <span className="font-medium text-gray-800 dark:text-gray-100">
                  {props.author.name}
                </span>
              </div>
              {props.author.role === "admin" && (
                <Badge className="bg-purple-600 text-white text-xs px-2 py-1">
                  Admin
                </Badge>
              )}
            </div>

            {/* Blog Image */}
            <div className="w-full h-52 overflow-hidden rounded-lg">
              <img
                src={props.featuredImage}
                alt="Blog"
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
            </div>

            {/* Date */}
            <p className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <FaCalendarAlt className="text-gray-400" />
              <span>{moment(props.createdAt).format("DD-MM-YYYY")}</span>
            </p>

            {/* Title */}
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white line-clamp-2">
              {props.title}
            </h2>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
};

export default BlogCard;
