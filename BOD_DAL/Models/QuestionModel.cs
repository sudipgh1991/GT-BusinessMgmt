using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class QuestionModel
    {
        public int QM_ID { get; set; }
        public string QM_Name { get; set; }
        public string QM_Container { get; set; }
        public int QM_QC_Id { get; set; }
        public string Required { get; set; }

        public int QM_DropdownType { get; set; }
        public List<DDL> DropDowns { get; set; }
    }
}
