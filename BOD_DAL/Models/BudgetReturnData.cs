using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class BudgetReturnData
    {
        public int BM_Id { get; set; }
        public int BM_ItemId { get; set; }
        public int BM_UnitId { get; set; }
        public int BM_Accounting { get; set; }
        public int BM_MonthId { get; set; }
        public decimal BM_Amount { get; set; }
        public int BM_Group { get; set; }
        public int BM_Year { get; set; }
        public string MM_Name { get; set; }
        public string BM_Description { get; set; }
    }
}
