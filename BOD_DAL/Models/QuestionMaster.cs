using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class QuestionMaster : ModelBase
    {
        //public long Id   {get; set;}
        public string Name { get; set; }
        public string Container {  get; set; }
        public bool? ForClient { get; set; }
        public bool? ForEmp { get; set; }
        public bool ForSME { get; set; }
        public int? QC_Id { get; set; }
        public string PIM_Name { get; set; }
        public string QC_Name { get; set; }
        public int? PIM_Id { get; set; }
        public bool? IsRequired { get; set; }
        public bool? ForLogin { get; set; }
        public int? DropdownType { get; set; }
        public override string Abbr
        {
            get
            {
                return "QM_";
            }
        }
    }
}
