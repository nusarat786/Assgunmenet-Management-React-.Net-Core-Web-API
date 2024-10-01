using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class TEACHER_Context : DbContext
{

    private readonly IConfiguration _configuration;

    public DbSet<Teacher> Teacher { get; set; }


    public TEACHER_Context(DbContextOptions<TEACHER_Context> options, IConfiguration configuration)
    : base(options)

    {
        _configuration = configuration;

    }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Teacher>(entity =>
        {
            entity.HasKey(e => e.Tid).HasName("PK__TEACHER__C456D729A5C10D8D");

            entity.ToTable("TEACHER");

            entity.HasIndex(e => e.Temail, "UQ__TEACHER__2CDE697A1CF3B3AD").IsUnique();

            entity.HasIndex(e => e.Tphone, "UQ__TEACHER__54111F7D2AAE9AD4").IsUnique();

            entity.Property(e => e.Tid).HasColumnName("TID");
            entity.Property(e => e.DepartmentId).HasColumnName("DEPARTMENT_ID");
            entity.Property(e => e.Tdob)
                .HasDefaultValueSql("(NULL)")
                .HasColumnName("TDOB");
            entity.Property(e => e.Temail)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("TEMAIL");
            entity.Property(e => e.Tfname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("TFNAME");
            entity.Property(e => e.TjoiningDate)
                .HasDefaultValueSql("(getdate())")
                .HasColumnName("TJOINING_DATE");
            entity.Property(e => e.Tpassword)
                .HasMaxLength(512)
                .IsUnicode(false)
                .HasColumnName("TPASSWORD");
            entity.Property(e => e.Tphone)
                .HasMaxLength(15)
                .IsUnicode(false)
                .HasColumnName("TPHONE");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
            entity.Property(e => e.Tsname)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("TSNAME");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
