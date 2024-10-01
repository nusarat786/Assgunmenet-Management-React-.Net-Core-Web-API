using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models;

public partial class Department
{
    [Key]
    public int DepartmentId { get; set; }

    public string DepartmentName { get; set; } = null!;

    public DateTime? Ts { get; set; }
}
