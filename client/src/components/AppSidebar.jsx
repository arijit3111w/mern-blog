import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import logo from "@/assets/images/MernBlog.png"; // Adjust the path as necessary

import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { SiBlogger } from "react-icons/si";
import { FaCommentDots } from "react-icons/fa";
import { FaUserLarge } from "react-icons/fa6";
import { MdLastPage } from "react-icons/md";
import {
  RouteBlog,
  RouteBlogByCategory,
  RouteCategoryDetails,
  RouteCommentDetails,
  RouteIndex,
  RouteUser,
} from "@/helpers/RouteName";
import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import { useSelector } from "react-redux";

const AppSidebar = () => {
  const user = useSelector((state) => state.user);

  const { data: categoryData } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/category/all-category`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  return (
    <div>
      <Sidebar>
        <SidebarHeader className="bg-white">
          <img src={logo} width={120} height={10} />
        </SidebarHeader>
        <SidebarContent className="bg-white">
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <FaHome className="mr-2" />
                  <Link to={RouteIndex}>Home</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {user && user.isLoggedIn ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <SiBlogger className="mr-2" />
                      <Link to={RouteBlog}>Blogs</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FaCommentDots className="mr-2" />
                      <Link to={RouteCommentDetails}>Comments</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <></>
              )}
              {user && user.isLoggedIn && user.user.role === "admin" ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <BiSolidCategory className="mr-2" />
                      <Link to={RouteCategoryDetails}>Categories</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>

                  <SidebarMenuItem>
                    <SidebarMenuButton>
                      <FaUserLarge className="mr-2" />
                      <Link to={RouteUser}>User</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <></>
              )}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Categories</SidebarGroupLabel>
            <SidebarMenu>
              {categoryData &&
                categoryData?.categories?.length > 0 &&
                categoryData.categories.map((category) => (
                  <SidebarMenuItem key={category._id}>
                    <SidebarMenuButton>
                      <MdLastPage className="mr-2" />
                      <Link to={RouteBlogByCategory(category.slug)}>
                        {category.name}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </div>
  );
};

export default AppSidebar;
