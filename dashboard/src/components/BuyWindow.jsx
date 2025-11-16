import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import GeneralContext from "./GeneralContext";

import "./BuyWindow.css";

const BuyWindow = ({ uid, mode, price }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(price);

  const { closeBuyWindow } = useContext(GeneralContext);
  const {refreshHoldings } = useContext(GeneralContext);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const handleBuySellHoldClick = async() => {
    await axios.post(`${BACKEND_URL}/newOrder`, {
      name: uid,
      quantity: stockQuantity,
      price: stockPrice,
      action: mode,
    },{
      withCredentials:true,
    }
  );
    refreshHoldings();
    closeBuyWindow();
  };

  const handleCancelClick = ()=>{
    closeBuyWindow();
  }

  return (
    <div className="container " id="buy-window" draggable="true">
      <h3 className="title">Choose Action</h3>
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Quantity</legend>
            <input
              type="number"
              name="qty"
              className=""
              id="qty"
              onChange={(e)=>setStockQuantity(e.target.value)}
              value={stockQuantity}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              name="price"
              id="price"
              step="0.05"
              onChange={(e)=>setStockPrice(e.target.value)}
              value={stockPrice}
            />
          </fieldset>
        </div>
      </div>

      <div className="buttons">
        <span>Margin required {stockPrice}</span>
        <div>
          <Link  onClick={handleBuySellHoldClick}>
           <button className="w-30 bg-blue-500 p-2 rounded text-white ">{mode}</button>
          </Link> &nbsp;
          <Link to="" onClick={handleCancelClick}>
            <button className="w-30 bg-slate-500 p-2 rounded text-white ">Cancel</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyWindow;