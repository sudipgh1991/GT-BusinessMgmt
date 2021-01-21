using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class BudgetMonthList
    {
        public int MonthNumber { get; set; }
        public string MonthName { get; set; }

        public int LastDayOfMonth { get; set; }
        public int MonthYear { get; set; }
    }
}
