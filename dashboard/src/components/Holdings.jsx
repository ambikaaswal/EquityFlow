// import { holdingsWithML } from "../data/dataML";
import { Tooltip, Grow } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import GeneralContext from "./GeneralContext";
import { VerticalChart } from "./verticalChart";
import axios from "axios";
// import { data } from "react-router-dom";

//data  from database:
const Holdings = () => {
  // const [allHoldings, setAllHoldings] = useState([]);
  // useEffect(()=>{
  //   axios.get("http://localhost:8000/allHoldings").then((res)=>{
  //     // console.log(res.data);
  //     setAllHoldings(res.data);
  //   })
  // },[]); //[] se ek hi baar run hoga.

  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [user, setUser] = useState({});
  const { allHoldings, refreshHoldings } = useContext(GeneralContext);
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/user/data`, {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.log("Couldn't fetch user, error: ", err);
      }
    };
    fetchUser();
    refreshHoldings();
  }, []);

  function separate(value) {
    if (value === undefined || value === null || isNaN(value))
      return { integer: "0", decimal: "00" };
    const [integer, decimal] = value.toString().split(".");
    return {
      integer,
      decimal: decimal || "00",
    };
  }
  function integerPart(value) {
    const { integer, decimal } = separate(value);
    return integer;
  }

  function decimalPart(value) {
    const { integer, decimal } = separate(value);
    return decimal;
  }

  // const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(99, 135, 255, 0.5)",
      },
    ],
  };

  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { openBuyWindow } = useContext(GeneralContext);

  const handleMouseEnter = (index) => {
    setHoveredIndex(index);
  };

  const handleMouseLeave = (index) => {
    setHoveredIndex(index);
  };
  return (
    <>
      <h3 className="title">Holdings ({allHoldings.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg. cost</th>
              <th>LTP</th>
              <th>Cur. val</th>
              <th>P&L</th>
              <th>Net chg.</th>
              <th>Day chg.</th>
            </tr>
          </thead>
          <tbody>
            {allHoldings.map((stock, index) => {
              const curValue = stock.price * stock.quantity;
              const isProfit =
                curValue - stock.avg_price * stock.quantity >= 0.0;
              const profitClass = isProfit ? "profit" : "loss"; //where profit and loss are css classes
              const dayClass = stock.isLoss ? "loss" : "profit"; //same as above
              return (
                <tr
                  className="holdings"
                  onMouseEnter={() => handleMouseEnter(index)}
                  onMouseLeave={() => handleMouseLeave(index)}
                  key={index}
                >
                  <td>{stock.name}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.avg_price.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td>{curValue.toFixed(2)}</td>
                  <td className={profitClass}>
                    {(curValue - stock.avg_price * stock.quantity).toFixed(2)}
                  </td>
                  <td className={profitClass}>{stock.net}%</td>
                  <td className={dayClass}>{stock.day}%</td>
                  <td>
                    {hoveredIndex === index && (
                      <Tooltip
                        title="Sell (S)"
                        placement="top"
                        arrow
                        slots={{ transition: Grow }}
                      >
                        <button
                          className="sell"
                          onClick={() =>
                            openBuyWindow(stock.name, "SELL", stock.price)
                          }
                        >
                          Sell
                        </button>
                      </Tooltip>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            {integerPart(user.totalInvested)}.
            <span>{decimalPart(user.totalInvested)}</span>
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            {integerPart(user.totalCurrentValue)}.
            <span>{decimalPart(user.totalCurrentValue)}</span>
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>
            {user.totalCurrentValue - user.totalInvested} (
            {(
              (user.totalCurrentValue - user.totalInvested) /
              user.totalInvested
            ).toFixed(3)}
            )%
          </h5>
          <p>P&L</p>
        </div>
      </div>

      {/* chart */}
      <VerticalChart data={data} />
    </>
  );
};

export default Holdings;

//local component:
// const showBuySellWindow = ({stock, index})=>{

// }
