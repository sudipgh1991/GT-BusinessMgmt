using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class CorporateClient
    {
        public string CC_CorporateName { get; set; }
        public long CC_Id { get; set; }
        public string CC_TradingName { get; set; }
        public string CC_CIPC_RegistrationNo { get; set; }
        public string CC_SARS_VATNo { get; set; }
        public string CC_Address { get; set; }
        public string CC_Zipcode { get; set; }
        public string CC_PostalAddress { get; set; }
        public string CC_PhoneNo { get; set; }
        public string CC_Email { get; set; }
        public string CC_ContactPersonName { get; set; }
        public long CC_CompanyId { get; set; }
        public long CC_FyId { get; set; }
        public string CC_Logo { get; set; }

        public long CC_PIM_Id { get; set; }

        public int? UserId { get; set; }
        public bool? UM_AssesmentGiven { get; set; }
        public string CC_Password { get; set; }
        public string CC_UserId { get; set; }
        public string CC_ContactPersonPhNo { get; set; }
        public string CC_ContactPersonEmail { get; set; }
        public string PIM_Name { get; set; }
        public List<QA> QA { get; set; }
        public List<ProjectEntry> project { get; set; }
        public List<CorporateClient> clinetList { get; set; }
        public List<SSME> smme { get; set; }
        public List<EmployeeMaster> empList { get; set; }
        public List<CorporateClientDocument> CorporateClientDocumentList { get; set; }
        public List<DDLList> dropdownIndustryList { get; set; }
        public int CC_TotalProjects { get; set; }
        public CorporateClient()
        {
            empList = new List<EmployeeMaster>();
            QA = new List<QA>();
            project = new List<ProjectEntry>();
            smme = new List<SSME>();
            clinetList = new List<CorporateClient>();
            CorporateClientDocumentList = new List<CorporateClientDocument>();
            dropdownIndustryList = new List<DDLList>();
        }


    }
}
