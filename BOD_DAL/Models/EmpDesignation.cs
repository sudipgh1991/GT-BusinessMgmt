using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class EmpDesignation:ModelBase
    {
        public string DesignationName { get; set; }

        public override string Abbr
        {
            get
            {
                return "ED_";
            }
        }

    }
}
