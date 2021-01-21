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
    public class ProjectController : Controller
    {
        // GET: Project
        public static UserModel UserModel { get; set; }
        public static UserModel CUserModel { get; set; }
        public static UserModel EUserModel { get; set; }
        public static UserModel SUserModel { get; set; }
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
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            SUserModel = (UserModel)System.Web.HttpContext.Current.Session["SMUserDataModel"];
            CUserModel = (UserModel)System.Web.HttpContext.Current.Session["CUserDataModel"];
            EUserModel = (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];
        }


        public ProjectController()
        {
            GetSession();

        }
        public ActionResult Project()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {

                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        ViewBag.disabled = "disabled";

                    }

                }
                else
                {
                    ViewBag.MainId = CUserModel.UM_MainID;
                    ViewBag.disabled = "disabled";
                }

            }
            else
            {
                ViewBag.disabled = "";
            }

            return View();
        }
        public ActionResult ProjectList()
        {
            if (UserModel == null)
            {
                if (SUserModel == null)
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
                            global.UserID = EUserModel.EmpUnder;
                            ViewBag.UserRole = "E";
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
                    ViewBag.UserRole = "S";
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }
            DataTable dt = new DataTable();
            List<ProjectEntry> lst = new List<ProjectEntry>();

            global.StoreProcedure = "ProjectEntry_USP";
            global.TransactionType = "SelectList";
            global.param1 = "PE_Id";
            global.param1Value = null;
            if (CUserModel != null)
            {
                global.param2 = "PE_ClientId";
                global.param2Value = global.UserID;
            }
            else if (SUserModel != null)
            {
                ViewBag.Role = "S";
                global.param2 = "PE_ClientId";
                global.param3 = "UserId";
                global.param3Value = SUserModel.UserID;
            }
            else if (EUserModel != null)
            {
                if (EUserModel.IsSuper == true)
                {
                    global.param2 = "PE_ClientId";
                    global.param2Value = global.UserID;
                }
                else
                {
                    global.param2 = "PE_ClientId";
                    global.param2Value = global.UserID;
                    global.param3 = "UserId";
                    global.param3Value = EUserModel.UserID;

                }

            }


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectEntry>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
        public ActionResult ProjectWiseExpenses(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        global.UserID = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        public ActionResult ProjectSummary(int? Id)
        {
            if (UserModel == null)
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

                        global.param1Value = EUserModel.EmpUnder;
                    }


                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;

                    global.param1Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

                global.param1Value = null;
            }
            ViewBag.Id = Id;
            DataTable dt = new DataTable();
            ProjectSummaryDashBoard corp = new ProjectSummaryDashBoard();

            global.StoreProcedure = "ProjectSummaryDashboard_USP";
            global.TransactionType = "Select";
            global.param1 = "ProjectId";
            global.param1Value = Id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    corp = GetItem1<ProjectSummaryDashBoard>(ds.Tables[0]);

                }
                catch (Exception ex)
                {

                }



            return View(corp);
        }
        #region  ProjectWiseJobsFundGrant
        public ActionResult ProjectWiseJobsFundGrant(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion

        #region  MatchedFunding
        public ActionResult MatchedFunding(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion

        #region  OtherContributions
        public ActionResult OtherContributions(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion

        #region  LoanFinancing
        public ActionResult LoanFinancing(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion

        #region  InKindContributions
        public ActionResult InKindContributions(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion
        #region  InterestIncome
        public ActionResult InterestIncome(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion
        #region  OtherEarnings
        public ActionResult OtherEarnings(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {

                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }

            ViewBag.Id = Id;

            return View();
        }
        #endregion

        public ActionResult AddSMME(int? id)
        {
            ViewBag.Id = id;
            if (UserModel == null)
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
                    }
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
            ViewBag.Id = id;
            DataTable dt = new DataTable();
            List<ProjectWiseSMME> lst = new List<ProjectWiseSMME>();

            global.StoreProcedure = "ProjectWiseSMME_USP";
            global.TransactionType = "SelectSMMEForPrject";

            //global.TransactionType = "SelectSMMENotinPrject";
            global.param1 = "PWS_ProjectId";
            global.param1Value = id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectWiseSMME>(ds.Tables[0]);

            var List = lst;

            return View(List);

            //if (ds.Tables.Count > 0)
            //    lst.SmmeList = ConvertDataTable<ProjectWiseSMME>(ds.Tables[1]);
            ////lst.SmmeNonProjectList = ConvertDataTable<ProjectWiseSMME>(ds.Tables[0]);

            //var List = lst;
            //return View(List);
        }
        public ActionResult ProjectWiseSMME(int? id, int? taskid)
        {
            if (UserModel == null)
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
                    }
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
            ViewBag.Id = id;
            ViewBag.taskid = taskid;
            DataTable dt = new DataTable();
            ProjectWiseSMME lst = new ProjectWiseSMME();

            global.StoreProcedure = "ProjectWiseSMME_USP";
            global.TransactionType = "SelectSMMENotinPrject";
            global.param1 = "PWS_ProjectId";
            global.param1Value = id;
            global.param2 = "PWS_TaskId";
            global.param2Value = taskid;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst.SmmeList = ConvertDataTable<ProjectWiseSMME>(ds.Tables[3]);
            lst.SmmeNonProjectList = ConvertDataTable<ProjectWiseSMME>(ds.Tables[0]);
            lst.TaskList = ConvertDataTable<ProjectWiseTask>(ds.Tables[2]);
            var List = lst;
            return View(List);
        }

        public ActionResult ProjectWiseTask(int? id)
        {
            ViewBag.Id = id;
            if (UserModel == null)
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
                    }
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
        public ActionResult ProjectWiseTaskList()
        {
            if (UserModel == null)
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
                        if (EUserModel.IsSuper == true)
                        {
                            global.TransactionType = "SelectProjectWiseTask";
                            global.param2 = "UserId";
                            global.param2Value = EUserModel.EmpUnder;
                        }
                        else
                        {
                            global.TransactionType = "SelectProjectWiseTaskEmp";
                            global.param2 = "UserId";
                            global.param2Value = EUserModel.UserID;
                        }


                    }
                }
                else
                {
                    global.TransactionType = "SelectProjectWiseTask";
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.param2 = "UserId";
                    global.param2Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.TransactionType = "Select";
            }
            DataTable dt = new DataTable();
            List<ProjectWiseTask> lst = new List<ProjectWiseTask>();

            global.StoreProcedure = "ProjectWiseTask_USP";


            global.param1 = "PWT_Id";
            global.param1Value = null;


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectWiseTask>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
        #region Budget
        public ActionResult Budget(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }
            ViewBag.Id = Id;

            return View();
        }
        #endregion

        #region Income
        public ActionResult Income(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }
            ViewBag.Id = Id;

            return View();
        }
        #endregion

        public ActionResult CorporateWiseProjectsList(int? Id)
        {
            if (UserModel == null)
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
                    }
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
            DataTable dt = new DataTable();
            List<ProjectEntry> lst = new List<ProjectEntry>();

            global.StoreProcedure = "ProjectEntry_USP";
            global.TransactionType = "CorpWiseProjectList";
            global.param1 = "PE_Id";
            global.param1Value = null;

            if (Id != null)
            {
                global.param2 = "PE_ClientId";
                global.param2Value = Id;

            }


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectEntry>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }

        public ActionResult AsessmentQuestion(int? userId)
        {
            List<QuestionView> QA = new List<QuestionView>();
            int id = 0;
            string name = "";
            AssesmentView assView = new AssesmentView();

            ViewBag.onlyVisible = "No";

            if (CUserModel == null && userId == null)
            {
                if (SUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }


            if (userId != null)
            {
                ViewBag.Role = "A";
                ViewBag.onlyVisible = "Yes";
                id = Convert.ToInt32(userId);
                UserModel = dl.GetUserDetails(id);
                QA = GetQuestionView(id, UserModel.Role);
                ViewBag.QCategory = GetQuestionCategory(id, name);
            }

            if (CUserModel != null)
            {
                id = CUserModel.UserID;
                name = "C";
                QA = GetQuestionView(id, "C");
                ViewBag.QCategory = GetQuestionCategory(id, name);
            }
            else if (SUserModel != null)
            {
                id = SUserModel.UserID;
                name = "S";
                QA = GetQuestionView(id, "S");
                ViewBag.QCategory = GetQuestionCategory(id, name);
            }
            else if (EUserModel != null)
            {
                id = EUserModel.EmpUnder;
                name = "C";
                QA = GetQuestionView(id, "C");
                ViewBag.QCategory = GetQuestionCategory(id, name);
            }

            return View(QA);

        }
        [HttpPost]
        public ActionResult AsessmentQuestion(List<QuestionView> assestemnt)
        {
            string Action = "";
            string Controler = "";
            long login = 0;

            if (CUserModel != null)
            {

                login = dl.InsertUpdateAssestment(assestemnt, "CorporateClient_USP", CUserModel.UserID);
                if (login != 0)
                {
                    Action = "Home";
                    Controler = "Client";
                    CUserModel.UM_AssesmentGiven = true;
                }
            }
            else if (SUserModel != null)
            {
                login = dl.InsertUpdateAssestment(assestemnt, "SSME_USP", SUserModel.UserID);
                if (login != 0)
                {
                    Action = "Home";
                    Controler = "SSME";
                    SUserModel.UM_AssesmentGiven = true;
                }
            }
            //return RedirectToAction(Action, Controler);
            return RedirectToAction("AsessmentQuestion", "Project");
        }
        public List<QuestionCategory> GetQuestionCategory(int? Id, string type)
        {
            //if (type == "C")
            //{
            //    global.StoreProcedure = "CorporateClient_USP";

            //    global.param1 = "UserId";
            //}
            //else
            //{
            //    global.StoreProcedure = "SSME_USP";

            //    global.param1 = "UserId";

            //}
            //global.TransactionType = "SelectAssetmentCategory";
            //global.param1Value = Id;
            //DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            //return ConvertDataTable<QuestionCategory>(ds.Tables[0]);
            return dl.GetQuestionCategory(Id, type);
        }
        public List<QuestionView> GetQuestionView(int? Id, string type)
        {
            //if (type == "C")
            //{
            //    global.StoreProcedure = "CorporateClient_USP";
            //    global.param1 = "UserId";
            //}
            //else
            //{
            //    global.StoreProcedure = "SSME_USP";

            //    global.param1 = "UserId";

            //}
            //global.TransactionType = "SelectAssetmentView";

            //global.param1Value = Id;
            //global.StoreProcedure = "AsessmentQuestionAnswer_USP";
            //global.param1 = "UserId";
            //global.param1Value = Id;
            //global.param2 = "Type";
            //global.paramString = type;
            //DataSet ds = dl.GetAsessmentQuestionAnswer(Id,type);
            return dl.GetAsessmentQuestionAnswer(Id, type);
        }
        public ActionResult ProjectWiseEmployee(int? id)
        {
            ViewBag.Id = id;
            if (UserModel == null)
            {

                if (SUserModel == null)
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
                            global.UserID = EUserModel.EmpUnder;
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                }
            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }
            ViewBag.Id = id;
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectProjectWiseEMP";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            global.param2 = "ProjectId";
            global.param2Value = id;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<EmployeeMaster>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
        public ActionResult ProjectWiseEmployeeTask(int? id, int? TaskId)
        {

            if (UserModel == null)
            {
                if (SUserModel == null)
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
                            global.UserID = EUserModel.EmpUnder;
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                }
            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }
            ViewBag.Id = id;
            ViewBag.TaskId = TaskId;
            DataTable dt = new DataTable();
            ProjectWiseTask lst = new ProjectWiseTask();

            global.StoreProcedure = "ProjectWiseTask_USP";
            global.TransactionType = "SelectProjectTaskWiseEMP";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            global.param2 = "ProjectId";
            global.param2Value = id;
            global.param3 = "TaskId";
            global.param3Value = TaskId;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = GetItem1<ProjectWiseTask>(ds.Tables[0]);
            lst.emplist = ConvertDataTable<EmployeeMaster>(ds.Tables[1]);

            var List = lst;

            return View(List);
        }
        public ActionResult ProjectCardList()
        {
            if (UserModel == null)
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
                        global.UserID = EUserModel.EmpUnder;
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


            return View();
        }
        public ActionResult NewList()
        {
            if (UserModel == null)
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
                        global.UserID = EUserModel.EmpUnder;
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


            return View();
        }


        #region Project Indicator
        public ActionResult ProjectIndicator(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }
            ViewBag.Id = Id;

            return View();
        }
        #endregion
        #region ProjectWiseQuestionior

        public ActionResult ProjectWiseQuestionior(int? id, int? SectorId)
        {
            //if (UserModel == null)
            //{
            //    if (CUserModel == null)
            //    {
            //        if (EUserModel == null)
            //        {
            //            return RedirectToAction("AppLogin", "Account");
            //        }
            //        else
            //        {
            //            String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
            //            global.paramValue = paramValuestr;
            //        }
            //    }
            //    else
            //    {
            //        String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
            //        global.paramValue = paramValuestr;
            //    }
            //}
            //else
            //{
            //    //String[] paramValuestr = new String[] { Convert.ToString(UserModel.UserID), null };
            //    //global.paramValue = paramValuestr;
            //    String[] paramValuestr = new String[] { Convert.ToString(SectorId), null };
            //    global.paramValue = paramValuestr;
            //}

            //ViewBag.Id = id;
            //ViewBag.SectorId = SectorId;
            //String[] stringarr = new String[] { "PQM_PIM_Id" };

            //// assign the value "Geeks" in array on its index 0

            //global.StoreProcedure = "ProjectQuestionMaster_USP";
            //global.TransactionType = "SelectQuestionBySector";
            //global.Param = stringarr;



            //var List = DAL.GetGlobalMasterList<ProjectQuestionMaster>(global);

            //return View(List);



            if (UserModel == null)
            {
                if (SUserModel == null)
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
                            global.UserID = EUserModel.EmpUnder;
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                }
            }
            else
            {
                //global.CompanyID = UserModel.CompanyID;
                //global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
            }
            ViewBag.Id = id;
            ViewBag.SectorId = SectorId;

            DataTable dt = new DataTable();
            List<ProjectSectorwiseQuestion> lst = new List<ProjectSectorwiseQuestion>();

            global.StoreProcedure = "ProjectQuestionMaster_USP";
            global.TransactionType = "SelectQuestionBySector";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            global.param2 = "PQM_PIM_Id";
            global.param2Value = SectorId;
            //global.param3 = "TaskId";
            //global.param3Value = TaskId;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)

                lst = ConvertDataTable<ProjectSectorwiseQuestion>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
        #endregion
        #region Project Performance Indicator
        public ActionResult ProjectPerformanceIndicator(int? Id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        ViewBag.UserId = EUserModel.UserID;
                    }
                }
                else
                {
                    ViewBag.UserId = CUserModel.UserID;
                }

            }
            else
            {
                ViewBag.UserId = UserModel.UserID;
            }
            ViewBag.Id = Id;

            return View();
        }
        #endregion
        #region ProjectAssesment
        public ActionResult ProjectAsessmentQuestion(int? Id, int? UserId, string type)
        {
            List<ProjectQuestionView> QA = new List<ProjectQuestionView>();
            int userid = 0;
            string name = string.Empty;
            AssesmentView assView = new AssesmentView();
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (SUserModel == null)
                    {
                        if (EUserModel == null)
                        {
                            return RedirectToAction("AppLogin", "Account");
                        }
                    }
                }
            }

            if (UserModel != null || CUserModel != null)
            {
                ViewBag.Role = "A";
                userid = Convert.ToInt32(UserId);
                name = type;
            }
            //else if (CUserModel != null)
            //{
            //    ViewBag.Role = "A";
            //    userid = UserId;
            //    name = type;
            //    //userid = CUserModel.UserID;
            //    //name = "C";
            //    //QA = GetProjectQuestionView(id);
            //    //ViewBag.QCategory = GetProjectQuestionCategory();
            //}
            else if (SUserModel != null)
            {
                userid = SUserModel.UserID;
                name = "S";
                //QA = GetProjectQuestionView(id);
                //ViewBag.QCategory = GetProjectQuestionCategory();
            }
            else if (EUserModel != null)
            {
                userid = EUserModel.UserID;
                name = "E";
                //QA = GetProjectQuestionView(id);
                //ViewBag.QCategory = GetProjectQuestionCategory();
            }

            TempData["ProjectId"] = Id;

            QA = GetProjectQuestionView(Id, userid, name);
            ViewBag.QCategory = GetProjectQuestionCategory();
            return View(QA);

        }
        [HttpPost]
        public ActionResult ProjectAsessmentQuestion(List<ProjectQuestionView> assestemnt)
        {
            string Action = "";
            string Controler = "";
            long login = 0;
            int id = 0;
            if (CUserModel != null)
            {
                id = CUserModel.UserID;

            }
            else if (SUserModel != null)
            {
                id = SUserModel.UserID;

            }
            else if (EUserModel != null)
            {
                id = EUserModel.UserID;

            }

            login = dl.InsertUpdateProjectAssestment(assestemnt, "InsertProjectQuestionMap_USP", id, Convert.ToInt32(TempData["ProjectId"]));
            //if (CUserModel != null)
            //{


            //    //if (login != 0)
            //    //{
            //    //    Action = "Home";
            //    //    Controler = "Client";
            //    //    CUserModel.UM_AssesmentGiven = true;
            //    //}
            //}
            //else if (SUserModel != null)
            //{
            //    login = dl.InsertUpdateProjectAssestment(assestemnt, "InsertProjectQuestionMap_USP", SUserModel.UserID);
            //    //if (login != 0)
            //    //{
            //    //    Action = "Home";
            //    //    Controler = "SSME";
            //    //    SUserModel.UM_AssesmentGiven = true;
            //    //}
            //}
            return RedirectToAction("ProjectList", "Project");

            //  return RedirectToAction("ProjectAsessmentQuestion", new { id = Convert.ToInt32(TempData["ProjectId"] ) });
        }

        public List<QuestionCategoryModel> GetProjectQuestionCategory()
        {
            DAL dl = new DAL();
            var questions = dl.GetQuestionsCaterory("Project");
            List<QA> model = new List<QA>();
            return questions;
        }

       public List<ProjectQuestionView> GetProjectQuestionView(int? Id, int? userid, string type)
        {
            //if (type == "C")
            //{
            //    global.TransactionType = "SelectProjectQuestionForClient";

            //}
            if (type == "S")
            {
                global.TransactionType = "SelectProjectQuestionForSME";

            }
            else if (type == "E")
            {
                global.TransactionType = "SelectProjectQuestionForEmployee";

            }
            global.StoreProcedure = "ProjectWiseQuestion_USP";
            //global.TransactionType = "SelectProjectQuestion";
            global.param1 = "PWQ_ProjectId";
            global.param1Value = Id;
            global.param2 = "UserId";
            global.param2Value = userid;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            return ConvertDataTable<ProjectQuestionView>(ds.Tables[0]);
        }
        #endregion


        public ActionResult PerformanceIndicatorCard()
        {


            if (UserModel == null)
            {
                if (SUserModel == null)
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
                            global.UserID = EUserModel.EmpUnder;
                        }
                    }
                    else
                    {
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                        global.UserID = CUserModel.UserID;
                        global.param1 = "PE_ClientId";
                        global.param1Value = CUserModel.UM_MainID;
                    }

                }
                else
                {
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                    global.param1 = "PE_ClientId";
                    global.param1Value = SUserModel.UM_MainID;
                }
            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;


            }
            global.StoreProcedure = "ProjectEntry_USP";


            global.TransactionType = "SelectCardPerformance";


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectIndicator indicator = new ProjectIndicator();
            indicator = GetItem1<ProjectIndicator>(ds.Tables[0]);
            indicator.ProjectList = ConvertDataTable<ProjectEntry>(ds.Tables[1]);

            return View(indicator);
        }
        public ActionResult  ProjectPlanningList(int ?Id)
        {
            if (UserModel == null)
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
                        if (EUserModel.IsSuper == true)
                        {
                            global.TransactionType = "Select";
                            global.param2 = "UserId";
                            global.param2Value = EUserModel.EmpUnder;
                        }
                        else
                        {
                            global.TransactionType = "Select";
                            global.param2 = "UserId";
                            global.param2Value = EUserModel.UserID;
                        }


                    }
                }
                else
                {
                    global.TransactionType = "Select";
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.param2 = "UserId";
                    global.param2Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.TransactionType = "Select";
            }
            DataTable dt = new DataTable();
            ProjectPhase phase = new ProjectPhase();

            global.StoreProcedure = "ProjectPhase_USP";


            global.param1 = "PP_ProjectId";
            global.param1Value = Id;
            ViewBag.Projectid = Id;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                phase.projectPhase = ConvertDataTable<ProjectPhase>(ds.Tables[0]);
            phase.projectTaskWisePase = ConvertDataTable<ProjectTaskWisePase>(ds.Tables[1]);
            phase.projectTaskWiseSMME = ConvertDataTable<ProjectWiseSMME>(ds.Tables[2]);

            var List = phase;


            return View(List);
        }

        public ActionResult ProjectTaskManagement()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
                else
                {
                    global.TransactionType = "SelectProjectWiseActivity";
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    
                    global.param1Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
               
                global.FYId = UserModel.FyId;
                global.TransactionType = "SelectProjectWiseActivity";
            }
            DataTable dt = new DataTable();
            ProjectEntry project = new ProjectEntry();

            global.StoreProcedure = "ProjectWiseTask_USP";


            global.param1 = "UserId";
           
           

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
              project.projectEntries=ConvertDataTable<ProjectEntry>(ds.Tables[0]);
              project.projectWiseTasks = ConvertDataTable<ProjectWiseTask>(ds.Tables[1]);
              project.projectTaskWiseSMME = ConvertDataTable<ProjectWiseSMME>(ds.Tables[2]);
            var List = project;


            return View(List);
        }





    }
}