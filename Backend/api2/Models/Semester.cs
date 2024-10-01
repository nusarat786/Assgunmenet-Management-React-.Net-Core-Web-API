using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models
{
    public partial class Semester
    {
        [Key]
        public int SemId { get; set; }
        public string SemName { get; set; }
        public DateTime? Ts { get; set; }

       
    }
}
