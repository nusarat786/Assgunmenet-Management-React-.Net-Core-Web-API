using api2.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetrievalController : ControllerBase
    {
        private readonly ASSIGNMENT_Context _assignmentContext;
        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentContext;
        private readonly CYS_Context _cysContext;
        private readonly YEAR_Context _yearContext;
        private readonly COURSE_Context _courseContext;
        private readonly SEMESTER_Context _semesterContext;
        private readonly COURSE_OFFERED_Context _courseOfferedContext;
        private readonly SUBJECT_Context _subjectContext;
        private readonly TEACHER_Context _teacherContext;
        //private readonly FirebaseService _firebaseService;

        public RetrievalController(
            ASSIGNMENT_Context assignmentContext,
            STUDENT_All_Enrolment_Context studentAllEnrolmentContext,
            CYS_Context cysContext,
            YEAR_Context yearContext,
            COURSE_Context courseContext,
            SEMESTER_Context semesterContext,
            COURSE_OFFERED_Context courseOfferedContext,
            SUBJECT_Context subjectContext,
            TEACHER_Context teacherContext)
        {
            _assignmentContext = assignmentContext;
            _studentAllEnrolmentContext = studentAllEnrolmentContext;
            _cysContext = cysContext;
            _yearContext = yearContext;
            _courseContext = courseContext;
            _semesterContext = semesterContext;
            _courseOfferedContext = courseOfferedContext;
            _subjectContext = subjectContext;
            _teacherContext = teacherContext;
            //_firebaseService = new FirebaseService("fir-e1409.appspot.com");
        }

        [HttpGet("getDetailsByCourseOfferId/{courseOfferId}")]
        public async Task<IActionResult> GetDetailsByCourseOfferId(int courseOfferId)
        {
            try
            {
                // Get CourseOffered details
                var courseOffer = await _courseOfferedContext.CourseOffereds
                    .FirstOrDefaultAsync(co => co.CoId == courseOfferId);

                if (courseOffer == null)
                {
                    return NotFound(new
                    {
                        error = true,
                        message = "Course Offer not found."
                    });
                }

                // Get CYS details
                var cys = await _cysContext.Cys
                    .FirstOrDefaultAsync(c => c.CysId == courseOffer.CysId);

                if (cys == null)
                {
                    return NotFound(new
                    {
                        error = true,
                        message = "CYS not found."
                    });
                }

                // Get Year details
                var year = await _yearContext.Years
                    .FirstOrDefaultAsync(y => y.YearId == cys.YearId);

                // Get Subject details
                var subject = await _subjectContext.Subjects
                    .FirstOrDefaultAsync(s => s.SId == courseOffer.Sid);

                // Get Course details
                var course = await _courseContext.Courses
                    .FirstOrDefaultAsync(c => c.CId == cys.CId);

                // Get Semester details
                var semester = await _semesterContext.Semesters
                    .FirstOrDefaultAsync(s => s.SemId == cys.SemId);

                var teacher = await _teacherContext.Teacher.FirstOrDefaultAsync(t => t.Tid == courseOffer.Tid);

                return Ok(new
                {
                    error = false,
                    message = "Details retrieved successfully.",
                    data = new
                    {
                        CourseOfferId = courseOffer.CoId,
                        YearId = year?.YearId,
                        YearName = year?.YearName,
                        YearStart = year?.DateStart?.ToString("yyyy-MM-dd"),
                        YearEnd = year?.DateEnd?.ToString("yyyy-MM-dd"),
                        SubjectId = subject?.SId,
                        SubjectName = subject?.SName,
                        CourseId = course?.CId,
                        CourseName = course?.CName,
                        SemesterId = semester?.SemId,
                        SemesterName = semester?.SemName,
                        TeacherId = courseOffer.Tid,      
                        TeacherFName=teacher.Tfname,
                        TeacherLName=teacher.Tsname
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred while retrieving details.",
                    details = ex.Message
                });
            }
        }


        [HttpGet("getDetailsByCysId/{cysId}")]
        public async Task<IActionResult> GetDetailsByCysId(int cysId)
        {
            try
            {
                // Get CYS details
                var cys = await _cysContext.Cys
                    .FirstOrDefaultAsync(c => c.CysId == cysId);

                if (cys == null)
                {
                    return NotFound(new
                    {
                        error = true,
                        message = "CYS not found."
                    });
                }

                // Get Year details
                var year = await _yearContext.Years
                    .FirstOrDefaultAsync(y => y.YearId == cys.YearId);

                // Get Course details
                var course = await _courseContext.Courses
                    .FirstOrDefaultAsync(c => c.CId == cys.CId);

                // Get Semester details
                var semester = await _semesterContext.Semesters
                    .FirstOrDefaultAsync(s => s.SemId == cys.SemId);

                return Ok(new
                {
                    error = false,
                    message = "Details retrieved successfully.",
                    data = new
                    {
                        CysId = cys.CysId,
                        YearId = year?.YearId,
                        YearName = year?.YearName,
                        YearStart = year?.DateStart?.ToString("yyyy-MM-dd"),
                        YearEnd = year?.DateEnd?.ToString("yyyy-MM-dd"),
                        CourseId = course?.CId,
                        CourseName = course?.CName,
                        SemesterId = semester?.SemId,
                        SemesterName = semester?.SemName,
                       
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred while retrieving details.",
                    details = ex.Message
                });
            }
        }


    }
}
