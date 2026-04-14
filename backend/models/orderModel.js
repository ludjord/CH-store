import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  qty: { type: Number, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Product',
  },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    orderItems: [orderItemSchema],
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    paymentResult: {
      id: { type: String },
      status: { type: String },
      update_time: { type: String },
      email_address: { type: String }
    },
    shippingStatus: {
      type: String,
      required: true,
      default: 'Pending', // Pending, Processing, Shipped, Delivered
    },
    trackingNumber: {
      type: String, // Resi JNE/JNT dsb
    }
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);
export default Order;
