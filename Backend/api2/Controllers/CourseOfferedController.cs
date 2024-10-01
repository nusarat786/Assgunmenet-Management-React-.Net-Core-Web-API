using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;
using Microsoft.Data.SqlClient;
using System.Data;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CourseOfferedController : ControllerBase
    {
        private readonly COURSE_OFFERED_Context _courseOfferedDbContext;
        private readonly ASSIGNMENT_Context _assignmentDbContext;

        public CourseOfferedController(COURSE_OFFERED_Context courseOfferedDbContext, ASSIGNMENT_Context assignmentDbContext)
        {
            _courseOfferedDbContext = courseOfferedDbContext;
            _assignmentDbContext = assignmentDbContext;
        }

        // GET: api/CourseOffered
        [HttpGet("/withName")]
        public async Task<IActionResult> GetCourseOffereds()
        {
            try
            {
                var courseOffereds = await _courseOfferedDbContext.CourseOffereds.ToListAsync();
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

        // GET: api/CourseOffered/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetCourseOffered(int id)
        {
            try
            {
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

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffered retrieved successfully.",
                    data = courseOffered,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "CourseOffered");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "CourseOffered");
            }
        }


        // GET: api/CourseOffered
        [HttpGet]
        public async Task<IActionResult> GetCourseOffereds2()
        {
            try
            {
                var courseOffereds = await _courseOfferedDbContext.GetCourseOfferedsAsync();

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


        //// POST: api/CourseOffered
        //[HttpPost]
        //[AdminAuthFilter]
        //public async Task<IActionResult> AddCourseOffered(CourseOffered courseOffered)
        //{
        //    try
        //    {
        //        _courseOfferedDbContext.CourseOffereds.Add(courseOffered);
        //        await _courseOfferedDbContext.SaveChangesAsync();

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "CourseOffered added successfully.",
        //            data = courseOffered
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "CourseOffered");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "CourseOffered");
        //    }
        //}

        //// PUT: api/CourseOffered/5
        //[HttpPatch("{id}")]
        //[AdminAuthFilter]

        //public async Task<IActionResult> UpdateCourseOffered(int id, CourseOffered courseOffered)
        //{
        //    try
        //    {
        //        if (id != courseOffered.CoId)
        //        {
        //            return StatusCode(400, new
        //            {
        //                error = true,
        //                message = "CourseOffered ID mismatch"
        //            });
        //        }

        //        _courseOfferedDbContext.Entry(courseOffered).State = EntityState.Modified;

        //        try
        //        {
        //            await _courseOfferedDbContext.SaveChangesAsync();
        //        }
        //        catch (DbUpdateConcurrencyException dc)
        //        {
        //            if (!_courseOfferedDbContext.CourseOffereds.Any(e => e.CoId == id))
        //            {
        //                return StatusCode(400, new
        //                {
        //                    error = true,
        //                    message = "CourseOffered not found during concurrency check",
        //                    stackTrace = dc.StackTrace,
        //                    exception = dc.Message
        //                });
        //            }
        //            else
        //            {
        //                return StatusCode(400, new
        //                {
        //                    error = true,
        //                    message = "Error updating courseOffered",
        //                    stackTrace = dc.StackTrace,
        //                    exception = dc.Message
        //                });
        //            }
        //        }

        //        return StatusCode(200, new
        //        {
        //            error = false,
        //            message = "CourseOffered updated successfully.",
        //            data = courseOffered
        //        });
        //    }
        //    catch (DbUpdateException dbEx)
        //    {
        //        Console.WriteLine(dbEx);
        //        return Helper.HandleDatabaseException(dbEx, "CourseOffered");
        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex);
        //        return Helper.HandleGeneralException(ex, "CourseOffered");
        //    }
        //}


        // POST: api/CourseOffered
        [HttpPost]
        [AdminAuthFilter]
        public async Task<IActionResult> AddCourseOffered(CourseOffered courseOffered)
        {
            try
            {
                // Prepare parameters for the stored procedure
                var parameters = new[]
                {
            new SqlParameter("@CO_ID", SqlDbType.Int) { Direction = ParameterDirection.Output },
            new SqlParameter("@TID", courseOffered.Tid),
            new SqlParameter("@SID", courseOffered.Sid),
            new SqlParameter("@CYS_ID", courseOffered.CysId),
            new SqlParameter("@TS", (object)courseOffered.Ts ?? DBNull.Value),
            new SqlParameter("@IsUpdate", SqlDbType.Bit) { Value = 0 } // Explicitly setting type

               };

                // Execute the stored procedure
                await _courseOfferedDbContext.Database.ExecuteSqlRawAsync(
                    "EXEC sp_InsertOrUpdateCourseOffered1 @CO_ID OUTPUT, @TID, @SID, @CYS_ID, @TS, @IsUpdate",
                    parameters);

                // Retrieve the generated CO_ID
                int coId = (int)parameters[0].Value;

                // Update courseOffered object with the generated CO_ID
                courseOffered.CoId = coId;

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffered added successfully.",
                    data = courseOffered
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "CourseOffered");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "CourseOffered");
            }
        }



        // PUT: api/CourseOffered/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]
        public async Task<IActionResult> UpdateCourseOffered(int id, CourseOffered courseOffered)
        {
            try
            {
                if (id != courseOffered.CoId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "CourseOffered ID mismatch"
                    });
                }

                // Prepare parameters for the stored procedure
                var parameters = new[]
                {
            new SqlParameter("@CO_ID", id),
            new SqlParameter("@TID", courseOffered.Tid),
            new SqlParameter("@SID", courseOffered.Sid),
            new SqlParameter("@CYS_ID", courseOffered.CysId),
            new SqlParameter("@TS", (object)courseOffered.Ts ?? DBNull.Value),
            new SqlParameter("@IsUpdate", SqlDbType.Bit) { Value = 1 } // Explicitly setting type
        };

                // Execute the stored procedure
                await _courseOfferedDbContext.Database.ExecuteSqlRawAsync("EXEC sp_InsertOrUpdateCourseOffered @CO_ID, @TID, @SID, @CYS_ID, @TS, @IsUpdate", parameters);

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffered updated successfully.",
                    data = courseOffered
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "CourseOffered");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "CourseOffered");
            }
        }



        // DELETE: api/CourseOffered/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteCourseOffered(int id)
        {
            try
            {
                var courseOffered = await _courseOfferedDbContext.CourseOffereds.FindAsync(id);

                if (courseOffered == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "CourseOffered Not Found"
                    });
                }

                _courseOfferedDbContext.CourseOffereds.Remove(courseOffered);
                await _courseOfferedDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "CourseOffered removed successfully.",
                    data = courseOffered
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "CourseOffered");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "CourseOffered");
            }
        }
    }
}
