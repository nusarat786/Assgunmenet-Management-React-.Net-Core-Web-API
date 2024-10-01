using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CoursesController : ControllerBase
    {
        private readonly COURSE_Context _courseDbContext;

        public CoursesController(COURSE_Context courseDbContext)
        {
            _courseDbContext = courseDbContext;
        }

        // GET: api/Courses
        [HttpGet]
        public async Task<IActionResult> GetCourses()
        {
            try
            {
                var courses = await _courseDbContext.Courses.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Courses retrieved successfully.",
                    data = courses
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Course");
            }
        }

        // GET: api/Courses/5
        [HttpGet("{id}")]

        public async Task<IActionResult> GetCourse(int id)
        {
            try
            {
                var course = await _courseDbContext.Courses.FindAsync(id);

                if (course == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Course Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Course retrieved successfully.",
                    data = course,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Course");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Course");
            }
        }

        // POST: api/Courses
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddCourse(Course course)
        {
            try
            {
                _courseDbContext.Courses.Add(course);
                await _courseDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Course added successfully.",
                    data = course
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Course");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Course");
            }
        }

        // PUT: api/Courses/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateCourse(int id, Course course)
        {
            try
            {
                if (id != course.CId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Course ID mismatch"
                    });
                }

                _courseDbContext.Entry(course).State = EntityState.Modified;

                try
                {
                    await _courseDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_courseDbContext.Courses.Any(e => e.CId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Course not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating course",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Course updated successfully.",
                    data = course
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Course");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Course");
            }
        }

        // DELETE: api/Courses/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteCourse(int id)
        {
            try
            {
                var course = await _courseDbContext.Courses.FindAsync(id);

                if (course == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Course Not Found"
                    });
                }

                _courseDbContext.Courses.Remove(course);
                await _courseDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Course removed successfully.",
                    data = course
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Course");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Course");
            }
        }
    }
}
