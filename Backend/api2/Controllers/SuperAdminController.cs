using api2.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[AdminAuthFilter] 

    public class SuperAdminController : ControllerBase
    {
        private readonly SUPER_ADMIN_Context  _superAdminDbContext;

        public SuperAdminController(SUPER_ADMIN_Context superAdminDbContext)
        {
            _superAdminDbContext = superAdminDbContext;
        }


        // GET: api/SuperAdmins
        [HttpGet]
        public async Task<IActionResult> GetSuperAdmins()
        {
            try
            {
                var SuperAdmins = await _superAdminDbContext.SuperAdmin.ToListAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "SuperAdmins retrieved successfully.",
                    data = SuperAdmins
                });
            }
            catch (Exception ex)
            {
                // Log the exception (if logging is configured)
                // _logger.LogError(ex, "An error occurred while retrieving SuperAdmins.");

                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "SuperAdmin");
            }
        }


        //// GET: api/SuperAdmins/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetSuperAdmin(int id)
        {
            try
            {
                var SuperAdmin = await _superAdminDbContext.SuperAdmin.FindAsync(id);

                if (SuperAdmin == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "SuperAdmins Can Not Be Found ",
                        _id = id
                    });
                }


                return StatusCode(200, new
                {
                    error = false,
                    message = "SuperAdmins retrived successfully.",
                    data = SuperAdmin,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "SuperAdmin");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "SuperAdmin");
            }
        }




        // POST: api/SuperAdmins
        [HttpPost]
        public async Task<IActionResult> AddSuperAdmin(SuperAdmin SuperAdmin)
        {
            try
            {
                SuperAdmin.Password = Helper.HashPassword(SuperAdmin.Password);
                _superAdminDbContext.SuperAdmin.Add(SuperAdmin);
                await _superAdminDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "SuperAdmins added successfully.",
                    data = SuperAdmin

                }); // Return the newly added SuperAdmin with a 200 OK status
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "SuperAdmin");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "SuperAdmin");
            }
        }

        // PUT: api/5
        [HttpPatch]
        [Route("{id}")]
        public async Task<IActionResult> UpdateSuperAdmin(int id, SuperAdmin SuperAdmin)
        {
            try
            {
                if (id != SuperAdmin.Sid)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "SuperAdmins Can Not Be Found (Form issue)",

                    });
                }

                //Check if a password is provided, and hash it before saving

                
                SuperAdmin.Password = Helper.HashPassword(SuperAdmin.Password);
                

                _superAdminDbContext.Entry(SuperAdmin).State = EntityState.Modified;

                try
                {
                    await _superAdminDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_superAdminDbContext.SuperAdmin.Any(e => e.Sid == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Problem To Update Data Because Not Found While Concurncy",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message,
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Problem To Update Data",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message,
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "SuperAdmins updated successfully.",
                    data = SuperAdmin

                }); // Return the newly added SuperAdmin with a 200 OK status
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "SuperAdmin");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "SuperAdmin");
            }
        }


        [HttpDelete]
        [Route("{id}")]
        public async Task<IActionResult> DeleteStudents(int id)
        {

            try
            {
                var SuperAdmin = await _superAdminDbContext.SuperAdmin.FindAsync(id);

                if (SuperAdmin == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "SuperAdmins Can Not Be Found ",
                    });
                }

                _superAdminDbContext.SuperAdmin.Remove(SuperAdmin);
                await _superAdminDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "SuperAdmins removed successfully.",
                    data = SuperAdmin
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "SuperAdmin");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "SuperAdmin");
            }
        }
    }
}
