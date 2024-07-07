import express from "express";
import { createReferralForm } from "../controllers/referralForm.controller.js";

const referralRouter = express.Router()

referralRouter.post('/refer', createReferralForm);

export default referralRouter;