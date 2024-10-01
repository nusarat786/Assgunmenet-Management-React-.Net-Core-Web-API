using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SemestersController : ControllerBase
    {
        private readonly SEMESTER_Context _semesterDbContext;

        public SemestersController(SEMESTER_Context semesterDbContext)
        {
            _semesterDbContext = semesterDbContext;
        }

        // GET: api/Semesters
        [HttpGet]
        public async Task<IActionResult> GetSemesters()
        {
            try
            {
                var semesters = await _semesterDbContext.Semesters.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Semesters retrieved successfully.",
                    data = semesters
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Semester");
            }
        }

        // GET: api/Semesters/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSemester(int id)
        {
            try
            {
                var semester = await _semesterDbContext.Semesters.FindAsync(id);

                if (semester == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Semester Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Semester retrieved successfully.",
                    data = semester,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Semester");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Semester");
            }
        }

        // POST: api/Semesters
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddSemester(Semester semester)
        {
            try
            {
                _semesterDbContext.Semesters.Add(semester);
                await _semesterDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Semester added successfully.",
                    data = semester
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Semester");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Semester");
            }
        }

        // PUT: api/Semesters/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateSemester(int id, Semester semester)
        {
            try
            {
                if (id != semester.SemId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Semester ID mismatch"
                    });
                }

                _semesterDbContext.Entry(semester).State = EntityState.Modified;

                try
                {
                    await _semesterDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_semesterDbContext.Semesters.Any(e => e.SemId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Semester not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating semester",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Semester updated successfully.",
                    data = semester
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Semester");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Semester");
            }
        }

        // DELETE: api/Semesters/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteSemester(int id)
        {
            try
            {
                var semester = await _semesterDbContext.Semesters.FindAsync(id);

                if (semester == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Semester Not Found"
                    });
                }

                _semesterDbContext.Semesters.Remove(semester);
                await _semesterDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Semester removed successfully.",
                    data = semester
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Semester");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Semester");
            }
        }
    }
}
