using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
   public class ProjectPerformanceIndicatorReturnData
    {
        public long PPI_Id { get; set; }
        public long PPI_IndicatorTypeId { get; set; }
        public string PPI_Description { get; set; }
        public int PPI_MonthId { get; set; }
        public int PPI_Number { get; set; }
        public int PPI_InputNumber { get; set; }
        public string PPI_Year { get; set; }
        public string MM_Name { get; set; }
        public int PPI_Group { get; set; }
    }
}
