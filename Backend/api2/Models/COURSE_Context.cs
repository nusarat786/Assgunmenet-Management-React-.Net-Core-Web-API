using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class COURSE_Context : DbContext
{

    private readonly IConfiguration _configuration;

    public DbSet<Course> Courses { get; set; }


    public COURSE_Context(DbContextOptions<COURSE_Context> options, IConfiguration configuration) : base(options)
    {
        _configuration = configuration;
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Course>(entity =>
        {
            entity.HasKey(e => e.CId).HasName("PK__COURSE__A9FDEC127C27DD3C");

            entity.ToTable("COURSE");

            entity.HasIndex(e => e.CName, "UQ__COURSE__087C53F4F14218B5").IsUnique();

            entity.Property(e => e.CId).HasColumnName("C_ID");
            entity.Property(e => e.CName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("C_NAME");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
