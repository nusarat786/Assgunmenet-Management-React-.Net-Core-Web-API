using System;
using System.Collections.Generic;

namespace api2.Models;

public partial class Submission
{
    public int SubId { get; set; }

    public int AssiId { get; set; }

    public int StId { get; set; }

    public string? AnswerFile { get; set; }

    public string? AnswerNote { get; set; }

    public string? AssCheckNote { get; set; }

    public int? TestCasePassed { get; set; }

    public int? TestCaseFailed { get; set; }

    public DateTime? SubmittedTs { get; set; }

    public DateTime? TurnedInTs { get; set; }

    public decimal? Marks { get; set; }

    public string? Code { get; set; }
}
