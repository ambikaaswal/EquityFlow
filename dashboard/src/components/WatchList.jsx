import { Tooltip, Grow } from "@mui/material";
import { watchlistWithML } from "../data/dataML";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  // MoreHoriz,
} from "@mui/icons-material";
import { useContext } from "react";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnutChart";

const labels = watchlistWithML.map((subArray)=>subArray["name"]);

const WatchList = () => {
  const data = {
  labels,
  datasets: [
    {
      label: 'price',
      data: watchlistWithML.map((stock)=>stock.price),
      backgroundColor: [
        'rgba(255, 99, 132, 0.4)',
        'rgba(54, 162, 235, 0.4)',
        'rgba(255, 206, 86, 0.4)',
        'rgba(75, 192, 192, 0.4)',
        'rgba(153, 102, 255, 0.4)',
        'rgba(255, 159, 64, 0.4)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
};


  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts"> {watchlistWithML.length} / 50</span>
      </div>
      <ul className="list">
        {watchlistWithML.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

      {/* chart */}
      <DoughnutChart data={data}/>
      <br />
    </div>
  );
};
export default WatchList;

//local component:
const WatchListItem = ({ stock, index }) => {
  const [showWatchListActions, setShowWatchListActions] = useState(false);
  const handleMouseEnter = (e) => {
    setShowWatchListActions(true);
  };
  const handleMouseLeave = (e) => {
    setShowWatchListActions(false);
  };
  return (
    <li
      key={index}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="item">
        {/* item is defined in css */}
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}%</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">&#8377;{stock.price}</span>
        </div>
      </div>
      {showWatchListActions && <WatchListAction uid={stock.name} />}
    </li>
  );
};

//local component:
const WatchListAction = ({ uid }) => {
  const { openBuyWindow } = useContext(GeneralContext);

  const handleSellClick = () => {
    openBuyWindow(uid); // Reuse modal for selling
  };

  const handleBuyClick = () => {
    openBuyWindow(uid);
  };
  return (
    <span className="actions">
      <span className="tooltip">
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          {/* <button className="buy" onClick={handleBuyClick}>Buy</button> */}
          <button className="buy" onClick={() => openBuyWindow(uid, "BUY")}>
            Buy
          </button>
        </Tooltip>
        <Tooltip
          title="Sell (S)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          {/* <button className="sell" onClick={handleSellClick}>Sell</button> */}
          <button className="sell" onClick={() => openBuyWindow(uid, "SELL")}>
            Sell
          </button>
        </Tooltip>
        <Tooltip
          title="Track (T)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="track">
            Track
          </button>
        </Tooltip>
        <Tooltip
          title="Analytics (A)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>
        {/* <Tooltip
      title="More (M)"
      placement='top'
      arrow
      slots={{ transition: Grow }}
      >
          <button className='action'>
          <MoreHoriz className='icon'/>
          </button>
      </Tooltip> */}
      </span>
    </span>
  );
};
