import mongoose from 'mongoose';

const marketingSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    type: {
      type: String,
      default: 'announcement', // promo, announcement, credit
    },
    endDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Marketing = mongoose.model('Marketing', marketingSchema);
export default Marketing;
