using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using Microsoft.EntityFrameworkCore;

namespace api2.Models;

public partial class STUDENT_All_Enrolment_Context : DbContext
{

    private readonly IConfiguration _configuration;

    public DbSet<StudentAllEnrolment> StudentAllEnrolments { get; set; }

    public DbSet<EnrDto> AllEnrolmentDto { get; set; }

    public STUDENT_All_Enrolment_Context(DbContextOptions<STUDENT_All_Enrolment_Context> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;
    }


    // Other DbSet properties and configurations

    public async Task<List<EnrDto>> GetAllEnrolmentDtoAsync()
    {
        var courseOffereds = await this.AllEnrolmentDto
            .FromSqlRaw("EXEC ssa_v1")
            .ToListAsync();
        Debug.WriteLine(courseOffereds);
        return courseOffereds;
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<StudentAllEnrolment>(entity =>
        {
            entity.HasKey(e => e.EiD).HasName("PK__STUDENT___C1971B331466482D");

            entity.ToTable("STUDENT_All_Enrolment");

            entity.HasIndex(e => new { e.StId, e.CysId }, "UQ_STUDENT_ALL_ENROLMENT").IsUnique();

            entity.Property(e => e.CysId).HasColumnName("CYS_ID");
            entity.Property(e => e.StId).HasColumnName("ST_ID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}



public class EnrDto
{
    // Add properties for all columns in COURSE_OFFERED

    [Key]
    public int eiD { get; set; }
    public int stId { get; set; }
    public int cysId { get; set; }

    

    // Add property for concatenated string
    public string cysstr { get; set; }
    public string name { get; set; }

    
}

