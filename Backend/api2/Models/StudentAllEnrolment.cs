using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace api2.Models
{
    public partial class StudentAllEnrolment
    {
        [Key]
        public int EiD { get; set; }

        public int StId { get; set; }

        public int CysId { get; set; }

        
    }
}
