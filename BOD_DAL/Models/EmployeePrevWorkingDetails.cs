using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmployeePrevWorkingDetails
    {
        public int EPWD_Id { get; set; }
        public int EPWD_EmployeeId { get; set; }
        public string EPWD_CompanyName { get; set; }
        public string EPWD_DOJ { get; set; }
        public string EPWD_RealiseDate { get; set; }
        public string EMPWD_Designation { get; set; }
        public string EMPWD_Details { get; set; }
    }
}
