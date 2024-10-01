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


public class AdminAuthFilter : Attribute, IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        var httpContext = context.HttpContext;

        Debug.WriteLine(httpContext.Request.Cookies.TryGetValue("admin", out var cookieValue2));
        Debug.WriteLine(cookieValue2);
        // Check if the cookie is present
        if (httpContext.Request.Cookies.TryGetValue("admin", out var cookieValue))
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
                    var dbContext = httpContext.RequestServices.GetRequiredService<SUPER_ADMIN_Context>();
                    var superAdmin = await dbContext.SuperAdmin
                                            .FirstOrDefaultAsync(sa => sa.Sid == id && sa.Password == password);

                    Console.WriteLine(superAdmin);

                    if (superAdmin != null)
                    { 
                        // User is authenticated, proceed to the action
                        await next();
                        return;
                    }
                }
            }
        }

        Debug.WriteLine("no cokkie");
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

