using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace api2.Models
{
    public partial class Student
    {
        [Key]
        public int StId { get; set; }

        public string SfirstName { get; set; } = null!;
        public string SSurname { get; set; } = null!;
        public DateTime? Dob { get; set; }
        public string? Phone { get; set; }
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public DateTime? Ts { get; set; }

     }
}
