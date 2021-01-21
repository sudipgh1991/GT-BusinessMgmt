using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class LoanFinancing
    {
        public string LF_LendingInstitution { get; set; }
        public string LF_Date { get; set; }
        public decimal? LF_LoanAmount { get; set; }
        public string LF_LoanTerm { get; set; }
        public decimal? LF_InterestTerm { get; set; }
        public decimal? LF_PaymentTerm { get; set; }
        public int LF_Accounting { get; set; }
    }
}
