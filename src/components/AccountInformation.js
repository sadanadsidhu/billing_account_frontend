import React from "react";
import Dropdown from "react-dropdown";
import axios from "axios";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import { apiDomain } from "../utilities/url";
import "react-notifications/lib/notifications.css";
import "react-dropdown/style.css";

const AccountInformation = ({
  formData,
  handleInputChange,
  handleClearFields,
}) => {
  const schemeOptions = ["Choose One", "DD", "MS", "FS", "LS", "SS"];
  const planOptions = ["Choose One", 12, 18, 25, 36, 48, 144];
  const defaultSchemeOption = schemeOptions[0];

  const _onSchemeSelect = (selectedOption) => {
    handleInputChange("schemeType", selectedOption.value);
  };

  const _onPlanNameChange = (selectedOption) => {
    handleInputChange("planName", selectedOption.value);
  };

  const handleCreateAccount = async () => {
    // if (
    //   !formData.accountNo ||
    //   !formData.name ||
    //   !formData.address ||
    //   !formData.aadharNo ||
    //   !formData.mobileNo ||
    //   !formData.openingBlance
    // ) 
    // {
    //   // NotificationManager.warning(
    //   //   "Please fill in all the required fields.",
    //   //   "Warning",
    //   //   2000
    //   // );
    //   return;
    // }

    if (!/^\d{10}$/.test(formData.mobileNo)) {
      NotificationManager.warning(
        "Please enter a valid 10-digit mobile number.",
        "Warning",
        2000
      );
      return;
    }

    // if (!/^\d{12}$/.test(formData.aadharNo)) {
    //   NotificationManager.warning(
    //     "Please enter a valid 12-digit Aadhar number.",
    //     "Warning",
    //     2000
    //   );
    //   return;
    // }

    try {
      const response = await axios.post(`${apiDomain}/create`, {
      
    accountNumber: formData.accountNo,
    Name: formData.name,
    S_O_Name: formData.careOf,
    Address: formData.address,
    mobileNo: formData.mobileNo,
    PanNo: formData.pan,
    SchemeType: formData.schemeType,
    PlanName: formData.planName,
    CustomerId: "2022", // Assuming CustomerId is a string
    OpeningDate: new Date(formData.Opening_Date),
    InsatllmentAmount: formData.Installment_Amount,
    Period: formData.Period,
    PeriodInterest: formData.Period_Interest,
    DepositAmount: formData.Deposit_Amount,
    DepositInterest: formData.Deposit_Interest,
    Maturity: new Date(formData.Maturity),
    MaturityAmount: formData.Maturity_Amount,
    OpeningBalance: formData.Opening_Balance,
    ClosingBalance: formData.Closing_Balance,
        }
      );

      // console.log("Create account response:", response);
      if (response) {
        NotificationManager.success("Account created successfully.", "Success");
      }
      handleClearFields();
    } catch (error) {
      console.error("Create account error:", error);
      if (error.response.status === 409) {
        NotificationManager.error(
          "Account number or phone number already exists.",
          "Error"
        );
      } else {
      NotificationManager.error(
        "Failed to create account. Please try again.",
        "Error"
      );
      }
    }
  };

  return (
    <div className="container">
      <div className="form-container">
        <h2 className="form-header mb-2 mt-1">Account Information</h2>
        <div className="form-control">
          <label>Account Number:*</label>
          <input
            type="number"
            value={formData.accountNo}
            placeholder="Enter Account Number"
            onChange={(e) => handleInputChange("accountNo", e.target.value)}
            min="0"
          />
        </div>

        <div className="form-control">
          <label>Name:*</label>
          <input
            type="text"
            value={formData.name}
            placeholder="Enter Name"
            onChange={(e) => handleInputChange("name", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>S/o or W/o or D/o:*</label>
          <input
            type="text"
            value={formData.careOf}
            placeholder="Enter Care of Name"
            onChange={(e) => handleInputChange("careOf", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Address:*</label>
          <input
            type="text"
            value={formData.address}
            className="large-textbox"
            placeholder="Enter Address"
            onChange={(e) => handleInputChange("address", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Mobile Number:*</label>
          <input
            type="tel"
            value={formData.mobileNo}
            placeholder="Enter Mobile Number"
            onChange={(e) => handleInputChange("mobileNo", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>PAN:*</label>
          <input
            type="text"
            value={formData.pan}
            placeholder="Enter PAN"
            onChange={(e) => handleInputChange("pan", e.target.value)}
            min="0"
          />
        </div>

        <div className="form-control">
          <label>Scheme Type:*</label>
          <Dropdown
            options={schemeOptions}
            onChange={_onSchemeSelect}
            value={defaultSchemeOption}
            placeholder="Select Scheme Type"
          />
        </div>

        <div className="form-control">
          <label>Plan Name:*</label>
          <Dropdown
            options={planOptions}
            onChange={_onPlanNameChange}
            value={planOptions[0]}
            placeholder="Select Plan Name"
          />
        </div>

        <div className="form-control">
          <label>Customer ID:*</label>
          <input
            type="number"
            value={formData.custId}
            placeholder="Enter Customer ID"
            onChange={(e) => handleInputChange("custId", e.target.value)}
            min="0"
          />
        </div>

        <div className="form-control">
          <label>Openning Date:*</label>
          <input
            type="date"
            value={formData.openningDate}
            placeholder="Enter Openning Date"
            onChange={(e) => handleInputChange("openningDate", e.target.value)}
          />
        </div>

        <div className="form-control">
          <label>Installment Amount:*</label>
          <input
            type="number"
            value={formData.installmentAmt}
            placeholder="Enter Installment Amount(₹)"
            onChange={(e) =>
              handleInputChange("installmentAmt", parseFloat(e.target.value))
            }
            min="0"
          />
        </div>

        <div className="form-control">
          <div className="input-wrapper mr-1">
            <label>Period:*</label>
            <input
              type="number"
              value={formData.period}
              placeholder="Enter Period"
              onChange={(e) =>
                handleInputChange("period", parseFloat(e.target.value))
              }
              min="0"
            />
          </div>
          <div className="input-wrapper">
            <label>Period Interest:*</label>
            <input
              type="number"
              value={formData.periodsInterest}
              placeholder="Enter Period Interest"
              onChange={(e) =>
                handleInputChange("periodsInterest", parseFloat(e.target.value))
              }
              min="0"
            />
          </div>
        </div>

        <div className="form-control">
          <div className="input-wrapper mr-1">
            <label>Deposit Amount:*</label>
            <input
              type="number"
              value={formData.depostAmt}
              placeholder="Enter Deposit Amount(₹)"
              onChange={(e) =>
                handleInputChange("depostAmt", parseFloat(e.target.value))
              }
              min="0"
            />
          </div>
          <div className="input-wrapper">
            <label>Deposit Interest:*</label>
            <input
              type="number"
              value={formData.depostAmtInterest}
              placeholder="Enter Deposit Intererst"
              onChange={(e) =>
                handleInputChange(
                  "depostAmtInterest",
                  parseFloat(e.target.value)
                )
              }
              min="0"
            />
          </div>
        </div>

        <div className="form-control">
          <div className="input-wrapper mr-1">
            <label>Maturity:*</label>
            <input
              type="date"
              value={formData.maturityDate}
              placeholder="Enter Maturity Date"
              onChange={(e) =>
                handleInputChange("maturityDate", e.target.value)
              }
             
            />
          </div>
          <div className="input-wrapper">
            <label>Maturity Amount:*</label>
            <input
              type="number"
              value={formData.maturityAmt}
              placeholder="Enter Maturity Amount(₹)"
              onChange={(e) =>
                handleInputChange("maturityAmt", parseFloat(e.target.value))
              }
              min="0"
            />
          </div>
        </div>

        <div className="form-control">
          <div className="input-wrapper mr-1">
            <label>Opening Balance:*</label>
            <input
              type="number"
              value={formData.openingBlance}
              placeholder="Opening Balance"
              onChange={(e) =>
                handleInputChange("openingBlance", parseFloat(e.target.value))
              }
              min="0"
            />
          </div>
          <div className="input-wrapper">
            <label>Closing Balance:*</label>
            <input
              type="number"
              value={formData.openingBlance}
              placeholder="Closing Balance"
              min="0"
              readOnly
              disabled
            />
          </div>
        </div>

        <div className="button-wrapper mt-1">
          <button className="btn-light" onClick={handleClearFields}>
            Clear
          </button>
          <button className="btn-light" onClick={handleClearFields}>
            Send
          </button>
          <button className="btn-primary" onClick={handleCreateAccount}>
            Create
          </button>
        </div>
        <NotificationContainer />
      </div>
    </div>
  );
};

export default AccountInformation;
