import express from "express";
const router = express.Router();
import {renderDashboardPage, renderHomePage} from "../controllers/page.controller.js";

router.route("/").get(renderHomePage)
router.route("/admin/dashboard").get(renderDashboardPage)

export default router;