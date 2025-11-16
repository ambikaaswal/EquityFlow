//unused for now:

// import axios from "axios";
// import { useEffect, useState } from "react";

// const MostActive =()=> {
//     const [mostActive, SetMostActive] = useState([]);
//     // const [watchlist, setWatchList]= useState([]);

//     useEffect(()=>{
//     axios.get("http://localhost:8000/api/stocks/most-active").then((res)=>{
//         SetMostActive(res.data);
//         console.log(res.data);
//     })
//     },[]);
//     return(
//         <>
//         <h3>most active</h3>
//         </>
//     )
// }
// export default MostActive;