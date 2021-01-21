using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class TrainingWiseEmployee
    {
        public int? TWE_TE_Id { get; set; }
        public int? TWE_EmpId { get; set; }

  
        public List<TrainingWiseEmployee> trainingWiseEmployee { get; set; }
        public TrainingWiseEmployee()
        {
            trainingWiseEmployee = new List<TrainingWiseEmployee>();

        }
    }
}
