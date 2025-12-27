import { Router } from "express";
import {
  createStripeSession,
  stripeWebhook,
} from "../controllers/paymentController.js";

const router = Router();

router.route("/create-session").post(createStripeSession);

// Stripe requires the raw body for webhook signature verification,
// so this route should be configured before any body-parsing middleware.
router.route("/webhook").post(stripeWebhook);

export default router;