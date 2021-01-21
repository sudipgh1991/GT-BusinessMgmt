using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOD_DAL.Models
{
    public class UserModel
    {
        public UserModel()
        {
            submenuList = new List<SubMenu>();
            mainmenuList = new List<Menu>();
            mainmenuLst = new List<MainMenu>();
        }
        public List<SubMenu> submenuList { get; set; }
        public List<MainMenu> mainmenuLst { get; set; }
        public List<Menu> mainmenuList { get; set; }
        public int UserID { get; set; }
        public bool IsSuper { get; set; }
        public string UserLoginID { get; set; }
        public string Logo { get; set; }
        public string Type { get; set; }
        public string Password { get; set; }
        public int? CompanyID { get; set; }
        public int? FyId { get; set; }
        public string UserName { get; set; }
        public string SMSGateWay { get; set; }
        public string CompanyName { get; set; }
        public long? StateId { get; set; }
        public int? Module { get; set; }
        public int? SelectedModule { get; set; }
        public int? UM_MainID { get; set; }
        public string DashBoard { get; set; }
        public string Role { get; set; }
        public int? IndustryId { get; set; }
        public int EmpUnder{ get; set; }
        public string status { get; set; }
        public bool? UM_AssesmentGiven { get; set; }
        
    }
}