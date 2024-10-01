using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentAllEnrolmentController : ControllerBase
    {
        private readonly STUDENT_All_Enrolment_Context _studentAllEnrolmentDbContext;

        public StudentAllEnrolmentController(STUDENT_All_Enrolment_Context studentAllEnrolmentDbContext)
        {
            _studentAllEnrolmentDbContext = studentAllEnrolmentDbContext;
        }

        // GET: api/StudentAllEnrolment
        [HttpGet("test")]
        public async Task<IActionResult> GetStudentAllEnrolments()
        {
            try
            {
                var studentAllEnrolments = await _studentAllEnrolmentDbContext.StudentAllEnrolments.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolments retrieved successfully.",
                    data = studentAllEnrolments
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "StudentAllEnrolment");
            }
        }


        // GET: api/StudentAllEnrolment
        [HttpGet]
        public async Task<IActionResult> GetStudentAllEnrolments2()
        {
            try
            {
                var studentAllEnrolments = await _studentAllEnrolmentDbContext.GetAllEnrolmentDtoAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolments retrieved successfully.",
                    data = studentAllEnrolments
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "StudentAllEnrolment");
            }
        }

        // GET: api/StudentAllEnrolment/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudentAllEnrolment(int id)
        {
            try
            {
                var studentAllEnrolment = await _studentAllEnrolmentDbContext.StudentAllEnrolments.FindAsync(id);

                if (studentAllEnrolment == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "StudentAllEnrolment Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment retrieved successfully.",
                    data = studentAllEnrolment,
                    _id = id
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

        // POST: api/StudentAllEnrolment
        [HttpPost]
        [AdminAuthFilter]
        public async Task<IActionResult> AddStudentAllEnrolment(StudentAllEnrolment studentAllEnrolment)
        {
            try
            {
                _studentAllEnrolmentDbContext.StudentAllEnrolments.Add(studentAllEnrolment);
                await _studentAllEnrolmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment added successfully.",
                    data = studentAllEnrolment
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

        // PUT: api/StudentAllEnrolment/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]
        public async Task<IActionResult> UpdateStudentAllEnrolment(int id, StudentAllEnrolment studentAllEnrolment)
        {
            try
            {
                if (id != studentAllEnrolment.EiD)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "StudentAllEnrolment ID mismatch"
                    });
                }

                _studentAllEnrolmentDbContext.Entry(studentAllEnrolment).State = EntityState.Modified;

                try
                {
                    await _studentAllEnrolmentDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_studentAllEnrolmentDbContext.StudentAllEnrolments.Any(e => e.EiD == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "StudentAllEnrolment not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating studentAllEnrolment",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment updated successfully.",
                    data = studentAllEnrolment
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

        // DELETE: api/StudentAllEnrolment/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]
        public async Task<IActionResult> DeleteStudentAllEnrolment(int id)
        {
            try
            {
                var studentAllEnrolment = await _studentAllEnrolmentDbContext.StudentAllEnrolments.FindAsync(id);

                if (studentAllEnrolment == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "StudentAllEnrolment Not Found"
                    });
                }

                _studentAllEnrolmentDbContext.StudentAllEnrolments.Remove(studentAllEnrolment);
                await _studentAllEnrolmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "StudentAllEnrolment removed successfully.",
                    data = studentAllEnrolment
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



        
        
    }
}
