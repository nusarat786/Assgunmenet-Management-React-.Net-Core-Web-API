using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models
{
    public partial class Year
    {
        [Key]
        public int YearId { get; set; }
        public string YearName { get; set; }
        public DateTime? DateStart { get; set; }
        public DateTime? DateEnd { get; set; }
        public DateTime? Ts { get; set; }

        
    }
}
