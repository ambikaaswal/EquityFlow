import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import axios from "axios";
import GeneralContext from "./GeneralContext";

import "./BuyWindow.css";

const BuyWindow = ({ uid, mode }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);

  const { closeBuyWindow } = useContext(GeneralContext);
  const {refreshHoldings } = useContext(GeneralContext);

  const handleBuySellHoldClick = async() => {
    await axios.post("http://localhost:8000/newOrder", {
      name: uid,
      quantity: stockQuantity,
      price: stockPrice,
      action: mode,
    });
    refreshHoldings();
    closeBuyWindow();
  };

  const handleCancelClick = ()=>{
    closeBuyWindow();
  }

  return (
    <div className="container" id="buy-window" draggable="true">
      <h3 className="title">Choose Action</h3>
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Quantity</legend>
            <input
              type="number"
              name="qty"
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
        <span>Margin required ₹140.65</span>
        <div>
          <Link className="btn btn-blue" onClick={handleBuySellHoldClick}>
            {mode}
          </Link>
          <Link to="" className="btn btn-grey" onClick={handleCancelClick}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BuyWindow;