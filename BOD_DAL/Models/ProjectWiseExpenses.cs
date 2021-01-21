using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectWiseExpenses
    {
        public int? PWE_Item { get; set; }
        public int? PWE_UnitId { get; set; }
        public string PWE_Date { get; set; }
        public decimal? PWE_Rate { get; set; }
        public int? PWE_Qty { get; set; }
        public decimal? PWE_Amount { get; set; }
        public int PWE_Accounting { get; set; }
    }
}
