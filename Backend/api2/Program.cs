using api2.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);


// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigins", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Frontend URL
               .AllowAnyHeader()
               .AllowAnyMethod()
               .AllowCredentials(); // Allow credentials (cookies, authorization headers, etc.)
    });
});

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();





// Configure each DbContext
builder.Services.AddDbContext<DEPARTMENT_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<TEACHER_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<SUPER_ADMIN_Context>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<STUDENT_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<SUBJECT_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<COURSE_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<SEMESTER_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<YEAR_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<CYS_Context>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<COURSE_OFFERED_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<STUDENT_All_Enrolment_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));


builder.Services.AddDbContext<ASSIGNMENT_Context>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));

builder.Services.AddDbContext<SUBMISSION_Context>(options =>
   options.UseSqlServer(builder.Configuration.GetConnectionString("dbc")));




// Set environment variable programmatically (for local testing)
//Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "C:\\Users\\nusu\\source\\repos\\api2\\api2\\Helper\\firebase-key.json");
var keyPath = Path.Combine(Directory.GetCurrentDirectory(), "Helper", "firebase-key.json");
Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", keyPath);


// Register FirebaseService as a singleton
builder.Services.AddSingleton<FirebaseService>(provider =>
    new FirebaseService("fir-e1409.appspot.com") // Pass your bucket name
);

var app = builder.Build();

// Add CORS middleware before UseAuthorization
app.UseCors("AllowSpecificOrigins");
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.Run();
