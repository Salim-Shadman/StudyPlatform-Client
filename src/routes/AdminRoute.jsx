import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const AdminRoute = ({ children }) => {


    const { user, dbUser, loading } = useContext(AuthContext);

    if (loading) {

        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }


//jodi admin thake thole component render korbe 
    if (user && dbUser?.role === 'admin') {
        return children; 
    }



    //admin na thakle dashboard e ashbe
    return <Navigate to="/dashboard" replace />;


    
};

export default AdminRoute;