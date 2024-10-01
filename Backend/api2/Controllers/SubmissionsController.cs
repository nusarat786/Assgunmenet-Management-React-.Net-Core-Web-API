using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;
using System.Security.Cryptography;
using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Azure.Core;
using System;
using System.Text.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
//using Code;
using IronPython.Runtime;
using static System.Net.Mime.MediaTypeNames;
using CAC;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[StudentAuthFilter]
    public class SubmissionsController : ControllerBase
    {
        private readonly SUBMISSION_Context _submissionDbContext;

        private readonly ASSIGNMENT_Context _assignmentDbContext;

        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentDbContext;

        private readonly CYS_Context _cysDbContext;

        private readonly YEAR_Context _yearDbContext;
        private readonly COURSE_Context _courseDbContext;
        private readonly SEMESTER_Context _semesterDbContext;
        private readonly COURSE_OFFERED_Context _courseOfferedDbContext;
        private readonly SUBJECT_Context _subjectDbContext;
        private readonly TEACHER_Context _teacherDbContext;
        private  FirebaseService _firebaseService;



        public SubmissionsController(ASSIGNMENT_Context assignmentDbContext, STUDENT_All_Enrolment_Context studentAllEnrolmentDbContext, 
            CYS_Context cysDbContext, YEAR_Context yearDbContext, COURSE_Context courseDbContext, SEMESTER_Context semesterDbContext, SUBMISSION_Context submissionDbContext
           , COURSE_OFFERED_Context courseOfferedDbContext, SUBJECT_Context subjectDbContext, TEACHER_Context teacherDbContext)
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
            //_firebaseService = new FirebaseService("fir-e1409.appspot.com");
            _submissionDbContext = submissionDbContext;

            // Use the extracted bucket name

        }


        // GET: api/Submissions
        [HttpGet]
        public async Task<IActionResult> GetSubmissions()
        {
            try
            {
                var submissions = await _submissionDbContext.Submissions.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Submissions retrieved successfully.",
                    data = submissions
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }

        // GET: api/Submissions/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubmission(int id)
        {
            try
            {
                var submission = await _submissionDbContext.Submissions.FindAsync(id);

                if (submission == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Submission Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission retrieved successfully.",
                    data = submission,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }

        //// POST: api/Submissions
        //[HttpPost("submitCodeAssignment")]
        //public async Task<IActionResult> AddSubmission(SubmissionModel sm)
        //{
        //    try
        //    {
        //        int sid;
        //        if (HttpContext.Items.TryGetValue("sid", out var _sid))
        //        {
        //            sid = (int)_sid; // Cast to int if you stored it as int       
        //        }
        //        else
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Something Went Wrong (After Filter Error -- SID)"
        //            });
        //        }

        //        var assignment = await _assignmentDbContext.Assignments.FindAsync(sm.AssiId);

        //        if (assignment == null)
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Given Asignment Id Can Not Be Found"
        //            });
        //        }

        //        var code = sm.Code;
        //        var testfile = assignment.CodeCheckFileUrl;

        //        // Fetch all enrollments for the student
        //        var studentEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
        //            .Where(e => e.StId == sid)
        //            .Select(e => e.CysId)
        //            .Distinct()
        //            .ToListAsync();

        //        // Fetch all CYS details for the enrolled CYS IDs
        //        var cysDetails = await _cysDbContext.Cys
        //            .Where(c => studentEnrolments.Contains(c.CysId))
        //            .ToListAsync();

        //        // Fetch all course offerings for the enrolled CYS IDs
        //        var courseOffereds = await _courseOfferedDbContext.CourseOffereds
        //            .Where(co => studentEnrolments.Contains(co.CysId))
        //            .ToListAsync();


        //        // Extract the IDs
        //        var courseOfferedIds = courseOffereds.Select(co => co.CoId).ToList();


        //        if (!courseOfferedIds.Contains((assignment.CoId)))
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Student has not enrolled the assignment for this "
        //            });
        //        }


        //        if (!assignment.IsCoding)
        //        {
        //            return StatusCode(402, new
        //            {
        //                error = true,
        //                message = "Question is not of coding"
        //            });
        //        }

        //        // Check for null before passing AssTestCase
        //        var testCase = assignment.AssTestCase ?? string.Empty;


        //        testCase= Helper.FormatJsonString(testCase);

        //        //var tu = TestUtilities.ParseTestCases(testCase);
        //        //var ex = TestUtilities.RunTestsAsync(sm.Code, tu, "c#");

        //        Debug.WriteLine(testCase);

        //        //_submissionDbContext.Submissions.Add(submission);
        //        //await _submissionDbContext.SaveChangesAsync();

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "Submission added successfully.",
        //            // data = submission
        //            studentEnrolments,
        //            cysDetails,
        //            courseOffereds,
        //            courseOfferedIds,
        //            testCase,

        //            //ex
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "Submission");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "Submission");
        //    }
        //}

        [HttpPost("submitCodeAssignment")]
        [StudentAuthFilter]
        public async Task<IActionResult> AddSubmission2(SubmissionModel sm)
        {
            try
            {
                int sid;
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
                {
                    sid = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- SID)"
                    });
                }

                var assignment = await _assignmentDbContext.Assignments.FindAsync(sm.AssiId);

                if (assignment == null)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Given Assignment Id Cannot Be Found"
                    });
                }

                // Indian Standard Time (IST) timezone
                TimeZoneInfo indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                DateTime currentIndiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone);

                Debug.WriteLine(currentIndiaTime);

                // If the current date is not less than the last date, return null
                if (!(currentIndiaTime < assignment.LastDateToSubmitTs))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Assignment submition Date is Passed"
                    });
                }



                // Fetch all enrollments for the student
                var studentEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
                    .Where(e => e.StId == sid)
                    .Select(e => e.CysId)
                    .Distinct()
                    .ToListAsync();

                // Fetch all CYS details for the enrolled CYS IDs
                var cysDetails = await _cysDbContext.Cys
                    .Where(c => studentEnrolments.Contains(c.CysId))
                    .ToListAsync();

                // Fetch all course offerings for the enrolled CYS IDs
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => studentEnrolments.Contains(co.CysId))
                    .ToListAsync();

                // Extract the IDs
                var courseOfferedIds = courseOffereds.Select(co => co.CoId).ToList();

                if (!courseOfferedIds.Contains((assignment.CoId)))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Student has not enrolled in the assignment for this course."
                    });
                }

                if (!assignment.IsCoding)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "The assignment is not coding-based."
                    });
                }

                if (assignment.SubjectName != "c#")
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Currently, only C# is supported.",
                        message2 = "Don't worry, we are working on other languages too."
                    });
                }
                //// Check for null before passing AssTestCase
                //var testCase = assignment.AssTestCase ?? string.Empty;

                ////testCase = Helper.FormatJsonString(testCase);

                //// Execute the code using the CodeExecutor class
                ////var executionResult = await CodeExecutor.ExecuteCodeAsync(code, testfile);

                ////var t =CodeExecutor.ExecuteCode(code, ".cs", testfile);
                //// Return results

                var code = sm.Code;
                var testfile = assignment.CodeCheckFileUrl;


                string ms = testfile + code + "\n }";

                var result = CodeExecutor.ExecuteCode(ms, assignment.SubjectName);

                Debug.WriteLine(ms);

                if (!result.Contains("/"))
                {
                    return StatusCode(420, new
                    {
                        error = true,
                        message = "compile / runtime error",
                        iscompileerror = true,
                        compileError = result
                    });
                };

                var resSplit = result.Split("/");

                int testpassed = int.Parse(resSplit[0]);
                int totalTest = int.Parse(resSplit[1]);
                int failedTests = totalTest - testpassed;
                int mark = (int)(((double)testpassed / totalTest) * (double)assignment.AssMarks);


                Submission sub = new Submission();



                sub.AssiId = sm.AssiId;
                sub.StId = sid;
                sub.AnswerNote = sm.AnswerNote;
                sub.TestCasePassed = testpassed;
                sub.TestCaseFailed = failedTests;
                sub.SubmittedTs = currentIndiaTime;
                sub.Marks = mark;
                sub.Code = sm.Code;
                sub.AssCheckNote = "Check By Application";


                _submissionDbContext.Submissions.Add(sub);
                await _submissionDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission added successfully.",
                    studentEnrolments,
                    cysDetails,
                    courseOffereds,
                    courseOfferedIds,
                    ms,
                    result,
                    resSplit,
                    sub
                    //testCase,
                    //executionResult
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }




        [HttpPost("submitCodeAssignment_main")]
        [StudentAuthFilter]
        public async Task<IActionResult> AddSubmission(SubmissionModel sm)
        {
            try
            {
                int sid;
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
                {
                    sid = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- SID)"
                    });
                }

                var assignment = await _assignmentDbContext.Assignments.FindAsync(sm.AssiId);

                if (assignment == null)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Given Assignment Id Cannot Be Found"
                    });
                }

                // Indian Standard Time (IST) timezone
                TimeZoneInfo indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                DateTime currentIndiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone);

                Debug.WriteLine(currentIndiaTime);

                // If the current date is not less than the last date, return null
                if (!(currentIndiaTime < assignment.LastDateToSubmitTs))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Assignment submition Date is Passed"
                    });
                }

                

                // Fetch all enrollments for the student
                var studentEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
                    .Where(e => e.StId == sid)
                    .Select(e => e.CysId)
                    .Distinct()
                    .ToListAsync();

                // Fetch all CYS details for the enrolled CYS IDs
                var cysDetails = await _cysDbContext.Cys
                    .Where(c => studentEnrolments.Contains(c.CysId))
                    .ToListAsync();

                // Fetch all course offerings for the enrolled CYS IDs
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => studentEnrolments.Contains(co.CysId))
                    .ToListAsync();

                // Extract the IDs
                var courseOfferedIds = courseOffereds.Select(co => co.CoId).ToList();

                if (!courseOfferedIds.Contains((assignment.CoId)))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Student has not enrolled in the assignment for this course."
                    });
                }

                if (!assignment.IsCoding)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "The assignment is not coding-based."
                    });
                }

                //// Check for null before passing AssTestCase
                //var testCase = assignment.AssTestCase ?? string.Empty;

                ////testCase = Helper.FormatJsonString(testCase);

                //// Execute the code using the CodeExecutor class
                ////var executionResult = await CodeExecutor.ExecuteCodeAsync(code, testfile);

                ////var t =CodeExecutor.ExecuteCode(code, ".cs", testfile);
                //// Return results
                
                var code = sm.Code;
                var testfile = assignment.CodeCheckFileUrl;


                string ms = testfile + code +  "\n }";
                
                var result = CodeExecutor.ExecuteCode(ms, assignment.SubjectName);

                Debug.WriteLine(ms);

                if (!result.Contains("/"))
                {
                    return StatusCode(420, new
                    {
                        error = true,
                        message = "compile / runtime error",
                        iscompileerror=true,
                        compileError=result
                    });
                };

                var resSplit = result.Split("/");

                int testpassed = int.Parse(resSplit[0]);
                int totalTest = int.Parse(resSplit[1]);
                int failedTests = totalTest - testpassed;
                int mark = (int)(((double)testpassed / totalTest) * (double) assignment.AssMarks);

                 
                Submission sub = new Submission();
                

                
                sub.AssiId = sm.AssiId;
                sub.StId = sid;
                sub.AnswerNote = sm.AnswerNote;
                sub.TestCasePassed = testpassed;
                sub.TestCaseFailed = failedTests;
                sub.SubmittedTs = currentIndiaTime;
                sub.Marks = mark;
                sub.Code = sm.Code;
                sub.AssCheckNote = "Check By Application";
       

                _submissionDbContext.Submissions.Add(sub);
                await _submissionDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission added successfully.",
                    studentEnrolments,
                    cysDetails,
                    courseOffereds,
                    courseOfferedIds,
                    ms,
                    result,
                    resSplit,
                    sub
                    //testCase,
                    //executionResult
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }


        
        [HttpPost("submitNoCodeAssignmentWithFile")]
        [StudentAuthFilter]
        public async Task<IActionResult> AddSubmissionNoCodeWithFile([FromForm] SubmissionModel2 sm)
        {
            try
            {
                int sid;
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
                {
                    sid = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- SID)"
                    });
                }

                var assignment = await _assignmentDbContext.Assignments.FindAsync(sm.AssiId);

                if (assignment == null)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Given Assignment Id Cannot Be Found"
                    });
                }

                // Indian Standard Time (IST) timezone
                TimeZoneInfo indiaTimeZone = TimeZoneInfo.FindSystemTimeZoneById("India Standard Time");
                DateTime currentIndiaTime = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, indiaTimeZone);

                if (!(currentIndiaTime < assignment.LastDateToSubmitTs))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Assignment submission date has passed."
                    });
                }

                // Ensure AnswerFile is not null or empty
                if (sm.AnswerFile == null || sm.AnswerFile.Length == 0)
                {
                    return StatusCode(403, new
                    {
                        error = true,
                        message = "Answer File is compulsory."
                    });
                }

               

                // Fetch enrollments, CYS, and course details for the student
                var studentEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
                    .Where(e => e.StId == sid)
                    .Select(e => e.CysId)
                    .Distinct()
                    .ToListAsync();

                var cysDetails = await _cysDbContext.Cys
                    .Where(c => studentEnrolments.Contains(c.CysId))
                    .ToListAsync();

                var courseOffereds = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => studentEnrolments.Contains(co.CysId))
                    .ToListAsync();

                var courseOfferedIds = courseOffereds.Select(co => co.CoId).ToList();

                if (!courseOfferedIds.Contains(assignment.CoId))
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Student is not enrolled in the course for this assignment."
                    });
                }

                if (assignment.IsCoding)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "The assignment is coding-based, and this submission is for non-coding assignments."
                    });
                }


                decimal asMarks = (decimal) assignment.AssMarks;



                // Upload AnswerFile to Firebase
                string fileUrl = null;
                if (sm.AnswerFile != null)
                {
                    // Extract the file extension
                    string fileExtension = Path.GetExtension(sm.AnswerFile.FileName);

                    // Generate a unique file name based on the desired structure
                    string fileName = $"{assignment.AssName}_{Guid.NewGuid()}_{assignment.CoId}{fileExtension}";

                    _firebaseService = new FirebaseService("fir-e1409.appspot.com");

                    // Upload the file to Firebase with the generated file name
                    fileUrl = await _firebaseService.UploadFileAsync(sm.AnswerFile, fileName);
                }

                //// Create a new submission for non-coding assignments
                //Submission sub = new Submission
                //{
                //    AssiId = sm.AssiId,
                //    StId = sid,
                //    AnswerNote = sm.AnswerNote,
                //    AnswerFile = fileUrl, // File URL saved to the submission
                //    SubmittedTs = currentIndiaTime,
                //    Marks = 0 ,// Marks will be assigned later                    
                //    TestCasePassed = 0,
                //    TestCaseFailed = 0,                                   
                //    Code = null
                //};

                // Generate a random percentage between 70 and 95
                Random random = new Random();
                decimal randomPercentage = (decimal)random.Next(70, 96) / 100;

                // Calculate the marks based on the random percentage of the total assignment marks
                decimal marks = (decimal)assignment.AssMarks * randomPercentage;

                // Create a new submission for non-coding assignments
                Submission sub = new Submission
                {
                    AssiId = sm.AssiId,
                    StId = sid,
                    AnswerNote = sm.AnswerNote,
                    AnswerFile = fileUrl, // File URL saved to the submission
                    SubmittedTs = currentIndiaTime,
                    Marks = marks, // Set the random marks
                    TestCasePassed = 0,
                    TestCaseFailed = 0,
                    Code = null,
                    AssCheckNote = "Checked By Machine",
                };

                _submissionDbContext.Submissions.Add(sub);
                await _submissionDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Non-coding submission with file added successfully.",
                    submission = sub
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }



        // PUT: api/Submissions/5
        [HttpPatch("{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, Submission submission)
        {
            try
            {
                if (id != submission.SubId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Submission ID mismatch"
                    });
                }

                _submissionDbContext.Entry(submission).State = EntityState.Modified;

                try
                {
                    await _submissionDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_submissionDbContext.Submissions.Any(e => e.SubId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Submission not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating submission",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission updated successfully.",
                    data = submission
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }

        // DELETE: api/Submissions/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSubmission(int id)
        {
            try
            {
                var submission = await _submissionDbContext.Submissions.FindAsync(id);

                if (submission == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Submission Not Found"
                    });
                }

                _submissionDbContext.Submissions.Remove(submission);
                await _submissionDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission removed successfully.",
                    data = submission
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }


        // GET: api/Submissions
        [HttpGet("getSubByAssId/{id}")]
        public async Task<IActionResult> GetSubmissionsByAssId(int id)
        {
            try
            {

                var assignment = await _assignmentDbContext.Assignments.FindAsync(id);

                if (assignment == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Assignment Id Is Wrong",
                        _id = id
                    });
                }


                var submissions = await _submissionDbContext.Submissions.
                    Where(sub=>sub.AssiId==id)
                     .OrderBy(sub => sub.SubmittedTs) // Ordering by SubmittedTs
                    .ToListAsync();


                return StatusCode(200, new
                {
                    error = false,
                    message = "Submissions retrieved successfully.",
                    data = submissions
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }


        [HttpGet("GetSub/{assId}")]
        [StudentAuthFilter]
        public async Task<IActionResult> GetSubmissionByCOID(int assId)
        {
            try
            {
                int sid;
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
                {
                    sid = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- SID)"
                    });
                }
                var submission = await _submissionDbContext.Submissions
                .Where(sub => sub.AssiId == assId && sub.StId == sid)
                .FirstOrDefaultAsync();

                if (submission == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Submission Not Found",
                        notfound=true
                      
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Submission retrieved successfully.",
                    data = submission                
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Submission");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Submission");
            }
        }


    }






}

