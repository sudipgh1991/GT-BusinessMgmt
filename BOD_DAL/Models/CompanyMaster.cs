using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class CompanyMaster
    {
        public decimal? CM_Id { get; set; }

        public string CM_Name { get; set; }
        public string CM_Address{ get; set; }
       
        public CompanyMaster()
        {
           cList = new List<CompanyMaster>();
        }
        public List<CompanyMaster> cList { get; set; }
    }
}
