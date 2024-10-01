using api2.Models;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [TeacherAuthFilter]
    public class TeacherActivityController : ControllerBase
    {

        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentDbContext;

        private readonly CYS_Context _cysDbContext;

        private readonly YEAR_Context _yearDbContext;
        private readonly COURSE_Context _courseDbContext;
        private readonly SEMESTER_Context _semesterDbContext;
        private readonly COURSE_OFFERED_Context _courseOfferedDbContext;
        private readonly SUBJECT_Context _subjectDbContext;
        private readonly TEACHER_Context _teacherDbContext;
        private readonly ASSIGNMENT_Context _assignmentDbContext;
        private readonly SUBMISSION_Context _submissionDbContext;
        private readonly STUDENT_Context _studentDbContext;

        public int tid;
        public TeacherActivityController(STUDENT_All_Enrolment_Context studentAllEnrolmentDbContext, CYS_Context cysDbContext
            , YEAR_Context yearDbContext, COURSE_Context courseDbContext, SEMESTER_Context semesterDbContext,
            COURSE_OFFERED_Context courseOfferedDbContext, SUBJECT_Context subjectDbContext, TEACHER_Context teacherDbContext, 
            ASSIGNMENT_Context assignmentDbContext , SUBMISSION_Context submissionDbContext ,STUDENT_Context studentDbContext)
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
            _assignmentDbContext = assignmentDbContext;
            _submissionDbContext = submissionDbContext;
            _studentDbContext =studentDbContext;
    }

        [HttpGet("getID")]
        public async Task<IActionResult> GetAllCourse()
        {

            try
            {


                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    tid = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }



                // Fetch all courseOffred data for the student based on their ID
                var teacher = await _teacherDbContext.Teacher
                    .Where(te => te.Tid == tid)
                    .ToListAsync();

                // Fetch all enrollment data for the student based on their ID
                var teacherAllCourseOffered = await _courseOfferedDbContext.CourseOffereds
                    .Where(co => co.Tid == tid)
                    .ToListAsync();

                var cysIds = teacherAllCourseOffered.Select(tc => tc.CysId).Distinct().ToList();

                // Fetch the CYS details
                var cysDetails = await _cysDbContext.Cys
                    .Where(c => cysIds.Contains(c.CysId))
                    .ToListAsync();

                // Fetch related Course, Year, and Semester names using their respective DbContexts
                var courseIds = cysDetails.Select(c => c.CId).Distinct().ToList();
                var yearIds = cysDetails.Select(c => c.YearId).Distinct().ToList();
                var semIds = cysDetails.Select(c => c.SemId).Distinct().ToList();

                var courses = await _courseDbContext.Courses
                    .Where(co => courseIds.Contains(co.CId))
                    .ToListAsync();

                var years = await _yearDbContext.Years
                    .Where(y => yearIds.Contains(y.YearId))
                    .ToListAsync();

                var semesters = await _semesterDbContext.Semesters
                    .Where(s => semIds.Contains(s.SemId))
                    .ToListAsync();

                // Fetch subjects
                var subjectIds = teacherAllCourseOffered.Select(tc => tc.Sid).Distinct().ToList();
                var subjects = await _subjectDbContext.Subjects
                    .Where(sub => subjectIds.Contains(sub.SId))
                    .ToListAsync();

                //// Group subjects by CYS ID and include the course, year, and semester names
                //var cysWiseSubjects = cysDetails.Select(cys => new
                //{
                //    CysId = cys.CysId,
                //    CysName = $"{courses.FirstOrDefault(co => co.CId == cys.CId)?.CName} " +
                //              $"{semesters.FirstOrDefault(s => s.SemId == cys.SemId)?.SemName} " +
                //              $"{years.FirstOrDefault(y => y.YearId == cys.YearId)?.YearName}",
                //    Subjects = teacherAllCourseOffered
                //        .Where(tc => tc.CysId == cys.CysId)
                //        .Select(tc => subjects.FirstOrDefault(s => s.SId == tc.Sid))
                //        .Where(sub => sub != null)
                //        .Select(sub => new
                //        {
                //            sub.SId,
                //            sub.SName
                //        })
                //        .ToList()
                //}).ToList();
                var cysWiseSubjects = cysDetails.Select(cys => new
                {
                    CysId = cys.CysId,
                    CysName = $"{courses.FirstOrDefault(co => co.CId == cys.CId)?.CName} " +
                              $"{semesters.FirstOrDefault(s => s.SemId == cys.SemId)?.SemName} " +
                              $"{years.FirstOrDefault(y => y.YearId == cys.YearId)?.YearName}",
                    Subjects = teacherAllCourseOffered
                        .Where(tc => tc.CysId == cys.CysId)
                        .Select(tc => new
                        {
                            tc.CoId, // Include the CourseOffered ID
                            Subject = subjects.FirstOrDefault(s => s.SId == tc.Sid)
                        })
                        .Where(tc => tc.Subject != null)
                        .Select(tc => new
                        {
                            tc.CoId,
                            tc.Subject.SId,
                            tc.Subject.SName
                        })
                        .ToList()
                }).ToList();

                //if (studentAllEnrolments == null)
                //{
                //    return StatusCode(400, new
                //    {
                //        error = true,
                //        message = "StudentAllEnrolment Not Avilable"
                //    });
                //}


                //// Extract CysIds from the student enrollments
                //var cysIds = studentAllEnrolments.Select(e => e.CysId).Distinct().ToList();

                //// Fetch CYS details
                //var cysDetails = await _cysDbContext.Cys
                //    .Where(c => cysIds.Contains(c.CysId))
                //    .ToListAsync();

                //// Fetch Course, Year, and Semester names separately
                //var courseIds = cysDetails.Select(c => c.CId).Distinct().ToList();
                //var yearIds = cysDetails.Select(c => c.YearId).Distinct().ToList();
                //var semIds = cysDetails.Select(c => c.SemId).Distinct().ToList();

                //var courses = await _courseDbContext.Courses
                //    .Where(co => courseIds.Contains(co.CId))
                //    .ToListAsync();

                //var years = await _yearDbContext.Years
                //    .Where(y => yearIds.Contains(y.YearId))
                //    .ToListAsync();

                //var semesters = await _semesterDbContext.Semesters
                //    .Where(s => semIds.Contains(s.SemId))
                //    .ToListAsync();

                //// Combine results manually
                //var combinedCysDetails = cysDetails.Select(c => new
                //{
                //    c.CysId,
                //    c.CId,
                //    c.SemId,
                //    c.YearId,
                //    c.Ts,
                //    CourseName = courses.FirstOrDefault(co => co.CId == c.CId)?.CName,
                //    YearName = years.FirstOrDefault(y => y.YearId == c.YearId)?.YearName,
                //    SemesterName = semesters.FirstOrDefault(s => s.SemId == c.SemId)?.SemName
                //}).ToList();


                //var cof = await _courseOfferedDbContext.CourseOffereds
                //      .Where(cof => cysIds.Contains(cof.CysId)).ToListAsync();

                //var subId = cof.Select(cof => cof.Sid).Distinct().ToList();


                //var subject = await _subjectDbContext.Subjects
                //      .Where(sub => subId.Contains(sub.SId)).ToListAsync();


                //// Group subjects by CysId
                //var subjectsByCys = cof
                //    .GroupBy(cof => cof.CysId)
                //    .Select(group => new
                //    {
                //        CysId = group.Key,
                //        Subjects = subject
                //            .Where(sub => group.Select(g => g.Sid).Contains(sub.SId))
                //            .Select(sub => new
                //            {
                //                sub.SId,
                //                sub.SName,
                //                sub.Ts
                //            })
                //            .ToList()
                //    })
                //    .ToList();

                //// Group subjects by CysId and include course, sem, and year names
                //var subjectsByCys2 = cysDetails.Select(c => new
                //{
                //    CysId = c.CysId,
                //    Name = $"{courses.FirstOrDefault(co => co.CId == c.CId)?.CName} " +
                //           $"{semesters.FirstOrDefault(s => s.SemId == c.SemId)?.SemName} " +
                //           $"{years.FirstOrDefault(y => y.YearId == c.YearId)?.YearName}",
                //    Subjects = cof
                //        .Where(cof => cof.CysId == c.CysId)
                //        .Select(cof => subject.FirstOrDefault(sub => sub.SId == cof.Sid))
                //        .Where(sub => sub != null)
                //        .Select(sub => new
                //        {
                //            sub.SId,
                //            sub.SName,
                //            sub.Ts
                //        })
                //        .ToList()
                //}).ToList();

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment removed successfully.",
                    id = tid,
                    teacherAllCourseOffered,
                    teacher,
                    cysWiseSubjects
                    //studentAllotments = studentAllEnrolments,
                    //allCys = cysDetails,
                    //combined = combinedCysDetails,
                    //allcourseOffred = cof,
                    //allsubject = subject,
                    //subjectsByCys = subjectsByCys,
                    //subjectsByCys2

                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "StudentAllEnrolment");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "StudentAllEnrolment");
            }
        }



        // GET: api/CourseOffered
        [HttpGet("/api/getCourse")]
        public async Task<IActionResult> GetCourseOfferedsByTid()
        {
            int id;
            try
            {

                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    id = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }

                var courseOffereds = await _courseOfferedDbContext.GetCourseOfferedsAsyncByTID(id);

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffereds retrieved successfully.",
                    data = courseOffereds
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "CourseOffered");
            }
        }


        //[HttpDelete("{id}")]

        // GET: api/Assignments
        [HttpGet("getCoAssi/{coid}")]
        public async Task<IActionResult> GetAssignmentsByCo(int coid)
        {
            int id;
            try
            {
                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    id = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }

                var assignments = await _assignmentDbContext.Assignments
                    .Where(asi => asi.CoId == coid)
                    .OrderByDescending(asi => asi.CreatedTs)
                    .ToListAsync();


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


        // PUT: api/Submissions/5
        [HttpPatch("checkAssignment/{id}")]
        public async Task<IActionResult> UpdateSubmission(int id, [FromBody] JsonElement updateData)
        {
            int idi;
            try
            {

                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    idi = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }

                // Retrieve the existing submission from the database
                var existingSubmission = await _submissionDbContext.Submissions.FindAsync(id);
                if (existingSubmission == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Submission not found"
                    });
                }

                var assignment = await _assignmentDbContext.Assignments.FindAsync(existingSubmission.AssiId);




                //// Extract Marks and AssCheckNote from the updateData
                //if (updateData.TryGetProperty("AssMarks", out JsonElement marksElement) && marksElement.ValueKind == JsonValueKind.Number)
                //{
                //    if (marksElement.GetDecimal() >assignment.AssMarks || marksElement.GetDecimal() <0)
                //    {
                //        return StatusCode(400, new
                //        {
                //            error = true,
                //            message = "Marks Can Nither Be Greater Than Actual Assignment nor Negative : " + assignment.AssMarks
                //        });
                //    }
                //    existingSubmission.Marks = marksElement.GetDecimal();
                //}

                // Extract and convert AssMarks directly
                if (updateData.TryGetProperty("AssMarks", out JsonElement marksElement))
                {
                    decimal marks = Convert.ToDecimal(marksElement.ToString());

                    // Validate marks within bounds
                    if (marks > assignment.AssMarks || marks < 0)
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = $"Marks cannot be greater than the actual assignment marks ({assignment.AssMarks}) or negative."
                        });
                    }

                    existingSubmission.Marks = marks;
                }

                //existingSubmission.Marks = 20;

                if (updateData.TryGetProperty("AssCheckNote", out JsonElement assCheckNoteElement) && assCheckNoteElement.ValueKind == JsonValueKind.String)
                {
                    existingSubmission.AssCheckNote = assCheckNoteElement.GetString();
                }

                // Save the changes
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
                    data = new { existingSubmission.Marks, existingSubmission.AssCheckNote },
                    check= existingSubmission.Marks
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
        [HttpGet("getAssignmentReport/{id}")]
        public async Task<IActionResult> GetAssignmentReport(int id)
        {
            int idi;
            try
            {

                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    idi = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }


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


                var assignmentreport = await _studentDbContext.GetAssignmentDetailsAsync(id);

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffereds retrieved successfully.",
                    data = assignmentreport
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
        [HttpGet("getCourseOfferedAssignmentReport/{id}")]
        public async Task<IActionResult> GetCourseAssignmentReport(int id)
        {
            int idi;
            try
            {

                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    idi = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }


                var courseOffered = await _courseOfferedDbContext.CourseOffereds.FindAsync(id);

                if (courseOffered == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "CourseOffered Not Found",
                        _id = id
                    });
                }


                var coassignmentreport = await _studentDbContext.GetCourseAssignmentSummaryAsync(id);

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffereds retrieved successfully.",
                    data = coassignmentreport
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

        // GET: api/Teachers/5
        [HttpGet("getTeacher")]
        public async Task<IActionResult> GetTeacher()
        {
            int idi;
            try
            {

                if (HttpContext.Items.TryGetValue("tid", out var _sid))
                {
                    idi = (int)_sid; // Cast to int if you stored it as int       
                }
                else
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Something Went Wrong (After Filter Error -- TID)"
                    });
                }

                var teacher = await _teacherDbContext.Teacher.FindAsync(idi);

                if (teacher == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Teacher Not Found",
                        _id = idi
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Teacher retrieved successfully.",
                    data = teacher,
                    _id = idi
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Teacher");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Teacher");
            }
        }

    }
}
