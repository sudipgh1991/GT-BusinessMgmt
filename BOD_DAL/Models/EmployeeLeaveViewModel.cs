using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmployeeLeaveViewModel
    {
        public List<EmployeeLeaveDetails> BalanceLeaveList { get; set; }
        public List<EmployeeLeaveApproval> LeaveList { get; set; }
    }
}
