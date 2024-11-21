import React, { useState } from "react";
import axios from "axios";

function InvoiceForm() {
  const [email, setEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceCreated, setInvoiceCreated] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [message, setMessage] = useState("");

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  const handleCreateInvoice = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/generate-invoice",
        {
          email,
          amount,
          description,
        }
      );

      if (response.status === 200) {
        setInvoiceCreated(true);
        setInvoiceId(response.data.invoiceId);

        setMessage("Invoice created successfully! Review it below.");
      }
    } catch (error) {
      console.error("Error creating invoice:", error);
      setMessage("Failed to create invoice");
    }
  };

  const handleSendInvoice = async () => {
    try {
      console.log("Sending invoice with ID:", invoiceId);
      console.log("Recipient email:", recipientEmail);

      const response = await axios.post("http://localhost:3000/send-invoice", {
        invoiceId,
        recipientEmail,
      });

      if (response.status === 200) {
        setMessage("Invoice sent successfully!");
      }
    } catch (error) {
      console.error("Error sending invoice:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
        console.error("Response status:", error.response.status);
        console.error("Response headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error message:", error.message);
      }
      setMessage(
        "Failed to send the invoice: " +
          (error.response?.data?.message || error.message)
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Create Invoice
        </h2>
        {!showPreview ? (
          <form onSubmit={handlePreview} className="space-y-4">
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter client's email"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Amount
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-gray-600 font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description of the invoice"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Preview Invoice
            </button>
          </form>
        ) : !invoiceCreated ? (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Invoice Preview
            </h3>
            <div className="space-y-2 mb-4">
              <p>
                <strong>Amount:</strong> ${amount}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>
            <button
              onClick={handleCreateInvoice}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200"
            >
              Create Invoice
            </button>
            <button
              onClick={() => setShowPreview(false)}
              className="w-full mt-2 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
            >
              Edit
            </button>
          </>
        ) : (
          <>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Invoice Created
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Amount:</strong> ${amount}
              </p>
              <p>
                <strong>Description:</strong> {description}
              </p>
              <p>
                <strong>Email:</strong> {email}
              </p>
            </div>

            <div className="mt-6">
              <label className="block text-gray-600 font-medium mb-2">
                Send Invoice To
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Recipient's email"
              />
            </div>

            <button
              onClick={handleSendInvoice}
              className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition duration-200 mt-4"
            >
              Send Invoice
            </button>

            {message && (
              <p className="mt-4 text-center text-green-600 font-medium">
                {message}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default InvoiceForm;
