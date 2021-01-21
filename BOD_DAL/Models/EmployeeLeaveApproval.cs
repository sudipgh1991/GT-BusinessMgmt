using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmployeeLeaveApproval
    {
        public int? ELA_Id { get; set; }
        public int? ELA_EM_Id { get; set; }
        public string ELA_From { get; set; }
        public string ELA_To { get; set; }
        public int? ELA_TotalDays { get; set; }
        public string Status { get; set; }
        public string Color { get; set; }
        public string mode { get; set; }
        public string EM_EmpCode { get; set; }
        public string EM_EmpName { get; set; }
        public string ELA_Type { get; set; }

        public string EM_ProfilePic { get; set; }
        
    }
}
