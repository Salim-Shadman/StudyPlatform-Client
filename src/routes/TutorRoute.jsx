import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

const TutorRoute = ({ children }) => {


    const { user, dbUser, loading } = useContext(AuthContext);

    if (loading) {

        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;

    }

    if (user && dbUser?.role === 'tutor') {

        return children; 
    }


    
    return <Navigate to="/dashboard" replace />;

    
};

export default TutorRoute;