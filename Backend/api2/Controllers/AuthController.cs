using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using api2.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;
using System.Net.Http;

namespace api2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {


        private readonly SUPER_ADMIN_Context _superAdminDbContext;
        private readonly TEACHER_Context _teacherDbContext;
        private readonly STUDENT_Context _studentDbContext;

        public AuthController(SUPER_ADMIN_Context superAdminDbContext, TEACHER_Context teacherDbContext,STUDENT_Context studentDbContext)
        {
            _superAdminDbContext = superAdminDbContext;
            _teacherDbContext = teacherDbContext;
            _studentDbContext = studentDbContext;
        }


        [HttpPost]
        [Route("adminLogin")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {

                // Check if the request body is null
                if (request == null)
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Invalid login request",
                    });
                }

                request.Email.Trim();
                request.Password.Trim();


                // Find the user by email
                var superAdmin = await _superAdminDbContext.SuperAdmin.SingleOrDefaultAsync(sa => sa.Email == request.Email);

                // Check if the user exists and validate the password
                if (superAdmin != null && Helper.VerifyPassword(request.Password, superAdmin.Password))
                {
                    // Create a cookie with a combination of password and id
                    var cookieValue = $"{superAdmin.Password} {superAdmin.Sid}";
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Ensure this is true in production
                        SameSite = SameSiteMode.None
                    };

                    Response.Cookies.Append("admin", cookieValue, cookieOptions);

                    return StatusCode(200, new
                    {
                        error = false,
                        message = "Login successful",
                        data=  cookieValue,
                        
                    });
                }
                else
                {
                    return StatusCode(402, new
                    {
                        error = true,
                        message = "Invalid email or password",
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred during login",
                    stackTrace = ex.StackTrace,
                    exception = ex.Message,
                });
            }


        }


        [HttpPost]
        [Route("teacherLogin")]
        public async Task<IActionResult> TeacherLogin([FromBody] LoginRequest request)
        {
            try
            {
               
                // Check if the request body is null
                if (request == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Invalid login request",
                    });
                }

                request.Email = request.Email.Trim();
                request.Password= request.Password.Trim();

                // Invalid email or password
                // Find the user by email
                var teacher = await _teacherDbContext.Teacher.SingleOrDefaultAsync(sa => sa.Temail == request.Email);
                // Check if the user exists and validate the password
                if (teacher != null && Helper.VerifyPassword(request.Password, teacher.Tpassword))
                {
                    

                    // Create a cookie with a combination of password and id
                    var cookieValue = $"{teacher.Tpassword} {teacher.Tid}";
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Ensure this is true in production
                        SameSite = SameSiteMode.None
                    };

                    

                    Response.Cookies.Append("teacher", cookieValue, cookieOptions);

                    return StatusCode(200, new
                    {
                        error = false,
                        message = "Login successful",
                        data =  cookieValue
                    });
                }
                else
                {
                    //Debug.WriteLine(teacher.Tpassword);
                    return StatusCode(401, new
                    {
                        error = true,
                        message = "Invalid email or password",
                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred during login",
                    stackTrace = ex.StackTrace,
                    exception = ex.Message,
                });
            }


        }



        [HttpPost]
        [Route("studentLogin")]
        public async Task<IActionResult> StudentLogin([FromBody] LoginRequest request)
        {
            try
            {

                // Check if the request body is null
                if (request == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Invalid login request",
                    });
                }

                request.Email.Trim();
                request.Password.Trim();


                // Find the user by email
                var student = await _studentDbContext.Student.SingleOrDefaultAsync(sa => sa.Email == request.Email);

                // Check if the user exists and validate the password
                if (student != null && Helper.VerifyPassword(request.Password, student.Password))
                {
                    // Create a cookie with a combination of password and id
                    var cookieValue = $"{student.Password} {student.StId}";
                    var cookieOptions = new CookieOptions
                    {
                        HttpOnly = true,
                        Secure = true, // Ensure this is true in production
                        SameSite = SameSiteMode.None
                    };

                    Response.Cookies.Append("student", cookieValue, cookieOptions);

                    return StatusCode(200, new
                    {
                        error = false,
                        message = "Login successful",
                        data = cookieValue
                    });
                }
                else
                {
                    return StatusCode(401, new
                    {
                        error = true,
                        message = "Invalid email or password",

                    });
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return StatusCode(500, new
                {
                    error = true,
                    message = "An error occurred during login",
                    stackTrace = ex.StackTrace,
                    exception = ex.Message,
                });
            }


        }

        // DTO for login request
        public class LoginRequest
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
