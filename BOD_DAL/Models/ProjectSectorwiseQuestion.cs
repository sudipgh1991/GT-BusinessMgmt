using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectSectorwiseQuestion
    {

        public int PQM_Id { get; set; }
        public string PQM_Name { get; set; }
        public string PQM_Container { get; set; }
        public bool? PQM_ForClient { get; set; }
        public bool PQM_ForSME { get; set; }
        public bool PQM_ForEmp { get; set; }

        public int? PQM_PIM_Id { get; set; }
        public string PQM_PIM_Name { get; set; }
        public bool? PQM_IsRequired { get; set; }
        public int? PQM_DropdownType { get; set; }
    }
}
