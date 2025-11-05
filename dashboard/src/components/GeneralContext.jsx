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

  const refreshHoldings = async () => {
    const res = await axios.get("http://localhost:8000/allHoldings");
    setAllHoldings(res.data);
    return res.data;
  };

  const[orderMode, setOrderMode] = useState("BUY");


  const handleOpenBuyWindow = (uid, mode="BUY") => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
    setOrderMode(mode);
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
      {isBuyWindowOpen && <BuyWindow uid={selectedStockUID} mode = {orderMode}/>}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;