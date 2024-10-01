using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class YearsController : ControllerBase
    {
        private readonly YEAR_Context _yearDbContext;

        public YearsController(YEAR_Context yearDbContext)
        {
            _yearDbContext = yearDbContext;
        }

        // GET: api/Years
        [HttpGet]
        public async Task<IActionResult> GetYears()
        {
            try
            {
                var years = await _yearDbContext.Years.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Years retrieved successfully.",
                    data = years
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Year");
            }
        }

        // GET: api/Years/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetYear(int id)
        {
            try
            {
                var year = await _yearDbContext.Years.FindAsync(id);

                if (year == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Year Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Year retrieved successfully.",
                    data = year,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Year");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Year");
            }
        }

        // POST: api/Years
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddYear(Year year)
        {
            try
            {
                _yearDbContext.Years.Add(year);
                await _yearDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Year added successfully.",
                    data = year
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Year");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Year");
            }
        }

        // PUT: api/Years/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateYear(int id, Year year)
        {
            try
            {
                if (id != year.YearId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Year ID mismatch"
                    });
                }

                _yearDbContext.Entry(year).State = EntityState.Modified;

                try
                {
                    await _yearDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_yearDbContext.Years.Any(e => e.YearId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Year not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating year",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Year updated successfully.",
                    data = year
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Year");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Year");
            }
        }

        // DELETE: api/Years/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteYear(int id)
        {
            try
            {
                var year = await _yearDbContext.Years.FindAsync(id);

                if (year == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Year Not Found"
                    });
                }

                _yearDbContext.Years.Remove(year);
                await _yearDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Year removed successfully.",
                    data = year
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Year");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Year");
            }
        }
    }
}
