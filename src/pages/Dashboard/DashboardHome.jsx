import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';


const StatCard = ({ title, value, icon }) => (
    <div className="card bg-base-100 shadow-xl h-full">
        <div className="card-body flex-row items-center gap-4">
            <div className="text-3xl text-primary">{icon}</div>
            <div>
                <div className="text-2xl font-bold">{value}</div>
                <div className="text-base-content/70">{title}</div>
            </div>
        </div>
    </div>
);

// admin stat er component
const AdminOverview = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['adminStats'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/stats`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];
    const userRoleData = data.userRoleDistribution.map(item => ({ name: item._id, value: item.count }));
    const sessionStatusData = data.sessionStatusDistribution.map(item => ({ name: item._id, count: item.count }));


    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <StatCard title="Total Users" value={data.totalUsers} icon="👥" />
                <StatCard title="Total Sessions" value={data.totalSessions} icon="📚" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
                <div className="card bg-base-100 shadow-xl p-4">
                    <h3 className="font-bold text-center mb-4">User Role Distribution</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie data={userRoleData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label>
                                {userRoleData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="card bg-base-100 shadow-xl p-4">
                    <h3 className="font-bold text-center mb-4">Session Status</h3>
                    <ResponsiveContainer width="100%" height={300}>
                       <BarChart data={sessionStatusData}>
                           <XAxis dataKey="name" />
                           <YAxis allowDecimals={false} />
                           <Tooltip />
                           <Legend />
                           <Bar dataKey="count" fill="#82ca9d" />
                       </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// tutor stat er component
const TutorOverview = () => {
    const { data, isLoading } = useQuery({
        queryKey: ['tutorStats'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/tutor/stats`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;
        }
    });

    if (isLoading) return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="My Total Sessions" value={data?.totalSessions ?? 0} icon="📚" />
            <StatCard title="My Total Materials" value={data?.totalMaterials ?? 0} icon="📄" />
            <StatCard title="Total Bookings" value={data?.totalBookings ?? 0} icon="🎟️" />
        </div>
    );
}



// student stat er component
const StudentOverview = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['studentStats'],
        queryFn: async () => {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/student/stats`, { headers: { authorization: `Bearer ${token}` } });
            return res.data;
        }
    });

     if (isLoading) return <div className="text-center"><span className="loading loading-spinner loading-lg"></span></div>;

    return (

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard title="Booked Sessions" value={data?.totalBooked ?? 0} icon="📚" />
            <StatCard title="My Notes" value={data?.totalNotes ?? 0} icon="📝" />
            <StatCard title="Reviews Submitted" value={data?.totalReviews ?? 0} icon="⭐" />
        </div>
    );
}

const DashboardHome = () => {
    
    const { dbUser, loading } = useContext(AuthContext);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><span className="loading loading-spinner loading-lg"></span></div>;
    }

    const WelcomeMessage = () => (
        <div className="mb-8 p-6 bg-base-200 rounded-lg">
            <h1 className="text-3xl font-bold">Welcome back, {dbUser.name}!</h1>
            <p className="mt-2 text-base-content/80">Here's a quick overview of your activities.</p>
        </div>
    );

    return (
        <div>
            <WelcomeMessage />
            {dbUser?.role === 'admin' && <AdminOverview />}
            {dbUser?.role === 'tutor' && <TutorOverview />}
            {dbUser?.role === 'student' && <StudentOverview />}
        </div>
    );
};

export default DashboardHome;