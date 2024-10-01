using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models;

public partial class SUPER_ADMIN_Context : DbContext
{
    private readonly IConfiguration _configuration;

    public DbSet<SuperAdmin> SuperAdmin { get; set; }

    public SUPER_ADMIN_Context(DbContextOptions<SUPER_ADMIN_Context> options, IConfiguration configuration)
    : base(options)
    {
        _configuration = configuration;
    }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SuperAdmin>(entity =>
        {
            entity.HasKey(e => e.Sid).HasName("PK__SUPER_AD__CA195970A8186707");

            entity.ToTable("SUPER_ADMIN");

            entity.Property(e => e.Sid).HasColumnName("SID");
            entity.Property(e => e.Email).HasMaxLength(255);
            entity.Property(e => e.Email)
            .HasMaxLength(255)
            .IsRequired(); // Ensure Email is required

            entity.HasIndex(e => e.Email)
                .IsUnique(); // Ensure Email is unique

            // Add an email format check constraint
            entity.HasCheckConstraint("CK_Email_Format", "[Email] LIKE '%@%.%'");

            entity.Property(e => e.Password).HasMaxLength(512);
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");

        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
