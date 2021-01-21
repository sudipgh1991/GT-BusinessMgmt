using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BOD_DAL.Models
{
    public class CURegisterModel
    {
        public int UMId { get; set; }
        public int CCId { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }

        public int IndustryId { get; set; }
        public bool IsUserIDExist { get; set; }
        public bool IsEmailExist { get; set; }
    }
}
