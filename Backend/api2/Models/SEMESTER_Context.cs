using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class SEMESTER_Context : DbContext
{

    private readonly IConfiguration _configuration;

    public DbSet<Semester> Semesters { get; set; }

 
    public SEMESTER_Context(DbContextOptions<SEMESTER_Context> options, IConfiguration configuration)
         : base(options)

    {
        _configuration = configuration;
    }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Semester>(entity =>
        {
            entity.HasKey(e => e.SemId).HasName("PK__SEMESTER__DD34635F9D7946AD");

            entity.ToTable("SEMESTER");

            entity.HasIndex(e => e.SemName, "UQ__SEMESTER__EE8295FD91245F64").IsUnique();

            entity.Property(e => e.SemId).HasColumnName("SEM_ID");
            entity.Property(e => e.SemName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("SEM_NAME");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
