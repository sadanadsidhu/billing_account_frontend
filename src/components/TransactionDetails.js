import React, { useEffect, useState } from "react";
import Dropdown from "react-dropdown";
import axios from "axios";
import { NotificationManager } from "react-notifications";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router";
import { apiDomain } from "../utilities/url";
import "react-dropdown/style.css";
import "react-notifications/lib/notifications.css";

const TransactionDetails = ({
  formData,
  handleInputChange,
  setTransactionResponse,
  isInvoicePrinted,
  setIsInvoicePrinted,
  handleClearFields,
}) => {
  const [accountData, setAccountData] = useState(null);
  const transactionTypeOptions = ["received", "payment"];

  const navigate = useNavigate();

  const handleTransactionSubmission = async () => {
    // Validation check
    if (!formData.accountNo || !formData.transactionType || !formData.amount) {
      NotificationManager.warning(
        "Please fill in all the required fields.",
        "Warning",
        2000
      );
      return;
    }

    if (!formData.transactionDate) {
      const currentDate = new Date().toISOString().slice(0, 10);
      handleInputChange("transactionDate", currentDate);
    }

    try {
      // let closingBalance = formData.closingBlance;

      // if (formData.amount !== "") {
      //   if (formData.transactionType === "receive") {
      //     closingBalance += formData.amount;
      //   } else if (formData.transactionType === "payment") {
      //     closingBalance -= formData.amount;
      //   }
      // }

      const response = await axios.post(
        `${apiDomain}/transc/create`,
        {
          accountHolderId: accountData._id,
          accountNumber: formData.accountNo,
          Amount: formData.Amount,
          remark: formData.remarks,
          // closingBlance: closingBalance,
          transactionType: formData.transactionType,
        }
      );
      if (
        response?.data?.data === "Insuficent blance" ||
        response?.data?.data === "Insufficient balance"
      ) {
        NotificationManager.warning(
          "Insufficient Balance. Please try again.",
          "Error"
        );
        return;
      } else if (
        response?.data?.statusCode === 200 &&
        response?.data?.data === "Insuficent blance"
      ) {
        NotificationManager.warning(
          "Insufficient Balance. Please try again.",
          "Error"
        );
        return;
      }

      console.log("Transaction create response:", response);
      NotificationManager.success(
        "Transaction submitted successfully.",
        "Success",
        1000
      );
      handleClearFields();
      setTransactionResponse(response?.data?.data);
      navigate("/invoice");
    } catch (error) {
      console.error("Transaction create error:", error);
      NotificationManager.error(
        "Failed to submit transaction. Please try again.",
        "Error"
      );
    }
  };

  useEffect(() => {
    if (isInvoicePrinted) {
      handleClearFields();
      setIsInvoicePrinted(false);
    }
  }, [isInvoicePrinted,handleClearFields,setIsInvoicePrinted]);

  const fetchAccountDetailsDebounced = debounce(async (accountNo) => {
    try {
      const response = await axios.get(
        `${apiDomain}/${accountNo}`
      );
      setAccountData(response.data.data);
    } catch (error) {
      console.error("Fetch account details error:", error);
      handleClearFields();
      NotificationManager.error(
        "No account details found with the provided account number. Please try again.",
        "Error"
      );
    }
  }, 1000);

  useEffect(() => {
    if (formData.accountNo) {
      fetchAccountDetailsDebounced(formData.accountNo);
    } else {
      setAccountData(null);
    }

    return () => {
      fetchAccountDetailsDebounced.cancel();
    };
  }, [formData.accountNo]);

  useEffect(() => {
    if (accountData && !areAccountDetailsEqual(accountData, formData)) {
      handleInputChange("accountType", accountData.accountType || "");
      handleInputChange("Name", accountData.Name || "");
      handleInputChange("Address", accountData.Address || "");
      handleInputChange("aadharNo", accountData.aadharNo || "");
      handleInputChange("mobileNo", accountData.mobileNo || "");
      handleInputChange("openingBlance", accountData.openingBlance || "");
      handleInputChange("closingBlance", accountData.closingBlance || "");
    }
  }, [accountData,formData]);

  const areAccountDetailsEqual = (accountData, formData) => {
    return (
      accountData.accountType === formData.accountType &&
      accountData.Name === formData.Name &&
      accountData.Address === formData.aAdress &&
      accountData.aadharNo === formData.aadharNo &&
      accountData.mobileNo === formData.mobileNo &&
      accountData.openingBlance === formData.openingBlance &&
      accountData.closingBlance === formData.closingBlance
    );
  };

  // useEffect(() => {
  //   if (!formData.amount) {
  //     handleInputChange("closingBlance", formData.closingBlance);
  //   }
  //   else if (formData.transactionType === "receive") {
  //     console.log("closingBalance", formData.closingBlance)
  //     handleInputChange("closingBlance", formData.closingBlance + formData.amount);

  //   } else if (formData.transactionType === "payment") {
  //     console.log("closingBalance2 ", formData.closingBlance)
  //     handleInputChange("closingBlance", formData.closingBlance - formData.amount);
  //   }
  // }, [formData.transactionType, formData.amount]);

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-header mb-2 mt-1">Transaction Details</h2>

        <div className="form-control">
          <label>Account no:</label>
          <input
            type="number"
            value={formData.accountNo}
            onChange={(e) => handleInputChange("accountNo", e.target.value)}
            min="0"
          />
        </div>

        {/* Additional fields for displaying account data */}
        {accountData && (
          <>
            <div className="form-control">
              <label>Account Type:*</label>
              <input type="text" value={formData.accountType} disabled />
            </div>

            <div className="form-control">
              <label>Account Holder:*</label>
              <input type="text" value={formData.Name} disabled />
            </div>

            <div className="form-control">
              <label>Address:*</label>
              <input type="text" value={formData.Address} disabled />
            </div>

            <div className="form-control">
              <label>Aadhar Number:*</label>
              <input type="number" value={formData.aadharNo} disabled />
            </div>

            <div className="form-control">
              <label>Mobile Number:*</label>
              <input type="number" value={formData.mobileNo} disabled />
            </div>

            <div className="form-control">
              <label>Closing Balance:*</label>
              <input type="number" value={formData.closingBlance} disabled />
            </div>
          </>
        )}
        {/* Additional fields for displaying account data end */}

        <div className="form-control">
          <label>Transaction Type:*</label>
          <Dropdown
            options={transactionTypeOptions}
            onChange={(selected) =>
              handleInputChange("transactionType", selected.value)
            }
            value={formData.transactionType}
            placeholder="Select transaction type"
          />
        </div>

        <div className="form-control">
          <label>Amount:*</label>
          <input
            type="number"
            value={formData.amount}
            onChange={(e) =>
              handleInputChange("amount", parseFloat(e.target.value))
            }
          />
        </div>

        <div className="form-control">
          <label>Transaction date:*</label>
          <input
            type="date"
            value={formData.transactionDate}
            onChange={(e) =>
              handleInputChange("transactionDate", e.target.value)
            }
          />
        </div>

        <div className="form-control">
          <label>Remarks:</label>
          <input
            type="text"
            className="large-textbox"
            value={formData.remarks}
            onChange={(e) => handleInputChange("remarks", e.target.value)}
          />
        </div>

        <button className="btn-light" onClick={handleClearFields}>
          Clear
        </button>

        <button className="btn-primary" onClick={handleTransactionSubmission}>
          Submit
        </button>
      </div>
    </div>
  );
};

export default TransactionDetails;
