import express from "express";
import { getAllUser, getMyInfo, login, logout, registerUser, deleteMe, deleteUser, updateMyProfile, changeMyPassword, updateProfilePicture, forgetPassword,sendChangePasswordPage, resetPassword } from "../controllers/user.controller.js";
import multer from "multer";
import { storageForProfile } from "../configs/multer.js";
import {authorizeRoles, isAuthenticatedUser} from "../authentication/auth.js"
const router=express.Router();

router.route("/register").post(multer({storage:storageForProfile}).single("profile"),registerUser);
router.route("/login").get(login);
router.route("/logout").get(isAuthenticatedUser ,logout);
router.route("/all").get(isAuthenticatedUser,authorizeRoles("admin"),getAllUser);
router.route("/me").get(isAuthenticatedUser,getMyInfo);
router.route("/delete/me").delete(isAuthenticatedUser,deleteMe);
router.route("/:id").delete(isAuthenticatedUser,authorizeRoles("admin"),deleteUser)
router.route("/updateMyProfile").put(isAuthenticatedUser,updateMyProfile);
router.route("/password/change").put(isAuthenticatedUser,changeMyPassword);
router.route("/profile/change").post(isAuthenticatedUser,multer({storage:storageForProfile}).single("profile"),updateProfilePicture);

router.route("/forget/password").post(forgetPassword);
router.route("/password/reset/:token").get(sendChangePasswordPage).post(resetPassword);
export default router;



