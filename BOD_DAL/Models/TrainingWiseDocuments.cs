using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class TrainingWiseDocuments
    {
        public string TWD_TE_Id { get; set; }
        public string TWD_Documents { get; set; }
        public string TWD_DocName { get; set; }

        public List<TrainingWiseDocuments> TrainingWiseDocumentsList { get; set; }
        public TrainingWiseDocuments()
        {
            TrainingWiseDocumentsList = new List<TrainingWiseDocuments>();

        }
    }
}
