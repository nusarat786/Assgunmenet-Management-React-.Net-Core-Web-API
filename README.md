# Assignment Management System

## Overview
This system is designed to manage assignments, submissions, and other related entities for a school. It connects **teachers, students, subjects, courses**, and **assignments** with various constraints and features, ensuring that assignments are created, submitted, and tracked efficiently.

## Project Structure

- **Backend**: SQL Server with Entity Framework Core
- **Frontend**: React, Material-UI (MUI), @toolpad/core
- **File Storage**: Firebase Storage for storing and managing files
- **API**: RESTful API using .NET for data interaction


## Screenshots

**1. Access Based Login**
![image](https://github.com/user-attachments/assets/563ab299-85dc-47c4-9069-3cfda93a58c5)

**2. Admin Dashboard --can perform cruds on entire university records-**
![image](https://github.com/user-attachments/assets/319fa3f5-e4f8-4033-a236-57e7e38ce19f)
![image](https://github.com/user-attachments/assets/4ffbda01-ff73-483a-9afc-faeaf933727b)
![image](https://github.com/user-attachments/assets/a7ceecc0-2208-4947-8833-242c5094e4b4)
![image](https://github.com/user-attachments/assets/965b2a24-cf60-49ed-84b7-bbd014cc4c46)



**3. Admin Dashboard --can perform cruds on entire university records-**




















## Technical Components

### 1. Database Structure

The database consists of several key tables:

#### **Tables:**

- **DEPARTMENT**
- **TEACHER**
- **STUDENT**
- **SUBJECT**
- **COURSE**
- **SEMESTER**
- **YEAR**
- **CYS** (Course Year Semester)
- **ASSIGNMENT**
- **SUBMISSION**

---

### 2. API Endpoints

#### **Assignments**

- `GET /api/Assignments/getByTeacherId`: Get assignments by teacher ID
- `GET /api/Assignments`: Fetch all assignments
- `POST /api/Assignments`: Create a new assignment
- `GET /api/Assignments/{id}`: Fetch assignment by ID
- `DELETE /api/Assignments/{id}`: Delete an assignment
- `PUT /api/Assignments/updateCodeAssignmnet/{id}`: Update coding assignment
- `POST /api/addNoCodeAssignment`: Add non-coding assignment
- `PUT /api/Assignments/updateNoCodeAssignmnet/{id}`: Update non-coding assignment

#### **Auth**

- `POST /api/Auth/adminLogin`: Admin login
- `POST /api/Auth/teacherLogin`: Teacher login
- `POST /api/Auth/studentLogin`: Student login

#### **CourseOffered**

- `GET /withName`: Get courses offered by name
- `GET /api/CourseOffered/{id}`: Fetch course offered by ID
- `PATCH /api/CourseOffered/{id}`: Update course offered by ID
- `DELETE /api/CourseOffered/{id}`: Delete course offered by ID
- `GET /api/CourseOffered`: Fetch all courses offered
- `POST /api/CourseOffered`: Create a new course offered

#### **Courses**

- `GET /api/Courses`: Fetch all courses
- `POST /api/Courses`: Create a new course
- `GET /api/Courses/{id}`: Fetch course by ID
- `PATCH /api/Courses/{id}`: Update course by ID
- `DELETE /api/Courses/{id}`: Delete course by ID

#### **Cys**

- `GET /test`: Test endpoint
- `GET /api/Cys`: Fetch all CYS entries
- `POST /api/Cys`: Create a new CYS entry
- `GET /api/Cys/{id}`: Fetch CYS by ID
- `PATCH /api/Cys/{id}`: Update CYS by ID
- `DELETE /api/Cys/{id}`: Delete CYS by ID

#### **Departments**

- `GET /api/Departments`: Fetch all departments
- `POST /api/Departments`: Create a new department
- `GET /api/Departments/{id}`: Fetch department by ID
- `PATCH /api/Departments/{id}`: Update department by ID
- `DELETE /api/Departments/{id}`: Delete department by ID

#### **Retrieval**

- `GET /api/Retrieval/getDetailsByCourseOfferId/{courseOfferId}`: Retrieve details by course offer ID
- `GET /api/Retrieval/getDetailsByCysId/{cysId}`: Retrieve details by CYS ID

#### **Semesters**

- `GET /api/Semesters`: Fetch all semesters
- `POST /api/Semesters`: Create a new semester
- `GET /api/Semesters/{id}`: Fetch semester by ID
- `PATCH /api/Semesters/{id}`: Update semester by ID
- `DELETE /api/Semesters/{id}`: Delete semester by ID

#### **StudentActivity**

- `GET /api/StudentActivity/getID`: Get student ID
- `GET /api/StudentActivity/getEnrolledCourses`: Get enrolled courses
- `GET /api/StudentActivity/getStudentCYS`: Get student CYS
- `GET /api/StudentActivity/getAllSubjectByCys/{cysId}`: Get all subjects by CYS
- `GET /api/StudentActivity/getCoAssi/{coid}`: Get course assignments by course offer ID
- `GET /api/StudentActivity/getStudent`: Get student details

#### **StudentAllEnrolment**

- `GET /api/StudentAllEnrolment/test`: Test endpoint
- `GET /api/StudentAllEnrolment`: Fetch all student enrollments
- `POST /api/StudentAllEnrolment`: Create new student enrollment
- `GET /api/StudentAllEnrolment/{id}`: Fetch student enrollment by ID
- `PATCH /api/StudentAllEnrolment/{id}`: Update student enrollment by ID
- `DELETE /api/StudentAllEnrolment/{id}`: Delete student enrollment by ID

#### **Students**

- `GET /api/Students`: Fetch all students
- `POST /api/Students`: Create a new student
- `GET /api/Students/{id}`: Fetch student by ID
- `PATCH /api/Students/{id}`: Update student by ID
- `DELETE /api/Students/{id}`: Delete student by ID

#### **Subjects**

- `GET /api/Subjects`: Fetch all subjects
- `POST /api/Subjects`: Create a new subject
- `GET /api/Subjects/{id}`: Fetch subject by ID
- `PATCH /api/Subjects/{id}`: Update subject by ID
- `DELETE /api/Subjects/{id}`: Delete subject by ID

#### **Submissions**

- `GET /api/Submissions`: Fetch all submissions
- `GET /api/Submissions/{id}`: Fetch submission by ID
- `PATCH /api/Submissions/{id}`: Update submission by ID
- `DELETE /api/Submissions/{id}`: Delete submission by ID
- `POST /api/Submissions/submitCodeAssignment`: Submit a coding assignment
- `POST /api/Submissions/submitCodeAssignment_main`: Submit a main coding assignment
- `POST /api/Submissions/submitNoCodeAssignmentWithFile`: Submit a non-coding assignment with a file
- `GET /api/Submissions/getSubByAssId/{id}`: Get submissions by assignment ID
- `GET /api/Submissions/GetSub/{assId}`: Get submission details by assignment ID

#### **SuperAdmin**

- `GET /api/SuperAdmin`: Fetch all super admins
- `POST /api/SuperAdmin`: Create a new super admin
- `GET /api/SuperAdmin/{id}`: Fetch super admin by ID
- `PATCH /api/SuperAdmin/{id}`: Update super admin by ID
- `DELETE /api/SuperAdmin/{id}`: Delete super admin by ID

#### **TeacherActivity**

- `GET /api/TeacherActivity/getID`: Get teacher ID
- `GET /api/getCourse`: Get course details
- `GET /api/TeacherActivity/getCoAssi/{coid}`: Get course assignments by course offer ID
- `PATCH /api/TeacherActivity/checkAssignment/{id}`: Check assignment by ID
- `GET /api/TeacherActivity/getAssignmentReport/{id}`: Get assignment report by ID
- `GET /api/TeacherActivity/getCourseOfferedAssignmentReport/{id}`: Get course-offered assignment report by ID
- `GET /api/TeacherActivity/getTeacher`: Get teacher details

#### **Teachers**

- `GET /api/Teachers`: Fetch all teachers
- `POST /api/Teachers`: Create a new teacher
- `GET /api/Teachers/{id}`: Fetch teacher by ID
- `PATCH /api/Teachers/{id}`: Update teacher by ID
- `DELETE /api/Teachers/{id}`: Delete teacher by ID

#### **WeatherForecast**

- `GET /WeatherForecast`: Get weather forecast

#### **Years**

- `GET /api/Years`: Fetch all years
- `POST /api/Years`: Create a new year
- `GET /api/Years/{id}`: Fetch year by ID
- `PATCH /api/Years/{id}`: Update year by ID
- `DELETE /api/Years/{id}`: Delete year by ID

---

## Technology Stack

- **Backend**: 
  - Entity Framework Core (EF Core)
  - SQL Server (with collation 'Indic_General_90_CI_AS_SC_UTF8')
  
- **Frontend**: 
  - React
  - Material-UI (MUI)
  - @toolpad/core
  
- **File Storage**:
  - Firebase Storage

---

## Future Enhancements

- **Automated Assignment Grading**: Implementing automated grading for coding assignments using test cases.
- **Role-based API Calls**: Customizing API responses based on user roles (admin, teacher, student).
- **Responsive Design**: Improving mobile responsiveness for submission and dashboard layouts.
