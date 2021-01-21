using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectQuestionView
    {
        public int? PWQ_Id { get; set; }
        public int? PWQ_ProjectId { get; set; }
        public string PE_ProjectName { get; set; }
        public int? PWQ_PQM_Id { get; set; }
        public int? PQM_CategoryId { get; set; }
        public string PQM_Name { get; set; }
        public string PQM_Answer { get; set; }
        public string PQM_Container { get; set; }
        public string PQM_IsRequired { get; set; }
        public bool PQM_ForSME { get; set; }
        public bool PQM_ForClient { get; set; }

        public bool RadioOptions { get; set; }
    }
}
