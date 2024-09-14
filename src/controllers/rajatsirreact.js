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
     secure : true,
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
 