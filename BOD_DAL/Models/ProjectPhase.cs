using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectPhase
    {
        public int? PP_Id { get; set; }
        public string PP_Name { get; set; }
        public string PP_FromDate { get; set; }
        public string PP_ToDate { get; set; }
        public int? UserId { get; set; }
        public int? PP_ProjectId { get; set; }
        public string PP_Description { get; set; }
        public List<ProjectPhase> projectPhase { get; set; }
        public List<ProjectWiseTask> projectActiivity { get; set; }
        public List<ProjectTaskWisePase> projectTaskWisePase { get; set; }

        public List<ProjectWiseSMME> projectTaskWiseSMME { get; set; }
        public ProjectPhase()
        {
            projectTaskWisePase = new List<ProjectTaskWisePase>();
            projectActiivity = new List<ProjectWiseTask>();
            projectPhase = new List<ProjectPhase>();
            projectTaskWiseSMME = new List<ProjectWiseSMME>();
        }
    }
}
