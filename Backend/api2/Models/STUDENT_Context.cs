using System;
using System.Collections.Generic;
using Microsoft.Data.SqlClient;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models
{
    public partial class STUDENT_Context : DbContext
    {
        private readonly IConfiguration _configuration;

      

        public STUDENT_Context(DbContextOptions<STUDENT_Context> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Student> Student { get; set; }

        public DbSet<CysSubDto> CourseOfferedDtos { get; set; }

        public DbSet<AssignmentDetailsDto> AssignmentDetailsDtos { get; set; }


        public DbSet<CourseAssignmentSummaryDto> CourseAssignmentSummaries { get; set; }


        public async Task<List<CysSubDto>> GetCourseOfferedsAsync(int cysId)
        {
            var courseOffereds = await this.CourseOfferedDtos
                .FromSqlRaw("EXEC GetCourseAndOfferedDetailsByCYSId @CYS_ID", new SqlParameter("@CYS_ID", cysId))
                .ToListAsync();

            Debug.WriteLine(courseOffereds);
            return courseOffereds;
        }


        public async Task<List<AssignmentDetailsDto>> GetAssignmentDetailsAsync(int assignmentId)
        {
            var assignmentDetails = await this.AssignmentDetailsDtos
                .FromSqlRaw("EXEC GetAssignmentDetailsForStudents @AssignmentID",
                    new SqlParameter("@AssignmentID", assignmentId))
                .ToListAsync();

            Debug.WriteLine(assignmentDetails);
            return assignmentDetails;
        }



        // Method to call the stored procedure
        public async Task<List<CourseAssignmentSummaryDto>> GetCourseAssignmentSummaryAsync(int courseOfferedId)
        {
            var assignmentSummary = await this.CourseAssignmentSummaries
                .FromSqlRaw("EXEC GetCourseAssignmentSummary @input_CO_ID",
                    new SqlParameter("@input_CO_ID", courseOfferedId))
                .ToListAsync();

            return assignmentSummary;
        }


      

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Student>(entity =>
            {
                entity.HasKey(e => e.StId).HasName("PK__STUDENT__EBDB13EF0AE73584");

                entity.ToTable("STUDENT");

                entity.HasIndex(e => e.Email, "UQ__STUDENT__161CF72442494D46").IsUnique();

                entity.HasIndex(e => e.Phone, "UQ__STUDENT__D4FA0A26F6411B1A").IsUnique();

                entity.Property(e => e.StId).HasColumnName("ST_ID");
                entity.Property(e => e.Dob)
                    .HasDefaultValueSql("(NULL)")
                    .HasColumnName("DOB");
                entity.Property(e => e.Email)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("EMAIL");
                entity.Property(e => e.Password)
                    .HasMaxLength(512)
                    .IsUnicode(false)
                    .HasColumnName("PASSWORD");
                entity.Property(e => e.Phone)
                    .HasMaxLength(15)
                    .IsUnicode(false)
                    .HasColumnName("PHONE");
                entity.Property(e => e.SSurname)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("S_SURNAME");
                entity.Property(e => e.SfirstName)
                    .HasMaxLength(50)
                    .IsUnicode(false)
                    .HasColumnName("SFIRST_NAME");
                entity.Property(e => e.Ts)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime")
                    .HasColumnName("TS");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}


[Keyless]
public class CysSubDto
{

   
    public int courseOfferId { get; set; }
    public int yearId { get; set; }
    public string yearName { get; set; }
    public DateTime yearStart { get; set; }
    public DateTime yearEnd { get; set; }
    public int subjectId { get; set; }
    public string subjectName { get; set; }
    
    public int courseId { get; set; }
    public string courseName { get; set; }
    public int semesterId { get; set; }
    public string semesterName { get; set; }
    public int teacherId { get; set; }
    public string teacherFName { get; set; }
    public string teacherLName { get; set; }
}




[Keyless]
public class AssignmentDetailsDto
{
    public int? StudentId { get; set; }
    public string? StudentFirstName { get; set; }
    public string? StudentSurname { get; set; }
    public string? Email { get; set; }
    public string? Submitted { get; set; }  // "Yes" or "No"
    public decimal? ObtainedMarks { get; set; }
    public decimal? TotalMarks { get; set; }
    public int? AssignmentId { get; set; }
    public bool? IsCoding { get; set; }
    public string? AssignmentQuestionFile { get; set; }
    public int? SubmissionId { get; set; }
    public string? AnswerFile { get; set; }
    public string? AssignmentCheckNote { get; set; }  // Ensure this matches the stored procedure
    public DateTime? SubmittedTimestamp { get; set; }
    public string? DeadlinePassed { get; set; }  // "Yes" or "No"
    public string? CourseName { get; set; }
    public string? YearName { get; set; }
    public string? SemesterName { get; set; }
    public string? SubjectName { get; set; }
}



[Keyless]
public class CourseAssignmentSummaryDto
{
    public int? StudentId { get; set; }
    public string? StudentFirstName { get; set; }
    public string? StudentSurname { get; set; }
    public string? Email { get; set; }
    public decimal? TotalMarksObtained { get; set; }
    public decimal? TotalPossibleMarks { get; set; }
    public int? TotalAssignmentsSubmitted { get; set; }
    public int? TotalAssignments { get; set; }
    public decimal? PercentageObtained { get; set; }
    public int? CourseOfferedId { get; set; }
    public string? CourseName { get; set; }
    public string? YearName { get; set; }
    public string? SemesterName { get; set; }
    public string? SubjectName { get; set; }
}
