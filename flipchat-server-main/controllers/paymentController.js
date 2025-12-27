import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
import { handleSubscribe } from "./subscripionController.js";

dotenv.config();

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2024-06-20",
});

// Create Stripe Checkout Session - POST
export const createStripeSession = asyncHandler(async (req, res) => {
  const { amount, userId, planType } = req.body;

  if (!amount || !userId || !planType) {
    return res.status(400).json({ message: "all fields are required" });
  }

  const totalAmountInPaise = Number(amount) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "FlipChat Premium Subscription",
            },
            unit_amount: totalAmountInPaise,
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        planType,
      },
      success_url: `${process.env.CLIENT_BASE_URL.replace(/\/$/, '')}/dashboard/plans?status=success`,
      cancel_url: `${process.env.CLIENT_BASE_URL.replace(/\/$/, '')}/dashboard/plans?status=cancelled`,
    });

    return res
      .status(200)
      .json({ message: "session created successfully", sessionId: session.id });
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res
      .status(500)
      .json({ message: "Error creating Stripe session" });
  }
});

// Stripe Webhook - POST
export const stripeWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Stripe webhook signature verification failed:", err);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received webhook event: ${event.type}`);

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const { userId, planType } = session.metadata || {};

    console.log("Checkout session completed:", {
      sessionId: session.id,
      paymentStatus: session.payment_status,
      userId,
      planType,
    });

    // Verify payment was successful
    if (session.payment_status !== "paid") {
      console.error(
        `Payment not completed. Status: ${session.payment_status}`
      );
      return res.status(200).json({ 
        received: true, 
        message: `Payment status is ${session.payment_status}, not processing subscription` 
      });
    }

    // Validate required metadata
    if (!userId || !planType) {
      console.error("Missing required metadata:", { userId, planType });
      return res.status(200).json({ 
        received: true, 
        message: "Missing userId or planType in metadata" 
      });
    }

    try {
      console.log(`Processing subscription for userId: ${userId}, planType: ${planType}`);
      const subscribe = await handleSubscribe(userId, planType);

      if (!subscribe.status) {
        console.error("Error handling subscription:", subscribe.message);
        // Still return 200 to Stripe to prevent retries, but log the error
        return res.status(200).json({ 
          received: true, 
          error: subscribe.message 
        });
      }

      console.log("Subscription processed successfully:", subscribe.message);
      return res.status(200).json({ 
        received: true, 
        message: "Subscription processed successfully" 
      });
    } catch (error) {
      console.error("Error in handleSubscribe from webhook:", error);
      console.error("Error stack:", error.stack);
      // Return 200 to prevent Stripe from retrying, but log the error
      return res.status(200).json({ 
        received: true, 
        error: error.message 
      });
    }
  }

  // For other event types, just acknowledge receipt
  return res.status(200).json({ received: true });
});
