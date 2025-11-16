import {createContext, useContext, useEffect, useState} from "react";
import axios from "axios";

const UserContext = createContext();
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const UserProvider = ({children})=>{
    const [user, setUser] = useState(null);
    useEffect(()=>{
        axios.get(`${BACKEND_URL}/getuser`,{withCredentials:true})
        .then(res=>{
            if(res.data.success) setUser(res.data.user);
        })
        .catch(err=> console.log("User fetch failed:", err));
    },[]);

    const refreshUser = async()=>{
        try{
            const res = await axios.get(`${BACKEND_URL}/getuser`, {withCredentials:true});
            if(res.data.success) setUser(res.data.user);
        }catch{
            console.log("User refresh failed:",err);
        }
    };

    return(
        <UserContext.Provider value={{user, setUser, refreshUser}}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = ()=> useContext(UserContext);