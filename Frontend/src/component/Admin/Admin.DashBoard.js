import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AddTeacher from './AddTeacher';
import TeacherTable from './TeacherTable';
import { red } from '@mui/material/colors';
import TeacherTableComponent from './tem';
import Home from './test2';
import StudentTable from './StudentTable';
import YearTable from './YearTable';
import SemTable from './SemTable';
import CourseTable from './Course';
import SubjectTable from './SubjectTable';
import CysTable from './CysTable';
import CourseOffredTable from './CorseOffredTable';
import EnrolmentTable from './EnrollmentTable';
import { Button } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import {
  IconButton,
} from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminTable from './AllAdmin';
import AdTable from './AdTable';
import DepartmentTable from './Depatment';

//import Test from './test1';

function clearAllCookies() {
  const cookies = document.cookie.split(";");

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i];
    const eqPos = cookie.indexOf("=");
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  //window.location.href = "/login";
  document.location.reload();
  return;
}

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'Department',
    title: 'Department',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-department',
        title: 'All Department',
        icon: <DescriptionIcon />,      
      },
      
    ],
  },
  {
    segment: 'Teacher',
    title: 'Teacher',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-teachers',
        title: 'All Teachers',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addteacher',
        title: 'Add Teacher',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Student',
    title: 'Student',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-student',
        title: 'All Student',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addstudent',
        title: 'Add Student',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Year',
    title: 'Year',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-year',
        title: 'All Year',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addyear',
        title: 'Add Year',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Sem',
    title: 'Sem',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-sem',
        title: 'All Sem',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addsem',
        title: 'Add Sem',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Course',
    title: 'Course',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-course',
        title: 'All course',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addcourse',
        title: 'Add Course',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Subject',
    title: 'Subject',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-subject',
        title: 'All Subject',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addsubject',
        title: 'Add Subject',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Cys',
    title: 'CYS',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-cys',
        title: 'All CYS',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addcys',
        title: 'Add CYS',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'CourseOffered',
    title: 'CORSE OFFERED',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-co',
        title: 'All Course Offered',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addco',
        title: 'Add Course Offered',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'Enrolment',
    title: 'STUDENT Enrolment',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-enrolment',
        title: 'All Enrolment',
        icon: <DescriptionIcon />,      
      },
      {
        segment: 'addenrolment',
        title: 'Add Enrolment',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'SAdmin',
    title: 'Super Admin',
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'all-admin',
        title: 'All Admin',
        icon: <DescriptionIcon />,      
      },
      // {
      //   segment: 'addenrolment',
      //   title: 'Add Enrolment',
      //   icon: <DescriptionIcon />,
      // },
    ],
  },
  {
    segment: 'logout',
    title: 'Logout',
    icon: <LogoutIcon />,
  },
  // {
  //   kind: 'custom',
  //   component: (
  //     // <Button
  //     //   startIcon={<LogoutIcon />}
  //     //   onClick={() => {
  //     //     // Implement your logout logic here
  //     //     console.log("User logged out");
  //     //     alert("logout")
  //     //     // For example, you might want to clear user session and navigate to login page
  //     //   }}
  //     //   sx={{ marginRight: 2 }}
  //     // >
  //     //   Logout
  //     // </Button>
  //     <IconButton onClick={
  //       ()=> {  alert('hi')}
  //       }>
  //     <LogoutIcon />
  //   </IconButton>
  //   ),
  // },
  // {
  //   segment: 'students',
  //   title: 'Students',
  //   icon: <DescriptionIcon />,
  // },
  // {
  //   segment: 'orders',
  //   title: 'Orders',
  //   icon: <ShoppingCartIcon />,
  // },
  // {
  //   kind: 'divider',
  // },
  // {
  //   kind: 'header',
  //   title: 'Analytics',
  // },
  // {
  //   segment: 'reports',
  //   title: 'Reports',
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: 'sales',
  //       title: 'Sales',
  //       icon: <DescriptionIcon />,      
  //     },
  //     {
  //       segment: 'traffic',
  //       title: 'Traffic',
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: 'integrations',
  //   title: 'Integrations',
  //   icon: <LayersIcon />,
  // },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: true },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1536,
    },
  },
});

function Teachers() {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <Typography variant="h4">Teachers Panel</Typography>
      {/* Add more content as needed */}
    </Box>
  );
}

function Students() {
  return (
    <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', backgroundColor: red[50], width: '100%', overflowX: 'auto' }}>
      <TeacherTable />
    </Box>
  );
}

