import { useContext, useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { FiMenu } from 'react-icons/fi';
import { FaSun, FaMoon, FaUser, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { user, dbUser, logOut } = useContext(AuthContext);
    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'winter');

    const handleThemeToggle = (e) => {


        e.stopPropagation();
        const newTheme = theme === 'winter' ? 'dark' : 'winter';
        setTheme(newTheme);


    };

    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.querySelector('html').setAttribute('data-theme', theme);
    }, [theme]);

    const handleLogOut = () => {




        logOut()
            .then(() => {
                toast.success('You have been logged out.');
            })
            .catch(error => console.error(error));


    };

    const navLinks = (

        <>
            <li><NavLink to="/" className="hover:text-primary transition-colors duration-300">Home</NavLink></li>
            <li><NavLink to="/all-sessions" className="hover:text-primary transition-colors duration-300">Study Sessions</NavLink></li>
            <li><NavLink to="/tutors" className="hover:text-primary transition-colors duration-300">Tutors</NavLink></li>

        </>
    );

    const loggedInDropdownLinks = (



        <>
            <li className="p-2 font-semibold truncate">{dbUser?.name || user?.email}</li>
            <div className="divider my-0"></div>
            <li><Link to="/dashboard/profile" className="flex items-center gap-2"><FaUser /> Profile</Link></li>
            <li><Link to="/dashboard" className="flex items-center gap-2">Dashboard</Link></li>
            <li><a onClick={handleLogOut} className="flex items-center gap-2"><FaSignOutAlt /> Logout</a></li>


        </>
    );

    return (
        <div className="bg-base-100 sticky top-0 z-50 w-full border-b border-base-200">


            <div className="navbar container mx-auto px-4 sm:px-6 lg:px-8">

                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden px-1">
                            <FiMenu className="h-5 w-5" />
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                            {navLinks}
                        </ul>
                    </div>
                    <Link to="/" className="btn btn-ghost text-2xl font-bold text-primary">StudyPlatform</Link>
                </div>



                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 space-x-4 font-medium items-center">
                        {navLinks}
                    </ul>
                </div>




                <div className="navbar-end items-center gap-2">
                     <button onClick={handleThemeToggle} className="btn btn-ghost btn-circle">
                        {theme === 'winter' ? <FaMoon className="w-5 h-5" /> : <FaSun className="w-5 h-5" />}
                    </button>
                    {user && dbUser ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img alt="User profile" src={dbUser?.photoURL || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} />
                                </div>
                            </label>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                {loggedInDropdownLinks}
                            </ul>
                        </div>


                    ) : (


                        <div className='hidden sm:flex items-center gap-2'>
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Sign Up</Link>
                        </div>

                        
                    )}
                </div>
            </div>



        </div>
    );
};

export default Navbar;