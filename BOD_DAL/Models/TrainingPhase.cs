using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class TrainingPhase
    {
        public string TP_Title { get; set; }
        public DateTime? TP_FromDate { get; set; }
        public DateTime? TP_ToDate { get; set; }
        public int TWD_TE_Id { get; set; }
        public int TP_Id { get; set; }
        public string TP_Status { get; set; }
        public string TP_Color { get; set; }

        public List<TrainingPhase> trainingPhase { get; set; }
        public TrainingPhase()
        {
            trainingPhase = new List<TrainingPhase>();

        }
    }
}