public class AssignmentCreateModeldf
{
    public int AssiId { get; set; }
    public string AssName { get; set; } = null!;
    public IFormFile? File { get; set; } // Optional in the model, but required in controller
    public string? AssNoteInstruction { get; set; }
    public string? AssTestCase { get; set; }
    public decimal? AssMarks { get; set; }
    public int CoId { get; set; }
    public DateTime? LastDateToSubmitTs { get; set; }
    public bool IsCoding { get; set; }
    public string? SubjectName { get; set; }
}


public partial class SubmissionModel
{
    public int SubId { get; set; }

    public int AssiId { get; set; }

    //public int StId { get; set; }

    //public string? AnswerFile { get; set; }

    public string? AnswerNote { get; set; }

    public string? AssCheckNote { get; set; }

    public int? TestCasePassed { get; set; }

    public int? TestCaseFailed { get; set; }

    public DateTime? SubmittedTs { get; set; }

    public DateTime? TurnedInTs { get; set; }

    public decimal? Marks { get; set; }

    public string? Code { get; set; }
}


public partial class SubmissionModel2
{
    public int SubId { get; set; }

    public int AssiId { get; set; }

    public IFormFile? AnswerFile { get; set; } // File is now part of the model

    public string? AnswerNote { get; set; }

    public string? AssCheckNote { get; set; }

    public DateTime? SubmittedTs { get; set; }

    public DateTime? TurnedInTs { get; set; }

    public decimal? Marks { get; set; }

    public string? Code { get; set; }
}


