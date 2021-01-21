using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class AssesmentView
    {
              public List<QuestionCategory> categotyList { get; set; }

        public List<QuestionView> qsView { get; set; }
        public AssesmentView()
        {
            categotyList = new List<QuestionCategory>();
            qsView = new List<QuestionView>();
        }
    }
}
