import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import { apiCall } from "../../services/api";
import Navbar from "@components/client/Navbar";
import FundsUtilizationChart from "@components/client/FundsUtilizationChart";
import Alert from "../../components/ui/Alert";

const AddFundsModal = ({ isOpen, onClose }) => {
  const [amount, setAmount] = useState("");
  const queryClient = useQueryClient();

  const addFundsMutation = useMutation(
    (amount) =>
      apiCall("/client/add-funds", "POST", { amount: parseFloat(amount) }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("clientData");
        onClose();
      },
    },
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    addFundsMutation.mutate(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <h3 className="font-bold text-lg mb-4">Add Funds</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            className="input input-bordered w-full"
          />
          <div className="modal-action">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add Funds
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const ClientDashboard = () => {
  const { logout } = useAuth();
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("open");
  const {
    data: clientData,
    isLoading,
    error,
  } = useQuery("clientData", () => apiCall("/client/dashboard"));

  console.log(clientData);

  if (isLoading)
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center">
        <div className="loading loading-lg"></div>
      </div>
    );
  if (error) return <Alert variant="destructive">{error.message}</Alert>;

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="container mx-auto p-4 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Client Dashboard</h1>
          <button onClick={logout} className="btn btn-error btn-outline">
            Logout
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Funds Overview</h2>
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="space-y-2">
                  <p>Total Cash: ${clientData.totalCash.toFixed(2)}</p>
                  <p>
                    Available to Trade: $
                    {clientData.availableToTrade.toFixed(2)}
                  </p>
                  <p>Margin Used: ${clientData.marginUsed.toFixed(2)}</p>
                </div>
                <FundsUtilizationChart
                  totalCash={clientData.totalCash.toFixed(2)}
                  availableToTrade={clientData.availableToTrade.toFixed(2)}
                  marginUsed={clientData.marginUsed.toFixed(2)}
                />
              </div>
              <button
                onClick={() => setIsAddFundsModalOpen(true)}
                className="btn btn-primary mt-4"
              >
                Add Funds
              </button>
            </div>
          </div>

          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title">Profile</h2>
              <p>Name: {clientData.name}</p>
              <p>User ID: {clientData.userId}</p>
              <button className="btn btn-outline btn-info mt-4">
                Change Password
              </button>
            </div>
          </div>
        </div>

        <div className="tabs tabs-boxed">
          <a
            className={`tab ${activeTab === "open" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("open")}
          >
            Open Positions
          </a>
          <a
            className={`tab ${activeTab === "closed" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("closed")}
          >
            Closed Positions
          </a>
          <a
            className={`tab ${activeTab === "trades" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("trades")}
          >
            Recent Trades
          </a>
        </div>

        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            {activeTab === "open" ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Stock Name</th>
                      <th>Quantity</th>
                      <th>Buy Price</th>
                      <th>Current Price</th>
                      <th>P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientData.positions
                      .filter((pos) => pos.status === "Open")
                      .map((position) => {
                        return (
                          <tr key={position.stockName}>
                            <td>{position.stockName}</td>
                            <td>{position.quantity}</td>
                            <td>${position.buyPrice.toFixed(2)}</td>
                            <td>${position.buyPrice.toFixed(2)}</td>
                            <td
                              className={
                                position.profitLoss >= 0
                                  ? "text-success"
                                  : "text-error"
                              }
                            >
                              ${position.profitLoss}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : activeTab === "closed" ? (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Stock Name</th>
                      <th>Quantity</th>
                      <th>Buy Price</th>
                      <th>Sell Price</th>
                      <th>P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientData.positions
                      .filter((pos) => pos.status === "Closed")
                      .map((position) => {
                        return (
                          <tr key={position.stockName}>
                            <td>{position.stockName}</td>
                            <td>{position.quantity}</td>
                            <td>${position.buyPrice.toFixed(2)}</td>
                            <td>${position.sellPrice.toFixed(2)}</td>
                            <td
                              className={
                                position.profitLoss >= 0
                                  ? "text-success"
                                  : "text-error"
                              }
                            >
                              ${position.profitLoss.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="table table-zebra w-full">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Stock</th>
                      <th>Type</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>P/L</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientData.transactionHistory.map((transaction, index) => (
                      <tr key={index}>
                        <td>
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td>{transaction.stockName}</td>
                        <td>{transaction.type}</td>
                        <td>{transaction.quantity}</td>
                        <td>${transaction.price}</td>
                        <td
                          className={
                            transaction.profitLoss >= 0
                              ? "text-success"
                              : "text-error"
                          }
                        >
                          ${transaction.profitLoss.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <AddFundsModal
          isOpen={isAddFundsModalOpen}
          onClose={() => setIsAddFundsModalOpen(false)}
        />
      </div>
    </div>
  );
};
