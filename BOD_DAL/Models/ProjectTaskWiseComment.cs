using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectTaskWiseComment
    {


        public string PWT_Status { get; set; }

        public string PWT_StartDate { get; set; }
        public string PWT_EndDate { get; set; }
        public string PWT_Priority { get; set; }
        public string PTWC_Comment { get; set; }
        public string PTWC_File { get; set; }

        public int PTWC_TaskId { get; set;}//
        public int PTWC_ProjectId { get; set; }//

        public int UserId { get; set; }//

        public string PTWC_CreatedDate { get; set; }
        public string PWT_CreatedDate { get; set; }
        public string CC_TradingName { get; set; }
        public string CC_PhoneNo { get; set; }
        public string CC_Email { get; set; }
        public int PWT_Id { get; set; }//

        public string PWT_TaskTitle { get; set; }//

        public string PWT_Description { get; set; }//

        public string PWT_TaskId { get; set; }//

        public string UserName { get; set; }
        public string UserIamge { get; set; }

        public List<ProjectTaskWiseComment> cmmntlist { get; set; }
        public ProjectTaskWiseComment()
        {
           
            cmmntlist = new List<ProjectTaskWiseComment>();
        }


    }
}
