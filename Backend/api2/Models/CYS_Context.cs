using api2.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics;
using static Community.CsharpSqlite.Sqlite3;
using static IronPython.Modules._ast;
using System.Security.Cryptography;
using Microsoft.Extensions.Configuration;

public partial class CYS_Context : DbContext
{

    public virtual DbSet<Cy> Cys { get; set; }
    
    private readonly IConfiguration _configuration;


    public DbSet<CysDto> CourseOfferedDtos { get; set; }

    

    public CYS_Context(DbContextOptions<CYS_Context> options, IConfiguration configuration)
        : base(options)
    {
        _configuration = configuration;

    }



    // Other DbSet properties and configurations

    public async Task<List<CysDto>> GetCourseOfferedsAsync()
    {
        var courseOffereds = await this.CourseOfferedDtos
            .FromSqlRaw("EXEC GetCys_v1")
            .ToListAsync();
        Debug.WriteLine(courseOffereds);
        return courseOffereds;
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cy>(entity =>
        {
            entity.HasKey(e => e.CysId).HasName("PK__CYS__198BF80E2D167620");

            entity.ToTable("CYS");

            entity.Property(e => e.CysId).HasColumnName("CYS_ID");
            entity.Property(e => e.CId).HasColumnName("C_ID");
            entity.Property(e => e.SemId).HasColumnName("SEM_ID");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
            entity.Property(e => e.YearId).HasColumnName("YEAR_ID");

            // Define the unique constraint for C_ID, SEM_ID, and YEAR_ID
            entity.HasIndex(e => new { e.CId, e.SemId, e.YearId })
                .IsUnique()
                .HasDatabaseName("UQ_CYS_C_ID_SEM_ID_YEAR_ID");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}






