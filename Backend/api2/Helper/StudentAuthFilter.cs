using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using System.Threading.Tasks;
using api2.Models;
using Microsoft.EntityFrameworkCore;
using System.Diagnostics;


public class StudentAuthFilter : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var httpContext = context.HttpContext;
        Debug.WriteLine(httpContext.Request.Cookies);

        // Check if the cookie is present
        if (httpContext.Request.Cookies.TryGetValue("student", out var cookieValue))
        {
            var parts = cookieValue.Split(' ');
            Debug.WriteLine(parts);

            if (parts.Length == 2)
            {
                var password = parts[0];
                var idString = parts[1];

                if (int.TryParse(idString, out var id))
                {
                    // Get the DbContext from the service provider
                    var dbContext = httpContext.RequestServices.GetRequiredService<STUDENT_Context>();
                    var student = await dbContext.Student
                                            .FirstOrDefaultAsync(sa => sa.StId == id && sa.Password == password);

                    Console.WriteLine(student);

                    if (student != null)
                    {
                        // User is authenticated, add sid to HttpContext.Items
                        httpContext.Items["sid"] = student.StId; 
                        

                        // User is authenticated, proceed to the action
                        await next();
                        return;
                    }
                }
            }
        }


        // If authentication fails, return a JSON response
        context.Result = new JsonResult(new
        {
            error = true,
            message = "Unauthorized access. Please provide valid credentials."
        })
        {
            StatusCode = StatusCodes.Status401Unauthorized // Sets the status code to 401
        };
    }
}

