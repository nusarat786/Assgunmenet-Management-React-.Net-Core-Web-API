using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models;

public partial class SuperAdmin
{
    [Key]
    public int Sid { get; set; }

    public DateTime? Ts { get; set; }

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;
}
