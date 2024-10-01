using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace api2.Models;

public partial class YEAR_Context : DbContext
{
    private readonly IConfiguration _configuration;


    public DbSet<Year> Years { get; set; }

   
    public YEAR_Context(DbContextOptions<YEAR_Context> options , IConfiguration configuration)
                    : base(options)

    {
        _configuration = configuration;

    }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Year>(entity =>
        {
            entity.HasKey(e => e.YearId).HasName("PK__YEAR__3DF6F54796EB48AE");

            entity.ToTable("YEAR");

            entity.HasIndex(e => e.YearName, "UQ__YEAR__CF0BA080171D12A7").IsUnique();

            entity.Property(e => e.YearId).HasColumnName("YEAR_ID");
            entity.Property(e => e.DateEnd)
                .HasColumnType("datetime")
                .HasColumnName("DATE_END");
            entity.Property(e => e.DateStart)
                .HasColumnType("datetime")
                .HasColumnName("DATE_START");
            entity.Property(e => e.Ts)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("TS");
            entity.Property(e => e.YearName)
                .HasMaxLength(50)
                .IsUnicode(false)
                .HasColumnName("YEAR_NAME");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
