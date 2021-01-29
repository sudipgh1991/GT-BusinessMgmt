using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectSummaryDashBoard
    {
        public int? NoOfSMME { get; set; }
        public int? NoOftask { get; set; }
        public decimal? TotalIncome { get; set; }
        public decimal? TotalExpenses { get; set; }
        public int? CompletedTask { get; set; }
        public int? OnGoingTask { get; set; }
        public ProjectEntry ProjectEntry { get; set; }
    }
}
