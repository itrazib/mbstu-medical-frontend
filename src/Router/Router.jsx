import { createBrowserRouter } from "react-router";
import Mainlayout from "../Layout.jsx/Mainlayout";
import Home from "../components/Home";
import Login from "../Auth/Login";
import Register from "../Auth/Register";
import AdminLayout from "../Layout.jsx/AdminLayout";
import Dashboard from "../PAges/Admin/Dashboard";
// import AddDoctor from "../PAges/Admin/AdminAddUser";
import PendingUsers from "../PAges/Admin/PendingUsers";
import ManageDoctors from "../PAges/Admin/ManageDoctors";
import { PrivateRoute } from "../PrivateRoute/PrivateRoute";
import StudentDashboard from "../PAges/Student/StudentDashboard";
import StudentLayout from "../Layout.jsx/StudentLayout";
// import ServicePage from "../components/ServicePage";
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
import AddDriver from "../PAges/Admin/ambulance/AddDriver";
import AssignDriver from "../PAges/Admin/ambulance/AssignDriver";
import ManageDutyRosterDoctor from "../PAges/Admin/ManageDutyRosterDoctor";
import TelemedicineDutyRoster from "../PAges/Admin/TelemedicineDutyRoster";
import AdminAddUser from "../PAges/Admin/AdminAddUser";
import DutyRosterOfDoctorsPage from "../components/DutyRosterOfDoctorsPage";
import Staff from "../PAges/Staff/Staff";
import TelemedicinePage from "../components/TelemedicinePage";
import StaffDutyRoster from "../PAges/Admin/StaffDutyRoster";
import PathologyTest from "../PAges/Admin/PathologyTest";
import ServicePage from "../PAges/common/servicePage/ServicePage";
import DutyRosterViewer from "../components/DutyRosterViewer";
import StaffDashboard from "../PAges/Staff/StaffDashboard";
import StaffDashboardHome from "../PAges/Staff/StaffDashboardHome";
import AddMedicine from "../PAges/Staff/Component/AddMedicine";
import MedicineDetailPage from "../PAges/Staff/Component/MedicineDetailPage";
import EditMedicinePage from "../PAges/Staff/Component/EditMedicinePage";
import ManageMedicinePage from "../PAges/Staff/Component/ManageMedicinePage";
import MedicineOutOfStockPage from "../PAges/Staff/Component/MedicineOutOfStockPage";
import AvailableMedicinePage from "../PAges/Staff/Component/AvailableMedicinePage";
import DispenseMedicinePage from "../PAges/Staff/Component/DispenseMedicinePage";
import MonthlyDispenseReport from "../PAges/Staff/Component/MonthlyDispenseReport";
import PatientProfilePage from "../PAges/Doctor/PatientProfilePage";


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
                path:'/staff-duty-roster',
                element:<DutyRosterViewer></DutyRosterViewer>
            },
             {
                path:'/doctor',
                element:<DoctorList></DoctorList>
            },
            {
               path:'/staff',
               element: <Staff></Staff>
            },
            {
                path:'/doctor-schedule',
                element:<DutyRosterOfDoctorsPage></DutyRosterOfDoctorsPage>
            },
            {
                path:'/telemedicine',
                element:<TelemedicinePage></TelemedicinePage>
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
                path:'add-user',
                element:<AdminAddUser></AdminAddUser>
            },
            {
                path:'add-driver',
                element:<AddDriver></AddDriver>
            },
            {
                path:'assign-driver',
                element:<AssignDriver></AssignDriver>
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
                path:'pathology-tests',
                element:<PathologyTest></PathologyTest>
            },
            {
               path:'manage-duty-roster-doctor',
                element:<ManageDutyRosterDoctor></ManageDutyRosterDoctor>
            },
            {
                path:'staff-duty-roster',
                element:<StaffDutyRoster></StaffDutyRoster>
            },
            {
                path:'telemedicine-duty-roster',
                element:<TelemedicineDutyRoster></TelemedicineDutyRoster>
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
                path:'patient-profile',
                element:<PatientProfilePage></PatientProfilePage>
            },
            {
                path:'appointments',
                element:<DoctorAppointments></DoctorAppointments>
            },
            
        ]
    },
    {
        path:'/staff-dashboard',
        element:<PrivateRoute><StaffDashboard></StaffDashboard></PrivateRoute>,
        children:[
            {
                path:'home',
                element:<StaffDashboardHome></StaffDashboardHome>

            },
            {
                path:'medicines',
                element:<ManageMedicinePage></ManageMedicinePage>

            },
            {
                path:'add-medicine',
                element:<AddMedicine></AddMedicine>
            },
            {
                path:'medicines/:id',
                element:<MedicineDetailPage></MedicineDetailPage>
            },
            {
                path:'medicines/:id/edit',
                element:<EditMedicinePage></EditMedicinePage>
            },
            {
                path:'medicine-out-of-stock',
                element:<MedicineOutOfStockPage></MedicineOutOfStockPage>
            },
            {
                path:'medicines/available',
                element:<AvailableMedicinePage></AvailableMedicinePage>
            },
            {
                path:'medicines/dispense',
                element:<DispenseMedicinePage></DispenseMedicinePage>
            },
            {
                path:'monthly-dispense-report',
                element:<MonthlyDispenseReport></MonthlyDispenseReport>
            }
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