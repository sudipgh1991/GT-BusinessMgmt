using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectIndicatorReturnData
    {
        public long PI_Id { get; set; }
        public long PI_IndicatorTypeId { get; set; }
        public string PI_Description { get; set; }
        public int PI_MonthId { get; set; }
        public int PI_Number { get; set; }
        public string PI_Year { get; set; }
        public string MM_Name { get; set; }
        public int PI_Group { get; set; }
    }
}
