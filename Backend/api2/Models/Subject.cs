using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models;

public partial class Subject
{
    [Key]
    public int SId { get; set; }

    public string SName { get; set; } = null!;

    public DateTime? Ts { get; set; }

   

}

