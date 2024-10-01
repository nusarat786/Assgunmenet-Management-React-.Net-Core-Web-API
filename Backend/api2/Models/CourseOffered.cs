using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models
{
    public partial class CourseOffered
    {
        [Key]
        public int CoId { get; set; }

        public int Tid { get; set; }

        public int Sid { get; set; }

        public int CysId { get; set; }

        public DateTime? Ts { get; set; }

        
    }
}
