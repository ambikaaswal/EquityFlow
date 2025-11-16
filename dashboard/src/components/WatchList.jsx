import { Tooltip, Grow } from "@mui/material";
// import { watchlistWithML } from "../data/dataML";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  // MoreHoriz,
} from "@mui/icons-material";
import {useState,useEffect, useContext } from "react";
import GeneralContext from "./GeneralContext";
import { DoughnutChart } from "./DoughnutChart";
import axios from "axios";

// const labels = watchlistWithML.map((subArray)=>subArray["name"]);

const WatchList = () => {

  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  const fetchWatchlist = async()=>{
    try{
      const res = await axios.get(`${BACKEND_URL}/watchlist/stocks`);
      setStocks(res.data);
    }catch(err){
      console.log("failed to fetch watchlist");
    }finally{
      setLoading(false);
    }
  };

  useEffect(()=>{
    fetchWatchlist();
    const interval = setInterval(fetchWatchlist, 5*60*1000);
    return ()=> clearInterval(interval);
  },[]);

  if (loading) return <p className="text-gray-500">Loading watchlist...</p>;

  const labels = stocks.map((stock)=>stock.name);
  const data = {
  labels,
  datasets: [
    {
      label: 'price',
      data: stocks.map((stock)=>stock.price),
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
        <span className="counts"> {stocks.length} / 51</span>
      </div>
      <div className="scrollable-list">
        <ul className="list">
          {stocks.map((stock, index) => {
            return <WatchListItem stock={stock} key={index} />;
          })}
        </ul>
      </div>

      {/* chart */}
      <div className="watchlistchart">
        <DoughnutChart data={data}/>
      </div>  
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
      {showWatchListActions && <WatchListAction stock={stock} />}
    </li>
  );
};

//local component:
const WatchListAction = ({ stock }) => {
  const { openBuyWindow } = useContext(GeneralContext);

  // const handleSellClick = () => {
  //   openBuyWindow(stock.name, "SELL", stock.price); // Reuse code for selling
  // };

  // const handleBuyClick = () => {
  //   openBuyWindow(stock.name, "BUY", stock.price);
  // };
  return (
    <span className="actions">
      <span className="tooltips">
        <Tooltip
          title="Buy (B)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          {/* <button className="buy" onClick={handleBuyClick}>Buy</button> */}
          <button className="buy" onClick={() => openBuyWindow(stock.name, "BUY", stock.price)}>
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
          <button className="sell" onClick={() => openBuyWindow(stock.name, "SELL", stock.price)}>
            Sell
          </button>
        </Tooltip>
        {/* <Tooltip
          title="ML recommendation"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="ml-decision">
            ml
          </button>
        </Tooltip>
        <Tooltip
          title="ML analytics(A)"
          placement="top"
          arrow
          slots={{ transition: Grow }}
        >
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip> */}
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
