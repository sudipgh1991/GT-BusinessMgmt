using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class ProjectTaskWisePase
    {
       public int? PWP_TaskId { get; set; }
       public string PWT_TaskTitle { get; set; }
       public string PWT_Description { get; set; }
       public string PWT_Attachment { get; set; }
       public string PWT_Image { get; set; }
       public int? PWP_ProjectId { get; set; }
       public int? PWP_PhaseId { get; set; }
       public string PWT_StartDate { get; set; }
       public string PWT_EndDate { get; set; }
       public string PWT_Priority { get; set; }
       public int? PWT_ParentTaskCount { get; set; }
    }
}
