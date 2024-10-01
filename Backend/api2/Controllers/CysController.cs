using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CysController : ControllerBase
    {
        private readonly CYS_Context _cysDbContext;

        public CysController(CYS_Context cysDbContext)
        {
            _cysDbContext = cysDbContext;
        }

        // GET: api/Cys
        [HttpGet("/test")]
        public async Task<IActionResult> GetCys()
        {
            try
            {
                var cys = await _cysDbContext.Cys.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Cys retrieved successfully.",
                    data = cys
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }

        // GET: api/Cys
        [HttpGet]
        public async Task<IActionResult> GetCys2()
        {
            try
            {
                var cys = await _cysDbContext.GetCourseOfferedsAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Cys retrieved successfully.",
                    data = cys
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }

        // GET: api/Cys/5
        [HttpGet("{id}")]

        public async Task<IActionResult> GetCy(int id)
        {
            try
            {
                var cy = await _cysDbContext.Cys.FindAsync(id);

                if (cy == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Cy Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Cy retrieved successfully.",
                    data = cy,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Cy");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }

        // POST: api/Cys
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddCy(Cy cy)
        {
            try
            {
                _cysDbContext.Cys.Add(cy);
                await _cysDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Cy added successfully.",
                    data = cy
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Cy");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }

        // PUT: api/Cys/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateCy(int id, Cy cy)
        {
            try
            {
                if (id != cy.CysId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Cy ID mismatch"
                    });
                }

                _cysDbContext.Entry(cy).State = EntityState.Modified;

                try
                {
                    await _cysDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_cysDbContext.Cys.Any(e => e.CysId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Cy not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating cy",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Cy updated successfully.",
                    data = cy
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Cy");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }

        // DELETE: api/Cys/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteCy(int id)
        {
            try
            {
                var cy = await _cysDbContext.Cys.FindAsync(id);

                if (cy == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Cy Not Found"
                    });
                }

                _cysDbContext.Cys.Remove(cy);
                await _cysDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Cy removed successfully.",
                    data = cy
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Cy");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Cy");
            }
        }
    }
}
