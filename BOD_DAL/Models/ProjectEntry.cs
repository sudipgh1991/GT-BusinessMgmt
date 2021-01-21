using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectEntry
    {
        public int? PE_Id { get; set; }
        public int? TaskId { get; set; }
        public int? PE_ProjectIndicartor { get; set; }
        public int? PE_IndustryId { get; set; }
        public string PE_ProjectName { get; set; }
        public string role { get; set; }
        public string PE_JobFundno { get; set; }
        public string PE_ProjectOparate { get; set; }
        public string PE_StartDate { get; set; }
        public string PE_EndDate { get; set; }
        public int? TaskCount { get; set; }
        public string PE_ContactPerson { get; set; }

        public string PE_Status { get; set; }
        public string Color { get; set; }

        public string PE_ContactPersonNo { get; set; }
        public string PE_GrantFunding { get; set; }
        public string PE_Description { get; set; }
        public string PE_RegNo { get; set; }
        public string PIM_Name { get; set; }
        public int? CompanyID { get; set; }
        public int? FYId { get; set; }
        public int? UserId { get; set; }
        public int? PE_ClientId { get; set; }
        public string PE_CardStartDate { get; set; }
        public string PE_Image { get; set; }
        public decimal? TotalIncome { get; set; }
        public decimal? TotalExpenses { get; set; }
        public string CC_CorporateName { get; set; }
        public int? PE_TotalActivity { get; set; }
        public int? PE_TotalTask { get; set; }

        public List<ProjectWiseExpenses> ExpensesList { get; set; }
        public List<ProjectWiseJobsFundGrant> FundGrants { get; set; }
        public List<OwnFundingContributions> OwnFundingContributions { get; set; }
        public List<ProjectWiseSMME> projectTaskWiseSMME { get; set; }
        public List<LoanFinancing> LoanFinancing { get; set; }
        public List<OtherContributions> OtherContributions { get; set; }
        public List<InKindContributions> InKindContributions { get; set; }
        public List<OtherEarnings> OtherEarnings { get; set; }
        public List<InterestIncome> InterestIncome { get; set; }
        public List<ProjectWiseSMME> ProjectWiseSMME { get; set; }

        public List<ClientWiseSSME> ClientWiseSMME { get; set; }
        public List<BudgetMonthList> BudgetMonthList { get; set; }

        public List<Budget> Budget { get; set; }
        public List<BudgetReturnData> BudgetReturnData { get; set; }

        public List<CorporateClient> corporateClients { get; set; }

        public List<ProjectEntry> projectEntries { get; set; }

        public List<ProjectWiseTask> projectWiseTasks { get; set; }

        public List<SSME> sSMEs { get; set; }
        public List<ProjectWiseEmployee> prjectWiseEmp { get; set; }
        public ProjectEntry()
        {
            ProjectWiseSMME = new List<ProjectWiseSMME>();
            ExpensesList = new List<ProjectWiseExpenses>();
            FundGrants = new List<ProjectWiseJobsFundGrant>();
            OwnFundingContributions = new List<OwnFundingContributions>();
            LoanFinancing = new List<LoanFinancing>();
            OtherContributions = new List<OtherContributions>();
            InKindContributions = new List<InKindContributions>();
            ClientWiseSMME = new List<ClientWiseSSME>();

            OtherEarnings = new List<OtherEarnings>();
            InterestIncome = new List<InterestIncome>();

            BudgetMonthList = new List<BudgetMonthList>();
            Budget = new List<Budget>();
            BudgetReturnData = new List<BudgetReturnData>();
            corporateClients = new List<CorporateClient>();
            projectEntries = new List<ProjectEntry>();
            sSMEs = new List<SSME>();
            projectWiseTasks = new List<ProjectWiseTask>();
            prjectWiseEmp = new List<ProjectWiseEmployee>();
            projectTaskWiseSMME = new List<ProjectWiseSMME>();
        }
    }
}
