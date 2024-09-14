import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import jwt from "jsonwebtoken";

export const verifyJWT = asyncHandler(async(req, _,next)=>{
    try {
        const token = await req.cookies?.accessToken ;
        // const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NmUxN2NjYmY2ZGY1ZDJjNDk2MTEyZGYiLCJlbWFpbCI6ImpheWRlZXBAZ21haWwuY29tcSIsInVzZXJuYW1lIjoiamF5ZGVlcHEiLCJmdWxsbmFtZSI6ImpheWRlZXBxIiwiaWF0IjoxNzI2MTA4NDg5LCJleHAiOjE3MjYxOTQ4ODl9.E97OE9aqPmjpPGX6NtzoSnJLkz-NVkSwpRTqzo4AO7U"
        console.log("this is token =",token)
        if(!token){
        throw new ApiError(401,"unAuthorize token")
        }
        const decodedToken =  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    
       const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
       if(!user){
        throw new ApiError(401,"invalid access Token") 
       }
    
       req.user = user;
       next()
    } catch (error) {
        throw new ApiError(401,error)
    }
})




