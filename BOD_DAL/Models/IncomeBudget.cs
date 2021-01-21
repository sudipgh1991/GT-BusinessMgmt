using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class IncomeBudget
    {
        public int TypeId { get; set; }
        public int Accounting { get; set; }
        public int ContributorId { get; set; }
        public string Description { get; set; }

        public List<MonthList> MonthList { get; set; }

    }
}
