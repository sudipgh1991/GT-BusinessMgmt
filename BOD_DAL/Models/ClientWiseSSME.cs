using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
namespace BOD_DAL.Models
{
   public class ClientWiseSSME 
    {
       public int? CWS_SMMEId { get; set; }
       public int? CWS_ClientId { get; set; }

        public long SM_Id { get; set; }
        public string SM_PostalAddress { get; set; }
        public string SM_Image { get; set; }
        public string SM_CorporateName { get; set; }
        public string SM_TradingName { get; set; }
        public string SM_PhoneNo { get; set; }
        public string CC_CorporateName { get; set; }
        public List<ClientWiseSSME> SmmeList { get; set; }

        public ClientWiseSSME()
        {
            SmmeList = new List<ClientWiseSSME>();
            
        }
    }
}
