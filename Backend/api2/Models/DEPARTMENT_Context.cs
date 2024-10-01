using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models
{
    public partial class DEPARTMENT_Context : DbContext
    {
        private readonly IConfiguration _configuration;

        // Constructor accepting IConfiguration to access the connection string from appsettings.json
        public DEPARTMENT_Context(DbContextOptions<DEPARTMENT_Context> options, IConfiguration configuration)
            : base(options)
        {
            _configuration = configuration;
        }

        public DbSet<Department> Department { get; set; }

        //// Fetch connection string from appsettings.json
        //protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        //{
        //    if (!optionsBuilder.IsConfigured)
        //    {
        //        var connectionString = _configuration.GetConnectionString("dbchgfhgfh");
        //        optionsBuilder.UseSqlServer(connectionString);
        //    }
        //}

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasKey(e => e.DepartmentId).HasName("PK__DEPARTME__63E61362076094A5");

                entity.ToTable("DEPARTMENT");

                entity.Property(e => e.DepartmentId).HasColumnName("DEPARTMENT_ID");
                entity.Property(e => e.DepartmentName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("DEPARTMENT_NAME");

                // Setting DepartmentName as unique
                entity.HasIndex(e => e.DepartmentName)
                    .IsUnique()
                    .HasDatabaseName("UX_DEPARTMENT_NAME");

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


//using System;
//using System.Collections.Generic;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;

//namespace api2.Models;

//public partial class DEPARTMENT_Context : DbContext
//{
//    public DEPARTMENT_Context(DbContextOptions<DEPARTMENT_Context> options)
//    {
//    }



//    public  DbSet<Department> Department { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//    {
//        // Get the connection string from appsettings.json
//        var connectionString = _configuration.GetConnectionString("DefaultConnection");

//        optionsBuilder.UseSqlServer(connectionString);
//    }
//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<Department>(entity =>
//        {
//            entity.HasKey(e => e.DepartmentId).HasName("PK__DEPARTME__63E61362076094A5");

//            entity.ToTable("DEPARTMENT");

//            entity.Property(e => e.DepartmentId).HasColumnName("DEPARTMENT_ID");
//            entity.Property(e => e.DepartmentName)
//                .HasMaxLength(100)
//                .IsUnicode(false)
//                .HasColumnName("DEPARTMENT_NAME");

//            // Setting DepartmentName as unique
//            entity.HasIndex(e => e.DepartmentName)
//                .IsUnique()
//                .HasDatabaseName("UX_DEPARTMENT_NAME");

//            entity.Property(e => e.Ts)
//                .HasDefaultValueSql("(getdate())")
//                .HasColumnType("datetime")
//                .HasColumnName("TS");
//        });

//        OnModelCreatingPartial(modelBuilder);
//    }

//    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
//}
