import { Router } from "express"
import { loginUser, logoutuser, registerUser } from "../controllers/User.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

 router.route("/register").post(
    upload.fields([
        {
         name : "avatar",
         maxCount : 1,
        },
        { 
         name : "coverimage",
         maxCount : 1,
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secure routes
router.route("/logout").post(verifyJWT,logoutuser)

export default router