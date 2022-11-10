import express from "express";
import { createComment, createMusic, deleteComment, deleteMusic, getAllMusic, getComments, getMusicDetail, updateComment, updateMusic, updateMusicFile } from "../controllers/music.controller.js";

import {isAuthenticatedUser} from "../authentication/auth.js"
const router=express.Router();
import multer from "multer";
import { storage } from "../configs/multer.js";

router.route("/all").get(getAllMusic);
router.route("/:id").get(getMusicDetail);
router.route("/create").post(multer({storage}).single('music'),createMusic);
router.route("/delete/:id").delete(deleteMusic)
router.route('/update/:id').put(updateMusic);
router.route("/update/file/:id").post(multer({storage}).single('music'),updateMusicFile);

router.route("/comment/:id").get(getComments);
router.route("/comment/add/:id").put(isAuthenticatedUser,createComment);
router.route("/comment/delete").delete(isAuthenticatedUser,deleteComment);
router.route("/comment/update").put(isAuthenticatedUser,updateComment);
export default router;