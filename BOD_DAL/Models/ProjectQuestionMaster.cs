using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectQuestionMaster : ModelBase
    {
        //public long Id   {get; set;}
        public string Name { get; set; }
        public string Container { get; set; }
        public bool? ForClient { get; set; }
        public bool ForSME { get; set; }
        public bool ForEMP { get; set; }
        //public int? QC_Id { get; set; }
        public string PIM_Name { get; set; }
        public string QC_Name { get; set; }
        public int? PIM_Id { get; set; }
        public bool? IsRequired { get; set; }
        public int? CategoryId { get; set; }

        public int? DropdownType { get; set; }
        public override string Abbr
        {
            get
            {
                return "PQM_";
            }
        }
    }
}
