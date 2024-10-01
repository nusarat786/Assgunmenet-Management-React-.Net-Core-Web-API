# Assignment Management System

## Overview
This system is designed to manage assignments, submissions, and other related entities for a school. It connects **teachers, students, subjects, courses**, and **assignments** with various constraints and features, ensuring that assignments are created, submitted, and tracked efficiently.

## Project Structure

- **Backend**: SQL Server with Entity Framework Core
- **Frontend**: React, Material-UI (MUI), @toolpad/core
- **File Storage**: Firebase Storage for storing and managing files
- **API**: RESTful API using .NET for data interaction


## Screenshots
<br> </br>
**1. Access Based Login**
<br> </br>

![image](https://github.com/user-attachments/assets/563ab299-85dc-47c4-9069-3cfda93a58c5)

<br> </br>
**2. Admin Dashboard --can perform cruds on entire university records-**
<br> </br>

![image](https://github.com/user-attachments/assets/4ffbda01-ff73-483a-9afc-faeaf933727b)
![image](https://github.com/user-attachments/assets/e71e39ca-cfd5-4156-99dd-fd1c11861e17)
![image](https://github.com/user-attachments/assets/39883c0f-32fe-40b1-a697-d9f5cdfbdf99)
![image](https://github.com/user-attachments/assets/a4636a26-a61f-4834-9633-e2a40356bc79)


<br> </br>
**3. Teacher Dashboard --can add assignment and perform diffrent operation on assignment**
<br> </br>

  **3.1. Teacher Home Page -- teacher can see all the course he/she assigned in**
  ![image](https://github.com/user-attachments/assets/3a481d70-5f0d-4872-9806-8d7effd02e5a)
  <br> </br>

  **3.2. Teacher Add Assignment  -- teacher can add two types of assignment coding and non coding**
  ![image](https://github.com/user-attachments/assets/a11af27a-af1a-4646-a34d-620f3419c666)
  ![image](https://github.com/user-attachments/assets/da0fbc5a-c6ed-41f1-ad18-73b49c0fc2a4)
  <br> </br>

  **3.3. Teacher Course Offred  -- teacher can see all the assignments created in tht piticular course offered**
  <br> </br>
  ->teacher has all the option for assignment in specified links like edit,delete and get report
  ![image](https://github.com/user-attachments/assets/5a929607-cbfa-4ee2-b679-1fa65cecc7fd)
  ->report can be exported to exel and can be used to identify all the student who haven not submited assignment still
  ![image](https://github.com/user-attachments/assets/8f1f8001-ae65-4247-b63e-752b9161d9b5)

  <br> </br>
  **3.4. Teacher Course Offred Report Page  -- teacher can genrate report on piticular course offred he/she is assiggned in**
  <br> </br>
  ->report is like this and it used to get deatiled mark and submit history of all the students who are enrolled in pitucler corse
  ![image](https://github.com/user-attachments/assets/8956e4d8-c0cf-4501-8af0-e636e724afe0)
  ->can be exported in exel too ->> <40% marks means red rows
  ![image](https://github.com/user-attachments/assets/a030f9ff-2068-4bc8-bc6a-691acc8473c9)

  <br> </br>
  **3.5. teacher Assignment Submition Page  -- teacher can get all the submition associted with pirticular assignment**
  <br> </br>
  ![image](https://github.com/user-attachments/assets/d9947b23-f245-4e50-bead-dcba48018656)
  <br> </br>
  ->teacher can perform check submition and can give marks to pirticular submition
  ![image](https://github.com/user-attachments/assets/53c9c5e7-3545-44af-bede-524aa2095266)
  ->heaedr for teacher
  ![image](https://github.com/user-attachments/assets/e2f91159-3f48-4d4c-98d4-8cc0605eec96)

























<br> </br>
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
