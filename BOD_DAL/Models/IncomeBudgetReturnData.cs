using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class IncomeBudgetReturnData
    {
        public Int64 IB_typeId { get; set; }
        public Int64 IB_ContributorId { get; set; }
        public string IB_Description { get; set; }
        public int IB_MonthId { get; set; }
        public decimal IB_Amount { get; set; }
        public int IB_Accounting { get; set; }
        public string IB_Year { get; set; }
        public int IB_Group { get; set; }
        public string MM_Name { get; set; }
    }
}
