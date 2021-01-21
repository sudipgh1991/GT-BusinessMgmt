using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class CorporateDashboard
    {
       public decimal? IncomeBudgetCurrentYear { get; set; }
       public decimal? IncomeCurrentYear{ get; set; }
       public decimal? ExpenseCurrentYear { get; set; }
       public decimal? IncomeBudgetCurrentMonthly { get; set; }
       public decimal? IncomeCurrentMonthly { get; set; }
       public int? ProjectYearly { get; set; }
       public int? TaskYearly { get; set; }
       public int? MonthWisseIncome { get; set; }
       public int? MM_id { get; set; }
       public int? TotalEmployee { get; set; }
       public int? TaskCompletedYearly { get; set; }
       public int? TaskOpenYearly { get; set; }
       public int? TaskNotCompleted { get; set; }
       public List<SSME> smmList { get; set; }
       public List<ProjectEntry> projectList { get; set; }
       public List<CorporateDashboard> corpDashList{get;set;}
       public CorporateDashboard()
       {
           smmList = new List<SSME>();
           corpDashList = new List<CorporateDashboard>();
           projectList = new List<ProjectEntry>();
       }

    }
}
