using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class COURSE_OFFERED_Context : DbContext
{
    public DbSet<CourseOffered> CourseOffereds { get; set; }

    public DbSet<CourseOfferedDto> CourseOfferedDtos { get; set; }
    
    private readonly IConfiguration _configuration;

    

    public COURSE_OFFERED_Context(DbContextOptions<COURSE_OFFERED_Context> options, IConfiguration configuration)
    : base(options)
    {
        _configuration = configuration;

    }


    // Other DbSet properties and configurations

    public async Task<List<CourseOfferedDto>> GetCourseOfferedsAsync()
    {
        var courseOffereds = await this.CourseOfferedDtos
            .FromSqlRaw("EXEC GetCourseOffereds_1v")
            .ToListAsync();
        Debug.WriteLine(courseOffereds);
        return courseOffereds;
    }

    public async Task<List<CourseOfferedDto>> GetCourseOfferedsAsyncByTID(int tid)
    {
        var courseOffereds = await this.CourseOfferedDtos
            .FromSqlRaw("EXEC GetCourseOffereds_1v @TeacherId = {0}", tid)
            .ToListAsync();
        Debug.WriteLine(courseOffereds);
        return courseOffereds;
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=school_management2;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=Yes");
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<CourseOffered>(entity =>
        {
            entity.HasKey(e => e.CoId).HasName("PK__COURSE_O__F38FB8F5E8E287DC");

            entity.ToTable("COURSE_OFFERED");

            entity.HasIndex(e => new { e.Tid, e.Sid, e.CysId }, "UC_COURSE_OFFERED").IsUnique();

            entity.Property(e => e.CoId).HasColumnName("CO_ID");
            entity.Property(e => e.CysId).HasColumnName("CYS_ID");
            entity.Property(e => e.Sid).HasColumnName("SID");
            entity.Property(e => e.Tid).HasColumnName("TID");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}


public class CourseOfferedDto
{
    // Add properties for all columns in COURSE_OFFERED

    [Key]
    public int coId { get; set; }
    public int cysId { get; set; }
    public int sid { get; set; }

    public int tid { get;  set; }

    public DateTime? TS { get; set; } // Adjust based on actual columns

    // Add property for concatenated string
    public string Cofstr { get; set; }
}