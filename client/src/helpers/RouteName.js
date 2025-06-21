export const RouteIndex ='/'

export const RouteSignUp = '/sign-up'
export const RouteSignIn = '/sign-in'
export const RouteProfile = '/profile'

export const RouteAddCategory = '/category/add'
export const RouteEditCategory =  (category_id) =>{
    if(category_id){
        return `/category/edit/${category_id}`
    }else{
        return '/category/edit/:category_id'
    }
}

export const RouteCategoryDetails = '/categories'

export const RouteBlog ='/blog'
export const RouteBlogAdd ='/blog/add'
export const RouteBlogEdit =  (blogid) =>{
    if(blogid){
        return `/blog/edit/${blogid}`
    }else{
        return '/blog/edit/:blogid'
    }
}


export const RouteBlogDetails = (category,blog)=>{
    if(!category || !blog){
        return '/blog/:category/:blog'
    }
    return `/blog/${category}/${blog}`

}


export const RouteBlogByCategory = (category)=>{
    if(!category){
        return '/blog/:category'
    }
    return `/blog/${category}`
}

export const RouteSearch = (q)=>{
    if(q){
    return `/search?q=${q}` 
    }                    // Search route with query parameter
    else{
        return '/search'  // Default search route without query
    }
}

export const RouteCommentDetails = '/comments'


export const RouteUser = '/users'


