using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TeachersController : ControllerBase
    {
        private readonly TEACHER_Context _teacherDbContext;

        public TeachersController(TEACHER_Context teacherDbContext)
        {
            _teacherDbContext = teacherDbContext;
        }

        // GET: api/Teachers
        [HttpGet]
        public async Task<IActionResult> GetTeachers()
        {
            try
            {
                var teachers = await _teacherDbContext.Teacher.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Teachers retrieved successfully.",
                    data = teachers
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Teacher");
            }
        }

        // GET: api/Teachers/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetTeacher(int id)
        {
            try
            {
                var teacher = await _teacherDbContext.Teacher.FindAsync(id);

                if (teacher == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Teacher Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Teacher retrieved successfully.",
                    data = teacher,
                    _id = id
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

        // POST: api/Teachers
        [HttpPost]
        //[AdminAuthFilter]
        public async Task<IActionResult> AddTeacher(Teacher teacher)
        {
            try
            {
                teacher.Tpassword = Helper.GeneratePassword(teacher.Temail, teacher.Tdob, teacher.Tphone);
                teacher.Tpassword = Helper.HashPassword(teacher.Tpassword);
                _teacherDbContext.Teacher.Add(teacher);
                await _teacherDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Teacher added successfully.",
                    data = teacher
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

        // PUT: api/Teachers/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]
        public async Task<IActionResult> UpdateTeacher(int id, Teacher teacher)
        {
            try
            {
                if (id != teacher.Tid)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Teacher ID mismatch"
                    });
                }
                teacher.Tpassword = Helper.GeneratePassword(teacher.Temail, teacher.Tdob, teacher.Tphone);
                teacher.Tpassword = Helper.HashPassword(teacher.Tpassword);
                _teacherDbContext.Entry(teacher).State = EntityState.Modified;

                try
                {
                    await _teacherDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_teacherDbContext.Teacher.Any(e => e.Tid == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Teacher not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating teacher",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Teacher updated successfully.",
                    data = teacher
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

        // DELETE: api/Teachers/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteTeacher(int id)
        {
            try
            {
                var teacher = await _teacherDbContext.Teacher.FindAsync(id);

                if (teacher == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Teacher Not Found"
                    });
                }

                _teacherDbContext.Teacher.Remove(teacher);
                await _teacherDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Teacher removed successfully.",
                    data = teacher
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
