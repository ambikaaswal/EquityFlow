//summary.jsx
import axios from "axios";
import { useContext, useEffect } from "react";
import { useState } from "react";
import GeneralContext from "./GeneralContext";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Summary = () => {
  const [user, setUser] = useState({});
  const { allHoldings, refreshHoldings } = useContext(GeneralContext);
  const [percentForAutoTrade, setPercentForAutoTrade] = useState('');
  const [autoTradeEnabled, setAutoTradeEnabled] = useState(false);
  const [showAutoTradeForm, setShowAutoTradeForm] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  //sets user data:
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/user/data`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      setAutoTradeEnabled(res.data.user.autoTradingEnabled);
    } catch (err) {
      console.log("failed to fetch: ", err);
    }
  };

  //fetches user and refreshes holdings from Generalcontext
  useEffect(() => {
    fetchUser();
    refreshHoldings();
  }, []);

  //formats number to be displayed in k format
  function formatNumber(value) {
    if (typeof value !== "number") return "0.00";
    if (value >= 1000) {
      return (value / 1000).toFixed(2) + "k";
    }
    return value.toFixed(2);
  }

  const [amount, setAmount] = useState("");

  //adds balance to user account:
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BACKEND_URL}/allocateBalance`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ amount: Number(amount) }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`${data.message}: ₹${data.balance}`);
        fetchUser();
      } else {
    toast.error(data.message || "Request failed");
  }
    } catch (err) {
        toast.error("Server unreachable");   
    }
  };

  //toggles auto trading form and enables
  const handleEnableAutoTrade = () =>{
    // setAutoTradeEnabled(true);
    setShowAutoTradeForm(true);
  };

  //diables auto trading form and autotrade logic
  const handleDisableAutoTrade = async()=>{
    try{
      const res = await axios.post(`${BACKEND_URL}/autotrade`,
        {enabled: false},
        {withCredentials: true}
      );
      toast.success(res.data.message || "Auto trade disabled");
      setAutoTradeEnabled(false);
      setShowAutoTradeForm(false);
      setPercentForAutoTrade('');
    }catch(err){
      toast.error(err.response?.data?.message || "failed to disable Auto trade")
    }
  };


  const handleAutoTrade = async (e) => {
  e.preventDefault();
  console.log("Confirm clicked, percent:", percentForAutoTrade);

  const percent = Number(percentForAutoTrade);
  if (!percent || percent < 1 || percent > 30) {
    toast.error("Please enter a valid percentage (1-30)");
    return;
  }

  try {
    const res = await axios.post(`${BACKEND_URL}/autotrade`,
      { enabled: true, limitPercent: percent },
      { withCredentials: true }
    );
    console.log("Response:", res.data);
    toast.success(res.data.message || "Auto trade enabled");
    setAutoTradeEnabled(true);
    setShowAutoTradeForm(false);
    // Immediately refresh holdings/orders in UI
    refreshHoldings(); 
  } catch (err) {
    console.error("Auto trade enable failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.message || "failed to enable Auto trade");
  }
};


  return (
    <>
      <div className="username flex gap-4 flex-col">
        <h6>Hi, {user.name}!</h6> 

        {!autoTradeEnabled && !showAutoTradeForm && (
          <button
          className="bg-green-300 text-white px-4 py-2 rounded hover:bg-green-500 transition"
          onClick={handleEnableAutoTrade}
          >
            Enable Auto Trade
          </button>
        )}
        {/* {showAutoTradeForm && (
          <form onSubmit={handleAutoTrade} className="space-y-4 border p-4 rounded shadow">
            <label className="block mr-4">
              <span>Enter percentage of balance to auto trade</span>
              <input
              type="number" 
              value={percentForAutoTrade}
              onChange={(e)=>setPercentForAutoTrade(e.target.value)}
              className="mt-1 block w-full px-3 py-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
              placeholder="e.g: 10 Note: max(30)"
              min='1'
              max='30'
              required
              />
            </label>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-green-500 text-white py-2 px-3 rounded hover:bg-green-700 transition"
                >
                  Confirm
                </button>
                <button
                className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                onClick={()=>setShowAutoTradeForm(false)}
                >
                  hide
              </button>
            </div>
          </form>
        )} */}
        {showAutoTradeForm && (
  <div className="space-y-4 border p-4 rounded shadow">
    <label className="block mr-4">
      <span>Enter percentage of balance to auto trade</span>
      <input
        type="number" 
        value={percentForAutoTrade}
        onChange={(e)=>setPercentForAutoTrade(e.target.value)}
        className="mt-1 block w-full px-3 py-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
        placeholder="e.g: 10 Note: max(30)"
        min='1'
        max='30'
        required
      />
    </label>
    <div className="flex gap-4">
      <button
        onClick={handleAutoTrade}   // use onClick instead of form submit
        className="bg-green-500 text-white py-2 px-3 rounded hover:bg-green-700 transition"
      >
        Confirm
      </button>
      <button
        className="bg-gray-300 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
        onClick={()=>setShowAutoTradeForm(false)}
      >
        Hide
      </button>
    </div>
  </div>
)}

        {autoTradeEnabled && !showAutoTradeForm && (
          <button
          className="bg-red-300 text-white px-4 py-2 rounded hover:bg-red-500 transition"
          onClick={handleDisableAutoTrade}>
            Disable Auto trade
          </button>
        )}
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Equity</p>
        </span>

        <div className="data">
          <div className="first">
            <h3>&#8377;{formatNumber(user.balance)}</h3>
            <p>Margin available</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Inital Balance <span>&#8377;{user.initialBalance}/-</span>
            </p>
            <p>
              Opening balance{" "}
              <span>
                &#8377;{formatNumber(user.balance + user.totalCurrentValue)}
              </span>{" "}
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>

      <div className="section">
        <span>
          <p>Holdings ({allHoldings.length})</p>
        </span>

        <div className="data">
          <div className="first">
            <h3 className="profit">
              {formatNumber(user.totalCurrentValue - user.totalInvested)}{" "}
              <small>
                {(
                  (user.totalCurrentValue - user.totalInvested) /
                  user.totalInvested
                ).toFixed(3)}
                %
              </small>{" "}
            </h3>
            <p>P&L</p>
          </div>
          <hr />

          <div className="second">
            <p>
              Current Value <span>{formatNumber(user.totalCurrentValue)}</span>{" "}
            </p>
            <p>
              Investment <span>{formatNumber(user.totalInvested)}</span>
            </p>
          </div>
        </div>
        <hr className="divider" />
      </div>
      <div className="section">
        <span>
          <p>+Add Balance</p>
        </span>
        <form onSubmit={handleSubmit}>
          <input
            type="number"
            // className="!w-full bg-blue-100 text-center rounded placeholder: py-2"
            className="mt-1 block w-full px-3 py-2 rounded focus:outline-none focus:ring focus:border-indigo-300"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter Amount"
            required
          />
          <button
            className="mt-2 bg-blue-500 w-full text-center text-white py-2 rounded hover:bg-blue-700 transition"
            type="submit"
          >
            Add
          </button>
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
          />
        </form>
        <hr className="divider" />
      </div>
    </>
  );
};

export default Summary;
