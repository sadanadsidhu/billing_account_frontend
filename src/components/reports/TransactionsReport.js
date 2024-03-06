import React, { useState, useEffect } from "react";
import axios from "axios";
import { apiDomain } from "../../utilities/url";
import { NotificationManager } from "react-notifications";
import "./reports.css";
import { CircularProgress } from "@mui/material";

const TransactionsReport = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [editStatus, setEditStatus] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  console.log("transactions: ", transactions);

  useEffect(() => {
    fetchTransactions();
  }, []);
  console.log("trnastionnnnnnn", transactions);
  const fetchTransactions = async () => {
    try {
      const response = await axios.get(`${apiDomain}/transc/report`);
      console.log("Transaction response: ", response);
      setTransactions(response.data.data || []);

      const initialEditStatus = (response.data.data || []).reduce(
        (acc, curr) => ({ ...acc, [curr._id]: false }),
        {}
      );
      setEditStatus(initialEditStatus);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      setLoading(false);
    }
  };

  const handleRowClick = (transactionId) => {
    setSelectedRowId(transactionId);
  };

  const handleDeleteRow = async (transactionId) => {
    try {
      await axios.delete(
        `${apiDomain}/transc/delete/${transactionId}`
      );
      setTransactions(
        transactions.filter((transaction) => transaction._id !== transactionId)
      );
      NotificationManager.success(`Row deleted successfully`, "Success");
    } catch (error) {
      console.error("Error deleting transaction:", error);
      NotificationManager.error("Failed to delete row", "Error");
    }
  };

  const handleEditSaveClick = async (accountId) => {};

  const handleFieldChange = (transactionId, fieldName, value) => {
    const updatedTransactions = transactions.map((transaction) => {
      if (transaction._id === transactionId) {
        return { ...transaction, [fieldName]: value };
      }
      return transaction;
    });
    setTransactions(updatedTransactions);
  };

  return (
    <div className="transactions-report">
      <div className="table-report-header">
        <h3>Transactions Report</h3>
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
            <th>Serial Number</th>
            <th>Transaction Number</th>
            <th>Account Number</th>
            <th>Account Type</th>
            <th>Account Holder's Name</th>
            <th>Address</th>
            <th>Transaction Type</th>
            <th>Transaction Amount</th>
            <th>Transaction Date</th>
            <th>Remarks</th>
            <th>Action</th>
          </tr>
        </thead>
        {loading ? (
          <tbody>
            <tr>
              <td colSpan="12" className="circular-loader">
                <CircularProgress />
              </td>
            </tr>
          </tbody>
        ) : transactions.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan="12" className="no-data-text">
                No Data Available
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {transactions
              .filter((item) => {
                const searchLower = search.toLowerCase();
                return (
                  searchLower === "" ||
                  String(item.transactionNo)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.accountNumber)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.accountHolderId?.accountType)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.accountHolderId?.Name)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.accountHolderId?.address)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.transactionType)
                    .toLowerCase()
                    .includes(searchLower) ||
                  String(item.amount).toLowerCase().includes(searchLower) ||
                  String(item.date).toLowerCase().includes(searchLower) ||
                  String(item.remark).toLowerCase().includes(searchLower)
                );
              })
              .map((item, key) => (
                <tr
                  key={item._id}
                  className={selectedRowId === item._id ? "selected-row" : ""}
                  onClick={() => handleRowClick(item._id)}
                >
                  <td>{key}</td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.transactionNo || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item._id,
                            "transactionNo",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      item.transactionNo || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.accountNumber || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item._id,
                            "accountNumber",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      item.accountNumber || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.accountHolderId?.accountType || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item._id,
                            "accountType",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      item.accountHolderId?.accountType || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.accountHolderId?.Name || ""}
                        onChange={(e) =>
                          handleFieldChange(item._id, "name", e.target.value)
                        }
                      />
                    ) : (
                      item.Name || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.accountHolderId?.address || ""}
                        onChange={(e) =>
                          handleFieldChange(item._id, "Address", e.target.value)
                        }
                      />
                    ) : (
                      item.Address || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.transactionType || ""}
                        onChange={(e) =>
                          handleFieldChange(
                            item._id,
                            "transactionType",
                            e.target.value
                          )
                        }
                      />
                    ) : (
                      item.transactionType || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.amount || ""}
                        onChange={(e) =>
                          handleFieldChange(item._id, "amount", e.target.value)
                        }
                      />
                    ) : (
                      item.amount || ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={
                          item.date
                            ? new Date(item.date).toISOString().split("T")[0]
                            : ""
                        }
                        onChange={(e) =>
                          handleFieldChange(item._id, "date", e.target.value)
                        }
                      />
                    ) : item.date ? (
                      new Date(item.date).toISOString().split("T")[0]
                    ) : (
                      ""
                    )}
                  </td>
                  <td>
                    {editStatus[item._id] ? (
                      <input
                        type="text"
                        value={item.remark || ""}
                        onChange={(e) =>
                          handleFieldChange(item._id, "remark", e.target.value)
                        }
                      />
                    ) : (
                      item.remark || ""
                    )}
                  </td>
                  <td className="button-wrapper">
                    {editStatus[item._id] ? (
                      <button
                        className="edit-button"
                        onClick={() => handleEditSaveClick(item._id)}
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        className="edit-button"
                        onClick={() =>
                          setEditStatus({ ...editStatus, [item._id]: true })
                        }
                      >
                        Edit
                      </button>
                    )}
                    <button
                      className="delete-button"
                      onClick={() => handleDeleteRow(item._id)}
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

export default TransactionsReport;


