//using System;
//using System.Collections.Generic;
//using Microsoft.EntityFrameworkCore;

//namespace api2.Models;

//public partial class ASSIGNMENT_Context : DbContext
//{
//    public ASSIGNMENT_Context()
//    {
//    }

//    public ASSIGNMENT_Context(DbContextOptions<ASSIGNMENT_Context> options)        
//    {

//    }

//    public  DbSet<Assignment> Assignments { get; set; }

//    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//    {
//        optionsBuilder.UseSqlServer("Server=localhost\\SQLEXPRESS;Database=school_management2;Trusted_Connection=True;MultipleActiveResultSets=true;TrustServerCertificate=Yes");

//    }
//    protected override void OnModelCreating(ModelBuilder modelBuilder)
//    {
//        modelBuilder.Entity<Assignment>(entity =>
//        {
//            entity.HasKey(e => e.AssiId).HasName("PK__ASSIGNME__8E261ACF78098C93");

//            entity.ToTable("ASSIGNMENT");

//            entity.Property(e => e.AssiId).HasColumnName("ASSI_ID");
//            entity.Property(e => e.AssMarks)
//                .HasDefaultValue(0m)
//                .HasColumnType("decimal(5, 2)")
//                .HasColumnName("ASS_MARKS");
//            entity.Property(e => e.AssName)
//                .HasMaxLength(100)
//                .IsUnicode(false)
//                .HasColumnName("ASS_NAME");
//            entity.Property(e => e.AssNoteInstruction)
//                .IsUnicode(false)
//                .HasColumnName("ASS_NOTE_INSTRUCTION");
//            entity.Property(e => e.AssQuestionFile)
//                .HasMaxLength(255)
//                .IsUnicode(false)
//                .HasColumnName("ASS_QUESTION_FILE");
//            entity.Property(e => e.AssTestCase)
//                .IsUnicode(false)
//                .HasColumnName("ASS_TEST_CASE");
//            entity.Property(e => e.CoId).HasColumnName("CO_ID");
//            entity.Property(e => e.CreatedTs)
//                .HasDefaultValueSql("(getdate())")
//                .HasColumnType("datetime")
//                .HasColumnName("CREATED_TS");
//            entity.Property(e => e.IsCoding).HasColumnName("IS_CODING");
//            entity.Property(e => e.LastDateToSubmitTs)
//                .HasColumnType("datetime")
//                .HasColumnName("LAST_DATE_TO_SUBMIT_TS");
//            entity.Property(e => e.SubjectName)
//                .HasMaxLength(100)
//                .IsUnicode(false)
//                .HasColumnName("SUBJECT_NAME");
//        });

//        OnModelCreatingPartial(modelBuilder);
//    }

//    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
//}



using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace api2.Models
{
    public partial class ASSIGNMENT_Context : DbContext
    {
        private readonly IConfiguration _configuration;

        public DbSet<Assignment> Assignments { get; set; }

      
        public ASSIGNMENT_Context(DbContextOptions<ASSIGNMENT_Context> options, IConfiguration configuration) : base(options)
        {
            _configuration = configuration;

        }

    

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Assignment>(entity =>
            {
                entity.HasKey(e => e.AssiId).HasName("PK__ASSIGNME__8E261ACF78098C93");

                entity.ToTable("ASSIGNMENT");

                entity.Property(e => e.AssiId).HasColumnName("ASSI_ID");

                entity.Property(e => e.AssMarks)
                    .HasDefaultValue(0m)
                    .HasColumnType("decimal(5, 2)")
                    .HasColumnName("ASS_MARKS");

                entity.Property(e => e.AssName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("ASS_NAME");

                entity.Property(e => e.AssNoteInstruction)
                    .IsUnicode(false)
                    .HasColumnName("ASS_NOTE_INSTRUCTION");

                entity.Property(e => e.AssQuestionFile)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("ASS_QUESTION_FILE");

                entity.Property(e => e.AssTestCase)
                    .IsUnicode(false)
                    .HasColumnName("ASS_TEST_CASE");

                entity.Property(e => e.CoId).HasColumnName("CO_ID");

                entity.Property(e => e.CreatedTs)
                    .HasDefaultValueSql("(getdate())")
                    .HasColumnType("datetime")
                    .HasColumnName("CREATED_TS");

                entity.Property(e => e.IsCoding).HasColumnName("IS_CODING");

                entity.Property(e => e.LastDateToSubmitTs)
                    .HasColumnType("datetime")
                    .HasColumnName("LAST_DATE_TO_SUBMIT_TS");

                entity.Property(e => e.SubjectName)
                    .HasMaxLength(100)
                    .IsUnicode(false)
                    .HasColumnName("SUBJECT_NAME");

                // New CodeCheckFileUrl property with conditional constraint
                entity.Property(e => e.CodeCheckFileUrl)
                    .HasMaxLength(255)
                    .IsUnicode(false)
                    .HasColumnName("CODE_CHECK_FILE_URL");

                //// Conditional constraint: CodeCheckFileUrl is required if IsCoding is true
                //entity.HasCheckConstraint("CK_Assignment_CodeCheckFileUrl_Required", "[IS_CODING] = 0 OR ([IS_CODING] = 1 AND [CODE_CHECK_FILE_URL] IS NOT NULL)");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
