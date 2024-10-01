using System;
using System.Collections.Generic;

namespace api2.Models;

public partial class Assignment
{
    public int AssiId { get; set; }

    public string AssName { get; set; } = null!;

    public string AssQuestionFile { get; set; } = null!;

    public string? AssNoteInstruction { get; set; }

    public string? AssTestCase { get; set; }

    public decimal? AssMarks { get; set; }

    public int CoId { get; set; }

    public DateTime? CreatedTs { get; set; }

    public DateTime LastDateToSubmitTs { get; set; }

    public bool IsCoding { get; set; }

    public string? SubjectName { get; set; }

    // New Property for Code Check File URL
    public string? CodeCheckFileUrl { get; set; }

}

