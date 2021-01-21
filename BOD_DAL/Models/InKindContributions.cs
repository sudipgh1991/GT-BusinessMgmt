using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class InKindContributions
    {
        public string IKC_CategoryContribution { get; set; }
        public string IKC_NameOfContributor { get; set; }
        public string IKC_Date { get; set; }
        public decimal? IKC_Amount { get; set; }
        public string IKC_Contact { get; set; }
        public string IKC_BankAccount { get; set; }
        public string IKC_Specify { get; set; }
        public string IKC_TimeLine { get; set; }
        public string IKC_Description { get; set; }
        public int IKC_Accounting { get; set; }
    }
}
