using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class AddTraining
    {
        public int? TE_ID { get; set; }
        public string TE_Name { get; set; }
        public int? TE_TrainingTypeId { get; set; }
        public string TE_FromDate { get; set; }
        public string TE_ToDate { get; set; }
        public string TE_Pic { get; set; }
        public string TE_Certificate { get; set; }
        public string TE_Status { get; set; }
        public string TE_Color { get; set; }
        public string TE_Description { get; set; }
        public int? UserId { get; set; }
        public int? CompanyId { get; set; }

        public List<AddTraining> trainingList { get; set; }
        public AddTraining()
        {
            trainingList = new List<AddTraining>();
        }
    }

}
