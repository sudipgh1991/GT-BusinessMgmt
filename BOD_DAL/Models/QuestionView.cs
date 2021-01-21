using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class QuestionView
    {
       public int? QM_Id { get; set; }
       public int? QM_QC_Id { get; set; }
       public string QM_Name { get; set; }
        public string UQM_Answer { get; set; }
        public string QM_Container { get; set; }
      public string Required { get; set; }
       public bool RadioOptions { get; set; }
       // public List<DDLListoption> DropDowns { get; set; }
    }

   //public class DDLListoption
   // {
   //     public int OM_Id { get; set; }
   //     public string OM_Name { get; set; }
   //     public int OM_OTM_Id { get; set; }
   // }


}

    

