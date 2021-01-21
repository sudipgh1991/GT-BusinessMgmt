using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class InterestIncome
    {
        public string II_Date { get; set; }
        public string II_InterestInstrument { get; set; }

        public string II_InstitutionHolding { get; set; }
        public int? II_InterestRate { get; set; }
        public string II_InterestPaymentTerms { get; set; }
        public int II_Accounting { get; set; }
    }
}
