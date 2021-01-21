using BOD_DAL;
using BOD_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Reflection;

namespace BOD_APP.Controllers
{
    public class ClientController : Controller
    {
        // GET: Client
        public static UserModel UserModel { get; set; }
        public static UserModel CUserModel { get; set; }
        public static UserModel EUserModel { get; set; }
      
        public GlobalData global = new GlobalData();
      public static DataTable dt = new DataTable();
      DAL dl = new DAL();
      public DDLList ddl = new DDLList();
      public List<DDLList> DropDownPopulation(DDLList data)
      {

        List<DDLList> ddlList = dl.GetDDLList(data);
        return ddlList;

      }
        private static List<T> ConvertDataTable<T>(DataTable dt)
        {
            List<T> data = new List<T>();
            foreach (DataRow row in dt.Rows)
            {
                T item = GetItem<T>(row);
                data.Add(item);
            }
            return data;
        }
        private static T GetItem<T>(DataRow dr)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            foreach (DataColumn column in dr.Table.Columns)
            {
                foreach (PropertyInfo pro in temp.GetProperties())
                {
                    if (pro.Name == column.ColumnName)
                        pro.SetValue(obj, dr[column.ColumnName], null);
                    else
                        continue;
                }
            }
            return obj;
        }

        private static T GetItem1<T>(DataTable dt)
        {
            Type temp = typeof(T);
            T obj = Activator.CreateInstance<T>();

            T data = Activator.CreateInstance<T>();
            foreach (DataRow row in dt.Rows)
            {
                data = GetItem<T>(row);
            }


            return data;
        }
        public static void GetSession()
        {
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            CUserModel = (UserModel)System.Web.HttpContext.Current.Session["CUserDataModel"];
            EUserModel = (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];
        }


        public ClientController()
        {
            GetSession();

        }
        public ActionResult Home()
        {
            if (CUserModel == null)
            {

                if (EUserModel == null)
                {

                    return RedirectToAction("AppLogin", "Account");
                }
                else
                {
                    global.CompanyID = EUserModel.CompanyID;
                    global.FYId = EUserModel.FyId;
                    global.param1Value = EUserModel.UserID;
                    global.paramString2 = "E";
                }
            }
            else if (CUserModel.UM_AssesmentGiven == false)
            {
                return RedirectToAction("Assesment", "Home");
            }
            else
            {
                global.CompanyID = CUserModel.CompanyID;
                global.FYId = CUserModel.FyId;
                global.param1Value = CUserModel.UserID;
            }


            DataTable dt = new DataTable();
            CorporateDashboard corp = new CorporateDashboard();
          
            global.StoreProcedure = "ClientDashboard_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param2 = "Type";
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    corp = GetItem1<CorporateDashboard>(ds.Tables[0]);
                    corp.smmList = ConvertDataTable<SSME>(ds.Tables[1]);
                    corp.projectList = ConvertDataTable<ProjectEntry>(ds.Tables[2]);
                }
                catch (Exception ex)
                {

                }



            return View(corp);
        }
        #region client wise SSME
        public ActionResult ClientWiseSMME()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            return View();
        }

        public ActionResult ClientWiseSMMEList(int? id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.param1 = "CWS_ClientId";
                    global.param1Value = id;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            ViewBag.Count = 0;
            DataTable dt = new DataTable();
            List<ClientWiseSSME> lst = new List<ClientWiseSSME>();

            global.StoreProcedure = "ClientWiseSMME_USP";
            global.TransactionType = "CorporateClientWiseSMME";

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    lst = ConvertDataTable<ClientWiseSSME>(ds.Tables[0]);
                    ViewBag.Count = lst.Count();
                }
                catch (Exception ex)
                {

                }


            var List = lst;
            return View(List);
        }
        
        public ActionResult CorpUserProfile()
        {
            if (CUserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();
        }

        
        #endregion

    }
}