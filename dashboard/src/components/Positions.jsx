// import { positionsWithML } from "../data/dataML";

import { useState, useEffect } from "react";
import axios from "axios";

const Positions = () => {
  const [allPositions, setAllPositions] = useState([]);

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/allPositions`, {
          withCredentials: true,
        });
        setAllPositions(res.data.allPositions);
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      }
    };
    fetchPositions();
  }, []);
  return (
    <>
      <h3 className="title">Positions ({allPositions.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
          </thead>
          <tbody>
          {
            allPositions.length === 0 ? (
              <tr>
                <td colSpan="7">No positions found</td>
              </tr>
              ) : (
              allPositions.map((stock, index) => {
                const curValue = stock.price * stock.quantity;
                const isProfit =curValue - stock.avg_price * stock.quantity >= 0.0;
                const profitClass = isProfit ? "profit" : "loss"; //where profit and loss are css classes
                const dayClass = stock.isLoss ? "loss" : "profit"; //same as above

                return (
                  <tr key={index}>
                    <td>{stock.product}</td>
                    <td>{stock.name}</td>
                    <td>{stock.quantity}</td>
                    <td>{stock.avg_price?.toFixed(2) ?? "-"}</td>
                    <td>{stock.price?.toFixed(2) ?? "-"}</td>
                    <td className={profitClass}>
                      {(curValue - stock.avg_price * stock.quantity).toFixed(2)}
                    </td>
                    <td className={dayClass}>{stock.day}%</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
