import { createBrowserRouter } from "react-router";
import Mainlayout from "../Layout.jsx/Mainlayout";
import Home from "../components/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import AdminLayout from "../Layout.jsx/AdminLayout";
import Dashboard from "../PAges/Admin/Dashboard";
import AddDoctor from "../PAges/Admin/AddDoctor";
import PendingUsers from "../PAges/Admin/PendingUsers";
import ManageDoctors from "../PAges/Admin/ManageDoctors";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import StudentDashboard from "../PAges/Student/StudentDashboard";
import StudentLayout from "../Layout.jsx/StudentLayout";
import ServicePage from "../components/ServicePage";
import About from "../components/About";
import DoctorList from "../PAges/Student/DoctorList";
import BookAppointment from "../PAges/Student/MyAppoinments";
import MyAppointments from "../PAges/Student/MyAppoinments";
import DoctorDashboard from "../PAges/Doctor/DoctorDashboard";
import DoctorHome from "../PAges/Doctor/DoctorHome";
import DoctorProfile from "../PAges/Doctor/DoctorProfile";
import DoctorAppointments from "../PAges/Doctor/DoctorAppointments";
import DoctorDetails from "../PAges/Student/DoctorDetails";
// import Certificate from "../PAges/Student/Certificate";
import StudentPrescription from "../PAges/Student/StudentPrescription";
import AdminVaccineUpdate from "../PAges/Admin/AdminVaccineUpdate";


const router = createBrowserRouter([
    {
        path:'/',
        element:<Mainlayout></Mainlayout>,
        children:[
            {
                path:'/',
                element:<Home></Home>
            },
            {
                path:'/login',
                element:<Login></Login>

            },
            {
                path:'/register',
                element:<Register></Register>
            },
            {
                path:'/services',
                element:<ServicePage></ServicePage>
            },
            {
                path:'/about',
                element:<About></About>
            },
             {
                path:'doctor',
                element:<DoctorList></DoctorList>
            },
            {
                path:'doctorDetails/:id',
                element:<DoctorDetails></DoctorDetails>
            },
            // {
            //     path:'/student-dashboard',
            //     element:<StudentDashboard></StudentDashboard>
            // }
        ]

    },
    {
        path:'/admin',
        element:<PrivateRoute role="admin"><AdminLayout></AdminLayout></PrivateRoute>,
        children:[
            {
                path:'dashboard',
                element:<Dashboard></Dashboard>
            },
            {
                path:'add-doctor',
                element:<AddDoctor></AddDoctor>
            },
            {
                path:'pending-user',
                element:<PendingUsers></PendingUsers>
            },
            {
                path:'manage-doctors',
                element:<ManageDoctors></ManageDoctors>
            },
            {
                path:'vaccine',
                element:<AdminVaccineUpdate></AdminVaccineUpdate>
            }
        ]
    },
    {
        path:'/student',
        element:<PrivateRoute role="student"><StudentLayout></StudentLayout></PrivateRoute>,
        children:[
            {
                path:'dashboard',
                element:<StudentDashboard></StudentDashboard>
            },
            {
                path:'my-appoinments',
                element: <MyAppointments></MyAppointments>

            },
           {
            path:'prescription',
            element:<StudentPrescription></StudentPrescription>
           },
            
            // {
            //     path:'certificate',
            //     element:<Certificate></Certificate>
            // }
           
        ]
    },
    {
        path:'/doctor',
        element:<PrivateRoute><DoctorDashboard></DoctorDashboard></PrivateRoute>,
        children:[
            {
                path:'dashboard',
                element:<DoctorHome></DoctorHome>
            },
            {
                path:'profile',
                element:<DoctorProfile></DoctorProfile>
            },
            {
                path:'appointments',
                element:<DoctorAppointments></DoctorAppointments>
            },
            
        ]
    }
])
export {router};

//  path="/doctor-dashboard" 
//   element={
//     <PrivateRoute role="doctor">
//       <DoctorDashboard />
//     </PrivateRoute>
//   }