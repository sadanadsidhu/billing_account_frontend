import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiDomain } from "../../utilities/url";
import { NotificationManager } from "react-notifications";
import { CircularProgress } from "@mui/material";
import "./reports.css";

const AccountsReport = () => {
  const [accounts, setAccounts] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editStatus, setEditStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetchAccounts();
  }, []);



  const fetchAccounts = async () => {
    try {
      const response = await axios.get(`${apiDomain}/get-all`); 
      setAccounts(response.data.data || []);
     

      const initialEditStatus = (response.data.data || []).reduce(
        (acc, curr) => ({ ...acc, [curr._id]: false }),
        {}
      );

      setEditStatus(initialEditStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching accounts:", error);
      setLoading(false);
    }
  };
 
  const handleRowClick = (accountId) => {
    setSelectedRowId(accountId);
  };

  const handleDeleteRow = async (accountId) => {
    try {
      await axios.delete(`${apiDomain}/delete/${accountId}`);

      setAccounts(accounts.filter((account) => account._id !== accountId));
      NotificationManager.success(`Row deleted successfully`, "Success");
    } catch (error) {
      console.error("Error deleting account:", error);
      NotificationManager.error("Failed to delete row", "Error");
    }
  };

  const handleEditSaveClick = async (accountId) => {
    console.log("accountId handleEditSaveClick ", accountId);
    setEditStatus({ ...editStatus, [accountId]: false });
    console.log("editStatus handleEditSaveClick ", editStatus);

    const updatedAccount = accounts.find(
      (account) => account._id === accountId
    );
    console.log("updatedAccount ---> ", updatedAccount);

    try {
      const response = await axios.put(
        `${apiDomain}/update/${accountId}`,
        updatedAccount
      );
      console.log("Account updated: ", response.data.data);

      const updatedAccounts = accounts.map((account) =>
        account._id === accountId ? response.data.data : account
      );
      setAccounts(updatedAccounts);
      NotificationManager.success("Row updated successfully");
    } catch (error) {
      console.error("Error updating account:", error);
      NotificationManager.error("Failed to update row");
    }
  };

  const handleFieldChange = (accountId, fieldName, value) => {
    const updatedAccounts = accounts.map((account) => {
      if (account._id === accountId) {
        return { ...account, [fieldName]: value };
      }
      return account;
    });
    setAccounts(updatedAccounts);
  };

  // console.log(search);

  return (
    <div className="accounts-report">
      <div className="table-report-header">
        <h3>Accounts Report</h3>
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search Here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <table className="table-report-wrapper">
        <thead>
          <tr>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Name</th>
            <th>Address</th>
            <th>Mobile No</th>
            <th>Opening Balance</th>
            <th>Closing Balance</th>
            <th>Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="8" className="circular-loader">
                <CircularProgress />
              </td>
            </tr>
          </tbody>
        ) : accounts.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="8" className="no-data-text">
                No Data Available
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {accounts
              .filter((item) => {
                const searchLower = search.toLowerCase();
                return (
                  searchLower === "" ||
                  String(item.accountNumber)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.accountType)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.name).toLowerCase().includes(searchLower) ||
                  String(item.address).toLowerCase().includes(searchLower) ||
                  String(item.mobileNo).toLowerCase().includes(searchLower) ||
                  String(item.openingBlance)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.closingBlance)
                    .toLowerCase()
                    .includes(searchLower)
                );
              })
              .map((account) => (
                <tr
                  key={account._id}
                  className={
                    selectedRowId === account._id ? "selected-row" : ""
                  }
                  onClick={() => handleRowClick(account._id)}
                >
                  <td>
                    {editStatus[account._id] ? (
                      <input
                        type="text"
                        value={account.accountNumber}
                        onChange={(e) =>
                          handleFieldChange(
                            account._id,
                            "accountNumber",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      account.accountNumber || ""
                    )}
                  </td>
                  <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.accountType}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "accountType",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        account.accountType || ""
                      )}
                    </td>
                    <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.name}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "name",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        account.Name || ""
                      )}
                    </td>
                    <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.address}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "address",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        account.Address || ""
                      )}
                    </td>
                    <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.mobileNo}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "mobileNo",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        account.mobileNo || ""
                      )}
                    </td>
                    <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.OpeningBalance}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "openingBlance",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        account.OpeningBalance || ""
                      )}
                    </td>
                    <td>
                      {editStatus[account._id] ? (
                        <input
                          type="text"
                          value={account.ClosingBalance}
                          onChange={(e) =>
                            handleFieldChange(
                              account._id,
                              "closingBlance",
                              e.target.value
                            )
                            // kya karna hai?
                            
                          }
                        />
                      ) : (
                        account.ClosingBalance || ""
                      )}
                    </td>
                    <td className="button-wrapper">
                      {editStatus[account._id] ? (
                        <button
                          className="edit-button"
                          onClick={() => handleEditSaveClick(account._id)}
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          className="edit-button"
                          onClick={() =>
                            setEditStatus({
                              ...editStatus,
                              [account._id]: true,
                            })
                          }
                        >
                          Edit
                        </button>
                      )}
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteRow(account._id)}
                      >
                        Delete
                      </button>
                    </td>
                </tr>
              ))}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default AccountsReport;


