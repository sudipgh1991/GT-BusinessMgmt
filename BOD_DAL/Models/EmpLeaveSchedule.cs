using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmpLeaveSchedule
    {
        public int? ELS_Id { get; set; }
        public int? ELS_EM_Id { get; set; }
        public int? ELS_Leave { get; set; }
        public string ELS_From { get; set; }
        public string ELS_To { get; set; }
        public string ELS_WeekLeave { get; set; }
        public int? ELS_Medical { get; set; }
        public int? ELS_EarnedLeave { get; set; }
        public int? ELS_CasualLeave { get; set; }

    }
}
