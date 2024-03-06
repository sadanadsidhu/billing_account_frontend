import React, { useState } from "react";
import "./invoice.css";
import { NotificationManager } from "react-notifications";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf"

const Invoice = ({ transactionResponse }) => {
  const [isInvoicePrinted, setIsInvoicePrinted] = useState(false);

  // console.log("transactionResponse: ", transactionResponse);
  const handlePrint = async (printerUUID) => {
    try {
      if (!navigator.bluetooth) {
        throw new Error("Web Bluetooth API is not supported in this browser.");
      }

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: [printerUUID] }],
      });

      const server = await device.gatt.connect();

      // Construct the invoice data as a string
      const invoiceData = `
        Transaction No: ${transactionResponse.transaction.transactionNo || "No Data"}
        Transaction Date: ${transactionResponse.transaction.date
          ? new Date(transactionResponse.transaction.date).toISOString().split("T")[0]
          : "No Data"}
        Account No: ${transactionResponse.account.accountNumber || "No Data"}
        Account Type: ${transactionResponse.account.accountType || "No Data"}
        Name: ${transactionResponse.account.name || "No Data"}
        Address: ${transactionResponse.account.address || "No Data"}
        Aadhar No: ${transactionResponse.account.aadharNo || "No Data"}
        Mobile No: ${transactionResponse.account.mobileNo || "No Data"}
        Amount: ${transactionResponse.transaction.amount || "No Data"}
        Transaction Type: ${transactionResponse.transaction.transactionType || "No Data"}
        Closing Balance: ${transactionResponse.account.closingBlance === 0
          ? "Insufficient Balance"
          : transactionResponse.account.closingBlance}
        Remarks: ${transactionResponse.transaction.remark || "No Data"}
      `;

      const encoder = new TextEncoder();
      await server.writeValueWithResponse(encoder.encode(invoiceData));

      setIsInvoicePrinted(true);
      NotificationManager.success("Invoice printed successfully via Bluetooth.")

      await server.disconnect();
    } catch (error) {
      console.error("Error printing via Bluetooth:", error);
    }
  };


  const printers = [
    { name: "Printer 1", uuid: "uuid_printer_1" },
    { name: "Printer 2", uuid: "uuid_printer_2" },
    { name: "Printer 3", uuid: "uuid_printer_3" },
    { name: "Printer 4", uuid: "uuid_printer_4" },
  ];

  /////


  return (
    
    <div className="container">
      <div className="invoice-container form-container">
        <h2 className="mb-2">Transaction Details</h2>
        <hr />
        <div className="invoice-content">
          <div className="invoice-header">
            <div className="invoice-header-item">
              <strong className="mr-1">Transaction No:</strong>
              {transactionResponse.transaction.transactionNo || "No Data"}
            </div>
            <div className="invoice-header-item">
              <strong className="mr-1">Transaction Date:</strong>
              {transactionResponse.transaction.date
                ? new Date(transactionResponse.transaction.date)
                    .toISOString()
                    .split("T")[0]
                : "No Data"}
            </div>
          </div>
          

          <div className="invoice-details">
            <div className="invoice-details-item">
              <strong className="mr-1">Account No:</strong>
              {transactionResponse.account.accountNumber || "No Data"}
            </div>
            <div className="invoice-details-item">
              <strong className="mr-1">Account Type:</strong>
              {transactionResponse.account.accountType || "No Data"}
            </div>
            <div className="invoice-details-item">
              <strong className="mr-1">Name:</strong>
              {transactionResponse.account.name || "No Data"}
            </div>
            <div className="invoice-details-item">
              <strong className="mr-1">Address:</strong>
              {transactionResponse.account.address || "No Data"}
            </div>
            <div className="invoice-details-item">
              <strong className="mr-1">Aadhar No:</strong>
              {transactionResponse.account.aadharNo || "No Data"}
            </div>
            <div className="invoice-details-item">
              <strong className="mr-1">Mobile No:</strong>
              {transactionResponse.account.mobileNo || "No Data"}
            </div>
          </div>

          <div className="invoice-footer">
            <div className="invoice-footer-item">
              <strong className="mr-1">Amount:</strong>
              {transactionResponse.transaction.amount || "No Data"}
            </div>
            <div className="invoice-footer-item">
              <strong className="mr-1">Transaction Type:</strong>
              {transactionResponse.transaction.transactionType || "No Data"}
            </div>
            <div className="invoice-footer-item">
              <strong className="mr-1">Closing Balance:</strong>
              {transactionResponse.account.closingBlance === 0
                ? "Insufficient Balance"
                : transactionResponse.account.closingBlance}
            </div>
          </div>

          <div className="invoice-remarks">
            <strong className="mr-1">Remarks:</strong>
            {transactionResponse.transaction.remark || "No Data"}
          </div>
        </div>
        <button className="btn-primary" id="print" onClick={handlePrint}>
          Print
        </button>

        <div>
          <h3>Select Printer:</h3>
          <ul>
            {printers.map((printer) => (
              <li key={printer.uuid}>
                <button onClick={() => handlePrint(printer.uuid)}>
                  Print with {printer.name}
                </button>
              </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default Invoice;
