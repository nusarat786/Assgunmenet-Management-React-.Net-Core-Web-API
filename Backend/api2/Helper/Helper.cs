using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System;
using System.Text.Json;
using IronPython.Hosting;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

using IronPython.Hosting;

using IronPython.Hosting;


public static class Helper
    {
        public static IActionResult HandleDatabaseException(Exception dbEx,string cls)
        {
            SqlException sqlEx = dbEx.InnerException as SqlException;
            string userFriendlyMessage;

            if (sqlEx != null)
            {
                // Customize the message based on SQL error numbers
                switch (sqlEx.Number)
                {
                    case 2627: // Unique constraint error (could include primary key issues)
                    case 2601: // Unique index violation
                        if (sqlEx.Message.Contains("PRIMARY KEY"))
                        {
                            userFriendlyMessage = "A primary key constraint violation occurred. The record already exists.";
                        }
                        else
                        {
                            userFriendlyMessage = "A unique constraint violation occurred. Please ensure the details are unique.";
                        }
                        break;
                    case 547: // Foreign key violation
                        userFriendlyMessage = "A foreign key constraint violation occurred. Please check related records.";
                        break;
                    case 4060: // Invalid database
                        userFriendlyMessage = "The specified database is not available.";
                        break;
                    case 18456: // Login failed
                        userFriendlyMessage = "Login to the database failed. Please check your credentials.";
                        break;
                    case 121: // Timeout expired
                        userFriendlyMessage = "The database operation timed out. Please try again.";
                        break;
                    case 53: // SQL Server not found
                        userFriendlyMessage = "The SQL Server was not found. Please verify the server address.";
                        break;
                    case 1101: // Invalid object name
                        userFriendlyMessage = "The specified database object does not exist.";
                        break;
                    case 233: // SQL Server connection issue
                        userFriendlyMessage = "There was a problem connecting to the SQL Server.";
                        break;
                    default:
                        userFriendlyMessage = "A database error occurred. Please try again later.";
                        break;
                }

                var sqlErrorResponse = new
                {
                    error = true,
                    message = userFriendlyMessage,
                    sqlError = sqlEx.Message,
                    stackTrace = sqlEx.StackTrace,
                    table=cls,
                    exception = dbEx.Message,
                    sqlNo = sqlEx.Number,
                };

                return new ObjectResult(sqlErrorResponse)
                {
                    StatusCode = StatusCodes.Status409Conflict
                };
            }
            else
            {
                var generalErrorResponse = new
                {
                    error = true,
                    message = dbEx.Message,      
                    exception = dbEx.Message,
                    table = cls,
                    stackTrace = dbEx.StackTrace,                    
                };

                return new ObjectResult(generalErrorResponse)
                {
                    StatusCode = StatusCodes.Status417ExpectationFailed
                };
            }
        }

        public static IActionResult HandleGeneralException(Exception ex, string cls)
        {
            var errorResponse = new
            {
                error = true,
                message = ex.Message,
                exception = ex.Message,
                stackTrace = ex.StackTrace,             
                table = cls
            };

            return new ObjectResult(errorResponse)
            {
                StatusCode = StatusCodes.Status417ExpectationFailed
            };
        }


    // Helper methods for hashing, verifying password, and generating JWT token
    public static string HashPassword(string password)
    {
        using (var sha256 = SHA256.Create())
        {
            var hashedBytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
            return Convert.ToBase64String(hashedBytes);
        }
    }

    public static bool VerifyPassword(string enteredPassword, string storedHashedPassword)
    {
        var enteredHashedPassword = HashPassword(enteredPassword);
        return storedHashedPassword == enteredHashedPassword;
    }

    public static string FormatJsonString(string jsonString)
    {
        // Parse the JSON string with escape sequences
        using (JsonDocument document = JsonDocument.Parse(jsonString))
        {
            // Serialize it back to a clean JSON string with indentation
            string cleanJsonString = JsonSerializer.Serialize(document.RootElement, new JsonSerializerOptions { WriteIndented = true });
            return cleanJsonString;
        }
    }

    //private string GenerateJwtToken(string username)
    //{
    //    var tokenHandler = new JwtSecurityTokenHandler();
    //    var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);
    //    var tokenDescriptor = new SecurityTokenDescriptor
    //    {
    //        Subject = new ClaimsIdentity(new[]
    //        {
    //                new Claim(ClaimTypes.Name, username)
    //            }),
    //        Expires = DateTime.UtcNow.AddHours(1),
    //        SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
    //    };
    //    var token = tokenHandler.CreateToken(tokenDescriptor);
    //    return tokenHandler.WriteToken(token);
    //}

    public static int getId( string name, HttpContext httpContext)
    {
      
        if (httpContext.Items.TryGetValue(name, out var _sid))
        {
           int num = (int)_sid; // Cast to int if you stored it as int
            return num;
        }

        return 0;
    }


    public static async Task<string> ReadAndTrimFileContentAsync(IFormFile file)
    {
        if (file == null)
        {
            throw new ArgumentNullException(nameof(file), "File cannot be null.");
        }

        using (var reader = new StreamReader(file.OpenReadStream()))
        {
            var content = await reader.ReadToEndAsync();
            return content.Trim();
        }
    }

    public static string GeneratePassword(string email, DateTime? dob, string phone)
    {
        // Get the first four letters of the email
        string emailPart = email.Substring(0, Math.Min(4, email.Length));

        // Format the date of birth as ddMMyyyy
        string dobPart = dob.HasValue ? dob.Value.ToString("ddMMyyyy") : "00000000";

        // Get the last four digits of the phone number
        string phonePart = phone != null && phone.Length >= 4
            ? phone.Substring(phone.Length - 4)
            : "0000";

        // Combine all parts to create the password
        return $"{emailPart}{dobPart}{phonePart}";
    }





}

