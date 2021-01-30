using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class ProjectIndicator
    {
        public int IndicatorTypeId { get; set; }
        public string Description { get; set; }
        public int? PI_TotalIndicator { get; set; }
        public List<MonthList> MonthList { get; set; }

        public List<ProjectEntry> ProjectList { get; set; }

        public int GetTotalIndicators()
            => this.ProjectList
                .Sum(t => (int)t.PE_ProjectIndicartor);

        public ProjectIndicator()
        {
            ProjectList = new List<ProjectEntry>();
        }
    }
}
