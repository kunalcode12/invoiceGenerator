// server.js (Backend entry point)
const express = require("express");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Invoice Schema
const invoiceSchema = new mongoose.Schema({
  email: String,
  amount: Number,
  description: String,
  isPaid: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Invoice = mongoose.model("Invoice", invoiceSchema);

// Nodemailer setup (using Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  auth: {
    user: "app714910@gmail.com",
    pass: "nxgd ruyx uncz zkrh",
  },
});

// API to generate invoice
app.post("/generate-invoice", async (req, res) => {
  const { email, amount, description } = req.body;

  try {
    // Create new invoice
    const newInvoice = new Invoice({
      email,
      amount,
      description,
    });

    await newInvoice.save();

    res.status(200).json({
      message: "Invoice created successfully!",
      invoiceId: newInvoice._id,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create invoice", error: error.message });
  }
});

// API to send invoice
app.post("/send-invoice", async (req, res) => {
  const { invoiceId, recipientEmail } = req.body;

  try {
    // ... (previous error checking)

    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    const senderEmail = invoice.email;
    const invoiceUrl = `http://localhost:5173/invoice/${invoiceId}`;

    const mailOptions = {
      from: '"Your Invoice App" <kunal72819@gmail.com>', // Your app's email
      replyTo: senderEmail, // The user's email
      to: recipientEmail,
      subject: `Invoice from ${senderEmail}`,
      html: `
          <p>Hello,</p>
          <p>You have received an invoice from ${senderEmail}.</p>
          <p>Amount: $${invoice.amount}</p>
          <p>Description: ${invoice.description}</p>
          <p>To view the full invoice, please click the link below:</p>
          <p><a href="${invoiceUrl}">View Invoice</a></p>
          <p>If you have any questions, please reply to this email to contact the sender directly.</p>
        `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Invoice sent successfully!" });
  } catch (error) {
    console.error("Error in /send-invoice:", error);
    res.status(500).json({
      message: "Failed to send invoice",
      error: error.message,
    });
  }
});

// API to get invoice by ID
app.get("/invoice/:invoiceId", async (req, res) => {
  const invoiceId = req.params.invoiceId;

  try {
    const invoice = await Invoice.findById(invoiceId);
    if (!invoice) {
      return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch invoice", error: error.message });
  }
});

module.exports = app;
