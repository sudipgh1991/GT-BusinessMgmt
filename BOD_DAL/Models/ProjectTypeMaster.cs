using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
  public  class ProjectTypeMaster:ModelBase
    {
       
        public string Name { get; set; }
        public override string Abbr
        {
            get
            {
                return "PTM_";
            }
        }
    }
}
