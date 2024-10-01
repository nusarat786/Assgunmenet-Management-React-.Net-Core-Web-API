using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace api2.Models;

public partial class SUBMISSION_Context : DbContext
{
    private readonly IConfiguration _configuration;
    public DbSet<Submission> Submissions { get; set; }


    public SUBMISSION_Context(DbContextOptions<SUBMISSION_Context> options, IConfiguration configuration)
            : base(options)

    {
        _configuration = configuration;

    }


  
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Submission>(entity =>
        {
            entity.HasKey(e => e.SubId).HasName("PK__SUBMISSI__2AC154A4C13BEBFF");

            entity.ToTable("SUBMISSION", tb => tb.HasTrigger("trg_check_submission"));

            entity.HasIndex(e => new { e.AssiId, e.StId }, "UQ_ASSI_ID_ST_ID").IsUnique();

            entity.Property(e => e.SubId).HasColumnName("SUB_ID");
            entity.Property(e => e.AnswerFile)
                .HasMaxLength(255)
                .IsUnicode(false)
                .HasColumnName("ANSWER_FILE");
            entity.Property(e => e.AnswerNote)
                .IsUnicode(false)
                .HasColumnName("ANSWER_NOTE");
            entity.Property(e => e.AssCheckNote)
                .IsUnicode(false)
                .HasColumnName("ASS_CHECK_NOTE");
            entity.Property(e => e.AssiId).HasColumnName("ASSI_ID");
            entity.Property(e => e.Code)
                .IsUnicode(false)
                .HasColumnName("CODE");
            entity.Property(e => e.Marks)
                .HasDefaultValueSql("(NULL)")
                .HasColumnType("decimal(5, 2)")
                .HasColumnName("MARKS");
            entity.Property(e => e.StId).HasColumnName("ST_ID");
            entity.Property(e => e.SubmittedTs)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime")
                .HasColumnName("SUBMITTED_TS");
            entity.Property(e => e.TestCaseFailed).HasColumnName("TEST_CASE_FAILED");
            entity.Property(e => e.TestCasePassed).HasColumnName("TEST_CASE_PASSED");
            entity.Property(e => e.TurnedInTs)
                .HasColumnType("datetime")
                .HasColumnName("TURNED_IN_TS");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
