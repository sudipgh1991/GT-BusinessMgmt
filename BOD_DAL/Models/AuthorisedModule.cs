using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class AuthorisedModule : ModelBase
    {
        public override string Abbr
        {
            get
            {
                return "MM_";
            }
        }

        public string Name { get; set; }
        public string Image { get; set; }
        public string Url { get; set; }
    }
}
