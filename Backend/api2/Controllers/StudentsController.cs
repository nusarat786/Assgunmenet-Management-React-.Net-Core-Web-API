using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using api2.Models;

namespace API2.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentsController : ControllerBase
    {
        private readonly STUDENT_Context _studentDbContext;

        public StudentsController(STUDENT_Context studentDbContext)
        {
            _studentDbContext = studentDbContext;
        }

        // GET: api/Students
        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            try
            {
                
                var students = await _studentDbContext.Student.ToListAsync();
                return StatusCode(200, new
                {
                    error = false,
                    message = "Students retrieved successfully.",
                    data = students
                });
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }

        // GET: api/Students/5
        [HttpGet("{id}")]
        public async Task<IActionResult> GetStudent(int id)
        {
            try
            {

                var student = await _studentDbContext.Student.FindAsync(id);

                if (student == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Student Not Found",
                        _id = id
                    });
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Student retrieved successfully.",
                    data = student,
                    _id = id
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Student");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }

        // POST: api/Students
        [HttpPost]
        [AdminAuthFilter]
        public async Task<IActionResult> AddStudent(Student student)
        {
            try
            {
                student.Password = Helper.GeneratePassword(student.Email,student.Dob, student.Phone);                
                student.Password = Helper.HashPassword(student.Password);
                _studentDbContext.Student.Add(student);
                await _studentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Student added successfully.",
                    data = student
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Student");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }

        // PUT: api/Students/5
        [HttpPatch("{id}")]
        [AdminAuthFilter]

        public async Task<IActionResult> UpdateStudent(int id, Student updatedStudent)
        {
            if (id != updatedStudent.StId)
            {
                return StatusCode(400, new
                {
                    error = true,
                    message = "Student ID mismatch"
                });
            }

            try
            {
                // Fetch the existing student record from the database
                var existingStudent = await _studentDbContext.Student.FindAsync(id);

                if (existingStudent == null)
                {
                    return StatusCode(404, new
                    {
                        error = true,
                        message = "Student not found"
                    });
                }

                // Update only the fields that are allowed to be changed
                existingStudent.SfirstName = updatedStudent.SfirstName;
                existingStudent.SSurname = updatedStudent.SSurname;
                existingStudent.Dob = updatedStudent.Dob;
                existingStudent.Phone = updatedStudent.Phone;
                existingStudent.Email = updatedStudent.Email;

                existingStudent.Password = Helper.GeneratePassword(existingStudent.Email, existingStudent.Dob, existingStudent.Phone);
                existingStudent.Password = Helper.HashPassword(existingStudent.Password);
                // Do not update Password

                _studentDbContext.Entry(existingStudent).State = EntityState.Modified;

                try
                {
                    await _studentDbContext.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException dc)
                {
                    if (!_studentDbContext.Student.Any(e => e.StId == id))
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Student not found during concurrency check",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                    else
                    {
                        return StatusCode(400, new
                        {
                            error = true,
                            message = "Error updating student",
                            stackTrace = dc.StackTrace,
                            exception = dc.Message
                        });
                    }
                }

                return StatusCode(200, new
                {
                    error = false,
                    message = "Student updated successfully.",
                    data = existingStudent
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Student");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }


        // DELETE: api/Students/5
        [HttpDelete("{id}")]
        [AdminAuthFilter]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            try
            {
                var student = await _studentDbContext.Student.FindAsync(id);

                if (student == null)
                {
                    return StatusCode(400, new
                    {
                        error = true,
                        message = "Student Not Found"
                    });
                }

                _studentDbContext.Student.Remove(student);
                await _studentDbContext.SaveChangesAsync();

                return StatusCode(200, new
                {
                    error = false,
                    message = "Student removed successfully.",
                    data = student
                });
            }
            catch (DbUpdateException dbEx)
            {
                Console.WriteLine(dbEx);
                return Helper.HandleDatabaseException(dbEx, "Student");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return Helper.HandleGeneralException(ex, "Student");
            }
        }
    }
}

