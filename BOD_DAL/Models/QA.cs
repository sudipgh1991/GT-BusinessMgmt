using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class QA
    {
        public int QAId { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
        public string[] Answer2 { get; set; }
        public string Type { get; set; }
        public int QM_QC_Id { get; set; }
        public bool RadioOptions { get; set; }
        public string Required { get; set; }
        public int QM_DropdownType { get; set; }
        public List<DDL> DropDowns { get; set; }
    }

    public class DDL
    {
        public int OM_Id { get; set; }
        public string OM_Name { get; set; }
        public int OM_OTM_Id { get; set; }
    }
}
