// import { holdingsWithML } from "../data/dataML";

import { useEffect, useContext } from "react";
// import axios from 'axios';
import GeneralContext from "./GeneralContext";
import { VerticalChart } from "./verticalChart";
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

  const {allHoldings, refreshHoldings} = useContext(GeneralContext);

  useEffect(()=>{
  refreshHoldings();
  },[]);

// const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];
  const labels = allHoldings.map((subArray)=> subArray["name"]);

const data = {
  labels,
  datasets: [
    {
      label: 'Stock Price',
      data: allHoldings.map((stock) => stock.price),
      backgroundColor: 'rgba(99, 135, 255, 0.5)',
    },
  ],
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
                <tr key={index}>
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
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="row">
        <div className="col">
          <h5>
            29,875.<span>55</span>{" "}
          </h5>
          <p>Total investment</p>
        </div>
        <div className="col">
          <h5>
            31,428.<span>95</span>{" "}
          </h5>
          <p>Current value</p>
        </div>
        <div className="col">
          <h5>1,553.40 (+5.20%)</h5>
          <p>P&L</p>
        </div>
      </div>

      {/* chart */}
      <VerticalChart data={data}/>
    </>
  );
};

export default Holdings;
