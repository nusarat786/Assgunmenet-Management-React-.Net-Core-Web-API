-- Create a new database
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'school_management2')
BEGIN
    CREATE DATABASE school_management2;
END
GO

-- Select the database
USE school_management2;
GO

-- Create DEPARTMENT table
CREATE TABLE DEPARTMENT (
    DEPARTMENT_ID INT IDENTITY(1,1) PRIMARY KEY,
    DEPARTMENT_NAME VARCHAR(100) NOT NULL,
    TS DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-- Create TEACHER table with constraints and nullable fields, with ON DELETE and ON UPDATE actions
CREATE TABLE TEACHER (
    TID INT IDENTITY(1000,1) PRIMARY KEY,
    TFNAME VARCHAR(50) NOT NULL,
    TSNAME VARCHAR(50) NOT NULL,
    TDOB DATE DEFAULT NULL,  -- Nullable with default NULL
    TPHONE VARCHAR(15) UNIQUE CHECK (TPHONE LIKE '[0-9]%'),
    TEMAIL VARCHAR(100) UNIQUE NOT NULL CHECK (TEMAIL LIKE '%@%.%'),
    TJOINING_DATE DATE DEFAULT CURRENT_TIMESTAMP,  -- Nullable with default CURRENT_TIMESTAMP
    TPASSWORD VARCHAR(512) NOT NULL,
    TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    DEPARTMENT_ID INT NULL,  -- Allow NULL
    FOREIGN KEY (DEPARTMENT_ID) REFERENCES DEPARTMENT(DEPARTMENT_ID)
    ON DELETE SET NULL  -- Set DEPARTMENT_ID to NULL if referenced department is deleted
    ON UPDATE CASCADE  -- Update DEPARTMENT_ID in TEACHER if referenced department ID is updated
);
GO



CREATE TABLE SUPER_ADMIN2 (
    SID INT IDENTITY(1,1) PRIMARY KEY,
    TID INT,
    TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    Email NVARCHAR(255) NOT NULL,
    Password NVARCHAR(512) NOT NULL
);
GO

CREATE TABLE SUPER_ADMIN (
    SID INT IDENTITY(1,1) PRIMARY KEY,
    TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    Email NVARCHAR(255) NOT NULL UNIQUE, -- Ensure Email is unique and not null
    Password NVARCHAR(512) NOT NULL,
    CONSTRAINT CK_Email_Format CHECK (Email LIKE '%@%.%') -- Basic email format check
);
GO


-- Create STUDENT table with constraints and nullable fields, including password
CREATE TABLE STUDENT (
    ST_ID INT IDENTITY(1,1) PRIMARY KEY,
    SFIRST_NAME VARCHAR(50) NOT NULL,  -- First name cannot be NULL
    S_SURNAME VARCHAR(50) NOT NULL,    -- Surname cannot be NULL
    DOB DATE DEFAULT NULL,              -- Nullable with default NULL
    PHONE VARCHAR(15) UNIQUE CHECK (PHONE LIKE '[0-9]%'),  -- Unique phone number, must start with a digit
    EMAIL VARCHAR(100) UNIQUE NOT NULL CHECK (EMAIL LIKE '%@%.%'),  -- Unique email address
    PASSWORD VARCHAR(512) NOT NULL,    -- Password field, cannot be NULL
    TS DATETIME DEFAULT CURRENT_TIMESTAMP  -- Timestamp with default value
);
GO

-- Create YEAR table with DATETIME fields and a unique and not null YEAR_NAME field
CREATE TABLE YEAR (
    YEAR_ID INT IDENTITY(1,1) PRIMARY KEY,
    YEAR_NAME VARCHAR(50) NOT NULL UNIQUE,  -- Name field is unique and not null
    DATE_START DATETIME,                    -- Start date and time
    DATE_END DATETIME,                      -- End date and time
    TS DATETIME DEFAULT CURRENT_TIMESTAMP   -- Timestamp with default value
);
GO

-- Create SEMESTER table with a unique and not null NAME field
CREATE TABLE SEMESTER (
    SEM_ID INT IDENTITY(1,1) PRIMARY KEY,
    SEM_NAME VARCHAR(50) NOT NULL UNIQUE,  -- Name field is unique and not null
    TS DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-- Create SUBJECT table with a unique and not null NAME field
CREATE TABLE SUBJECT (
    S_ID INT IDENTITY(1,1) PRIMARY KEY,
    S_NAME VARCHAR(100) NOT NULL UNIQUE,  -- Name field is unique and not null
    TS DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-- Create COURSE table with a unique and not null NAME field
CREATE TABLE COURSE (
    C_ID INT IDENTITY(1,1) PRIMARY KEY,
    C_NAME VARCHAR(100) NOT NULL UNIQUE,  -- Name field is unique and not null
    TS DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-- Create CYS (Course Year Semester) table with NOT NULL constraints, foreign key actions, and unique constraint
CREATE TABLE CYS (
    CYS_ID INT IDENTITY(1,1) PRIMARY KEY,
    C_ID INT NOT NULL,              -- Cannot be NULL
    SEM_ID INT NOT NULL,            -- Cannot be NULL
    YEAR_ID INT NOT NULL,           -- Cannot be NULL
    TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (C_ID) REFERENCES COURSE(C_ID) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    FOREIGN KEY (SEM_ID) REFERENCES SEMESTER(SEM_ID) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    FOREIGN KEY (YEAR_ID) REFERENCES YEAR(YEAR_ID) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    CONSTRAINT UQ_CYS UNIQUE (C_ID, SEM_ID, YEAR_ID)  -- Unique constraint for the combination of these columns
);
GO

-- Create COURSE_OFFERED table
CREATE TABLE COURSE_OFFERED (
    CO_ID INT IDENTITY(1,1) PRIMARY KEY,
    TID INT NOT NULL,
    SID INT NOT NULL,
    CYS_ID INT NOT NULL,
    TS DATETIME DEFAULT CURRENT_TIMESTAMP NULL,
    FOREIGN KEY (TID) REFERENCES TEACHER(TID) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (SID) REFERENCES SUBJECT(S_ID) ON DELETE NO ACTION ON UPDATE CASCADE,
    FOREIGN KEY (CYS_ID) REFERENCES CYS(CYS_ID) ON DELETE NO ACTION ON UPDATE CASCADE,
    CONSTRAINT UC_COURSE_OFFERED UNIQUE (TID, SID, CYS_ID)
);
GO

CREATE TABLE ASSIGNMENT (
    ASSI_ID INT IDENTITY(1,1) PRIMARY KEY, -- Auto-increment primary key
    ASS_NAME VARCHAR(100) NOT NULL, -- Name of the assignment
    ASS_QUESTION_FILE VARCHAR(255) NOT NULL, -- Path or URL to the question file
    ASS_NOTE_INSTRUCTION VARCHAR(MAX), -- Detailed instructions or notes for the assignment
    ASS_TEST_CASE VARCHAR(MAX), -- Test cases to be used for evaluating the assignment
    ASS_MARKS DECIMAL(5, 2) DEFAULT 0, -- Maximum marks for the assignment with default value of 0
    CO_ID INT NOT NULL, -- Foreign key to the COURSE_OFFERED table, cannot be NULL
    CREATED_TS DATETIME DEFAULT CURRENT_TIMESTAMP, -- Timestamp when the assignment was created
    LAST_DATE_TO_SUBMIT_TS DATETIME NOT NULL, -- Last submission date for the assignment
    IS_CODING BIT NOT NULL DEFAULT 0, -- Boolean to indicate if the assignment is coding-related
	SUBJECT_NAME VARCHAR(100),
    FOREIGN KEY (CO_ID) REFERENCES COURSE_OFFERED(CO_ID) 
        ON DELETE CASCADE 
        ON UPDATE CASCADE, -- Foreign key constraints with ON DELETE and ON UPDATE actions
    CHECK (IS_CODING = 0 OR ASS_TEST_CASE IS NOT NULL) -- Constraint to ensure ASS_TEST_CASE is not NULL if IS_CODING is TRUE
);
GO

-- Create SUBJECT table with a unique and not null NAME field
CREATE TABLE SUBJECT (
    S_ID INT IDENTITY(1,1) PRIMARY KEY,
    S_NAME VARCHAR(100) NOT NULL UNIQUE,  -- Name field is unique and not null
    TS DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

-- Create SUBMISSION table
CREATE TABLE SUBMISSION (
    SUB_ID INT IDENTITY(1,1) PRIMARY KEY,
    ASSI_ID INT,
    ST_ID INT,
    ANSWER_FILE VARCHAR(255),
    ANSWER_NOTE VARCHAR(MAX), -- Updated from TEXT to VARCHAR(MAX)
    ASS_CHECK_NOTE VARCHAR(MAX), -- Updated from TEXT to VARCHAR(MAX)
    TEST_CASE_PASSED INT,
    TEST_CASE_FAILED INT,
    SUBMITTED_TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    TURNED_IN_TS DATETIME,
    MARKS DECIMAL(5, 2),
    FOREIGN KEY (ASSI_ID) REFERENCES ASSIGNMENT(ASSI_ID),
    FOREIGN KEY (ST_ID) REFERENCES STUDENT(ST_ID)
);
GO


-- Create the SUBMISSION table with cascading delete, update, and NOT NULL constraints
CREATE TABLE SUBMISSION (
    SUB_ID INT IDENTITY(1,1) PRIMARY KEY,
    ASSI_ID INT NOT NULL, -- Assignment ID, cannot be NULL
    ST_ID INT NOT NULL, -- Student ID, cannot be NULL
    ANSWER_FILE VARCHAR(255), -- Path or URL to the submitted file
    ANSWER_NOTE VARCHAR(MAX), -- Detailed notes provided by the student
    ASS_CHECK_NOTE VARCHAR(MAX), -- Notes added after checking the assignment
    TEST_CASE_PASSED INT,
    TEST_CASE_FAILED INT,
    SUBMITTED_TS DATETIME DEFAULT CURRENT_TIMESTAMP,
    TURNED_IN_TS DATETIME,
    MARKS DECIMAL(5, 2) DEFAULT NULL,
    CODE VARCHAR(MAX), -- Updated to VARCHAR(MAX) for better compatibility with your collation
    FOREIGN KEY (ASSI_ID) REFERENCES ASSIGNMENT(ASSI_ID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE, -- Cascade delete and update for ASSIGNMENT
    FOREIGN KEY (ST_ID) REFERENCES STUDENT(ST_ID)
        ON DELETE CASCADE 
        ON UPDATE CASCADE, -- Cascade delete and update for STUDENT
    CONSTRAINT UQ_ASSI_ID_ST_ID UNIQUE (ASSI_ID, ST_ID) -- Ensures the combination of ASSI_ID and ST_ID is unique
);
GO






-- Create a TRIGGER to enforce the rules based on the IS_CODING flag
CREATE TRIGGER trg_check_submission
ON SUBMISSION
FOR INSERT, UPDATE
AS
BEGIN
    DECLARE @assi_id INT, @is_coding BIT, @answer_file VARCHAR(255), @code VARCHAR(MAX);

    -- Retrieve the values being inserted/updated
    SELECT @assi_id = INSERTED.ASSI_ID, 
           @answer_file = INSERTED.ANSWER_FILE, 
           @code = INSERTED.CODE
    FROM INSERTED;

    -- Get the IS_CODING value from the ASSIGNMENT table
    SELECT @is_coding = IS_CODING FROM ASSIGNMENT WHERE ASSI_ID = @assi_id;

    -- Enforce the rules based on IS_CODING
    IF @is_coding = 0 AND @answer_file IS NULL
    BEGIN
        RAISERROR ('ANSWER_FILE cannot be NULL for non-coding assignments.', 16, 1);
        ROLLBACK TRANSACTION;
    END
    ELSE IF @is_coding = 1 AND @code IS NULL
    BEGIN
        RAISERROR ('CODE cannot be NULL for coding assignments.', 16, 1);
        ROLLBACK TRANSACTION;
    END
END;
GO






-- Create STUDENT_All_Enrolment table with foreign key constraints and unique combination constraint
CREATE TABLE STUDENT_All_Enrolment (
    EiD INT IDENTITY(1,1) PRIMARY KEY,  -- Primary key with auto-increment
    ST_ID INT NOT NULL,                  -- Student ID cannot be NULL
    CYS_ID INT NOT NULL,                 -- CYS ID cannot be NULL
    -- Add foreign key constraints
    FOREIGN KEY (ST_ID) REFERENCES STUDENT(ST_ID) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    FOREIGN KEY (CYS_ID) REFERENCES CYS(CYS_ID) 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE,
    -- Add a unique constraint to ensure unique combinations of ST_ID and CYS_ID
    CONSTRAINT UQ_STUDENT_ALL_ENROLMENT UNIQUE (ST_ID, CYS_ID)
);
GO









-- Optional: Create indexes for frequently queried columns
CREATE INDEX idx_student_email ON STUDENT (EMAIL);
CREATE INDEX idx_teacher_email ON TEACHER (TEMAIL);
GO

ALTER TABLE ASSIGNMENT
ADD CODE_CHECK_FILE_URL VARCHAR(255); -- Adding the new column

-- Adding the constraint to ensure CODE_CHECK_FILE_URL is not NULL if IS_CODING is TRUE
ALTER TABLE ASSIGNMENT
ADD CONSTRAINT CK_Assignment_Coding CHECK (
    IS_CODING = 0 OR (ASS_TEST_CASE IS NOT NULL AND CODE_CHECK_FILE_URL IS NOT NULL)
);

------------- modification 1

USE school_management2;
GO

-- Step 1: Delete all data from the DEPARTMENT table
DELETE FROM DEPARTMENT;

-- Step 2: Add the unique constraint on the DEPARTMENT_NAME column
ALTER TABLE DEPARTMENT
ADD CONSTRAINT DEPARTMENT_NAME UNIQUE (DEPARTMENT_NAME);



















USE [school_management2]
GO
/****** Object:  Trigger [dbo].[trg_UpdateSubjectName]    Script Date: 31-08-2024 22:30:19 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trg_UpdateSubjectName]
ON [dbo].[COURSE_OFFERED]
AFTER INSERT, UPDATE
AS
BEGIN
    -- Update SUBJECT_NAME in ASSIGNMENT table based on changes in COURSE_OFFERED
    UPDATE a
    SET a.SUBJECT_NAME = s.S_NAME
    FROM ASSIGNMENT a
    INNER JOIN INSERTED i ON a.CO_ID = i.CO_ID
    INNER JOIN SUBJECT s ON i.SID = s.S_ID
    WHERE a.CO_ID = i.CO_ID
    AND s.S_NAME IS NOT NULL; -- Ensure SUBJECT_NAME is updated only if S_NAME is not NULL
END;


USE school_management2;
GO

-- Create the stored procedure to get course offered details
CREATE PROCEDURE GetCourseOffereds_v1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        co.CO_ID AS CourseOfferedID,
        c.C_NAME AS CourseName,
        y.YEAR_NAME AS YearName,
        s.SEM_NAME AS SemesterName,
        sub.S_NAME AS SubjectName,
        t.TFNAME + ' ' + t.TSNAME AS TeacherName,
        cys.CYS_ID AS CYS_ID
    FROM COURSE_OFFERED co
     JOIN COURSE c ON co.CYS_ID = c.C_ID
     JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
     JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
     JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
     JOIN SUBJECT sub ON co.SID = sub.S_ID
     JOIN TEACHER t ON co.TID = t.TID;
END;
GO



SELECT
        co.* ,
        c.C_NAME AS CourseName,
        y.YEAR_NAME AS YearName,
        s.SEM_NAME AS SemesterName,
        sub.S_NAME AS SubjectName,
        t.TFNAME + ' ' + t.TSNAME AS TeacherName,
        cys.CYS_ID AS CYS_ID
    FROM COURSE_OFFERED co
     JOIN COURSE c ON co.CYS_ID = c.C_ID
     JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
     JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
     JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
     JOIN SUBJECT sub ON co.SID = sub.S_ID
     JOIN TEACHER t ON co.TID = t.TID;




select * from COURSE_OFFERED;


    SELECT
        co.*,  -- Select all columns from COURSE_OFFERED
        t.TFNAME + ' ' + t.TSNAME AS TeacherName,
        sub.S_NAME AS SubjectName,        
        c.C_NAME AS CourseName,
        y.YEAR_NAME AS YearName,
        s.SEM_NAME AS SemesterName
    FROM COURSE_OFFERED co
    INNER JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
    INNER JOIN COURSE c ON cys.C_ID = c.C_ID
    INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
    INNER JOIN SUBJECT sub ON co.SID = sub.S_ID
    INNER JOIN TEACHER t ON co.TID = t.TID



-- Create the stored procedure to get course offered details
CREATE PROCEDURE GetCourseOffereds_1v
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        co.CO_ID as coId,
		co.CYS_ID as cysId,
		co.SID as sid,
		co.TID as tid,
		co.TS as ts,-- Select all columns from COURSE_OFFERED
        y.YEAR_NAME + ' ' + c.C_NAME + ' ' + s.SEM_NAME + ' ' + sub.S_NAME +' ' + t.TFNAME + ' ' + t.TSNAME AS cofstr
               
    FROM COURSE_OFFERED co
    INNER JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
    INNER JOIN COURSE c ON cys.C_ID = c.C_ID
    INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
    INNER JOIN SUBJECT sub ON co.SID = sub.S_ID
    INNER JOIN TEACHER t ON co.TID = t.TID

END;
GO



drop procedure GetCourseOffereds_1v
EXEC GetCourseOffereds_1v



    


select * from CYS;


-- Create the stored procedure to get course offered details
CREATE PROCEDURE GetCys_v1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        
		cys.CYS_ID as cysId,
		cys.C_ID as cId,
		cys.SEM_ID as semId,
		cys.YEAR_ID as yearId,
		cys.TS as ts,-- Select all columns from COURSE_OFFERED
        y.YEAR_NAME + ' ' + c.C_NAME + ' ' + s.SEM_NAME as cysstr
               
    FROM CYS cys
    INNER JOIN COURSE c ON cys.C_ID = c.C_ID
    INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID

END;
GO


drop procedure GetCys_v1
select * from CYS;
EXEC GetCys_v1;



select * from STUDENT_All_Enrolment




-- Create the stored procedure to get course offered details
CREATE PROCEDURE ssa_v1
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
		sa.EiD as eiD,
		sa.ST_ID as stId,		
		sa.CYS_ID as cysId,
        y.YEAR_NAME + ' ' + c.C_NAME + ' ' + s.SEM_NAME as cysstr,
		st.S_SURNAME + '  ' +st.SFIRST_NAME as name
               
    FROM STUDENT_All_Enrolment sa
	INNER JOIN Student st on sa.ST_ID=st.ST_ID
	INNER JOIN CYS cys ON cys.CYS_ID = sa.CYS_ID
	INNER JOIN COURSE c ON cys.C_ID = c.C_ID
    INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID;

END;
GO 

drop procedure ssa_v1
select * from CYS;
EXEC ssa_v1;



drop procedure GetCourseOffereds_1v
EXEC GetCourseOffereds_1v 1014


CREATE PROCEDURE GetCourseOffereds_1v
    @TeacherId INT = NULL  -- Add parameter for specific teacher ID (nullable)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        co.CO_ID as coId,
        co.CYS_ID as cysId,
        co.SID as sid,
        co.TID as tid,
        co.TS as ts,  -- Select all columns from COURSE_OFFERED
        y.YEAR_NAME + ' ' + c.C_NAME + ' ' + s.SEM_NAME + ' ' + sub.S_NAME + ' ' + t.TFNAME + ' ' + t.TSNAME AS cofstr
    FROM 
        COURSE_OFFERED co
    INNER JOIN 
        CYS cys ON co.CYS_ID = cys.CYS_ID
    INNER JOIN 
        COURSE c ON cys.C_ID = c.C_ID
    INNER JOIN 
        YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN 
        SEMESTER s ON cys.SEM_ID = s.SEM_ID
    INNER JOIN 
        SUBJECT sub ON co.SID = sub.S_ID
    INNER JOIN 
        TEACHER t ON co.TID = t.TID
    WHERE 
        (@TeacherId IS NULL OR co.TID = @TeacherId)  -- Filter by TeacherId if provided
END;
GO








use school_management2;
delete from SUBMISSION
where SUB_ID=11;


    SELECT
        co.CO_ID AS CourseOfferedID,
        c.C_NAME AS CourseName,
        y.YEAR_NAME AS YearName,
        s.SEM_NAME AS SemesterName,
        sub.S_NAME AS SubjectName,
        t.TFNAME + ' ' + t.TSNAME AS TeacherName,
        cys.CYS_ID AS CYS_ID
    FROM COURSE_OFFERED co
    INNER JOIN COURSE c ON co.CYS_ID = c.C_ID
    INNER JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
    INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
    INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
    INNER JOIN SUBJECT sub ON co.SID = sub.S_ID
    INNER JOIN TEACHER t ON co.TID = t.TID;




select sa.*,co.*,
        c.C_NAME AS CourseName,
        y.YEAR_NAME AS YearName,
        s.SEM_NAME AS SemesterName,
        sub.S_NAME AS SubjectName,
        t.TFNAME + ' ' + t.TSNAME AS TeacherName
from
STUDENT_All_Enrolment sa  join COURSE_OFFERED co
on sa.CYS_ID=co.CYS_ID
INNER JOIN COURSE c ON co.CYS_ID = c.C_ID
INNER JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
INNER JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
INNER JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
INNER JOIN SUBJECT sub ON co.SID = sub.S_ID
INNER JOIN TEACHER t ON co.TID = t.TID





SELECT sa.*, co.*, 
       c.C_NAME AS CourseName, 
       y.YEAR_NAME AS YearName, 
       s.SEM_NAME AS SemesterName, 
       sub.S_NAME AS SubjectName, 
       t.TFNAME + ' ' + t.TSNAME AS TeacherName
FROM STUDENT_All_Enrolment sa
JOIN COURSE_OFFERED co ON sa.CYS_ID = co.CYS_ID
JOIN COURSE c ON co.CO_ID = c.C_ID
JOIN CYS cys ON co.CYS_ID = cys.CYS_ID
JOIN YEAR y ON cys.YEAR_ID = y.YEAR_ID
JOIN SEMESTER s ON cys.SEM_ID = s.SEM_ID
JOIN SUBJECT sub ON co.SID = sub.S_ID
JOIN TEACHER t ON co.TID = t.TID
WHERE sa.ST_ID = 8;





select sa.*,co.*,c.C_NAME,y.YEAR_NAME, s.SEM_NAME,sub.S_NAME
from STUDENT_All_Enrolment sa  
join COURSE_OFFERED co on sa.CYS_ID=co.CYS_ID
join CYS cys on cys.CYS_ID=co.CO_ID
join COURSE c on c.C_ID=c.C_ID 
join SEMESTER s on s.SEM_ID=CYS.SEM_ID
join YEAR y on y.YEAR_ID=cys.YEAR_ID
join SUBJECT sub on sub.S_ID=co.SID
join TEACHER t on t.TID=co.TID
where sa.ST_ID=10 and sa.CYS_ID=co.CYS_ID;


select co.*,c.C_NAME,y.YEAR_NAME, s.SEM_NAME from 
COURSE_OFFERED co 
join CYS cys on cys.CYS_ID=co.CYS_ID
join COURSE c on c.C_ID=c.C_ID 
join SEMESTER s on s.SEM_ID=CYS.SEM_ID
join YEAR y on y.YEAR_ID=cys.YEAR_ID
where co.CYS_ID=18;


select co.*,t.TFNAME,sub.S_NAME
from COURSE_OFFERED co 
join SUBJECT sub on sub.S_ID=co.SID
join TEACHER t on t.TID=co.TID
where co.CYS_ID=18;


select  c.C_NAME,s.SEM_NAME,y.YEAR_NAME from
CYS cys join COURSE c on c.C_ID=cys.C_ID
join SEMESTER s on s.SEM_ID=CYS.SEM_ID
join YEAR y on y.YEAR_ID=cys.YEAR_ID
where cys.CYS_ID=18;
 


SELECT 
    c.C_NAME, s.SEM_NAME, y.YEAR_NAME, 
    co.*, t.TFNAME, sub.S_NAME
FROM CYS cys
JOIN COURSE c ON c.C_ID = cys.C_ID
JOIN SEMESTER s ON s.SEM_ID = cys.SEM_ID
JOIN YEAR y ON y.YEAR_ID = cys.YEAR_ID
JOIN COURSE_OFFERED co ON co.CYS_ID = cys.CYS_ID
JOIN SUBJECT sub ON sub.S_ID = co.SID
JOIN TEACHER t ON t.TID = co.TID
WHERE cys.CYS_ID = 17;



CREATE PROCEDURE GetCourseAndOfferedDetailsByCYSId2
    @CYS_ID INT
AS
BEGIN
    SELECT 
        c.C_NAME, s.SEM_NAME, y.YEAR_NAME, y.YEAR_ID,sub.S_ID,c.C_ID,s.SEM_ID,t.TID
        ,co.CO_ID, t.TFNAME, sub.S_NAME
    FROM CYS cys
    JOIN COURSE c ON c.C_ID = cys.C_ID
    JOIN SEMESTER s ON s.SEM_ID = cys.SEM_ID
    JOIN YEAR y ON y.YEAR_ID = cys.YEAR_ID
    JOIN COURSE_OFFERED co ON co.CYS_ID = cys.CYS_ID
    JOIN SUBJECT sub ON sub.S_ID = co.SID
    JOIN TEACHER t ON t.TID = co.TID
    WHERE cys.CYS_ID = @CYS_ID;
END;

drop procedure GetCourseAndOfferedDetailsByCYSId;
EXEC GetCourseAndOfferedDetailsByCYSId2 @CYS_ID = 17;



CREATE PROCEDURE GetCourseAndOfferedDetailsByCYSId
    @CYS_ID INT
AS
BEGIN
    SELECT 
        co.CO_ID AS courseOfferId, 
        y.YEAR_ID AS yearId, 
        y.YEAR_NAME AS yearName,
        y.DATE_END AS yearStart, -- Assuming these columns exist
        y.DATE_END AS yearEnd,     -- Assuming these columns exist
        sub.S_ID AS subjectId,
        sub.S_NAME AS subjectName,
        c.C_ID AS courseId,
        c.C_NAME AS courseName,
        s.SEM_ID AS semesterId,
        s.SEM_NAME AS semesterName,
        t.TID AS teacherId,
        t.TFNAME AS teacherFName,
        t.TSNAME AS teacherLName -- Assuming the teacher's last name column exists
    FROM CYS cys
    JOIN COURSE c ON c.C_ID = cys.C_ID
    JOIN SEMESTER s ON s.SEM_ID = cys.SEM_ID
    JOIN YEAR y ON y.YEAR_ID = cys.YEAR_ID
    JOIN COURSE_OFFERED co ON co.CYS_ID = cys.CYS_ID
    JOIN SUBJECT sub ON sub.S_ID = co.SID
    JOIN TEACHER t ON t.TID = co.TID
    WHERE cys.CYS_ID = @CYS_ID;
END;

EXEC GetCourseAndOfferedDetailsByCYSId @CYS_ID = 17;

select * from SUBMISSION

delete from SUBMISSION
where SUB_ID=11;