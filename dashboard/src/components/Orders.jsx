// import { Link } from "react-router-dom";

import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

const Orders = () => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const[orders, setOrders] = useState([]);
  useEffect(()=>{
    const fetchOrders = async()=>{
      try{
          const res = await  axios.get(`${BACKEND_URL}/allOrders`,{withCredentials:true});
     setOrders(res.data.allOrders);
      }catch(err){
        console.log("couldn't fetch orders:",err);
      }
    }
    fetchOrders();
  },[])
  return (
    <div className="orders">
      <p className="title">Orders Summary({orders.length})</p> <br />
          {
            orders.map((order)=>(
              <div key={order._id}>
              <div className="eachOrder mx-3 p-3 " >
                <strong>Stock:</strong> {order.name} <br />
                <strong>Quantity:</strong> {order.quantity} <br />
                <strong>price:</strong> {order.price} <br />
                <strong>ml recommendation:</strong> {order.mlRecommendation|| "none"} <br />
                <strong>auto-trading</strong> {order.autoTradeEnabled ?"yes" :"false"}
              </div>
              <hr/>
              </div>
            ))
          }
        {/* <Link to={"/"} className="btn">
          Get started
        </Link> */}
    </div>
  );
};

export default Orders;