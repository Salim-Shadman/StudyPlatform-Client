import { NavLink, Outlet, Navigate, Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import {
    FaHome, FaBook, FaEdit, FaList, FaUpload, FaUsers, FaPlusCircle,
    FaChalkboardTeacher, FaRegListAlt, FaRegFileAlt, FaUser, FaChartPie, FaHistory
} from "react-icons/fa";

const SidebarLink = ({ to, icon, children }) => (

    <li>
        <NavLink
            to={to}
            end
            className={({ isActive }) =>
                `flex items-center gap-3 p-3 rounded-lg transition-colors text-base ${isActive ? 'bg-primary text-white font-semibold' : 'hover:bg-base-300'}`
            }
        >
            {icon}
            <span>{children}</span>
        </NavLink>
    </li>


);

const DashboardLayout = () => {

    const { dbUser, loading } = useContext(AuthContext);

    if (loading) {

        return (


            <div className="flex justify-center items-center h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg"></span>
            </div>

        );
    }

    if (!dbUser) {

        return <Navigate to="/login" replace />;

    }

    const role = dbUser?.role;

   
    const commonLinks = (


        <>

            <SidebarLink to="/dashboard" icon={<FaChartPie size={20} />}>Overview</SidebarLink>

            <SidebarLink to="/dashboard/profile" icon={<FaUser size={20} />}>My Profile</SidebarLink>
        </>


    );
    const studentLinks = (

        <>
            <SidebarLink to="/dashboard/my-booked-sessions" icon={<FaBook size={20} />}>My Booked Sessions</SidebarLink>

            <SidebarLink to="/dashboard/my-notes" icon={<FaEdit size={20} />}>My Personal Notes</SidebarLink>
            <SidebarLink to="/dashboard/view-materials" icon={<FaRegFileAlt size={20} />}>View Study Materials</SidebarLink>
        </>
    );



    const tutorLinks = (
        <>
            <SidebarLink to="/dashboard/create-session" icon={<FaPlusCircle size={20} />}>Create Session</SidebarLink>
            <SidebarLink to="/dashboard/my-sessions" icon={<FaChalkboardTeacher size={20} />}>My Sessions</SidebarLink>


            <SidebarLink to="/dashboard/upload-materials" icon={<FaUpload size={20} />}>Upload Materials</SidebarLink>
            <SidebarLink to="/dashboard/my-all-materials" icon={<FaRegListAlt size={20} />}>My Materials</SidebarLink>
        </>
    );



    const adminLinks = (



        <>
            <SidebarLink to="/dashboard/view-all-users" icon={<FaUsers size={20} />}>Manage Users</SidebarLink>


            <SidebarLink to="/dashboard/view-all-sessions" icon={<FaList size={20} />}>Manage Sessions</SidebarLink>
            <SidebarLink to="/dashboard/view-all-materials" icon={<FaRegListAlt size={20} />}>Manage Materials</SidebarLink>
            <SidebarLink to="/dashboard/login-history" icon={<FaHistory size={20} />}>Login History</SidebarLink>
        </>

    );



    return (
        <div className="drawer lg:drawer-open">

            <input id="sidebar-drawer" type="checkbox" className="drawer-toggle" />


            <main className="drawer-content bg-base-200">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="lg:hidden flex items-center mb-4">
                         <label htmlFor="sidebar-drawer" className="btn btn-ghost drawer-button">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                        </label>
                        <Link to="/" className="text-xl font-bold text-primary ml-2">StudyPlatform</Link>
                    </div>
                    <Outlet />
                </div>
            </main>




            <aside className="drawer-side z-30">
                <label htmlFor="sidebar-drawer" aria-label="close sidebar" className="drawer-overlay"></label>

                <div className="p-4 w-80 min-h-full bg-base-100 text-base-content flex flex-col">
                    
                    <div className="p-4 mb-4">
                         <Link to="/" className="text-2xl font-bold text-primary">StudyPlatform</Link>
                    </div>
                    
                    <div className="px-4 mb-6">
                        <div className="flex items-center gap-4 p-3 bg-base-200 rounded-lg">
                            <div className="avatar">
                                <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                                    <img src={dbUser?.photoURL || 'https://i.ibb.co/d5bC4T8/default-avatar.jpg'} alt="user" />
                                </div>
                            </div>
                            <div>
                                <p className="font-bold text-lg leading-tight">{dbUser?.name}</p>
                                <span className="text-sm text-base-content/70 capitalize">{dbUser?.role}</span>
                            </div>
                        </div>
                    </div>

                    <ul className="menu flex-grow space-y-2 px-4">
                        {commonLinks}
                        <div className="divider my-2"></div>
                        {role === 'student' && studentLinks}
                        {role === 'tutor' && tutorLinks}
                        {role === 'admin' && adminLinks}
                    </ul>

                    <ul className="menu px-4">
                        <div className="divider my-2"></div>
                        <SidebarLink to="/" icon={<FaHome size={20} />}>Home</SidebarLink>
                    </ul>
                </div>
            </aside>



        </div>


    );
};

export default DashboardLayout;