import { positionsWithML } from "../data/dataML";

const Positions = () => {
  return (
    <>
      <h3 className="title">Positions ({positionsWithML.length})</h3>
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
            {positionsWithML.map((stock, index) => {
              const curValue = stock.price * stock.quantity;
              const isProfit =
                curValue - stock.avg_price * stock.quantity >= 0.0;
              const profitClass = isProfit ? "profit" : "loss"; //where profit and loss are css classes
              const dayClass = stock.isLoss ? "loss" : "profit"; //same as above

              return (
                <tr key={index}>
                  <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.quantity}</td>
                  <td>{stock.avg_price.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profitClass}>
                    {(curValue - stock.avg_price * stock.quantity).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Positions;
