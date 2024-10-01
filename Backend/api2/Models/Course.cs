using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models
{
    public partial class Course
    {
        [Key]
        public int CId { get; set; }
        public string CName { get; set; }
        public DateTime? Ts { get; set; }

        
    }
}
