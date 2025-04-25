import razorpay from "../config/razorpay.js";
import OrderModel from "../models/order.model.js";
import CartProductModel from "../models/cartproduct.model.js";
import UserModel from "../models/user.model.js";
import mongoose from "mongoose";
import crypto from "crypto";

// Function to calculate price with discount (copied from order.controller.js)
const pricewithDiscount = (price, dis = 1) => {
  const discountAmout = Math.ceil((Number(price) * Number(dis)) / 100);
  const actualPrice = Number(price) - Number(discountAmout);
  return actualPrice;
};

// Create Razorpay order
export const createRazorpayOrder = async (request, response) => {
  try {
    const userId = request.userId;
    const { list_items, totalAmt, addressId, subTotalAmt, customer } = request.body;

    // Create a unique receipt ID
    const receipt = `receipt_${Date.now()}`;

    // Create Razorpay order
    const options = {
      amount: Math.round(totalAmt * 100), // Razorpay expects amount in paise
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId,
        addressId: addressId
      }
    };

    const order = await razorpay.orders.create(options);

    return response.status(200).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false
    });
  }
};

// Verify Razorpay payment
export const verifyRazorpayPayment = async (request, response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, list_items, addressId } = request.body;
    const userId = request.userId;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    // Check if signature matches
    if (expectedSignature !== razorpay_signature) {
      return response.status(400).json({
        success: false,
        error: true,
        message: "Invalid signature"
      });
    }

    // Create order entries in database
    const payload = list_items.map((el) => {
      return {
        userId: userId,
        orderId: `ORD-${new mongoose.Types.ObjectId()}`,
        productId: el.productId._id,
        product_details: {
          name: el.productId.name,
          image: el.productId.image,
        },
        paymentId: razorpay_payment_id,
        payment_status: "PAID",
        delivery_address: addressId,
        subTotalAmt: pricewithDiscount(el.productId.price, el.productId.discount) * el.quantity,
        totalAmt: pricewithDiscount(el.productId.price, el.productId.discount) * el.quantity,
        invoice_receipt: razorpay_order_id
      };
    });

    const generatedOrder = await OrderModel.insertMany(payload);

    // Remove items from cart
    const removeCartItems = await CartProductModel.deleteMany({
      userId: userId,
    });
    
    const updateInUser = await UserModel.updateOne(
      { _id: userId },
      { shopping_cart: [] }
    );

    return response.json({
      message: "Payment verified and order created successfully",
      error: false,
      success: true,
      data: generatedOrder,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};