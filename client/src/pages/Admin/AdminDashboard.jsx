import { useState, lazy, Suspense } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { useAuth } from "../../hooks/useAuth";
import {
  fetchClients,
  fetchStocks,
  manageStock,
  createUser,
  buyStockForClient,
  sellStockForClient,
} from "../../services/api";
import { toast } from "react-toastify";

const ClientTable = lazy(() => import("../../components/admin/ClientTable"));
const StockTable = lazy(() => import("../../components/admin/StockTable"));
const ClientPositions = lazy(
  () => import("../../components/admin/ClientPositions"),
);
const Modal = lazy(() => import("../../components/common/Modal"));

const LoadingSpinner = () => (
  <div className="flex justify-center items-center">
    <span className="loading loading-spinner loading-lg"></span>
  </div>
);

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("clients");
  const [selectedClient, setSelectedClient] = useState(null);
  const [isUserFormOpen, setIsUserFormOpen] = useState(false);
  const [isStockFormOpen, setIsStockFormOpen] = useState(false);
  const [isTradeFormOpen, setIsTradeFormOpen] = useState(false);
  const [userForm, setUserForm] = useState({
    name: "",
    userId: "",
    email: "",
    password: "",
    totalCash: "",
  });
  const [stockForm, setStockForm] = useState({
    stockName: "",
    stockSymbol: "",
    price: "",
    availableQuantity: "",
  });
  const [tradeForm, setTradeForm] = useState({
    clientId: "",
    stockId: "",
    quantity: "",
    action: "buy",
  });

  const { data: clients, isLoading: isLoadingClients } = useQuery(
    "clients",
    fetchClients,
  );
  const { data: stocks, isLoading: isLoadingStocks } = useQuery(
    "stocks",
    fetchStocks,
  );

  const manageStockMutation = useMutation(manageStock, {
    onSuccess: () => {
      queryClient.invalidateQueries("stocks");
      setIsStockFormOpen(false);
      setStockForm({
        stockName: "",
        stockSymbol: "",
        price: "",
        availableQuantity: "",
      });
      toast.success("Stock updated successfully");
    },
    onError: (error) => {
      toast.error(`Error updating stock: ${error.message}`);
    },
  });

  const createUserMutation = useMutation(createUser, {
    onSuccess: () => {
      queryClient.invalidateQueries("clients");
      setIsUserFormOpen(false);
      setUserForm({
        name: "",
        userId: "",
        email: "",
        password: "",
        totalCash: "",
      });
      toast.success("User created successfully");
    },
    onError: (error) => {
      toast.error(`Error creating user: ${error.message}`);
    },
  });

  const buyStockMutation = useMutation(buyStockForClient, {
    onSuccess: () => {
      queryClient.invalidateQueries(["clients", "stocks"]);
      setIsTradeFormOpen(false);
      setTradeForm({ clientId: "", stockId: "", quantity: "", action: "buy" });
      toast.success("Stock purchased successfully");
    },
    onError: (error) => {
      toast.error(`Error buying stock: ${error.message}`);
    },
  });

  const sellStockMutation = useMutation(sellStockForClient, {
    onSuccess: () => {
      queryClient.invalidateQueries(["clients", "stocks"]);
      setIsTradeFormOpen(false);
      setTradeForm({ clientId: "", stockId: "", quantity: "", action: "sell" });
      toast.success("Stock sold successfully");
    },
    onError: (error) => {
      toast.error(`Error selling stock: ${error.message}`);
    },
  });

  const handleUserFormChange = (e) =>
    setUserForm({ ...userForm, [e.target.name]: e.target.value });
  const handleStockFormChange = (e) =>
    setStockForm({ ...stockForm, [e.target.name]: e.target.value });
  const handleTradeFormChange = (e) =>
    setTradeForm({ ...tradeForm, [e.target.name]: e.target.value });

  const handleUserSubmit = (e) => {
    e.preventDefault();
    createUserMutation.mutate(userForm);
  };

  const handleStockSubmit = (e) => {
    e.preventDefault();
    manageStockMutation.mutate(stockForm);
  };

  const handleTradeSubmit = (e) => {
    e.preventDefault();
    const tradeData = {
      clientId: tradeForm.clientId,
      stockId: tradeForm.stockId,
      quantity: parseInt(tradeForm.quantity),
    };
    if (tradeForm.action === "buy") {
      buyStockMutation.mutate(tradeData);
    } else {
      sellStockMutation.mutate(tradeData);
    }
  };

  if (isLoadingClients || isLoadingStocks) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-base-200 p-4 md:p-8">
      <div className="navbar bg-base-100 rounded-box shadow-lg mb-8">
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>
        <div className="flex-none">
          <button onClick={logout} className="btn btn-error">
            Logout
          </button>
        </div>
      </div>

      <div className="tabs tabs-boxed mb-4">
        <a
          className={`tab ${activeTab === "clients" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("clients")}
        >
          Clients
        </a>
        <a
          className={`tab ${activeTab === "stocks" ? "tab-active" : ""}`}
          onClick={() => setActiveTab("stocks")}
        >
          Stocks
        </a>
      </div>

      {activeTab === "clients" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-wrap gap-2 mb-4">
              <button
                onClick={() => setIsUserFormOpen(true)}
                className="btn btn-primary"
              >
                Create User
              </button>
              <button
                onClick={() => setIsTradeFormOpen(true)}
                className="btn btn-secondary"
              >
                Trade Stock
              </button>
            </div>
            {clients && clients.length > 0 ? (
              <div className="overflow-x-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  <ClientTable
                    clients={clients}
                    onClientSelect={setSelectedClient}
                  />
                </Suspense>
              </div>
            ) : (
              <p>No clients available.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "stocks" && (
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <button
              onClick={() => setIsStockFormOpen(true)}
              className="btn btn-primary mb-4"
            >
              Add/Edit Stock
            </button>
            {stocks && stocks.length > 0 ? (
              <div className="overflow-x-auto">
                <Suspense fallback={<LoadingSpinner />}>
                  <StockTable
                    stocks={stocks}
                    onStockSelect={(stock) => {
                      setStockForm(stock);
                      setIsStockFormOpen(true);
                    }}
                  />
                </Suspense>
              </div>
            ) : (
              <p>No stocks available.</p>
            )}
          </div>
        </div>
      )}

      {activeTab === "clients" && selectedClient && (
        <Suspense fallback={<LoadingSpinner />}>
          <ClientPositions client={selectedClient} />
        </Suspense>
      )}

      <Suspense fallback={<LoadingSpinner />}>
        <Modal
          isOpen={isUserFormOpen}
          onClose={() => setIsUserFormOpen(false)}
          title="Create User"
        >
          <form onSubmit={handleUserSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              type="text"
              name="name"
              placeholder="User Name"
              value={userForm.name}
              onChange={handleUserFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="text"
              name="userId"
              placeholder="User ID"
              value={userForm.userId}
              onChange={handleUserFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="email"
              name="email"
              placeholder="User Email"
              value={userForm.email}
              onChange={handleUserFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="password"
              name="password"
              placeholder="Password"
              value={userForm.password}
              onChange={handleUserFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="number"
              name="totalCash"
              placeholder="Total Cash"
              value={userForm.totalCash}
              onChange={handleUserFormChange}
              required
            />
            <button
              className={`btn btn-primary ${createUserMutation.isLoading ? "loading" : ""}`}
              type="submit"
              disabled={createUserMutation.isLoading}
            >
              {createUserMutation.isLoading ? "Creating..." : "Create User"}
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={isStockFormOpen}
          onClose={() => setIsStockFormOpen(false)}
          title={stockForm._id ? "Edit Stock" : "Add Stock"}
        >
          <form onSubmit={handleStockSubmit} className="space-y-4">
            <input
              className="input input-bordered w-full"
              type="text"
              name="stockName"
              placeholder="Stock Name"
              value={stockForm.stockName}
              onChange={handleStockFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="text"
              name="stockSymbol"
              placeholder="Stock Symbol"
              value={stockForm.stockSymbol}
              onChange={handleStockFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="number"
              name="price"
              placeholder="Price"
              value={stockForm.price}
              onChange={handleStockFormChange}
              required
            />
            <input
              className="input input-bordered w-full"
              type="number"
              name="availableQuantity"
              placeholder="Available Quantity"
              value={stockForm.availableQuantity}
              onChange={handleStockFormChange}
              required
            />
            <button
              className={`btn btn-primary ${manageStockMutation.isLoading ? "loading" : ""}`}
              type="submit"
              disabled={manageStockMutation.isLoading}
            >
              {manageStockMutation.isLoading
                ? "Processing..."
                : stockForm._id
                  ? "Update Stock"
                  : "Add Stock"}
            </button>
          </form>
        </Modal>

        <Modal
          isOpen={isTradeFormOpen}
          onClose={() => setIsTradeFormOpen(false)}
          title="Trade Stock"
        >
          <form onSubmit={handleTradeSubmit} className="space-y-4">
            <select
              className="select select-bordered w-full"
              name="clientId"
              value={tradeForm.clientId}
              onChange={handleTradeFormChange}
              required
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client._id} value={client._id}>
                  {client.name}
                </option>
              ))}
            </select>
            <select
              className="select select-bordered w-full"
              name="stockId"
              value={tradeForm.stockId}
              onChange={handleTradeFormChange}
              required
            >
              <option value="">Select Stock</option>
              {stocks.map((stock) => (
                <option key={stock._id} value={stock._id}>
                  {stock.stockName}
                </option>
              ))}
            </select>
            <input
              className="input input-bordered w-full"
              type="number"
              name="quantity"
              placeholder="Quantity"
              value={tradeForm.quantity}
              onChange={handleTradeFormChange}
              required
            />
            <select
              className="select select-bordered w-full"
              name="action"
              value={tradeForm.action}
              onChange={handleTradeFormChange}
              required
            >
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
            <button
              className={`btn btn-primary ${buyStockMutation.isLoading || sellStockMutation.isLoading ? "loading" : ""}`}
              type="submit"
              disabled={
                buyStockMutation.isLoading || sellStockMutation.isLoading
              }
            >
              {buyStockMutation.isLoading || sellStockMutation.isLoading
                ? "Processing..."
                : "Execute Trade"}
            </button>
          </form>
        </Modal>
      </Suspense>
    </div>
  );
};
