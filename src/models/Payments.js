import mongoose from 'mongoose';

const PaymentSchema = new mongoose.Schema(
  {
    transactionType: String,
    transID: String,
    transTime: String,
    transAmount: Number,
    businessShortCode: String,
    billRefNumber: String,
    invoiceNumber: String,
    thirdPartyTransID: String,
    MSISDN: String,
    firstName: String,
    middleName: String,
    lastName: String,
  },
  { timestamps: true },
);

mongoose.model('Payment', PaymentSchema);
