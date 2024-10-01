using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class SUBJECT_Context : DbContext
{

    private readonly IConfiguration _configuration;
    public DbSet<Subject> Subjects { get; set; }


    public SUBJECT_Context(DbContextOptions<SUBJECT_Context> options, IConfiguration configuration) 
        : base(options)

    {
        _configuration = configuration;
    }


   
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Subject>(entity =>
        {
            entity.HasKey(e => e.SId).HasName("PK__SUBJECT__A3DFF16D07421E26");

            entity.ToTable("SUBJECT");

            entity.HasIndex(e => e.SName, "UQ__SUBJECT__8ADDC2074B262451").IsUnique();

            entity.Property(e => e.SId).HasColumnName("S_ID");
            entity.Property(e => e.SName)
                .HasMaxLength(100)
                .IsUnicode(false)
                .HasColumnName("S_NAME");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
