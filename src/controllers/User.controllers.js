import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudnary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const GenerateAccessAndRefreshTokens = async (userid) => {
  try {
   const user =  await User.findById(userid);
  const accessToken =  user.generateAccessToken()
  const refreshToken =  user.generateRefreshToken()
  //  console.log("Refresh Token = ",refreshToken)

     user.refreshToken = refreshToken

     const issave =  await user.save({ validateBeforeSave: false })
    // console.log("is save =",issave);


    return {accessToken,refreshToken}
  } catch (error) {
     throw new ApiError(500,'somethin went wrong when generating access and refresh token')
  }

}

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullname, password } = req.body;

  if (
    [fullname, username, email, password].some((feild) => {
      feild?.trim() === "";
    })) {
    throw new ApiError(400, "all fields are required");
    }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new ApiError(409, "user already exist");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;


  let coverimageLocalPath ;
  if(req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length>0){
     coverimageLocalPath =  req.files?.coverimage[0]?.path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "avatar file required");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverimage = await uploadOnCloudinary(coverimageLocalPath);

  if (!avatar) {
    throw new ApiError(400, "avatar file is required");
  }

  const user = User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });
  
  const createdUser = await User.findById(user._id).select("-password -refreshToken");

      // if (!createdUser) {
      //   throw new ApiError(500, "somthing went wrong while user was creating");
      // } else {
      //   console.log("user was created");
      // }

  return res
    .status(201).json(
        new ApiResponse(200, createdUser, "user registred successfully")
    );
});

const loginUser = asyncHandler(async (req,res)=>{
   const {username , email ,password} = req.body
  //  console.log(username,email,password)
   if ((!username && !email ) || !password){
        throw new ApiError(401 , "username or email and password are required")
    }

   const user = await  User.findOne({$or : [{username},{email}]})

   if(!user){
      throw new ApiError(404,"user not found please sign up")
   }
   console.log("controller pass = ",password);

   const isPasswordValid = await user.isPasswordCorrect(password)
      console.log(isPasswordValid)
      
   if(!isPasswordValid){
     throw new ApiError(401,"password was incorrect")
   }
  const {accessToken , refreshToken} =  await GenerateAccessAndRefreshTokens(user._id)
  const loggedInUSer =await User.findById(user._id).select("-password -refreshToken")

  const options ={
    httpOnly : true,
    secure : false,
  }

  console.log("this is AcccessToken",accessToken)
  return res
  .status(200)
  .cookie("accessToken" , accessToken , options)
  .cookie("refreshToken" , refreshToken , options)
  .json(
    new ApiResponse(
        200,
        {
        user : loggedInUSer ,  accessToken , refreshToken 
        },
        "user logged in successfully"
    )
  )
})

const logoutuser = asyncHandler(async (req,res,next)=>{
 await User.findByIdAndUpdate( req.user._id,
    {
      $set: {
          refreshToken : undefined
        }   
    },
    {
      new : true  ,
    }
  )

  const opitons = {
      httpOnly : true,
      secure : true
  }
  
  return res
  .status(200)
  .clearCookie("accessToken",opitons)
  .clearCookie("refreshToken",opitons)
  .json(new ApiResponse(200,{},"user logout successfully"))

  })


export { registerUser , loginUser , logoutuser };
