using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmployeeViewModel
    {
        public List<EmployeeMaster> cList { get; set; }
        public List<EmployeeMaster> managerList { get; set; }
    }
}
