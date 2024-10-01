using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Http.HttpResults;
using Mono.Unix.Native;
using System.Text;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AssignmentsController : ControllerBase
    {
        private readonly ASSIGNMENT_Context _assignmentDbContext;

        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentDbContext;

        private readonly CYS_Context _cysDbContext;

        private readonly YEAR_Context _yearDbContext;
        private readonly COURSE_Context _courseDbContext;
        private readonly SEMESTER_Context _semesterDbContext;
        private readonly COURSE_OFFERED_Context _courseOfferedDbContext;
        private readonly SUBJECT_Context _subjectDbContext;
        private readonly TEACHER_Context _teacherDbContext;
        private readonly FirebaseService _firebaseService;
        private readonly STUDENT_Context _studentDbContext;



        public AssignmentsController(ASSIGNMENT_Context assignmentDbContext, STUDENT_All_Enrolment_Context studentAllEnrolmentDbContext, CYS_Context cysDbContext
            , YEAR_Context yearDbContext, COURSE_Context courseDbContext, SEMESTER_Context semesterDbContext,
            COURSE_OFFERED_Context courseOfferedDbContext, SUBJECT_Context subjectDbContext, TEACHER_Context teacherDbContext,STUDENT_Context studentDbContext)
        {
            _studentAllEnrolmentDbContext = studentAllEnrolmentDbContext;
            _cysDbContext = cysDbContext;
            _yearDbContext = yearDbContext;
            _courseDbContext = courseDbContext;
            _semesterDbContext = semesterDbContext;
            _courseOfferedDbContext = courseOfferedDbContext;
            _subjectDbContext = subjectDbContext;
            _teacherDbContext = teacherDbContext;
            _assignmentDbContext = assignmentDbContext;
            _firebaseService = new FirebaseService("fir-e1409.appspot.com");
            _studentDbContext = studentDbContext;

    }


        [HttpGet("getByTeacherId")]
        [TeacherAuthFilter]
        public async Task<IActionResult> GetAssignmentsByTeacherId()
        {
            try
            {
                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                // Step 1: Fetch data from each context separately and sort by timestamp
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                var cysIds = courseOffereds.Select(co => co.CysId).Distinct().ToList();
                var cysList = await _cysDbContext.Cys
                    .Where(cys => cysIds.Contains(cys.CysId))
                    .OrderByDescending(cys => cys.Ts)
                    .ToListAsync();

                var courseIds = cysList.Select(cys => cys.CId).Distinct().ToList();
                var courses = await _courseDbContext.Courses
                    .Where(c => courseIds.Contains(c.CId))
                    .OrderByDescending(c => c.Ts)
                    .ToListAsync();

                var semesterIds = cysList.Select(cys => cys.SemId).Distinct().ToList();
                var semesters = await _semesterDbContext.Semesters
                    .Where(sem => semesterIds.Contains(sem.SemId))
                    .OrderByDescending(sem => sem.Ts)
                    .ToListAsync();

                var yearIds = cysList.Select(cys => cys.YearId).Distinct().ToList();
                var years = await _yearDbContext.Years
                    .Where(year => yearIds.Contains(year.YearId))
                    .OrderByDescending(year => year.Ts)
                    .ToListAsync();

                var subjectIds = courseOffereds.Select(co => co.Sid).Distinct().ToList();
                var subjects = await _subjectDbContext.Subjects
                    .Where(s => subjectIds.Contains(s.SId))
                    .OrderByDescending(s => s.Ts)
                    .ToListAsync();

                var coIds = courseOffereds.Select(co => co.CoId).ToList();
                var assignments = await _assignmentDbContext.Assignments
                    .Where(ass => coIds.Contains(ass.CoId))
                    .OrderByDescending(ass => ass.CreatedTs)
                    .ToListAsync();

                // Step 2: Build the nested JSON structure with sorting
                var groupedData = cysList
                    .Select(cys => new
                    {
                        cysId = cys.CysId,
                        cysName = $"{courses.First(c => c.CId == cys.CId).CName} {semesters.First(sem => sem.SemId == cys.SemId).SemName} {years.First(year => year.YearId == cys.YearId).YearName}",
                        subjects = courseOffereds
                            .Where(co => co.CysId == cys.CysId)
                            .GroupBy(co => new { co.CoId, co.Sid })
                            .Select(subjectGroup => new
                            {
                                coId = subjectGroup.Key.CoId,
                                sId = subjectGroup.Key.Sid,
                                sName = subjects.First(s => s.SId == subjectGroup.Key.Sid).SName,
                                assignments = assignments
                                    .Where(ass => ass.CoId == subjectGroup.Key.CoId)
                                    .ToList()
                            }).OrderBy(subject => subject.sName) // Optionally sort subjects
                            .ToList()
                    }).OrderBy(cys => cys.cysName) // Optionally sort CYS
                    .ToList();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignments retrieved successfully.",
                    cysWiseSubjects = groupedData
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred while retrieving assignments.",
                    details = ex.Message
                });
            }
        }




        // GET: api/Assignments
        [HttpGet]
        public async Task<IActionResult> GetAssignmentsByTeacher()
        {
            try
            {
                var assignments = await _assignmentDbContext.Assignments.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignments retrieved successfully.",
                    data = assignments
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }

        // GET: api/Assignments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignment(int id)
        {
            try
            {
                var assignment = await _assignmentDbContext.Assignments.FindAsync(id);

                if (assignment == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Assignment Not Found",
                        _id = id
                    });
                }
          
                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment retrieved successfully.",
                    data = assignment,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }

        //// POST: api/Assignments
        //[HttpPost]
        //[TeacherAuthFilter]
        //public async Task<IActionResult> AddAssignment(AssignmentCreateModel am)
        //{
        //    try
        //    {
        //        if (!HttpContext.Items.TryGetValue("tid", out var _tid))
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Something went wrong (After Filter Error -- TID)"
        //            });
        //        }

        //        int tid = (int)_tid;

        //        // Step 1: Fetch data from each context separately and sort by timestamp
        //        var courseOffereds = await _courseOfferedDbContext.CourseOffereds
        //            .Where(co => co.Tid == tid)
        //            .OrderByDescending(co => co.Ts)
        //            .ToListAsync();

        //        // Extract CysIds from the student enrollments
        //        var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

        //        if (!courseofferIds.Contains(am.CoId))
        //        {
        //            return StatusCode(403, new
        //            {
        //                error = true,
        //                message = "Teacher Is Not Enrolled in this Course offred"
        //            });
        //        }


        //        //


        //        if (am.File == null || am.File.Length == 0)
        //        {
        //            return StatusCode(403, new
        //            {
        //                error = true,
        //                message = "Question File Is Compulsory"
        //            });
        //        }

        //        if (am.Question == null || am.Question.Length == 0)
        //        {
        //            return StatusCode(403, new
        //            {
        //                error = true,
        //                message = "Code File Is Compulsory"
        //            });
        //        }

        //        string fileUrl = null;
        //        string codeUrl = null;
        //        string fileExtension2;

        //        if (am.File != null && am.Question !=null)
        //        {
        //            // Extract the file extension
        //            string fileExtension = Path.GetExtension(am.File.FileName);

        //            fileExtension2 = Path.GetExtension(am.Question.FileName);




        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";


        //            // Upload the file to Firebase with the generated file name
        //            fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
        //            codeUrl = await _firebaseService.UploadFileAsync(am.Question, fileName2);

        //        }

        //        var courseAssi = await  _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
        //        var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);

        //        var assignment = new Assignment
        //        {
        //            AssName = am.AssName,
        //            AssQuestionFile = fileUrl, // Save the URL or path of the uploaded file
        //            AssNoteInstruction = am.AssNoteInstruction,
        //            AssTestCase = am.AssTestCase,
        //            AssMarks = am.AssMarks,
        //            CoId = am.CoId,
        //            CreatedTs = DateTime.UtcNow,
        //            LastDateToSubmitTs = am.LastDateToSubmitTs ?? DateTime.UtcNow.AddDays(1),
        //            IsCoding = am.IsCoding,
        //            CodeCheckFileUrl=codeUrl,
        //            SubjectName= subject.SName

        //        };




        //        _assignmentDbContext.Assignments.Add(assignment);
        //        await _assignmentDbContext.SaveChangesAsync();

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "Assignment added successfully.",
        //            courseOffereds,
        //            courseofferIds,
        //            assignment
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "Assignment");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "Assignment");
        //    }
        //}


        // POST: api/Assignments
        [HttpPost]
        [TeacherAuthFilter]
        public async Task<IActionResult> AddAssignment(AssignmentCreateModel am)
        {
            try
            {
                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                // Step 1: Fetch data from each context separately and sort by timestamp
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                // Extract CysIds from the student enrollments
                var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

                if (!courseofferIds.Contains(am.CoId))
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Teacher Is Not Enrolled in this Course offred"
                    });
                }


                //


                if (am.File == null || am.File.Length == 0)
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Question File Is Compulsory"
                    });
                }

                if (am.Question == null || am.Question.Length == 0)
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Code File Is Compulsory"
                    });
                }

                string fileUrl = null;
                string codeUrl = null;
                string fileExtension2;

                if (am.File != null && am.Question != null)
                {
                    // Extract the file extension
                    string fileExtension = Path.GetExtension(am.File.FileName);

                    fileExtension2 = Path.GetExtension(am.Question.FileName);




                    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
                    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
                    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
                    string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";


                    // Upload the file to Firebase with the generated file name
                    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);

                    // Assume 'am' is an instance of a model containing an IFormFile property 'Question'
                    IFormFile? file = am.Question;

                    if (file == null || file.Length == 0)
                    {
                        // Handle the case where the file is null or empty
                        throw new ArgumentException("File is not provided or is empty.");
                    }

                    // Asynchronously read and trim the file content
                    codeUrl = await Helper.ReadAndTrimFileContentAsync(file);
                    //codeUrl = Helper.ReadAndTrimFileContentAsync(am.Question);

                }

                var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
                var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);

                //var assignment = new Assignment
                //{
                //    AssName = am.AssName,
                //    AssQuestionFile = fileUrl, // Save the URL or path of the uploaded file
                //    AssNoteInstruction = am.AssNoteInstruction,
                //    AssTestCase = am.AssTestCase,
                //    AssMarks = am.AssMarks,
                //    CoId = am.CoId,
                //    CreatedTs = DateTime.UtcNow,
                //    LastDateToSubmitTs = am.LastDateToSubmitTs ?? DateTime.UtcNow.AddDays(1),
                //    IsCoding = am.IsCoding,
                //    CodeCheckFileUrl = codeUrl,
                //    SubjectName = subject.SName

                //};

                // Define IST TimeZone
                TimeZoneInfo indianZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

                //// Get the current timestamp in UTC and convert it to IST
                //DateTime createdTsUtc = DateTime.UtcNow;
                //DateTime createdTsIst = TimeZoneInfo.ConvertTimeFromUtc(createdTsUtc, indianZone);

                var assignment = new Assignment
                {
                    AssName = am.AssName,
                    AssQuestionFile = fileUrl, // Save the URL or path of the uploaded file
                    AssNoteInstruction = am.AssNoteInstruction,
                    AssTestCase = am.AssTestCase,
                    AssMarks = am.AssMarks,
                    CoId = am.CoId,
                    // Convert current UTC time to IST
                    CreatedTs = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indianZone),
                    // Set LastDateToSubmitTs or default it to the next day in IST
                    LastDateToSubmitTs = am.LastDateToSubmitTs.HasValue
                        ? TimeZoneInfo.ConvertTimeFromUtc(am.LastDateToSubmitTs.Value.ToUniversalTime(), indianZone)
                        : TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow.AddDays(1), indianZone),
                    IsCoding = am.IsCoding,
                    CodeCheckFileUrl = codeUrl,
                    SubjectName = subject.SName
                };





                _assignmentDbContext.Assignments.Add(assignment);
                await _assignmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment added successfully.",
                    courseOffereds,
                    courseofferIds,
                    assignment
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }




        // PUT: api/Assignments/5
        [HttpPut("updateCodeAssignmnet/{id}")]
        [TeacherAuthFilter]
        public async Task<IActionResult> ReplaceAssignment(int id, AssignmentCreateModel am)
        {
            try
            {
                if (id != am.AssiId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Assignment ID mismatch"
                    });
                }

                var existingAssignment = await _assignmentDbContext.Assignments.FindAsync(id);
                if (existingAssignment == null)
                {
                    return StatusCode(404, new
                    {
                        error = true,
                        message = "Assignment not found"
                    });
                }

                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

                if (!courseofferIds.Contains(am.CoId))
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Teacher is not enrolled in this course offered."
                    });
                }

                // Handling file upload (if applicable)
                string fileUrl = existingAssignment.AssQuestionFile;
                string codeUrl = existingAssignment.CodeCheckFileUrl;

                if (am.File != null && am.File.Length > 0 && am.Question != null && am.Question.Length > 0)
                {
                    // Extract the file extensions
                    string fileExtension = Path.GetExtension(am.File.FileName);
                    string fileExtension2 = Path.GetExtension(am.Question.FileName);

                    // Generate unique file names
                    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
                    string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";

                    // Upload the files to Firebase with the generated file names
                    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
                    IFormFile? file = am.Question;
                    codeUrl = await Helper.ReadAndTrimFileContentAsync(file);

                    // Update the file URLs/paths
                    existingAssignment.AssQuestionFile = fileUrl;
                    existingAssignment.CodeCheckFileUrl = codeUrl;
                }

                var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
                var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);

                TimeZoneInfo indianZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

                // Replace the entire assignment properties
                existingAssignment.AssName = am.AssName;
                existingAssignment.AssNoteInstruction = am.AssNoteInstruction;
                existingAssignment.AssTestCase = am.AssTestCase;
                existingAssignment.AssMarks = am.AssMarks;
                existingAssignment.CoId = am.CoId;
                existingAssignment.LastDateToSubmitTs = am.LastDateToSubmitTs.HasValue
                        ? TimeZoneInfo.ConvertTimeFromUtc(am.LastDateToSubmitTs.Value.ToUniversalTime(), indianZone)
                        : TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow.AddDays(1), indianZone);
                existingAssignment.IsCoding = am.IsCoding;
                existingAssignment.SubjectName = subject.SName;

                _assignmentDbContext.Entry(existingAssignment).State = EntityState.Modified;

                try
                {
                    await _assignmentDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_assignmentDbContext.Assignments.Any(e => e.AssiId == id))
                    {
                        return StatusCode(404, new
                        {
                            error = true,
                            message = "Assignment not found during concurrency check"
                        });
                    }
                    else
                    {
                        return StatusCode(500, new
                        {
                            error = true,
                            message = "Error updating assignment",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment replaced successfully.",
                    data = existingAssignment
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }





        //

        // POST: api/Assignments
        [HttpPost("/api/addNoCodeAssignment")]
        [TeacherAuthFilter]
        public async Task<IActionResult> AddNonCodeAssignment(AssignmentNoCodeModel am)
        {
            try
            {
                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                // Step 1: Fetch data from each context separately and sort by timestamp
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                // Extract CysIds from the student enrollments
                var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

                if (!courseofferIds.Contains(am.CoId))
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Teacher Is Not Enrolled in this Course offred"
                    });
                }


                //


                if (am.File == null || am.File.Length == 0)
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Question File Is Compulsory"
                    });
                }


                string fileUrl = null;
                //string codeUrl = null;
                string fileExtension2;

                if (am.File != null)
                {
                    // Extract the file extension
                    string fileExtension = Path.GetExtension(am.File.FileName);

                    //fileExtension2 = Path.GetExtension(am.Question.FileName);




                    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
                    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
                    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
                    //string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";


                    // Upload the file to Firebase with the generated file name
                    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);

                    //// Assume 'am' is an instance of a model containing an IFormFile property 'Question'
                    //IFormFile? file = am.Question;

                    //if (file == null || file.Length == 0)
                    //{
                    //    // Handle the case where the file is null or empty
                    //    throw new ArgumentException("File is not provided or is empty.");
                    //}

                    // Asynchronously read and trim the file content
                    //codeUrl = await Helper.ReadAndTrimFileContentAsync(file);
                    //codeUrl = Helper.ReadAndTrimFileContentAsync(am.Question);

                }

                var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
                var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);

                TimeZoneInfo indianZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                // Get the current timestamp in UTC and convert it to IST
                DateTime createdTsUtc = DateTime.UtcNow;
                DateTime createdTsIst = TimeZoneInfo.ConvertTimeFromUtc(createdTsUtc, indianZone);

                var assignment = new Assignment
                {
                    AssName = am.AssName,
                    AssQuestionFile = fileUrl, // Save the URL or path of the uploaded file
                    AssNoteInstruction = am.AssNoteInstruction,                    
                    AssMarks = am.AssMarks,
                    CoId = am.CoId,
                    CreatedTs = createdTsIst,
                    LastDateToSubmitTs = am.LastDateToSubmitTs.HasValue ? TimeZoneInfo.ConvertTimeFromUtc(am.LastDateToSubmitTs.Value.ToUniversalTime(), indianZone)
                        : TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow.AddDays(1), indianZone),
                    IsCoding = false,                    
                    SubjectName = subject.SName

                };




                _assignmentDbContext.Assignments.Add(assignment);
                await _assignmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment added successfully.",
                    courseOffereds,
                    courseofferIds,
                    assignment
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }



        // PUT: api/Assignments/5
        [HttpPut("updateNoCodeAssignmnet/{id}")]
        [TeacherAuthFilter]
        public async Task<IActionResult> ReplaceNodCodeAssignment(int id, AssignmentNoCodeModel am)
        {
            try
            {
                TimeZoneInfo indianZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");

                if (id != am.AssiId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Assignment ID mismatch"
                    });
                }

                var existingAssignment = await _assignmentDbContext.Assignments.FindAsync(id);
                if (existingAssignment == null)
                {
                    return StatusCode(404, new
                    {
                        error = true,
                        message = "Assignment not found"
                    });
                }

                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

                if (!courseofferIds.Contains(am.CoId))
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Teacher is not enrolled in this course offered."
                    });
                }

                // Handling file upload (if applicable)
                string fileUrl = existingAssignment.AssQuestionFile;
                //string codeUrl = existingAssignment.CodeCheckFileUrl;

                if (am.File != null && am.File.Length > 0)
                {
                    // Extract the file extensions
                    string fileExtension = Path.GetExtension(am.File.FileName);
                    //string fileExtension2 = Path.GetExtension(am.Question.FileName);

                    // Generate unique file names
                    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
                    //string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";

                    // Upload the files to Firebase with the generated file names
                    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
                    //codeUrl = await _firebaseService.UploadFileAsync(am.Question, fileName2);

                    // Update the file URLs/paths
                    existingAssignment.AssQuestionFile = fileUrl;
                    //existingAssignment.CodeCheckFileUrl = codeUrl;
                }

                var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
                var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);

                // Replace the entire assignment properties
                existingAssignment.AssName = am.AssName;
                existingAssignment.AssNoteInstruction = am.AssNoteInstruction;
                //existingAssignment.AssTestCase = am.AssTestCase;
                existingAssignment.AssMarks = am.AssMarks;
                existingAssignment.CoId = am.CoId;
                existingAssignment.LastDateToSubmitTs = am.LastDateToSubmitTs.HasValue ? TimeZoneInfo.ConvertTimeFromUtc(am.LastDateToSubmitTs.Value.ToUniversalTime(), indianZone)
                        : TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow.AddDays(1), indianZone);
                existingAssignment.IsCoding = false;
                existingAssignment.SubjectName = subject.SName;

                _assignmentDbContext.Entry(existingAssignment).State = EntityState.Modified;

                try
                {
                    await _assignmentDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_assignmentDbContext.Assignments.Any(e => e.AssiId == id))
                    {
                        return StatusCode(404, new
                        {
                            error = true,
                            message = "Assignment not found during concurrency check"
                        });
                    }
                    else
                    {
                        return StatusCode(500, new
                        {
                            error = true,
                            message = "Error updating assignment",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment replaced successfully.",
                    data = existingAssignment
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }



        //// PUT: api/Assignments/5
        //[HttpPatch("{id}")]
        //[TeacherAuthFilter]
        //public async Task<IActionResult> UpdateAssignment(int id, AssignmentCreateModel am)
        //{
        //    try
        //    {
        //        if (id != am.AssiId)
        //        {
        //            return StatusCode(400, new
        //            {
        //                error = true,
        //                message = "Assignment ID mismatch"
        //            });
        //        }

        //        var existingAssignment = await _assignmentDbContext.Assignments.FindAsync(id);
        //        if (existingAssignment == null)
        //        {
        //            return StatusCode(404, new
        //            {
        //                error = true,
        //                message = "Assignment not found"
        //            });
        //        }

        //        if (!HttpContext.Items.TryGetValue("tid", out var _tid))
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Something went wrong (After Filter Error -- TID)"
        //            });
        //        }

        //        int tid = (int)_tid;

        //        var courseOffereds = await _courseOfferedDbContext.CourseOffereds
        //            .Where(co => co.Tid == tid)
        //            .OrderByDescending(co => co.Ts)
        //            .ToListAsync();

        //        var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

        //        if (!courseofferIds.Contains(am.CoId))
        //        {
        //            return StatusCode(403, new
        //            {
        //                error = true,
        //                message = "Teacher is not enrolled in this course offered."
        //            });
        //        }

        //        //// Handling file upload (if applicable)
        //        //string fileUrl = existingAssignment.AssQuestionFile;
        //        //if (am.File != null && am.File.Length > 0)
        //        //{
        //        //    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //        //    string fileExtension = Path.GetExtension(am.File.FileName);
        //        //    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";

        //        //    // Upload the file to Firebase with the generated file name
        //        //    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
        //        //    existingAssignment.AssQuestionFile = fileUrl; // Update the file URL/path
        //        //}


        //        string fileUrl = null;
        //        string codeUrl = null;
        //        string fileExtension2;

        //        if (am.File != null && am.File.Length > 0  && am.Question != null && am.Question.Length != null)
        //        {
        //            // Extract the file extension
        //            string fileExtension = Path.GetExtension(am.File.FileName);

        //            fileExtension2 = Path.GetExtension(am.Question.FileName);



        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";

        //            // Upload the file to Firebase with the generated file name
        //            fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
        //            codeUrl = await _firebaseService.UploadFileAsync(am.Question, fileName2);

        //            existingAssignment.AssQuestionFile = fileUrl; // Update the file URL/path
        //            existingAssignment.CodeCheckFileUrl = codeUrl; // Update the file URL/path


        //        }

        //        var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
        //        var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);



        //        // Update the assignment properties
        //        existingAssignment.AssName = am.AssName;
        //         // Update the file URL/path
        //        existingAssignment.AssNoteInstruction = am.AssNoteInstruction;
        //        existingAssignment.AssTestCase = am.AssTestCase;
        //        existingAssignment.AssMarks = am.AssMarks;
        //        existingAssignment.CoId = am.CoId;
        //        existingAssignment.LastDateToSubmitTs = am.LastDateToSubmitTs ?? DateTime.UtcNow.AddDays(1);
        //        existingAssignment.IsCoding = am.IsCoding;
        //        existingAssignment.SubjectName = subject.SName;

        //        _assignmentDbContext.Entry(existingAssignment).State = EntityState.Modified;

        //        try
        //        {
        //            await _assignmentDbContext.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException dc)
        //        {
        //            if (!_assignmentDbContext.Assignments.Any(e => e.AssiId == id))
        //            {
        //                return StatusCode(404, new
        //                {
        //                    error = true,
        //                    message = "Assignment not found during concurrency check"
        //                });
        //            }
        //            else
        //            {
        //                return StatusCode(500, new
        //                {
        //                    error = true,
        //                    message = "Error updating assignment",
        //                    stackTrace = dc.StackTrace,
        //                    exception = dc.Message
        //                });
        //            }
        //        }

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "Assignment updated successfully.",
        //            data = existingAssignment
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "Assignment");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "Assignment");
        //    }
        //}

        //// PUT: api/Assignments/5
        //[HttpPatch("{id}")]
        //[TeacherAuthFilter]
        //public async Task<IActionResult> UpdateAssignment(int id, AssignmentCreateModel am)
        //{
        //    try
        //    {
        //        if (id != am.AssiId)
        //        {
        //            return StatusCode(400, new
        //            {
        //                error = true,
        //                message = "Assignment ID mismatch"
        //            });
        //        }

        //        var existingAssignment = await _assignmentDbContext.Assignments.FindAsync(id);
        //        if (existingAssignment == null)
        //        {
        //            return StatusCode(404, new
        //            {
        //                error = true,
        //                message = "Assignment not found"
        //            });
        //        }

        //        if (!HttpContext.Items.TryGetValue("tid", out var _tid))
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Something went wrong (After Filter Error -- TID)"
        //            });
        //        }

        //        int tid = (int)_tid;

        //        var courseOffereds = await _courseOfferedDbContext.CourseOffereds
        //            .Where(co => co.Tid == tid)
        //            .OrderByDescending(co => co.Ts)
        //            .ToListAsync();

        //        var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

        //        if (!courseofferIds.Contains(am.CoId))
        //        {
        //            return StatusCode(403, new
        //            {
        //                error = true,
        //                message = "Teacher is not enrolled in this course offered."
        //            });
        //        }

        //        //// Handling file upload (if applicable)
        //        //string fileUrl = existingAssignment.AssQuestionFile;
        //        //if (am.File != null && am.File.Length > 0)
        //        //{
        //        //    // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //        //    string fileExtension = Path.GetExtension(am.File.FileName);
        //        //    string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";

        //        //    // Upload the file to Firebase with the generated file name
        //        //    fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
        //        //    existingAssignment.AssQuestionFile = fileUrl; // Update the file URL/path
        //        //}


        //        string fileUrl = null;
        //        string codeUrl = null;
        //        string fileExtension2;

        //        if (am.File != null && am.File.Length > 0 && am.Question != null && am.Question.Length != null)
        //        {
        //            // Extract the file extension
        //            string fileExtension = Path.GetExtension(am.File.FileName);

        //            fileExtension2 = Path.GetExtension(am.Question.FileName);



        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName = $"{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension}";
        //            // Generate a unique file name based on the desired structure: asi_name_asi id_cys_id_
        //            string fileName2 = $"CODE_{am.AssName}_{Guid.NewGuid()}_{am.CoId}{fileExtension2}";

        //            // Upload the file to Firebase with the generated file name
        //            fileUrl = await _firebaseService.UploadFileAsync(am.File, fileName);
        //            codeUrl = await _firebaseService.UploadFileAsync(am.Question, fileName2);

        //            existingAssignment.AssQuestionFile = fileUrl; // Update the file URL/path
        //            //existingAssignment.CodeCheckFileUrl = codeUrl; // Update the file URL/path


        //        }

        //        var courseAssi = await _courseOfferedDbContext.CourseOffereds.FindAsync(am.CoId);
        //        var subject = await _subjectDbContext.Subjects.FindAsync(courseAssi.Sid);



        //        // Update the assignment properties
        //        existingAssignment.AssName = am.AssName;
        //        // Update the file URL/path
        //        existingAssignment.AssNoteInstruction = am.AssNoteInstruction;
        //        existingAssignment.AssTestCase = am.AssTestCase;
        //        existingAssignment.AssMarks = am.AssMarks;
        //        existingAssignment.CoId = am.CoId;
        //        existingAssignment.LastDateToSubmitTs = am.LastDateToSubmitTs ?? DateTime.UtcNow.AddDays(1);
        //        existingAssignment.IsCoding = am.IsCoding;
        //        existingAssignment.SubjectName = subject.SName;

        //        _assignmentDbContext.Entry(existingAssignment).State = EntityState.Modified;

        //        try
        //        {
        //            await _assignmentDbContext.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException dc)
        //        {
        //            if (!_assignmentDbContext.Assignments.Any(e => e.AssiId == id))
        //            {
        //                return StatusCode(404, new
        //                {
        //                    error = true,
        //                    message = "Assignment not found during concurrency check"
        //                });
        //            }
        //            else
        //            {
        //                return StatusCode(500, new
        //                {
        //                    error = true,
        //                    message = "Error updating assignment",
        //                    stackTrace = dc.StackTrace,
        //                    exception = dc.Message
        //                });
        //            }
        //        }

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "Assignment updated successfully.",
        //            data = existingAssignment
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "Assignment");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "Assignment");
        //    }
        //}










        // DELETE: api/Assignments/5
        [HttpDelete("{id}")]
        [TeacherAuthFilter]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            try
            {


                var assignment = await _assignmentDbContext.Assignments.FindAsync(id);

                if (assignment == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Assignment Not Found"
                    });
                }


                if (!HttpContext.Items.TryGetValue("tid", out var _tid))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something went wrong (After Filter Error -- TID)"
                    });
                }

                int tid = (int)_tid;

                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .OrderByDescending(co => co.Ts)
                    .ToListAsync();

                var courseofferIds = courseOffereds.Select(e => e.CoId).Distinct().ToList();

                if (!courseofferIds.Contains(assignment.CoId))
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Teacher is not enrolled in this course offered."
                    });
                }

                _assignmentDbContext.Assignments.Remove(assignment);
                await _assignmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Assignment removed successfully.",
                    data = assignment
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Assignment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Assignment");
            }
        }
    }
}

public class AssignmentCreateModel
{
    public int AssiId { get; set; }
    public string AssName { get; set; } = null!;
    public IFormFile? File { get; set; } // Optional in the model, but required in controller

    public IFormFile? Question { get; set; } // Optional in the model, but required in controller

    public string? AssNoteInstruction { get; set; }
    public string? AssTestCase { get; set; }
    public decimal? AssMarks { get; set; }
    public int CoId { get; set; }
    public DateTime? LastDateToSubmitTs { get; set; }
    public bool IsCoding { get; set; }
    public string? SubjectName { get; set; }
}

public partial class AssignmentNoCodeModel
{
    public int AssiId { get; set; }

    public string AssName { get; set; } = null!;

    public IFormFile? File { get; set; } 

    public string? AssNoteInstruction { get; set; }

    public decimal? AssMarks { get; set; }

    public int CoId { get; set; }

    public DateTime? CreatedTs { get; set; }

    public DateTime? LastDateToSubmitTs { get; set; }

    public bool IsCoding { get; set; }

    public string? SubjectName { get; set; }



}



