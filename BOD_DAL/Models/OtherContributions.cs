using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class OtherContributions
    {
        public string OC_FunderName { get; set; }
        public string OC_Activity { get; set; }
        public string OC_Date { get; set; }
        public decimal? OC_Amount { get; set; }
        public string OC_Status { get; set; }
        public decimal? OC_FundingSecured { get; set; }
        public string OC_Conditions { get; set; }
        public string OC_Description { get; set; }
        public int OC_Accounting { get; set; }
    }
}
