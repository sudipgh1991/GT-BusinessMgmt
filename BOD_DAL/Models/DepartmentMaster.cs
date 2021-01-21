using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class DepartmentMaster : ModelBase
    {
        public string Name { get; set; }

        public override string Abbr
        {
            get
            {
                return "DM_";
            }
        }

    }
}
