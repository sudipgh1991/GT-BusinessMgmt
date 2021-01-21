using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class QuestionCategory : ModelBase
    {
        //public long Id   {get; set;}
        public string Name { get; set; }
        public override string Abbr
        {
            get
            {
                return "QC_";
            }
        }
    }
}
