// src/App.jsx

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CreateInvoice from "./components/createInvoice";
import InvoicePage from "./components/invoicePage";

const App = () => {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<CreateInvoice />} />
        <Route path="/invoice/:invoiceId" element={<InvoicePage />} />
      </Routes>
    </div>
  );
};

export default App;
