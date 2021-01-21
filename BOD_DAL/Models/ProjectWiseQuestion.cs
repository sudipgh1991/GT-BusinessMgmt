using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectWiseQuestion
    {
        public int PWQ_ProjectId { get; set; }
        public int PWQ_PQM_Id { get; set; }
        public int UserID { get; set; }
        public List<ProjectWiseQuestion> ProjectQuestionList { get; set; }

        public ProjectWiseQuestion()
        {
            ProjectQuestionList = new List<ProjectWiseQuestion>();
        }
    }

}
