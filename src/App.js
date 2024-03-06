import React, { useState, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";
import "./App.css";
import SignInForm from "./components/SignInForm";
import SignUpForm from "./components/SignUpForm";
import Invoice from "./components/invoice/Invoice";
import AccountInformation from "./components/AccountInformation";
import TransactionDetails from "./components/TransactionDetails";
import AccountsReport from "./components/reports/AccountsReport";
import TransactionsReport from "./components/reports/TransactionsReport";

const ProtectedRoute = lazy(() => import("./ProtectedRoute"));

function App() {
  const [authenticatedUser, setAuthenticatedUser] = useState(null);
  const [transactionResponse, setTransactionResponse] = useState({});
  const [isInvoicePrinted, setIsInvoicePrinted] = useState(false);

  const [formData, setFormData] = useState({
    accountNo: "",
    name: "",
    careOf: "",
    address: "",
    pan: "",
    schemeType: "",
    planName: "",
    custId: "",
    openningDate: "",
    mobileNo: "",
    installmentAmt: "",
    period: "",
    periodsInterest: "",
    depostAmt: "",
    depostAmtInterest: "",
    maturityDate: "",
    maturityAmt: "",
    openingBlance: "",
    closingBlance: "",
    transactionType: "",
    amount: "",
    transactionDate: "",
    remarks: "",
  });

  const handleClearFields = () => {
    handleInputChange("accountNo", "");
    handleInputChange("accountType", "saving");
    handleInputChange("name", "");
    handleInputChange("address", "");
    handleInputChange("aadharNo", "");
    handleInputChange("mobileNo", "");
    handleInputChange("openingBlance", "");
    handleInputChange("closingBlance", "");
    handleInputChange("transactionType", "");
    handleInputChange("amount", "");
    handleInputChange("transactionDate", "");
    handleInputChange("remarks", "");
  };

  const handleSignIn = (username) => {
    console.log("username: ", username);
    setAuthenticatedUser(username);
    handleClearFields();
  };

  const handleSignUp = (username) => {
    setAuthenticatedUser(username);
  };

  const handleSignOut = () => {
    setAuthenticatedUser(null);
    handleClearFields();
  };

  const handleInputChange = (field, value) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData((prevData) => ({ ...prevData, image: file }));
  };

  const handlePrint = () => {
    console.log("Printing...");
    window.print();
    setIsInvoicePrinted(true);
  };

  return (
    <Router basename="/">
      <Navbar
        handleSignOut={handleSignOut}
        handleSignIn={handleSignIn}
        authenticatedUser={authenticatedUser}
      />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <SignInForm
              handleSignIn={handleSignIn}
              handleClearFields={handleClearFields}
            />
          }
        />
        <Route
          path="/signin"
          element={
            <SignInForm
              handleSignIn={handleSignIn}
              handleClearFields={handleClearFields}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignUpForm
              handleSignUp={handleSignUp}
              handleClearFields={handleClearFields}
            />
          }
        />
      </Routes>

      <ProtectedRoute
        path="/accounts"
        element={
          <AccountInformation
            formData={formData}
            handleInputChange={handleInputChange}
            handleImageChange={handleImageChange}
            handleClearFields={handleClearFields}
          />
        }
        isAuthenticated={authenticatedUser !== null}
      />

      <ProtectedRoute
        path="/transactions"
        element={
          <TransactionDetails
            formData={formData}
            handleInputChange={handleInputChange}
            setTransactionResponse={setTransactionResponse}
            isInvoicePrinted={isInvoicePrinted}
            setIsInvoicePrinted={setIsInvoicePrinted}
            handleClearFields={handleClearFields}
          />
        }
        isAuthenticated={authenticatedUser !== null}
      />

      <ProtectedRoute
        path="/invoice"
        element={
          <Invoice
            formData={formData}
            handlePrint={handlePrint}
            transactionResponse={transactionResponse}
          />
        }
        isAuthenticated={authenticatedUser !== null}
      />

      <ProtectedRoute
        path="/accounts-report"
        element={<AccountsReport />}
        isAuthenticated={authenticatedUser !== null}
      />

      <ProtectedRoute
        path="/transactions-report"
        element={<TransactionsReport />}
        isAuthenticated={authenticatedUser !== null}
      />
      <NotificationContainer />
    </Router>
  );
}

export default App;
