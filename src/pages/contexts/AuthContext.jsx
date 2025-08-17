import { createContext, useState, useEffect } from 'react';
import {
    getAuth,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    GoogleAuthProvider,
    signOut,
} from 'firebase/auth';
import axios from 'axios';
import app from '../firebase/firebase.config';

export const AuthContext = createContext(null);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();


const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

const AuthProvider = ({ children }) => {


    const [user, setUser] = useState(null);
    const [dbUser, setDbUser] = useState(null); 
    const [loading, setLoading] = useState(true);



    const createUser = (email, password) => {

        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);

    };



    const signIn = (email, password) => {
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password);
    };





    const googleSignIn = () => {

        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    };




    const logOut = () => {
        setLoading(true);
        localStorage.removeItem('access-token');
        setDbUser(null);
        return signOut(auth);
    };




  
    useEffect(() => {


        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            
            if (currentUser) {

                const userInfo = { email: currentUser.email };
                axiosInstance.post('/api/jwt', userInfo)
                    .then(res => {

                        if (res.data.token) {
                            const token = res.data.token;
                            localStorage.setItem('access-token', token);

                           //user detail and role fetch kora hocce
                            axiosInstance.get('/api/auth/me', {
                                headers: { authorization: `Bearer ${token}` }
                            }).then(userRes => {

                                setDbUser(userRes.data);
                                setLoading(false);

                            }).catch(() => { 

                                logOut();
                                setLoading(false);

                            });

                        }

                    }).catch(() => { 


                        logOut();
                        setLoading(false);

                    });
            } else { 


                localStorage.removeItem('access-token');
                setDbUser(null);
                setLoading(false);

            }
        });



        
        return () => {
            return unsubscribe();
        };

    }, []);



    const authInfo = {
        user,
        dbUser,
        loading,
        createUser,
        signIn,
        googleSignIn,
        logOut,
    };



    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
    
};

export default AuthProvider;