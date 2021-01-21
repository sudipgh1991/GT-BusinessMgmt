using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class ProjectWiseTask
    {
     public int? PWT_Id{get;set;}
     public string PWT_TaskTitle{get;set;}
     public string PWT_Description{get;set;}
     public string PWT_Attachment{get;set;}
     public string PWT_Image{get;set;}
     public int? PWT_ProjectId{get;set;}
     public int?CompanyId { get; set; }
     public int?FyId { get; set; }
     public int? UserId { get; set; }
     public string PWT_CreatedDate { get; set; }
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
     public int? PWT_ParentTaskId { get; set; }
     public int? PWT_ParentTaskCount { get; set; }
       public string chkchecked { get; set; }
     public string PWT_StartDate { get; set; }
     public string PWT_Status { get; set; }
     public string PWT_EndDate { get; set; }
     public string PWT_Priority { get; set; }
     public List<ProjectWiseSMME> smmlist { get; set; }
     public List<ProjectWiseTask> projectTaskList { get; set; }
        public List<ProjectTaskWiseComment> commtList{ get; set; }
        public List<EmployeeMaster> emplist { get; set; }
    public ProjectWiseTask()
     {
         smmlist = new List<ProjectWiseSMME>();
         emplist = new List<EmployeeMaster>();
            commtList = new List<ProjectTaskWiseComment>();
            projectTaskList = new List<ProjectWiseTask>();
     }

    }
}
