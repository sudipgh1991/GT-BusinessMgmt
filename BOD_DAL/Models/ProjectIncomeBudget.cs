using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class ProjectIncomeBudget
    {
        public int? PE_Id { get; set; }

        public string YearId { get; set; }
        public int? PE_IndustryId { get; set; }
        public string PE_ProjectName { get; set; }
        public string PE_JobFundno { get; set; }
        public string PE_ProjectOparate { get; set; }
        public string PE_StartDate { get; set; }
        public string PE_EndDate { get; set; }
        public string PE_ContactPerson { get; set; }
        public string PE_ContactPersonNo { get; set; }
        public string PE_GrantFunding { get; set; }
        public string PE_Description { get; set; }
        public string PE_RegNo { get; set; }
        public string PIM_Name { get; set; }
        public int? CompanyID { get; set; }
        public int? FYId { get; set; }
        public int? UserId { get; set; }
        public int? PE_ClientId { get; set; }

        public string CC_CorporateName { get; set; }
        public List<ProjectWiseExpenses> ExpensesList { get; set; }
        public List<ProjectWiseJobsFundGrant> FundGrants { get; set; }
        public List<OwnFundingContributions> OwnFundingContributions { get; set; }

        public List<LoanFinancing> LoanFinancing { get; set; }
        public List<OtherContributions> OtherContributions { get; set; }
        public List<InKindContributions> InKindContributions { get; set; }
        public List<OtherEarnings> OtherEarnings { get; set; }
        public List<InterestIncome> InterestIncome { get; set; }
        public List<ProjectWiseSMME> ProjectWiseSMME { get; set; }
        public List<BudgetMonthList> BudgetMonthList { get; set; }

        public List<IncomeBudget> IncomeBudget { get; set; }
        public List<IncomeBudgetReturnData> BudgetReturnData { get; set; }
        public List<ProjectIndicator> ProjectIndicator { get; set; }
        public List<ProjectIndicatorReturnData> ProjectIndicatorReturnData { get; set; }
        public List<ProjectPerformanceIndicatorReturnData> ProjectPerformanceIndicatorReturnData { get; set; }
        public ProjectIncomeBudget()
        {
            ProjectWiseSMME = new List<ProjectWiseSMME>();
            ExpensesList = new List<ProjectWiseExpenses>();
            FundGrants = new List<ProjectWiseJobsFundGrant>();
            OwnFundingContributions = new List<OwnFundingContributions>();
            LoanFinancing = new List<LoanFinancing>();
            OtherContributions = new List<OtherContributions>();
            InKindContributions = new List<InKindContributions>();

            OtherEarnings = new List<OtherEarnings>();
            InterestIncome = new List<InterestIncome>();

            BudgetMonthList = new List<BudgetMonthList>();
            IncomeBudget = new List<IncomeBudget>();
            BudgetReturnData = new List<IncomeBudgetReturnData>();
            ProjectIndicator = new List<ProjectIndicator>();
            ProjectIndicatorReturnData = new List<ProjectIndicatorReturnData>();
            ProjectPerformanceIndicatorReturnData = new List<ProjectPerformanceIndicatorReturnData>();
        }
    }

}
