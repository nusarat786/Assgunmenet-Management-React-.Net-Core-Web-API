using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;
using Microsoft.Data.SqlClient;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    public class DepartmentsController : ControllerBase
    {

        private readonly DEPARTMENT_Context _departmentDbContext;

        public DepartmentsController(DEPARTMENT_Context departmentDbContext)
        {
            _departmentDbContext = departmentDbContext;
        }


        // GET: api/Departments
        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            try
            {
                var departments = await _departmentDbContext.Department.ToListAsync();

                return StatusCode(200,new
                {
                    error = false,
                    message = "Departments retrieved successfully.",
                    data = departments
                });
            }
            catch (Exception ex)
            {
                // Log the exception (if logging is configured)
                // _logger.LogError(ex, "An error occurred while retrieving departments.");

                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Department");
            }
        }


        //// GET: api/Departments/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetDepartment(int id)
        {
            try
            {
                var department = await _departmentDbContext.Department.FindAsync(id);

                if (department == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Departments Can Not Be Found ",
                        _id=id
                    });
                }

                
                return StatusCode(200, new
                {
                    error = false,
                    message = "Departments retrived successfully.",
                    data = department,
                    _id=id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Department");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Department");
            }
        }




        // POST: api/Departments
        [HttpPost]
        [AdminAuthFilter]

        public async Task<IActionResult> AddDepartment(Department department)
        {
            try
            {
                _departmentDbContext.Department.Add(department);
                await _departmentDbContext.SaveChangesAsync();

                return StatusCode(200,new { 
                    error = false,
                    message = "Departments added successfully.",
                    data = department

                }); // Return the newly added department with a 200 OK status
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx,"Department");
            }
    
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Department");
            }
        }

        // PUT: api/5
        [HttpPatch]
        [Route("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateDepartment(int id, Department department)
        {
            try
            {
                if (id != department.DepartmentId)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Departments Can Not Be Found (Form issue)",

                    });
                }

                _departmentDbContext.Entry(department).State = EntityState.Modified;

                try
                {
                    await _departmentDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_departmentDbContext.Department.Any(e => e.DepartmentId == id))
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
                    message = "Departments updated successfully.",
                    data = department

                }); // Return the newly added department with a 200 OK status
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Department");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Department");
            }
        }


        [HttpDelete]
        [Route("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> DeleteStudents(int id)
        {

            try
            {
                var department = await _departmentDbContext.Department.FindAsync(id);

                if (department == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Departments Can Not Be Found ",
                    });
                }

                _departmentDbContext.Department.Remove(department);
                await _departmentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Departments removed successfully.",
                    data = department
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Department");
            }

            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Department");
            }
        }
    }
}

