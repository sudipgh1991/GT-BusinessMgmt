using BOD_DAL;
using BOD_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using System.Reflection;
//using BOD_DAL.Model;
namespace BOD_APP.Controllers
{
    public class HomeController : Controller
    {
        public static UserModel UserModel { get; set; }
        public static UserModel CUserModel { get; set; }
        public static UserModel SUserModel { get; set; }
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
            SUserModel = (UserModel)System.Web.HttpContext.Current.Session["SMUserDataModel"];
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            CUserModel = (UserModel)System.Web.HttpContext.Current.Session["CUserDataModel"];
            EUserModel = (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];

        }


        public HomeController()
        {
            GetSession();

        }

        public ActionResult Home()
        {
            //if (UserModel == null)
            //{
            //    return RedirectToAction("AdminLogin", "Account");
            //}


            return View();
        }
        public ActionResult DemoEntry()
        {
            //if (UserModel == null)
            //{
            //    return RedirectToAction("AdminLogin", "Account");
            //}


            return View();
        }
        public ActionResult DemoList()
        {
            //if (UserModel == null)
            //{
            //    return RedirectToAction("AdminLogin", "Account");
            //}


            return View();
        }


        public ActionResult DemoList2()
        {
            //if (UserModel == null)
            //{
            //    return RedirectToAction("AdminLogin", "Account");
            //}


            return View();
        }
        public ActionResult UserLayout()
        {
            UserModel = (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
            return PartialView(UserModel);
        }


        public ActionResult UserNameLayout()
        {
            return View(UserModel);
        }

        public ActionResult CompanyMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AdminLogin", "Account");
            }
            return View();
        }

        public ActionResult ProjectCategoryMaster()
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
            return View();
        }
        public ActionResult ProjectIndustryMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            return View();
        }
        public ActionResult ProjectTypeMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            return View();
        }
        public ActionResult ProjectCategoryMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "PCM_Id" };
         
            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ProjectCategoryMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<ProjectCategoryMaster>(global);

            return View(List);
        }
        public ActionResult ProjectIndustryMasterList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            String[] stringarr = new String[] { "PIM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ProjectIndustryMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<ProjectIndustryMaster>(global);

            return View(List);

        }
        public ActionResult ProjectTypeMasterList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            String[] stringarr = new String[] { "PTM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ProjectTypeMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<ProjectTypeMaster>(global);

            return View(List);

        }
        public ActionResult CorporateClient()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();
        }
        public ActionResult CorporateClientList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            DataTable dt = new DataTable();
            List<CorporateClient> lst = new List<CorporateClient>();

            global.StoreProcedure = "CorporateClient_USP";
            global.TransactionType = "Select";
            global.param1 = "CC_Id";
            global.param1Value = null;
            global.CompanyID = UserModel.CompanyID;
            global.FYId = UserModel.FyId;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<CorporateClient>(ds.Tables[0]);

            var List = lst;

            return View(List);



        }

        public ActionResult QuestionMaster()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }
            return View();
        }
        public ActionResult QuestionMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "QM_Id" };
           
            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "QuestionMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<QuestionMaster>(global);

            return View(List);
        }
        public ActionResult SSME()
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


            return View();
        }
        public ActionResult SSMEList()
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
                    global.TransactionType = "SelectCorpWiseSMME";
                    global.param1 = "CWS_ClientId";
                    global.param1Value = EUserModel.EmpUnder;
                }

                    
                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.TransactionType = "SelectCorpWiseSMME";
                    global.param1 = "CWS_ClientId";
                    global.param1Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.TransactionType = "Select";
                global.param1 = "SSME_Id";
                global.param1Value = null;
            }

            DataTable dt = new DataTable();
            SSME lst = new SSME();

            global.StoreProcedure = "SSME_USP";


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);


            
            lst = GetItem1<SSME>(ds.Tables[1]);
            lst.ssmeList = ConvertDataTable<SSME>(ds.Tables[0]);
            var List = lst;

            return View(List);



        }

        public ActionResult CorporateClientProfile(int? clientid)
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

            ViewBag.Id = clientid;
            DataTable dt = new DataTable();
            ProjectEntry lst = new ProjectEntry();

            global.StoreProcedure = "CorporateClientProfile_USP";
            global.TransactionType = "Select";
            global.param1 = "CC_Id";
            global.param1Value = clientid;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    lst.corporateClients = ConvertDataTable<CorporateClient>(ds.Tables[0]);
                    lst.projectEntries = ConvertDataTable<ProjectEntry>(ds.Tables[1]);
                    lst.sSMEs = ConvertDataTable<SSME>(ds.Tables[2]);
                }
                catch (Exception ex)
                {

                }


            var List = lst;
            return View(List);
        }

        public ActionResult SMMEProfile(int? sm_id)
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

            ViewBag.Id = sm_id;
            DataTable dt = new DataTable();
            ProjectEntry lst = new ProjectEntry();

            global.StoreProcedure = "SMMEProfile_USP";
            global.TransactionType = "Select";
            global.param1 = "SM_Id";
            global.param1Value = sm_id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    lst.sSMEs = ConvertDataTable<SSME>(ds.Tables[0]);
                    lst.projectEntries = ConvertDataTable<ProjectEntry>(ds.Tables[1]);
                    lst.projectWiseTasks = ConvertDataTable<ProjectWiseTask>(ds.Tables[2]);
                }
                catch (Exception ex)
                {

                }


            var List = lst;
            return View(List);
        }

        public ActionResult IncomeTypeMaster()
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

            return View();

        }
        public ActionResult IncomeTypeMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "ITM_Id" };
           

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "IncomeTypeMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<IncomeTypeMaster>(global);

            return View(List);
        }
        public ActionResult IncomeContributerName()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }

            return View();

        }
        public ActionResult IncomeContributerNameList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                   
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
          
            String[] stringarr = new String[] { "UserId", "ICM_Id" };
           


            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "IncomeContributerName_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<IncomeContributerName>(global);

            return View(List);
        }
        public ActionResult EmpDesignation()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();

        }
        public ActionResult DepartmentMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();

        }
        public ActionResult TrainingTypeMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();

        }
        public ActionResult TrainingTypeMasterList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            String[] stringarr = new String[] { "TTM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "TrainingTypeMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<TrainingTypeMaster>(global);

            return View(List);
        }
        public ActionResult TrainingDocumentsMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();

        }
        public ActionResult TrainingDocumentsMasterList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            String[] stringarr = new String[] { "TDM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "TrainingDocumentsMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<TrainingDocumentsMaster>(global);

            return View(List);
        }

        public ActionResult ProvinceMaster()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }

            return View();

        }
        public ActionResult ProvinceMasterList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            String[] stringarr = new String[] { "PM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ProvinceMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<ProvinceMaster>(global);

            return View(List);
        }

        public ActionResult AccountingCode()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }
            return View();
        }

        public ActionResult AccountingCodeList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "AC_Id" };


            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "AccountingCode_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<AccountingCode>(global);

            return View(List);
        }

        public ActionResult QuestionCategory()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }
            return View();
        }

        public ActionResult QuestionCategoryList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "QC_Id" };
           

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "QuestionCategory_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<QuestionCategory>(global);

            return View(List);
        }


        public ActionResult ItemMaster()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }
            return View();
        }

        public ActionResult ItemMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId","IM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ItemMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;
           


            var List = DAL.GetGlobalMasterList<ItemMaster>(global);

            return View(List);
        }

        public ActionResult AsessmentQuestionView(int? Id, string name)
        {
            AssesmentView assView = new AssesmentView();
            if (UserModel == null)
            {
                if(CUserModel==null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
                
            }
            List<QuestionCategory> list = new List<QuestionCategory>();
            List<QuestionView> qsviewlist = new List<QuestionView>();
            assView.categotyList = GetQuestionCategory(Id, name);

            assView.qsView = GetQuestionView(Id, name);
            return View(assView);
        }
        public List<QuestionCategory> GetQuestionCategory(int? Id, string type)
        {
            if (type == "C")
            {
                global.StoreProcedure = "CorporateClient_USP";

                global.param1 = "CC_Id";
            }
            else
            {
                global.StoreProcedure = "SSME_USP";

                global.param1 = "SM_Id";

            }
            global.TransactionType = "SelectQsAssetmentCategory";
            global.param1Value = Id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            return ConvertDataTable<QuestionCategory>(ds.Tables[0]);
        }

        public List<QuestionView> GetQuestionView(int? Id, string type)
        {
            if (type == "C")
            {
                global.StoreProcedure = "CorporateClient_USP";

                global.param1 = "CC_Id";
            }
            else
            {
                global.StoreProcedure = "SSME_USP";

                global.param1 = "SM_Id";

            }
            global.TransactionType = "SelectQsAssetmentView";

            global.param1Value = Id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            return ConvertDataTable<QuestionView>(ds.Tables[0]);
        }

        public ActionResult Assesment()
        {
            List<QA> QA = new List<QA>();
            if (CUserModel != null)
            {

                QA = GetClientQuestion("C");
                ViewBag.QCategory = GetQuestionCategory();
            }
            else if (SUserModel != null)
            {
                QA = GetClientQuestion("S");
                ViewBag.QCategory = GetQuestionCategory();
            }
            return View(QA);
        }
        [HttpPost]
        public ActionResult Assesment(List<QA> QA)
        {
            string Action = "";
            string Controler = "";
            long login = 0;

            if (CUserModel != null)
            {

                login = dl.InsertUpdateQuestion(QA, "CorporateClient_USP", CUserModel.UserID);
                if (login != 0)
                {
                    Action = "Home";
                    Controler = "Client";
                    CUserModel.UM_AssesmentGiven = true;
                }
            }
            else if (SUserModel != null)
            {
                login = dl.InsertUpdateQuestion(QA, "SSME_USP", SUserModel.UserID);
                if (login != 0)
                {
                    Action = "Home";
                    Controler = "SSME";
                    SUserModel.UM_AssesmentGiven = true;
                }
            }
            return RedirectToAction(Action, Controler);
        }
        public List<QA> GetClientQuestion(string type)
        {
            DAL dl = new DAL();
            var questions = dl.GetQuestions(1, type);
            List<QA> model = new List<QA>();
            foreach (var item in questions)
            {
                model.Add(new QA()
                {
                    QAId = item.QM_ID,
                    Question = item.QM_Name,
                    Type = item.QM_Container,
                    QM_QC_Id = item.QM_QC_Id,
                    Required = item.Required
                });
            }
            return model;
        }


        public List<QuestionCategoryModel> GetQuestionCategory()
        {
            DAL dl = new DAL();
            var questions = dl.GetQuestionsCaterory("NonProject");
            List<QA> model = new List<QA>();
            return questions;
        }
        public ActionResult CorpProfile(int id)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
            }
            ViewBag.Id = id;
            
            global.StoreProcedure = "CorporateClient_USP";

            global.param1 = "CC_Id";
            global.TransactionType = "SelectForProfolie";

            global.param1Value = id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            CorporateClient corp = new CorporateClient();
            corp = GetItem1<CorporateClient>(ds.Tables[0]);
            corp.project = ConvertDataTable<ProjectEntry>(ds.Tables[1]);
            corp.smme = ConvertDataTable<SSME>(ds.Tables[2]);
            return View(corp);
        }
        public ActionResult SMMEProfileDetails(int id)
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

            ViewBag.Id = id;
            DataTable dt = new DataTable();
            SSME lst = new SSME();

            global.StoreProcedure = "SMMEProfile_USP";
            global.TransactionType = "Select";
            global.param1 = "SM_Id";
            global.param1Value = id;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    lst = GetItem1<SSME>(ds.Tables[0]);
                    lst.project = ConvertDataTable<ProjectEntry>(ds.Tables[1]);
                    lst.projecttask = ConvertDataTable<ProjectWiseTask>(ds.Tables[2]);
                }
                catch (Exception ex)
                {

                }


            var List = lst;
            return View(List);
        }
        public ActionResult OptionMaster()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }

            return View();

        }

        public ActionResult OptionMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "OM_Id" };
       

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "OptionMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<OptionMaster>(global);

            return View(List);
        }
        public ActionResult OptionTypeMaster()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }

            return View();

        }

        public ActionResult OptionTypeMasterList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "OTM_Id" };
           

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "OptionTypeMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<OptionTypeMaster>(global);

            return View(List);
        }
        public ActionResult EmployeeMaster()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }

            EmployeeViewModel empmodel = new EmployeeViewModel();
            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
            //return View();
        }
        public ActionResult EmployeeMasterList()
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);

        }

        public ActionResult SMMEWiseEmployeeList()
        {
            if (UserModel == null)
            {
                if (SUserModel == null)
                {
                    if (CUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectSMMWiseEmp";
            global.param1 = "UserId";
            global.param1Value = global.UserID;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<EmployeeMaster>(ds.Tables[0]);

            var List = lst;

            return View(List);

        }
        public ActionResult UserPermission(int? Id,string type,int ?SmId)
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
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            UserModel usr = new UserModel();
            if (Id == null)
            {
                if((type=="S")||SUserModel!=null)
                {
                    usr.mainmenuLst = dl.GetMainMenu(3, Convert.ToInt32(global.UserID));
                    usr.submenuList = dl.GetSubMenu(3, Convert.ToInt32(global.UserID));

                }
                else if ((CUserModel != null) || ((type != "S")))
                {
                    usr.mainmenuLst = dl.GetMainMenu(2, Convert.ToInt32(global.UserID));
                    usr.submenuList = dl.GetSubMenu(2, Convert.ToInt32(global.UserID));
                }
                else if ((EUserModel != null ) || ((type == "S")))
                {
                    usr.mainmenuLst = dl.GetMainMenu(3, Convert.ToInt32(global.UserID));
                    usr.submenuList = dl.GetSubMenu(3, Convert.ToInt32(global.UserID));
                }
                else if ((CUserModel != null) || ((type == "S")))
                {
                    usr.mainmenuLst = dl.GetMainMenu(3, Convert.ToInt32(global.UserID));
                    usr.submenuList = dl.GetSubMenu(3, Convert.ToInt32(global.UserID));
                }
                else if(UserModel !=null)
                {
                    usr.mainmenuLst = dl.GetMainMenu(1, Convert.ToInt32(global.UserID));
                    usr.submenuList = dl.GetSubMenu(1, Convert.ToInt32(global.UserID));

                }
            }
            else
            {
                global.StoreProcedure = "UserMaster_USP";
                global.TransactionType = "Select";
                global.param1 = "UM_UserId";
                if((SmId!=null)||(SmId>0))
                {

                    global.UserID = SmId;
                }

              
                    global.param1Value = global.UserID;
                
                global.param2 = "UM_Id";
                global.param2Value = Id;
                DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
                usr = GetItem1<UserModel>(ds.Tables[0]);
                if ((type == "S") || SUserModel != null)
                {
                   
                    usr.mainmenuLst = dl.GetMainMenuForUser(3, Convert.ToInt32(global.UserID), Id);
                    usr.submenuList = dl.GetSubMenuForUser(3, Convert.ToInt32(global.UserID), Id);

                }
                else if ((CUserModel != null) || ((type != "S") || (type != null)))
                {


                    usr.mainmenuLst = dl.GetMainMenuForUser(2, Convert.ToInt32(global.UserID), Id);
                    usr.submenuList = dl.GetSubMenuForUser(2, Convert.ToInt32(global.UserID), Id);
                }
                else if ((EUserModel != null) || ((type == "S")))
                {
                   

                    usr.mainmenuLst = dl.GetMainMenuForUser(3, Convert.ToInt32(global.UserID), Id);
                    usr.submenuList = dl.GetSubMenuForUser(3, Convert.ToInt32(global.UserID), Id);
                }
                else if ((CUserModel != null) || ((type == "S")))
                {
                    
                    usr.mainmenuLst = dl.GetMainMenuForUser(3, Convert.ToInt32(global.UserID), Id);
                    usr.submenuList = dl.GetSubMenuForUser(3, Convert.ToInt32(global.UserID), Id);
                }
                else if (UserModel != null)
                {
                   
                    usr.mainmenuLst = dl.GetMainMenuForUser(1, Convert.ToInt32(global.UserID), Id);
                    usr.submenuList = dl.GetSubMenuForUser(1, Convert.ToInt32(global.UserID), Id);

                }

                
                ViewBag.userId = Id;
            }
            return View(usr);
        }

        public ActionResult UserList()
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
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            List<UserModel> usr = new List<UserModel>();
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            global.StoreProcedure = "UserMaster_USP";
            global.TransactionType = "SelectUserList";
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);
            usr = ConvertDataTable<UserModel>(ds.Tables[0]);

            return View(usr);
        }
        public ActionResult Calender()
        {
            return View();
        }
        public ActionResult SalarySettings()
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
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<EmployeeMaster>(ds.Tables[0]);

            var List = lst;

            return View(List);
        }
      

        public ActionResult SalaryTest()
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
                    }
                }
            }
            return View();
        }
        public ActionResult ProjectIndicatorType()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        return RedirectToAction("AppLogin", "Account");
                    }
                }

            }
            return View();
        }

        public ActionResult ProjectIndicatorTypeList()
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
                        String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                        global.paramValue = paramValuestr;
                    }
                }
                else
                {
                    String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                    global.paramValue = paramValuestr;
                }

            }
            String[] stringarr = new String[] { "UserId", "PIT_Id" };

            global.StoreProcedure = "ProjectIndicatorType_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;

            var List = DAL.GetGlobalMasterList<ProjectIndicatorType>(global);

            return View(List);
        }
        public ActionResult ProjectAssesmentType()
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
                            ViewBag.UserId = EUserModel.EmpUnder;
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        ViewBag.UserId = CUserModel.UserID;
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            return View();
        }
        public ActionResult ProjectAssesmentTypeList()
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
                            String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                            global.paramValue = paramValuestr;
                        }
                    }
                    else
                    {
                        String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                        global.paramValue = paramValuestr;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            String[] stringarr = new String[] { "UserId", "PAT_Id" };

            global.StoreProcedure = "ProjectAssesmentType_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;

            var List = DAL.GetGlobalMasterList<ProjectAssesmentType>(global);

            return View(List);
        }
        public ActionResult ProjectQuestionMaster()
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
                            ViewBag.UserId = EUserModel.EmpUnder;
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        ViewBag.UserId = CUserModel.UserID;
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            return View();
        }
        public ActionResult ProjectQuestionMasterList()
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
                            String[] paramValuestr = new String[] { Convert.ToString(EUserModel.EmpUnder), null };
                            global.paramValue = paramValuestr;
                        }
                    }
                    else
                    {
                        String[] paramValuestr = new String[] { Convert.ToString(CUserModel.UserID), null };
                        global.paramValue = paramValuestr;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            String[] stringarr = new String[] { "UserId", "PQM_Id" };

            // assign the value "Geeks" in array on its index 0

            global.StoreProcedure = "ProjectQuestionMaster_USP";
            global.TransactionType = "Select";
            global.Param = stringarr;


            var List = DAL.GetGlobalMasterList<ProjectQuestionMaster>(global);

            return View(List);
        }

        public ActionResult EmployeeSalarySettings()//EmployeeSalarySettings
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
        }
        public ActionResult EmployeeEducation()//EmployeeEducationDetails
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
        }
        public ActionResult EmployeeDocumentation()
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
        }//EmployeeDocumentation
        public ActionResult EmployeePrevEmployement()
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
        }//EmployeePrevEmployement
        public ActionResult EmployeeLeave()
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
            DataTable dt = new DataTable();
            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            EmployeeViewModel empmodel = new EmployeeViewModel();

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "Select";
            global.param1 = "UserId";
            global.param1Value = global.UserID;



            DataSet dsemplist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsemplist.Tables.Count > 0)
                empmodel.cList = ConvertDataTable<EmployeeMaster>(dsemplist.Tables[0]);

            global.StoreProcedure = "EmployeeMaster_USP";
            global.TransactionType = "SelectManagerList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            DataSet dsmanagerlist = dl.GetGlobalMasterTransactionSingle(global);

            if (dsmanagerlist.Tables.Count > 0)
                empmodel.managerList = ConvertDataTable<EmployeeMaster>(dsmanagerlist.Tables[0]);

            //var List = lst;

            return View(empmodel);
        }//EmployeeleaveSettings
        public ActionResult EmployeeSalary()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }
        public ActionResult EmployeeEducationDetails()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }
        public ActionResult EmployeeDocumentDetails()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }
        public ActionResult EmployeePreiviousEmploymentDetails()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }
        public ActionResult EmployeeLeaveSetting()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }
        
        public ActionResult AddTraining()
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
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            return View();
        }

        public ActionResult TrainingList()
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

            return View();

        }

        public ActionResult UploadFiles()
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

            return View();

        }

      
        public ActionResult NewForm()
        {
            return View();
        }



        public ActionResult DemoView()
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
                            global.UserID = EUserModel.EmpUnder;
                            global.CompanyID = EUserModel.CompanyID;
                            global.FYId = EUserModel.FyId;
                        }
                    }
                    else
                    {
                        global.UserID = CUserModel.UserID;
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                    }

                }
                else
                {
                    global.UserID = SUserModel.UserID;
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }
            }
            else
            {
                global.UserID = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }
            return View();
        }


        public ActionResult SMMECardList()
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
                        global.TransactionType = "SelectCorpWiseSMME";
                        global.param1 = "CWS_ClientId";
                        global.param1Value = EUserModel.EmpUnder;
                    }


                }
                else
                {
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                    global.TransactionType = "SelectCorpWiseSMME";
                    global.param1 = "CWS_ClientId";
                    global.param1Value = CUserModel.UserID;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.TransactionType = "Select";
                global.param1 = "SSME_Id";
                global.param1Value = null;
            }

            DataTable dt = new DataTable();
            List<SSME> lst = new List<SSME>();
            SSME SSMEobj = new SSME();

            global.StoreProcedure = "SSME_USP";


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                SSMEobj.ssmeList = ConvertDataTable<SSME>(ds.Tables[0]);
                //lst = ConvertDataTable<SSME>(ds.Tables[0]);
            SSMEobj.empList = ConvertDataTable<EmployeeMaster>(ds.Tables[2]);

            var List = SSMEobj;

            return View(List);

        }


        public ActionResult CorporateClientCardList()
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            DataTable dt = new DataTable();
            CorporateClient corpobj = new CorporateClient();
            List<CorporateClient> lst = new List<CorporateClient>();

            global.StoreProcedure = "CorporateClient_USP";
            global.TransactionType = "Select";
            global.param1 = "CC_Id";
            global.param1Value = null;
            global.CompanyID = UserModel.CompanyID;
            global.FYId = UserModel.FyId;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                corpobj.clinetList = ConvertDataTable<CorporateClient>(ds.Tables[0]);
                corpobj.empList = ConvertDataTable<EmployeeMaster>(ds.Tables[2]);

                var List = corpobj;

            return View(List);



        }

        public ActionResult TrainingPhase()
        {
            return View();
        }

        public ActionResult EventCalender()
        {
            return View();
        }

        public ActionResult ProjectDemo()
        {
            return View();
        }

        public ActionResult ClientWiseSMME2()
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
            return View();
        }

        public ActionResult EmpLeaveApplicationList()
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
                            global.EmpID = EUserModel.UM_MainID;
                        }
                    }
                    else
                    {
                        global.CompanyID = CUserModel.CompanyID;
                        global.FYId = CUserModel.FyId;
                        global.UserID = CUserModel.UserID;
                        global.EmpID = CUserModel.UM_MainID;
                    }

                }
                else
                {
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                    global.UserID = SUserModel.UserID;
                    global.EmpID = SUserModel.UM_MainID;
                }
            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.UserID = UserModel.UserID;
                global.EmpID = UserModel.UM_MainID;
            }
            DataTable dt = new DataTable();
            List<EmployeeLeaveApproval> lst = new List<EmployeeLeaveApproval>();

            global.StoreProcedure = "EmpLeaveApplication_USP";
            global.TransactionType = "SelectList";
            global.param1 = "UserId";
            global.param1Value = global.UserID;
            global.param2 = "ELA_EM_Id";
            global.param2Value = global.EmpID;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<EmployeeLeaveApproval>(ds.Tables[0]);

            var List = lst;

            return View(List);

        }

    

    

        public ActionResult EmployeeLeaveApplication()
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
                    global.CompanyID = SUserModel.CompanyID;
                    global.FYId = SUserModel.FyId;
                }

            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;

            }
            return View();
        }


        public ActionResult EmployeeLeaveDetails()
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
            //DataTable dt = new DataTable();
            EmployeeLeaveViewModel model = new EmployeeLeaveViewModel();
            //EmployeeLeaveDetails lst = new EmployeeLeaveDetails();

            global.StoreProcedure = "EmpLeaveApplication_USP";
            global.TransactionType = "Selectleave";
            global.param1 = "ELA_EM_Id";
            global.param1Value = global.UserID;
            global.param2 = "ELA_ELS_Id";
            global.param2Value = 5;

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                model.BalanceLeaveList = ConvertDataTable<EmployeeLeaveDetails>(ds.Tables[0]);
            model.LeaveList = ConvertDataTable<EmployeeLeaveApproval>(ds.Tables[1]);

            return View(model);

        }


    }
}