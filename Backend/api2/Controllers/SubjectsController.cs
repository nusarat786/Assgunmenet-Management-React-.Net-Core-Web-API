using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubjectsController : ControllerBase
    {
        private readonly SUBJECT_Context _subjectDbContext;

        public SubjectsController(SUBJECT_Context subjectDbContext)
        {
            _subjectDbContext = subjectDbContext;
        }

        // GET: api/Subjects
        [HttpGet]
        public async Task<IActionResult> GetSubjects()
        {
            try
            {
                var subjects = await _subjectDbContext.Subjects.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Subjects retrieved successfully.",
                    data = subjects
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Subject");
            }
        }

        // GET: api/Subjects/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSubject(int id)
        {
            try
            {
                var subject = await _subjectDbContext.Subjects.FindAsync(id);

                if (subject == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Subject Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Subject retrieved successfully.",
                    data = subject,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Subject");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Subject");
            }
        }

        // POST: api/Subjects
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddSubject(Subject subject)
        {
            try
            {
                _subjectDbContext.Subjects.Add(subject);
                await _subjectDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Subject added successfully.",
                    data = subject
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Subject");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Subject");
            }
        }

        // PUT: api/Subjects/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateSubject(int id, Subject subject)
        {
            try
            {
                if (id != subject.SId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Subject ID mismatch"
                    });
                }

                _subjectDbContext.Entry(subject).State = EntityState.Modified;

                try
                {
                    await _subjectDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_subjectDbContext.Subjects.Any(e => e.SId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Subject not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating subject",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Subject updated successfully.",
                    data = subject
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Subject");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Subject");
            }
        }

        // DELETE: api/Subjects/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteSubject(int id)
        {
            try
            {
                var subject = await _subjectDbContext.Subjects.FindAsync(id);

                if (subject == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Subject Not Found"
                    });
                }

                _subjectDbContext.Subjects.Remove(subject);
                await _subjectDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Subject removed successfully.",
                    data = subject
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Subject");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Subject");
            }
        }
    }
}
