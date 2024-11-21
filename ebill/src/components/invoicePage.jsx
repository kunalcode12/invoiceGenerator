import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const InvoicePage = () => {
  const { invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/invoice/${invoiceId}`
        );
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice:", error);
      }
    };

    fetchInvoice();
  }, [invoiceId]);

  const handlePayment = async () => {
    setIsLoading(true);
    setPaymentStatus("");

    setTimeout(async () => {
      try {
        // Simulating API call
        // const response = await axios.post(`http://localhost:3000/pay/${invoiceId}`);
        // if (response.status === 200) {
        setPaymentStatus("Payment successful!");
        setInvoice({ ...invoice, isPaid: true });
        // }
      } catch (error) {
        console.error("Error processing payment:", error);
        setPaymentStatus("Payment failed!");
      } finally {
        setIsLoading(false);
      }
    }, 2000);
  };

  if (!invoice) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Invoice Details
        </h2>
        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Amount:</span>{" "}
            <span className="text-green-600 font-bold">${invoice.amount}</span>
          </p>
        </div>
        <div className="mb-6">
          <p className="text-gray-600">
            <span className="font-semibold">Description:</span>{" "}
            {invoice.description}
          </p>
        </div>

        {invoice.isPaid ? (
          <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-4">
            <p className="font-bold">The invoice is already paid.</p>
          </div>
        ) : (
          <>
            <button
              onClick={handlePayment}
              disabled={isLoading}
              className={`w-full py-2 px-4 rounded ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white font-bold transition duration-200"
              }`}
            >
              {isLoading ? "Processing..." : "Pay Now"}
            </button>
            {isLoading && (
              <div className="mt-4 w-full bg-gray-200 rounded-full h-2.5">
                <div className="bg-blue-600 h-2.5 rounded-full animate-[loading_2s_ease-in-out_infinite]"></div>
              </div>
            )}
            {paymentStatus && (
              <div
                className={`mt-4 p-4 rounded ${
                  paymentStatus.includes("successful")
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {paymentStatus}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default InvoicePage;
