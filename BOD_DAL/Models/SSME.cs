using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class SSME
    {
        public string SM_CorporateName { get; set; }
        public long SM_Id { get; set; }
        public string SM_TradingName { get; set; }
        public string SM_CIPC_RegistrationNo { get; set; }
        public string SM_SARS_VATNo { get; set; }
        public string SM_Address { get; set; }
        public string SM_Zipcode { get; set; }
        public string SM_PostalAddress { get; set; }
        public string SM_PhoneNo { get; set; }
        public string SM_Email { get; set; }
        public string SM_ContactPersonName { get; set; }
        public int? SM_CompanyId { get; set; }
        public int? SM_FyId { get; set; }
        public int? UserId { get; set; }
        public string SM_Image { get; set; }
        public string SM_Password { get; set; }
        public string SM_UserId { get; set; }
        public string InputFrom { get; set; }
        public long SM_PIM_Id { get; set; }
        public string SM_ContactPersonPhone { get; set; }
        public string SM_ContactPersonEmail { get; set; }
        public bool? UM_AssesmentGiven { get; set; }
        public List<ProjectEntry> project { get; set; }
        public List<ProjectWiseTask> projecttask { get; set; }
        public List<SSME> ssmeList { get; set; }
        public List<QA> QA { get; set; }
        public List<SSMEDocument> SMMEDocumentList { get; set; }
        public List<DDLList> dropdownIndustryList { get; set; }
        public int SM_TotalProjects { get; set; }
        public int? TotalSMME { get; set; }
        public int? TotalInYear { get; set; }
        public int? TotalInMonth { get; set; }
        public List<EmployeeMaster> empList { get; set; }
        public SSME()
        {
            empList = new List<EmployeeMaster>();
            projecttask = new List<ProjectWiseTask>();
            project = new List<ProjectEntry>();
            QA = new List<QA>();

            dropdownIndustryList = new List<DDLList>();
            ssmeList = new List<SSME>();
            SMMEDocumentList = new List<SSMEDocument>();
        }
    }
}
