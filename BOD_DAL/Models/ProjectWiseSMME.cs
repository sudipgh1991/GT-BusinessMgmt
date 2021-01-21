using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public  class ProjectWiseSMME
    {
        public string SM_CorporateName { get; set; }
        public int? PWS_SM_Id { get; set; }
        public string SM_TradingName { get; set; }
        public string SM_CIPC_RegistrationNo { get; set; }
        public string SM_SARS_VATNo { get; set; }
        public string SM_Address { get; set; }
        public string SM_Zipcode { get; set; }
        public string SM_PostalAddress { get; set; }
        public string SM_PhoneNo { get; set; }
        public string SM_Email { get; set; }
        public string SM_ContactPersonName { get; set; }
        public string PWS_TaskSM_Id { get; set; }
        public string SM_Image { get; set; }
        public string AssociateProject { get; set; }
        public int? PTWS_TaskId { get; set; }
        public int? PWS_ProjectId { get; set; }
        public int? UserID { get; set; }
        public List<ProjectWiseSMME> SmmeList { get; set; }
        public List<ProjectWiseSMME> SmmeNonProjectList { get; set; }
        public List<ProjectWiseTask> TaskList { get; set; }
        public ProjectWiseSMME()
       {
           SmmeList = new List<ProjectWiseSMME>();
           SmmeNonProjectList = new List<ProjectWiseSMME>();
           TaskList = new List<ProjectWiseTask>();
       }
    }
}
