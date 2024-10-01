using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api2.Models
{
    public partial class Cy
    {
        [Key]
        public int CysId { get; set; }
        public int CId { get; set; }
        public int SemId { get; set; }
        public int YearId { get; set; }
        public DateTime Ts { get; set; }

        
        
    }

    public class CysDto
    {
        // Add properties for all columns in COURSE_OFFERED

        [Key]
        public int cysId { get; set; }
        public int cId { get; set; }
        public int semId { get; set; }

        public int yearId { get; set; }

        public DateTime? ts { get; set; } // Adjust based on actual columns

        // Add property for concatenated string
        public string cysstr { get; set; }
    }
}
