import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import DashboardLayoutBasic from './component/Admin/Admin.DashBoard'; // Adjust the import based on your file structure
import CredentialsSignInPage from './component/Auth/Login';
import Teacher from './component/Teacher/TeacherDashBoard'
import Admin from './component/Admin/Admin';
import Box from '@mui/material/Box';
import { Grid2 } from '@mui/material';
import { red } from '@mui/material/colors';
import TeacherTable from './component/Admin/TeacherTable';
import ExampleWithProviders from './component/Admin/TeacherDummy';
import {  useLocation } from "react-router-dom";
import TeacherAllCourseoffred from './component/Teacher/TeacherAllCourseoffred';
import Assignment from './component/Teacher/Assignment';
import AssignmentList from './component/Teacher/List';
import TeacherAllCoAssignment from './component/Teacher/TeacherAllCoAssignment';
import AddAssignmentForm from './component/Teacher/AddAssignment';
import EditAssignmentForm from './component/Teacher/EditAssignmentForm';
import TeacherSubmition from './component/Teacher/TeacherSubmition';
import EditSubmition from './component/Teacher/EditSubmition';
import AddNocodeAssignment from './component/Teacher/AddNocodeAssignment';
import EditNoCodeAssignmentForm from './component/Teacher/EditNoCodeAssignment';
import StudentAllCys from './component/Student/StudentAllCys';
import TestCard from './component/Student/TestCard';
import CysSub from './component/Student/CysSub';
import StudentCoAssignment from './component/Student/StudentCoAssignment';
import SubmitCodeAssignment from './component/Student/SubmitCodeAssignment';
import SubmitNoCodeAssignment from './component/Student/SubmitNoCodeAssignment';
import AssignmentReport from './component/Teacher/AssignmentReport';
import TestCard2 from './component/Student/TestCard2';
import CoAssignmentReport from './component/Teacher/CoAssignmentReport';
import AboutTeacher from './component/Teacher/AboutTeacher';
import AboutStudent from './component/Student/AboutStudent';


function App() {

  var cookies = document.cookie;
  console.log(cookies);



  return (
    <Router>

          <Routes>
            <Route path="/login" element={<CredentialsSignInPage/>} /> 
            <Route path="/admin-dashboard" element={<DashboardLayoutBasic />} />
            {/* Add other routes as needed */}
            <Route path='/teacher-dashboard' element={<TeacherAllCourseoffred/>} />
            <Route path="/add-assignment" element={<AddAssignmentForm />} />
            <Route path='/assignment/' element={<TeacherAllCourseoffred/>} />
            <Route path="/assignment/:coId" element={<Assignment />} /> {/* Assignment component */}
            <Route path="/al" element={<AssignmentList />} /> {/* Assignment component */}
            <Route path="/teacher-co-assignment/:coId" element={<TeacherAllCoAssignment />} />            
            <Route path="/teacher-assignment-submition/:id" element={<TeacherSubmition/>} />            
            
            
            <Route path="/edit-assignment/:id" element={<EditAssignmentForm />} />
            <Route path="/checkAssignment/:id" element={<EditSubmition/>} />
            <Route path="/add-no-code-assignment" element={<AddNocodeAssignment/>} />
            <Route path="/edit-no-code-assignment/:id" element={<EditNoCodeAssignmentForm/>} />
            <Route path="/get-assignment-report/:assId" element={<AssignmentReport/>} />
            
           
            <Route path='/student-dashboard' element={<StudentAllCys/>} />
            
            <Route path="/student-all-sub-cys/:cysId" element={<CysSub/>} />
            
            <Route path="/student-assignment-coid/:coId" element={<StudentCoAssignment/>} />
            
            
            
            <Route path='/test-card' element={<TestCard/>} />
            <Route path='/test-card2' element={<TestCard2/>} />
            
            <Route path="/submit-coding-assignment/:assId" element={<SubmitCodeAssignment/>} />
            <Route path="/submit-no-code-assignment/:assId" element={<SubmitNoCodeAssignment/>} />
            <Route path="/course-offred-assignment-report/:coId" element={<CoAssignmentReport/>} />
            
            <Route path="/teacher-deatils" element={<AboutTeacher/>} />
            <Route path="/student-deatils" element={<AboutStudent/>} />
            
          
          
            <Route path="*" element={<CredentialsSignInPage/>} /> 
            
            
            {/* SubmitNoCodeAssignment */}
            
            {/* <Route path="*" element={<CredentialsSignInPage/>} /> 
             */}
            {/* element={<Teacher/>}/>           */}
          </Routes>
      
    </Router>
  );
}

// function App() {
//   const [role, setRole] = useState(null);
  
//   useEffect(() => {
//     // Get cookies
//     const cookies = document.cookie;

//     if (!cookies) {
//       // Redirect to login if no cookie is found
//       window.location.href = "/login";
//       return;
//     }

//     //Assuming the role is stored in a cookie like "roleName/tokenValue"
//     const roleCookie = cookies.split('; ').find(row => row.startsWith('role='));
    

    
//     if (roleCookie) {
//       const roleValue = roleCookie.split('=')[1]; // Get the value after 'role='
//       const role = roleValue.split('/')[0]; // Extract the role before the "/"
//       setRole(role);
//     } 
//     else {
//       // If no role is found in the cookies, redirect to login
//       window.location.href = "/login";
//     }
//   }, []);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<CredentialsSignInPage />} />
//         {role === 'admin' && (
//           <Route path="/admin-dashboard" element={<DashboardLayoutBasic />} />
//         )}
//         {role === 'teacher' && (
//           <Route path="/teacher-dashboard" element={<Teacher />} />
//         )}
//         {/* Redirect to login if the role is not recognized */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

// function App() {
//   const [role, setRole] = useState(null);
//   const [cookies,setCokie] = useState(document.cookie)

//   useEffect(() => {
//     // Get cookies
//     //const cookies = document.cookie;

//     console.log(cookies);
    
//     setCokie(document.cookie)

//     if (!cookies && window.location.pathname !== "/login") {
//       // Redirect to login if no cookie is found and not already on the login page
//       window.location.href = "/login";
//       return;
//     }

//     // Assuming the role is stored in a cookie like "roleName/tokenValue"
//     const roleCookie = cookies.split("; ").find(row => row.startsWith("role="));


//     console.log(roleCookie);
//     if (roleCookie) {
//       const roleValue = roleCookie.split("=")[1]; // Get the value after 'role='
//       const role = roleValue.split("/")[0]; // Extract the role before the "/"
//       setRole(role);

//       var navTo=''
//       switch (role) {
//         case 'admin':
//           navTo="/admin-dashboard"
//           break;
//         case 'teacher':
//           navTo="/teacher-dashboard"
//           break;
//         case 'student':
//           navTo="/student-dashboard"
//           break;
//         default:
//           return;
//       }

//       window.location.pathname = navTo;
      
//     } else if (window.location.pathname !== "/login") {
//       // If no role is found in the cookies and not on login page, redirect to login
//       window.location.href = "/login";
//     }
//   }, [cookies]);

//   return (
//     <Router>
//       <Routes>
//         <Route path="/login" element={<CredentialsSignInPage />} />
//         {role === "admin" && (
//           <Route path="/admin-dashboard" element={<DashboardLayoutBasic />} />
//         )}
//         {role === "teacher" && (
//           <Route path="/teacher-dashboard" element={<Teacher />} />
//         )}
//         {/* Redirect to login if the role is not recognized */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </Router>
//   );
// }

 export default App;

