using api2.Models;
using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [StudentAuthFilter]
    public class StudentActivity : ControllerBase
    {

        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentDbContext;

        private readonly CYS_Context _cysDbContext;

        private readonly YEAR_Context _yearDbContext;
        private readonly COURSE_Context _courseDbContext;
        private readonly SEMESTER_Context _semesterDbContext;
        private readonly COURSE_OFFERED_Context _courseOfferedDbContext;
        private readonly SUBJECT_Context _subjectDbContext;
        private readonly ASSIGNMENT_Context _assignmentDbContext;
        private readonly STUDENT_Context _studentDbContext;


        public int sid;
        public StudentActivity(STUDENT_All_Enrolment_Context studentAllEnrolmentDbContext, CYS_Context cysDbContext
            ,YEAR_Context yearDbContext, COURSE_Context courseDbContext, SEMESTER_Context semesterDbContext, 
            COURSE_OFFERED_Context courseOfferedDbContext, SUBJECT_Context subjectDbContext , ASSIGNMENT_Context assignmentDbContext, STUDENT_Context studentDbContext)
        {
            _studentAllEnrolmentDbContext = studentAllEnrolmentDbContext;
            _cysDbContext = cysDbContext;
            _yearDbContext = yearDbContext;
            _courseDbContext = courseDbContext;
            _semesterDbContext = semesterDbContext;
            _courseOfferedDbContext = courseOfferedDbContext;
            _subjectDbContext = subjectDbContext;
            _assignmentDbContext = assignmentDbContext;
            _studentDbContext = studentDbContext;
            
        }

        [HttpGet("getID")]
        public async Task<IActionResult> GetAllCourse()
        {
            
            try
            {


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



                // Fetch all enrollment data for the student based on their ID
                var studentAllEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
                    .Where(sa => sa.StId == sid)
                    .ToListAsync();

               

                if (studentAllEnrolments == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "StudentAllEnrolment Not Avilable"
                    });
                }


                // Extract CysIds from the student enrollments
                var cysIds = studentAllEnrolments.Select(e => e.CysId).Distinct().ToList();

                // Fetch CYS details
                var cysDetails = await _cysDbContext.Cys
                    .Where(c => cysIds.Contains(c.CysId))
                    .ToListAsync();

                // Fetch Course, Year, and Semester names separately
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

                var cof = await _courseOfferedDbContext.CourseOffereds
                     .Where(cof => cysIds.Contains(cof.CysId)).ToListAsync();

                var subId = cof.Select(cof => cof.Sid).Distinct().ToList();


                var subject = await _subjectDbContext.Subjects
                      .Where(sub => subId.Contains(sub.SId)).ToListAsync();

                // Combine results manually
                var combinedCysDetails = cysDetails.Select(c => new
                {   
                    
                    c.CysId,
                    c.CId,
                    c.SemId,
                    c.YearId,
                    c.Ts,
                    CourseName = courses.FirstOrDefault(co => co.CId == c.CId)?.CName,
                    YearName = years.FirstOrDefault(y => y.YearId == c.YearId)?.YearName,
                    SemesterName = semesters.FirstOrDefault(s => s.SemId == c.SemId)?.SemName,
                    //coid=cof.FirstOrDefault(co=>co.CysId==c.CysId)?.CoId,    
                    //subject=subject.FirstOrDefault()
                }).ToList();


               




                // Group subjects by CysId
                var subjectsByCys = cof
                    .GroupBy(cof => cof.CysId)
                    .Select(group => new
                    {
                        CysId = group.Key,
                        Subjects = subject
                            .Where(sub => group.Select(g => g.Sid).Contains(sub.SId))
                            .Select(sub => new
                            {
                                sub.SId,
                                sub.SName,
                                sub.Ts
                            })
                            .ToList()
                    })
                    .ToList();

                // Group subjects by CysId and include course, sem, and year names
                var subjectsByCys2 = cysDetails.Select(c => new
                {
                    CysId = c.CysId,
                    Name = $"{courses.FirstOrDefault(co => co.CId == c.CId)?.CName} " +
                           $"{semesters.FirstOrDefault(s => s.SemId == c.SemId)?.SemName} " +
                           $"{years.FirstOrDefault(y => y.YearId == c.YearId)?.YearName}",
                    Subjects = cof
                        .Where(cof => cof.CysId == c.CysId)
                        .Select(cof => subject.FirstOrDefault(sub => sub.SId == cof.Sid))
                        .Where(sub => sub != null)
                        .Select(sub => new
                        {
                            sub.SId,
                            sub.SName,
                            sub.Ts
                        })
                        .ToList()
                }).ToList();

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment removed successfully.",
                    id= sid,
                    studentAllotments = studentAllEnrolments,
                    allCys = cysDetails,
                    combined=combinedCysDetails,
                    allcourseOffred=cof,
                    allsubject= subject,
                    subjectsByCys= subjectsByCys,
                    subjectsByCys2,
                    cof

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


        [HttpGet("getEnrolledCourses")]
        public async Task<IActionResult> GetEnrolledCourses()
        {
            try
            {
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
                {
                    int sid = (int)_sid; // Cast to int if you stored it as int       

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

                    // Fetch all assignments for the course offerings
                    var assignments = await _assignmentDbContext.Assignments
                        .Where(a => courseOfferedIds.Contains(a.CoId))
                        .ToListAsync();

                    // Fetch all subjects
                    var subjects = await _subjectDbContext.Subjects.ToListAsync();

                    // Build the response
                    var response = cysDetails.Select(cys => new
                    {
                        cys.CysId,
                        Name = $"{cys.CId} SEM-{cys.SemId} {cys.YearId}", // Construct name from CYS details
                        CourseOffered = courseOffereds
                            .Where(co => co.CysId == cys.CysId)
                            .GroupBy(co => co.Sid) // Group by subject ID
                            .Select(group => new
                            {
                                CourseOfferedId = group.First().CoId,
                                SId = group.Key,
                                SName = subjects.FirstOrDefault(sub => sub.SId == group.Key)?.SName,
                                Assignments = assignments
                                    .Where(a => a.CoId == group.First().CoId)
                                    .Select(a => new
                                    {
                                        a.AssiId,
                                        a.AssName,
                                        a.AssQuestionFile,
                                        a.AssNoteInstruction,
                                        a.AssTestCase,
                                        a.AssMarks,
                                        a.LastDateToSubmitTs,
                                        a.IsCoding,
                                        a.SubjectName
                                    })
                                    .ToList()
                            })
                            .ToList()
                    })
                    .ToList();

                    return Ok(new
                    {
                        error = false,
                        message = "Data retrieved successfully.",
                        getCourse = response,
                        studentEnrolments,
                        cysDetails,
                        courseOffereds,
                        courseOfferedIds,
                        assignments
                    });
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Student ID not found in request."
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred while retrieving data.",
                    details = ex.Message
                });
            }
        }


        [HttpGet("getStudentCYS")]
        public async Task<IActionResult> GetAllCys()
        {

            try
            {


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



                // Fetch all enrollment data for the student based on their ID
                var studentAllEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments
                    .Where(sa => sa.StId == sid)
                    .ToListAsync();



                if (studentAllEnrolments == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "StudentAllEnrolment Not Avilable"
                    });
                }


                // Extract CysIds from the student enrollments
                var cysIds = studentAllEnrolments.Select(e => e.CysId).Distinct().ToList();

                // Fetch CYS details
                var cysDetails = await _cysDbContext.Cys
                    .Where(c => cysIds.Contains(c.CysId))
                    .ToListAsync();

                // Fetch Course, Year, and Semester names separately
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

                var cof = await _courseOfferedDbContext.CourseOffereds
                     .Where(cof => cysIds.Contains(cof.CysId)).ToListAsync();

                var subId = cof.Select(cof => cof.Sid).Distinct().ToList();


                var subject = await _subjectDbContext.Subjects
                      .Where(sub => subId.Contains(sub.SId)).ToListAsync();

                // Combine results manually
                var combinedCysDetails = cysDetails.Select(c => new
                {

                    c.CysId,
                    c.CId,
                    c.SemId,
                    c.YearId,
                    c.Ts,
                    CourseName = courses.FirstOrDefault(co => co.CId == c.CId)?.CName,
                    YearName = years.FirstOrDefault(y => y.YearId == c.YearId)?.YearName,
                    SemesterName = semesters.FirstOrDefault(s => s.SemId == c.SemId)?.SemName,
                    sid= sid
                    //coid=cof.FirstOrDefault(co=>co.CysId==c.CysId)?.CoId,    
                    //subject=subject.FirstOrDefault()
                }).ToList();








                return StatusCode(200, new
                {
                    error = false,
                    message = "CYS fetched successfully.",                
                    data = combinedCysDetails

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


        [HttpGet("getAllSubjectByCys/{cysId}")]
        public async Task<IActionResult> GetAllSubjectByCys(int cysId)
        {

            try
            {


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

                var data = await _studentDbContext.GetCourseOfferedsAsync(cysId);


                return StatusCode(200, new
                {
                    error = false,
                    message = "CYS Sub fetched successfully.",
                    data = data

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

        // GET: api/Assignments
        [HttpGet("getCoAssi/{coid}")]
        public async Task<IActionResult> GetAssignmentsByCo(int coid)
        {
            int id;
            try
            {
                if (HttpContext.Items.TryGetValue("sid", out var _sid))
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

        [HttpGet("getStudent")]

        public async Task<IActionResult> GetStudent()
        {
            try
            {

                int id;

                if (HttpContext.Items.TryGetValue("sid", out var _sid))
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

                var student = await _studentDbContext.Student.FindAsync(id);

                if (student == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Student Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Student retrieved successfully.",
                    data = student,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Student");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }



    }
}
