using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
  public class GlobalDelTrans
    {
        public int? CompanyId { get; set; }
        public int? FyId { get; set; }
        public int? UserId { get; set; }
        public int? DelId { get; set; }
        public string TransactionType { get; set; }
    }
}
