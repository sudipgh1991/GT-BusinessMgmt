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
    public class SSMEController : Controller
    {
        // GET: SSME
        public static UserModel UserModel { get; set; }
        public static UserModel CUserModel { get; set; }
        public static UserModel EUserModel { get; set; }
        public static UserModel AUserModel { get; set; }
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
            //UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["SMUserDataModel"];
            AUserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            CUserModel = (UserModel)System.Web.HttpContext.Current.Session["CUserDataModel"];
            EUserModel = (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];
        }


        public SSMEController()
        {
            GetSession();

        }
        public ActionResult Home()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            else if (UserModel.UM_AssesmentGiven == false)
            {
                return RedirectToAction("Assesment", "Home");
            }

            return View();
        }
        public ActionResult ProjectWiseTaskList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");

            }
            global.CompanyID = UserModel.CompanyID;
            global.FYId = UserModel.FyId;
            DataTable dt = new DataTable();
            List<ProjectWiseTask> lst = new List<ProjectWiseTask>();

            global.StoreProcedure = "ProjectTaskWiseSMME_USP";
            global.TransactionType = "SelectSMMWiseTaskProject";
            global.param1 = "UserId";
            global.param1Value = UserModel.UserID;


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectWiseTask>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
        public ActionResult TaskList(int? Id,int?ProjectId)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (AUserModel == null)
                    {
                        if (EUserModel == null)
                        {
                            return RedirectToAction("AppLogin", "Account");
                        }
                        else
                        {
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                            global.UserID = EUserModel.EmpUnder;
                        }
                    }
                    else
                    {
                        global.CompanyID = AUserModel.CompanyID;
                        global.FYId = AUserModel.FyId;
                        global.UserID = AUserModel.UserID;
                    }
                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.UserID = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }

            DataTable dt = new DataTable();
            
            ProjectWiseTask lst = new ProjectWiseTask();

            global.StoreProcedure = "ProjectTaskWiseSMME_USP";
            global.TransactionType = "SelectSMMWiseSubTaskProject";
            //global.param1 = "UserId";
            //global.param1Value = global.UserID;
            global.param2="PWS_TaskId";
            global.param2Value = Id;
            global.param1 = "PWS_ProjectId";
            global.param1Value = ProjectId;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            lst = GetItem1<ProjectWiseTask>(ds.Tables[1]);
            if (ds.Tables.Count > 0)
            {
                lst.projectTaskList = ConvertDataTable<ProjectWiseTask>(ds.Tables[0]);
            }
            var List = lst;

            return View(List);
        }
        public ActionResult TaskDetails(int? Id, int? TaskId, int? IsSub)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (AUserModel == null)
                    {
                        if (EUserModel == null)
                        {
                            return RedirectToAction("AppLogin", "Account");
                        }
                        else
                        {
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                            global.UserID = EUserModel.EmpUnder;
                        }
                    }
                    else
                    {
                        global.CompanyID = AUserModel.CompanyID;
                        global.FYId = AUserModel.FyId;
                        global.UserID = AUserModel.UserID;
                    }
                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.UserID = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }
            ViewBag.Id = Id;
            ViewBag.TaskId = TaskId;
            ViewBag.IsSub = IsSub;
            return View();
        }
        public ActionResult SSMEUserProfile()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();
        }
    }
}