import { Router } from 'express';
import auth from '../middleware/auth.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/razorpay.controller.js';

const razorpayRouter = Router();

razorpayRouter.post('/create-order', auth, createRazorpayOrder);
razorpayRouter.post('/verify-payment', auth, verifyRazorpayPayment);

export default razorpayRouter;