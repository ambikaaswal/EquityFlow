import {useUser} from "./UserContext";

const FRONTEND_URL = import.meta.env.FRONTEND_URL;
const UserGuard = ({children})=>{
    const {user, setUser} = useUser();
    if(user==null) return <p>Loading user...</p>
    if (!user) {
     window.open(`${FRONTEND_URL}/login`, "_blank");
     return null;
    }
    return children;
};
export default UserGuard;