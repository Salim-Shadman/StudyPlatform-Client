import React, { lazy, Suspense } from 'react';
import { createBrowserRouter } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import TutorRoute from "./TutorRoute";
import ErrorPage from "../pages/ErrorPage";


const PageLoader = () => (
    <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
    </div>
);




// Lazy loading add korlam
const MainLayout = lazy(() => import("../layout/MainLayout"));
const DashboardLayout = lazy(() => import("../layout/DashboardLayout"));
const HomePage = lazy(() => import("../pages/Home/HomePage"));
const LoginPage = lazy(() => import("../pages/Login/LoginPage"));
const RegisterPage = lazy(() => import("../pages/Register/RegisterPage"));
const AllStudySessionsPage = lazy(() => import("../pages/AllStudySessions/AllStudySessionsPage"));
const SessionDetailsPage = lazy(() => import("../pages/SessionDetails/SessionDetailsPage"));
const TutorsPage = lazy(() => import("../pages/TutorsPage"));
const DashboardHome = lazy(() => import("../pages/Dashboard/DashboardHome"));
const ProfilePage = lazy(() => import("../pages/Dashboard/ProfilePage"));
const ViewBookedSessions = lazy(() => import("../pages/Dashboard/Student/ViewBookedSessions"));
const ManageNotes = lazy(() => import("../pages/Dashboard/Student/ManageNotes"));
const ViewStudyMaterials = lazy(() => import("../pages/Dashboard/Student/ViewStudyMaterials"));
const PaymentPage = lazy(() => import("../pages/Dashboard/Student/PaymentPage"));
const CreateSession = lazy(() => import("../pages/Dashboard/Tutor/CreateSession"));
const ViewMySessions = lazy(() => import("../pages/Dashboard/Tutor/ViewMySessions"));
const UploadMaterials = lazy(() => import("../pages/Dashboard/Tutor/UploadMaterials"));
const ViewAllTutorMaterials = lazy(() => import("../pages/Dashboard/Tutor/ViewAllTutorMaterials"));
const ViewAllUsers = lazy(() => import("../pages/Dashboard/Admin/ViewAllUsers"));
const ViewAllSessions = lazy(() => import("../pages/Dashboard/Admin/ViewAllSessions"));
const ViewAllAdminMaterials = lazy(() => import("../pages/Dashboard/Admin/ViewAllAdminMaterials"));
const LoginHistoryPage = lazy(() => import('../pages/Dashboard/Admin/LoginHistoryPage')); 


export const router = createBrowserRouter([
 
  {
    path: "/",
    element: <Suspense fallback={<PageLoader />}><MainLayout /></Suspense>,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Suspense fallback={<PageLoader />}><HomePage /></Suspense> },
      { path: "/all-sessions", element: <Suspense fallback={<PageLoader />}><AllStudySessionsPage /></Suspense> },
      { path: "/session/:id", element: <Suspense fallback={<PageLoader />}><SessionDetailsPage /></Suspense> },
      { path: "/tutors", element: <Suspense fallback={<PageLoader />}><TutorsPage /></Suspense> },
      { path: "/login", element: <Suspense fallback={<PageLoader />}><LoginPage /></Suspense> },
      { path: "/register", element: <Suspense fallback={<PageLoader />}><RegisterPage /></Suspense> },
    ],
  },
  // Dashboard er Layout 
  {
    path: 'dashboard',
    element: <Suspense fallback={<PageLoader />}><PrivateRoute><DashboardLayout /></PrivateRoute></Suspense>,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><DashboardHome /></Suspense> },
      { path: 'profile', element: <Suspense fallback={<PageLoader />}><ProfilePage /></Suspense> },
      // Student routes
      { path: 'my-booked-sessions', element: <Suspense fallback={<PageLoader />}><ViewBookedSessions /></Suspense> },
      { path: 'view-materials', element: <Suspense fallback={<PageLoader />}><ViewStudyMaterials /></Suspense> },
      { path: 'my-notes', element: <Suspense fallback={<PageLoader />}><ManageNotes /></Suspense> },
      { path: 'payment/:sessionId', element: <Suspense fallback={<PageLoader />}><PaymentPage /></Suspense> },
      // Tutor routes
      { path: 'create-session', element: <TutorRoute><Suspense fallback={<PageLoader />}><CreateSession /></Suspense></TutorRoute> },
      { path: 'my-sessions', element: <TutorRoute><Suspense fallback={<PageLoader />}><ViewMySessions /></Suspense></TutorRoute> },
      { path: 'upload-materials', element: <TutorRoute><Suspense fallback={<PageLoader />}><UploadMaterials /></Suspense></TutorRoute> },
      { path: 'my-all-materials', element: <TutorRoute><Suspense fallback={<PageLoader />}><ViewAllTutorMaterials /></Suspense></TutorRoute> },
      // Admin routes
      { path: 'view-all-users', element: <AdminRoute><Suspense fallback={<PageLoader />}><ViewAllUsers /></Suspense></AdminRoute> },
      { path: 'view-all-sessions', element: <AdminRoute><Suspense fallback={<PageLoader />}><ViewAllSessions /></Suspense></AdminRoute> },
      { path: 'view-all-materials', element: <AdminRoute><Suspense fallback={<PageLoader />}><ViewAllAdminMaterials /></Suspense></AdminRoute> },
      { path: 'login-history', element: <AdminRoute><Suspense fallback={<PageLoader />}><LoginHistoryPage /></Suspense></AdminRoute> }, 
    ]
  }
]);