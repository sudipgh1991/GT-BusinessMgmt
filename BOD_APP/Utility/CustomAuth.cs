using BOD_DAL;
using BOD_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOD_APP.Utility
{
    public class CustomAuth
    {
        private static IList<MenuMaster> MenuList
        {
            get
            {
                if (System.Web.HttpContext.Current.Session["Menu"] == null)
                {
                    System.Web.HttpContext.Current.Session["Menu"] = DAL.GetGlobalMasterList<MenuMaster>(new GlobalData()
                    {
                        TransactionType = "Select",
                        StoreProcedure = "MenuMaster_USP"
                    });
                }
                return System.Web.HttpContext.Current.Session["Menu"] as List<MenuMaster>;
            }
        }

        public static IList<AuthorisedModule> GetModulesByUser(int userId)
        {
            var dal = new DAL();
            return dal.GetModulesByUser(userId);
        }

        public static IList<AuthorisedModule> GetModulesByUser(int companyId, string userLogin)
        {
            var dal = new DAL();
            return dal.GetModulesByUser(companyId, userLogin);
        }

        //public static IList<MenuMaster> GetMenuByUserId(int menuid = 0)
        //{

        //}
    }
}