import React, { useState } from "react";
import axios from 'axios';
import BuyWindow from "./BuyWindow";
// import { holdings } from "../data/dataML";

const GeneralContext = React.createContext({
  openBuyWindow: (uid) => {},
  closeBuyWindow: () => {},
  allHoldings: [],
  refreshHoldings: ()=>{},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [allHoldings, setAllHoldings] = useState([]);
  const [selectedStockPrice, setSelectedStockPrice] = useState(0.0);


  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  
  const refreshHoldings = async () => {
    const res = await axios.get(`${BACKEND_URL}/allHoldings`, {withCredentials:true});
    setAllHoldings(res.data.allHoldings);
    return res.data;
  };

  const[orderMode, setOrderMode] = useState("BUY");


  const handleOpenBuyWindow = (uid, mode="BUY", price=0.0) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setOrderMode(mode);
    setSelectedStockPrice(price);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        allHoldings,
        refreshHoldings,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyWindow uid={selectedStockUID} mode = {orderMode} price={selectedStockPrice}/>}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;