function DemoPageContent({ pathname }) {
  switch (pathname) {
    case '/dashboard':
      return <>
       <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>Welcome To Admin Panel</Typography>
       
       </>
       ;
    case '/teachers':
      return <Teachers />;
    case '/students':
      return <Box sx={{width:"100%",position:"relative" ,backgroundColor:red}}>
          <h1 sx>Hello</h1>
          <Home/>
         </Box>;
    case '/Teacher/addteacher':
      return <AddTeacher />;
    case '/Teacher/all-teachers':
      return (
      <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
        <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Teachers</Typography>
      <TeacherTable/>
     </Box>)
    case '/Student/all-student':
      return (
      <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
        <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Students</Typography>
      <StudentTable/>
     </Box>)
    case '/Year/addyear':
          return <AddTeacher />;
    case '/Year/all-year':
          return (
          <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Year</Typography>
          {/* <YearTable/> */}
         <YearTable/>
         </Box>)
    case '/Sem/addsem':
          return <AddTeacher />;
    case '/Sem/all-sem':
          return (
          <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Sem</Typography>
          {/* <YearTable/> */}
         <SemTable/>
         </Box>)
    case '/Course/addcourse':
      return <AddTeacher />;
    case '/Course/all-course':
          return (
          <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Course</Typography>
          {/* <YearTable/> */}
        <CourseTable/>
        </Box>)    
    case '/Subject/addsubject':
          return <AddTeacher />;
    case '/Subject/all-subject':
          return (
            <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
                <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Subject</Typography>
              {/* <YearTable/> */}
           <SubjectTable/>
          </Box>) 
    case '/Cys/addcys':
      return <AddTeacher />;
    case '/Cys/all-cys':
      return (
        <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Cys</Typography>
          {/* <YearTable/> */}
       <CysTable/>
      </Box>) 
    case '/CourseOffered/addco':
      return <AddTeacher />;
    case '/CourseOffered/all-co':
      return (
        <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Course Offred</Typography>
          {/* <YearTable/> */}
        <CourseOffredTable/>
      </Box>) 
    case '/Enrolment/addenrolment':
      return <AddTeacher />;
    case '/Enrolment/all-enrolment':
      return (
        <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Enrolment</Typography>
          {/* <YearTable/> */}
       <EnrolmentTable/>
      </Box>) 
    case '/SAdmin/all-admin':
      return (
        <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
            <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Super Admins</Typography>
          {/* <YearTable/> */}
       <AdTable/>
      </Box>) 
    case '/Department/all-department':
          return (
            <Box sx={{width:"100%",position:"relative" ,backgroundColor:red,marginBottom:'1rem'}}>
                <Typography level="h1" sx={{textAlign:'center', fontSize:'2rem' ,marginY:"1rem"}}>All Department</Typography>
              {/* <YearTable/> */}
           <DepartmentTable/>
          </Box>) 
    case '/logout':{
      clearAllCookies();
      return null
    }
      
    default:
      return <Typography>Page not found</Typography>;
  }
}



DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};



function DashboardLayoutBasic(props) {
  const { window } = props;
  const navigate = useNavigate();

  useEffect(() => {
    
    const cookies = document.cookie;

    console.log(cookies);

    if (!cookies) {
      navigate("/login");
      return;
    }

    const roleCookie = cookies.split("; ").find(row => row.startsWith("role="));


    console.log(roleCookie);
    if (!roleCookie) {
      navigate("/login");
      return
    }

    const roleValue = roleCookie.split("=")[1]; // Get the value after 'role='
    const role = roleValue.split("/")[0]; // Extract the role before the "/"
      
    if(role!=='admin'){
      navigate("/login");
      return
    }
     
       
  }, []);



  const [pathname, setPathname] = React.useState(props.page || '/dashboard');

  const router = React.useMemo(() => ({
    pathname,
    searchParams: new URLSearchParams(),
    navigate: (path) => {
      setPathname(path);
      console.log(`Navigated to ${path}`); // Debugging
    }
  }), [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  const authentication = React.useMemo(() => {
    return {
      signIn: () => {
        alert('hello')
      },
      
    };
  }, []);

  const branding = React.useMemo(() => {
    return {
      title:'Admin'
     // logo: React.ReactNode;
      
    };
  }, []);

 

  return (
    <AppProvider
      navigation={NAVIGATION}
      router={router}
      theme={demoTheme}
      window={demoWindow}
      //authentication={authentication}
      branding={branding}

    >
      {/* <Box sx={{ overflow: 'hidden', height: '100vh', display: 'flex', flexDirection: 'column' }}>
         */}
        <DashboardLayout>
          {/* <Button
        variant="contained"
        color="primary"
        startIcon={<LogoutIcon />}
      // onClick={handleLogout}
        sx={{ position: 'absolute', top: 16, right: 16 }}
      >
        Logout
      </Button> */}
          <DemoPageContent pathname={pathname} />
        </DashboardLayout>
      {/* </Box> */}
    </AppProvider>
  );
}

DashboardLayoutBasic.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
