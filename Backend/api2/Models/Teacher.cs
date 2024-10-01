using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models;

public partial class Teacher
{

    [Key]
    public int Tid { get; set; }

    public string Tfname { get; set; } = null!;

    public string Tsname { get; set; } = null!;

    public DateTime? Tdob { get; set; }

    public string? Tphone { get; set; }

    public string Temail { get; set; } = null!;

    public DateTime TjoiningDate { get; set; }

    public string Tpassword { get; set; } = null!;

    public DateTime? Ts { get; set; }

    public int? DepartmentId { get; set; }

    
}
