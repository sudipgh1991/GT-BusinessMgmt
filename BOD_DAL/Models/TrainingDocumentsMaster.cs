using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class TrainingDocumentsMaster : ModelBase
    {
        public string Title { get; set; }
        public string Documents { get; set; }
        public override string Abbr
        {
            get
            {
                return "TDM_";
            }
        }
    }
}
