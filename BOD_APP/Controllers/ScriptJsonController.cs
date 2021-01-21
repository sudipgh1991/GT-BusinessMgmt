
using BOD_DAL;
using System;
using System.Collections.Generic;
using System.Data;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using BOD_DAL.Models;
using System.IO;
using System.Reflection;
using System.Web;
using System.Net;
using Newtonsoft.Json;

namespace BOD_APP.Controllers
{
    public class ScriptJsonController : Controller
    {

        //  ScriptJson Controller Only for ajax post and get data 
        DAL dl = new DAL();
        JavaScriptSerializer jsSerializer = new JavaScriptSerializer();
        List<Dictionary<string, object>> parentRow = new List<Dictionary<string, object>>();
        Dictionary<string, object> childRow;

        public static UserModel UserModel { get; set; }
        public static UserModel CUserModel { get; set; }
        public static UserModel SUserModel { get; set; }
        public static UserModel EUserModel { get; set; }

        public GlobalData global = new GlobalData();
        public static DataTable dt = new DataTable();

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
            SUserModel = (UserModel)System.Web.HttpContext.Current.Session["SMUserDataModel"];
            EUserModel = (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];
        }
        public ScriptJsonController()
        {
            GetSession();
        }

        #region DropDownPopulation

        [HttpPost]
        public JsonResult DropDownPopulation(DDLList data)
        {
            List<DDLList> ddlList = dl.GetDDLList(data);
            return Json(ddlList, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult DropDownJoinPopulation(DDLJoinList data)
        {
            List<DDLJoinList> ddlList = dl.GetDDLJoinList(data);
            return Json(ddlList, JsonRequestBehavior.AllowGet);

        }
        #endregion
        #region GetGlobalList

        [HttpPost]
        public JsonResult GetGlobalList(GlobalData global)
        {
            DataTable dt = new DataTable();
            global.CompanyID = UserModel.CompanyID;
            dt = DAL.GetGlobalMasterList(global);


            foreach (DataRow row in dt.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            var SRecords = dt;

            string GlobalData = jsSerializer.Serialize(parentRow);
            return Json(GlobalData, JsonRequestBehavior.AllowGet);

        }
        #endregion
        #region GetGlobalMaster

        #region GetGlobalMasterTransactionSingle1

        [HttpPost]
        public JsonResult GetGlobalMasterTransactionSingle1(GlobalData global)
        {
            DataSet ds = new DataSet();
            global.CompanyID = UserModel.CompanyID;


            ds = dl.GetGlobalMasterTransactionSingle1(global);


            foreach (DataRow row in ds.Tables[0].Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in ds.Tables[0].Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }
                parentRow.Add(childRow);
            }
            var SRecords = ds;

            return Json(SRecords, JsonRequestBehavior.AllowGet);
        }
        #endregion
        //[JsonNetFilter]
        [HttpPost]
        public JsonResult GetGlobalMaster(GlobalData global)
        {
            DataTable dt = new DataTable();


            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                        // return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        global.UserID = EUserModel.EmpUnder;
                    }

                }
                else
                {
                    global.UserID = CUserModel.UserID;

                }
            }
            else
            {
                global.UserID = UserModel.UserID;

            }
               
          

            dt = dl.GetGlobalMaster(global);


            foreach (DataRow row in dt.Rows)
            {
                childRow = new Dictionary<string, object>();
                foreach (DataColumn col in dt.Columns)
                {
                    childRow.Add(col.ColumnName, row[col]);
                }

            }
            var SRecords = dt;

            //string GlobalData = jsSerializer.Serialize(childRow);
            return Json(childRow, JsonRequestBehavior.AllowGet);

        }
        #endregion
        #region GlobalDeleteTrans

        public ActionResult GlobalDeleteTransaction(GlobalDelTrans del)
        {
            //entity.CompanyId = UserModel.CompanyID ?? 0;
            StatusResponse Status = new StatusResponse();
            try
            {
                del.CompanyId = Convert.ToInt32(UserModel.CompanyID);
                del.UserId = Convert.ToInt32(UserModel.UserID);
                del.FyId = Convert.ToInt32(UserModel.UserID);

                long id = dl.GlobalDeleteTransaction(del);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record Delete successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not Delete successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Validation

        [HttpPost]
        public JsonResult GetValidation(DDLList obj)
        {
            DDLList objectdata = dl.GetValidation(obj);
            return Json(objectdata, JsonRequestBehavior.AllowGet);

        }
        #endregion
        [HttpPost]
        public JsonResult GlobalDelete(GlobalDelete del)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                long id = dl.GlobalDelete(del);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record Deleted successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not Deleted successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        #region Masters
        [HttpPost]
        public ActionResult ProjectCategoryMaster(ProjectCategoryMaster entity)
        {


            StatusResponse Status = new StatusResponse();
            try
            {
                if (UserModel != null)
                {
                    entity.UserId = UserModel.UserID;
                }

                else if (CUserModel != null)
                {
                    entity.UserId = CUserModel.UserID;
                }
                else if (EUserModel != null)
                {
                    entity.UserId = EUserModel.EmpUnder;
                }
                else
                {
                    entity.UserId = SUserModel.UserID;

                }
                long id = DAL.InsertUpdate<ProjectCategoryMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ProjectIndustryMaster(ProjectIndustryMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<ProjectIndustryMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ProjectTypeMaster(ProjectTypeMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<ProjectTypeMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult EmpDesignation(EmpDesignation entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<EmpDesignation>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult DepartmentMaster(DepartmentMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<DepartmentMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult TrainingTypeMaster(TrainingTypeMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                if (UserModel != null)
                {
                    entity.UserId = UserModel.UserID;
                }

                else if (CUserModel != null)
                {
                    entity.UserId = CUserModel.UserID;
                }
                else if (EUserModel != null)
                {
                    entity.UserId = EUserModel.EmpUnder;
                }
                else
                {
                    entity.UserId = SUserModel.UserID;

                }
                long id = DAL.InsertUpdate<TrainingTypeMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult ProvinceMaster(ProvinceMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<ProvinceMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult IncomeTypeMaster(IncomeTypeMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                if (UserModel != null)
                {
                    entity.UserId = UserModel.UserID;
                }

                else if (CUserModel != null)
                {
                    entity.UserId = CUserModel.UserID;
                }
                else if (EUserModel != null)
                {
                    entity.UserId = EUserModel.EmpUnder;
                }
                else
                {
                    entity.UserId = SUserModel.UserID;

                }
                long id = DAL.InsertUpdate<IncomeTypeMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult TrainingDocumentsMaster(TrainingDocumentsMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                if (UserModel != null)
                {
                    entity.UserId = UserModel.UserID;
                }

                else if (CUserModel != null)
                {
                    entity.UserId = CUserModel.UserID;
                }
                else if (EUserModel != null)
                {
                    entity.UserId = EUserModel.EmpUnder;
                }
                else
                {
                    entity.UserId = SUserModel.UserID;

                }
                long id = DAL.InsertUpdate<TrainingDocumentsMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult IncomeContributerName(IncomeContributerName entity)
        {
            if (UserModel != null)
            {
                entity.UserId = UserModel.UserID;
            }

            else if (CUserModel != null)
            {
                entity.UserId = CUserModel.UserID;
            }
            else if (EUserModel != null)
            {
                entity.UserId = EUserModel.EmpUnder;
            }
            else
            {
                entity.UserId = SUserModel.UserID;

            }
            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<IncomeContributerName>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        #endregion

        [HttpPost]
        public JsonResult InsertUpdateCorporateClient(CorporateClient client)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {
                        client.CC_CompanyId = Convert.ToInt64(CUserModel.CompanyID);
                        client.CC_FyId = Convert.ToInt64(CUserModel.FyId);
                        client.UserId = CUserModel.UserID;

                    }
                }
                else
                {
                    client.CC_CompanyId = Convert.ToInt64(UserModel.CompanyID);
                    client.CC_FyId = Convert.ToInt64(UserModel.FyId);
                    client.UserId = UserModel.UserID;
                }





                long id = dl.InsertUpdateCorporateClient(client);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetSelectCorporateClient(GlobalData global)
        {

            if (UserModel == null)
            {
                if (CUserModel != null)
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


            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);


            CorporateClient client = new CorporateClient();
            client = GetItem1<CorporateClient>(ds.Tables[0]);

            client.CorporateClientDocumentList = ConvertDataTable<CorporateClientDocument>(ds.Tables[1]);
            var GlobalData = client;
            var jsonResult = Json(GlobalData, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
           
           

        }
        [HttpPost]
        public JsonResult InsertUpdateProjectEntry(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel != null)
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                else if (CUserModel != null)
                {
                    project.CompanyID = CUserModel.CompanyID;
                    project.UserId = CUserModel.UserID;
                    project.FYId = CUserModel.FyId;
                    project.role = "C";
                }

                else if (EUserModel != null)
                {
                    project.CompanyID = EUserModel.CompanyID;
                    project.UserId = EUserModel.UserID;
                    project.FYId = EUserModel.FyId;
                    project.role = "E";
                }
                else
                {
                    project.CompanyID = SUserModel.CompanyID;
                    project.UserId = SUserModel.UserID;
                    project.FYId = SUserModel.FyId;

                }
                long id = dl.InsertUpdateProjectEntry(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult QuestionMaster(QuestionMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<QuestionMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult AccountingCode(AccountingCode entity)
        {

            if (UserModel != null)
            {
                entity.UserId = UserModel.UserID;
            }

            else if (CUserModel != null)
            {
                entity.UserId = CUserModel.UserID;
            }
            else if (EUserModel != null)
            {
                entity.UserId = EUserModel.EmpUnder;
            }
            else
            {
                entity.UserId = SUserModel.UserID;

            }
            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<AccountingCode>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult QuestionCategory(QuestionCategory entity)
        {


            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<QuestionCategory>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ItemMaster(ItemMaster entity)
        {
            if (UserModel != null)
            {
                entity.UserId = UserModel.UserID;
            }

            else if (CUserModel != null)
            {
                entity.UserId = CUserModel.UserID;
            }
            else if (EUserModel != null)
            {
                entity.UserId = EUserModel.EmpUnder;
            }
            else
            {
                entity.UserId = SUserModel.UserID;

            }
            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<ItemMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult InsertUpdateProjectExpenses(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectExpenses(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetProjectWiseExpenses(GlobalData global)
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
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.ExpensesList = ConvertDataTable<ProjectWiseExpenses>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult InsertUpdateSSME(SSME ssme)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {
                        ssme.SM_CompanyId = CUserModel.CompanyID;
                        ssme.UserId = CUserModel.UserID;
                        ssme.SM_FyId = CUserModel.FyId;
                        ssme.InputFrom = "C";

                    }
                    else
                    {
                        ssme.SM_CompanyId = SUserModel.CompanyID;
                        ssme.UserId = SUserModel.UserID;
                        ssme.SM_FyId = SUserModel.FyId;
                    }
                }
                else
                {
                    ssme.SM_CompanyId = UserModel.CompanyID;
                    ssme.UserId = UserModel.UserID;
                    ssme.SM_FyId = UserModel.FyId;
                }




                long id = dl.InsertUpdateSSME(ssme);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult GetSelectSSME(GlobalData global)
        {

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);


            SSME ssme = new SSME();
            ssme = GetItem1<SSME>(ds.Tables[0]);


            ssme.SMMEDocumentList = ConvertDataTable<SSMEDocument>(ds.Tables[2]);


            var GlobalData = ssme;
            return Json(GlobalData, JsonRequestBehavior.AllowGet);

        }


        #region  Fund Grant
        [HttpPost]
        public JsonResult InsertUpdateProjectFundGrant(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectFundGrant(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProjectWiseFundGrant(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.FundGrants = ConvertDataTable<ProjectWiseJobsFundGrant>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion


        #region  Own Funding Contributions
        [HttpPost]
        public JsonResult InsertUpdateProjectOwnFundingContributions(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectOwnFundingContributions(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProjectWiseOwnFundingContributions(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.OwnFundingContributions = ConvertDataTable<OwnFundingContributions>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion


        #region  Other Contributions
        [HttpPost]
        public JsonResult InsertUpdateOtherContributions(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateOtherContributions(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetOtherContributions(GlobalData global)
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
                    global.CompanyID = CUserModel.UserID;
                    global.FYId = CUserModel.FyId;
                }
            }
            else
            {
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
                global.CompanyID = UserModel.UserID;
            }
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.OtherContributions = ConvertDataTable<OtherContributions>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region  Loan Financing
        [HttpPost]
        public JsonResult InsertUpdateLoanFinancing(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateLoanFinancing(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetLoanFinancing(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.LoanFinancing = ConvertDataTable<LoanFinancing>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region  In Kind Contributions
        [HttpPost]
        public JsonResult InsertUpdateInKindContributions(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateInKindContributions(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetInKindContributions(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.InKindContributions = ConvertDataTable<InKindContributions>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region  OtherEarnings
        [HttpPost]
        public JsonResult InsertUpdateOtherEarnings(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateOtherEarnings(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetOtherEarnings(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.OtherEarnings = ConvertDataTable<OtherEarnings>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region  InterestIncome
        [HttpPost]
        public JsonResult InsertUpdateInterestIncome(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateInterestIncome(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetInterestIncome(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.InterestIncome = ConvertDataTable<InterestIncome>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region  ProjectWiseSMME
        [HttpPost]
        public JsonResult InsertUpdateProjectWiseSMME(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                    else if (EUserModel != null)
                    {
                        project.CompanyID = EUserModel.CompanyID;
                        project.UserId = EUserModel.EmpUnder;
                        project.FYId = EUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectWiseSMME(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        #endregion
        #region  ProjectWiseTask
        [HttpPost]
        public JsonResult InsertUpdateProjectWiseTask(ProjectWiseTask project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyId = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FyId = CUserModel.FyId;
                    }
                    else if (EUserModel != null)
                    {

                        project.CompanyId = EUserModel.CompanyID;
                        project.UserId = EUserModel.EmpUnder;
                        project.FyId = EUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyId = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FyId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectWiseTask(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        #endregion

        #region  ProjectWiseTask
        [HttpPost]
        public JsonResult InsertUpdateProjectTaskWiseSMME(ProjectWiseTask project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyId = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FyId = CUserModel.FyId;
                    }
                    else if (EUserModel != null)
                    {

                        project.CompanyId = EUserModel.CompanyID;
                        project.UserId = EUserModel.EmpUnder;
                        project.FyId = EUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyId = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FyId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectTaskWiseSMME(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        #endregion
        #region Budget
        [HttpPost]
        public ActionResult GetAllMonths(GlobalData global)
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    return RedirectToAction("AppLogin", "Account");
                }
                else
                {

                    //global.param1Value = UserModel.FyId;
                }
            }
            else
            {
                //global.param1Value = UserModel.FyId;
            }
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project.BudgetMonthList = ConvertDataTable<BudgetMonthList>(ds.Tables[0]);//List view          

            return Json(project.BudgetMonthList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult InsertUpdateBudget(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateBudget(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public ActionResult GetBudgets(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectEntry project = new ProjectEntry();
            project = GetItem1<ProjectEntry>(ds.Tables[0]);//Single Row 
            project.BudgetReturnData = ConvertDataTable<BudgetReturnData>(ds.Tables[1]);//List view 
            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion
        #region Income Budget
        [HttpPost]
        public JsonResult InsertUpdateIncomeBudget(ProjectIncomeBudget project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateIncomeBudget(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetIncomeBudgets(GlobalData global)
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
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectIncomeBudget project = new ProjectIncomeBudget();
            try
            {

                project = GetItem1<ProjectIncomeBudget>(ds.Tables[0]);//Single Row 
                project.BudgetReturnData = ConvertDataTable<IncomeBudgetReturnData>(ds.Tables[1]);//List view 
            }
            catch (Exception ex)
            {

            }

            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region  clientWiseSMME
        [HttpPost]
        public JsonResult InsertUpdateClienttWiseSMME(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                    else if (EUserModel != null)
                    {

                        project.CompanyID = EUserModel.CompanyID;
                        project.UserId = EUserModel.UserID;
                        project.FYId = EUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateClienttWiseSMME(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        public JsonResult ClientWiseSMME(GlobalData global)
        {
            DataTable dt = new DataTable();
            ClientWiseSSME lst = new ClientWiseSSME();
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);
            if (ds.Tables.Count > 0)
                // lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[1]);
                try
                {
                    lst.SmmeList = ConvertDataTable<ClientWiseSSME>(ds.Tables[0]);
                }
                catch (Exception ex)
                {

                }


            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }




        #endregion
        [HttpPost]
        public ActionResult GetProjectWiseTaskComment(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectTaskWiseComment projectTaskWiseComment = new ProjectTaskWiseComment();
            projectTaskWiseComment = GetItem1<ProjectTaskWiseComment>(ds.Tables[0]);//Single Row 
            projectTaskWiseComment.cmmntlist = ConvertDataTable<ProjectTaskWiseComment>(ds.Tables[1]);//List view 
            var Srecord = projectTaskWiseComment;
            return Json(Srecord, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult InsertUpdateProjectTaskWiseComment(ProjectTaskWiseComment project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (SUserModel != null)
                    {
                      project.UserId = SUserModel.UserID;

                    }
                    else if (EUserModel != null)
                    {
                        project.UserId = EUserModel.UserID;
                    }
                    else if (CUserModel != null)
                    {
                        project.UserId = CUserModel.UserID;
                    }
                }
                else
                {

                    project.UserId = UserModel.UserID;

                }

                long id = dl.InsertUpdateProjectWiseTaskComment(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult OptionTypeMaster(OptionTypeMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<OptionTypeMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult OptionMaster(OptionMaster entity)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = DAL.InsertUpdate<OptionMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        #region InsertUpdateEmployeeMaster

        //[HttpPost]
        // new function for date field mm/dd/yyyy
        //public JsonResult InsertUpdateEmployeeMasterPost(EmployeeMaster emp)
        //{
        //    StatusResponse Status = new StatusResponse();
        //    try
        //    {
        //        if (emp.UserID == 0 || emp.UserID == null)
        //        {

        //            if (CUserModel == null)
        //            {
        //                if (SUserModel != null)
        //                {

        //                    emp.UserID = SUserModel.UserID;

        //                }
        //                else if (EUserModel != null)
        //                {
        //                    emp.UserID = EUserModel.EmpUnder;
        //                }
        //                else if (UserModel != null)
        //                {
        //                    emp.UserID = UserModel.UserID;
        //                }
        //            }
        //            else
        //            {

        //                emp.UserID = CUserModel.UserID;

        //            }
        //        }
        //        long id = dl.InsertUpdateEmployeeMaster(emp);
        //        if (id > 0)
        //        {
        //            Status.Id = id;
        //            Status.ExMessage = "";
        //            Status.IsSuccess = true;
        //            Status.Message = "Record saved successfully...";
        //        }
        //        else
        //        {
        //            Status.Id = id;
        //            Status.ExMessage = "";
        //            Status.IsSuccess = true;
        //            Status.Message = "Record not saved successfully...";
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        Status.Id = -1;
        //        Status.IsSuccess = false;
        //        Status.ExMessage = ex.Message;
        //        Status.Message = "Process falils...";
        //    }
        //    return Json(Status, JsonRequestBehavior.AllowGet);
        //}

        [HttpPost]
        public ActionResult Upload()
        {
            // Checking no of files injected in Request object  
            if (Request.Files.Count > 0)
            {
                try
                {
                    //  Get all files from Request object  
                    HttpFileCollectionBase files = Request.Files;
                    for (int i = 0; i < files.Count; i++)
                    {
                        //string path = AppDomain.CurrentDomain.BaseDirectory + "Uploads/";  
                        //string filename = Path.GetFileName(Request.Files[i].FileName);  

                        HttpPostedFileBase file = files[i];
                        string fname;

                        // Checking for Internet Explorer  
                        if (Request.Browser.Browser.ToUpper() == "IE" || Request.Browser.Browser.ToUpper() == "INTERNETEXPLORER")
                        {
                            string[] testfiles = file.FileName.Split(new char[] { '\\' });
                            fname = testfiles[testfiles.Length - 1];
                        }
                        else
                        {
                            fname = file.FileName;
                        }

                        // Get the complete folder path and store the file inside it.  
                        fname = Path.Combine(Server.MapPath("../Content/images/"), fname);
                        file.SaveAs(fname);
                    }
                    // Returns message that successfully uploaded  
                    return Json("File Uploaded Successfully!");
                }
                catch (Exception ex)
                {
                    return Json("Error occurred. Error details: " + ex.Message);
                }
            }
            else
            {
                return Json("No files selected.");
            }
        }

        #endregion
        #region GetEmployeeMasterSingle
        [HttpPost]
        public JsonResult GetEmployeeMaster(EmployeeMaster emp)
        {
            EmployeeMaster employeObj = new EmployeeMaster();

            employeObj = dl.GetEmployeeMasterSingle(emp);
            employeObj.empList = dl.GetEmployeeMasterTransactionList(emp.EM_EmpId);
            employeObj.List = dl.GetExamDetailsMasterTransactionList(emp.EM_EmpId);
            employeObj.PrevWorkingList = dl.GetEmployeeMasterPrevWorkingList(emp.EM_EmpId);

            return Json(employeObj, JsonRequestBehavior.AllowGet);
        }

        #endregion
        [HttpPost]
        public JsonResult GetMonthWiseIncomeGraphPoint()
        {
            DataSet ds = new DataSet();

            if (CUserModel != null)
            {


                global.CompanyID = CUserModel.CompanyID;
                global.FYId = CUserModel.FyId;

                global.param1 = "UserId";
                global.param1Value = CUserModel.UserID;



            }
            global.TransactionType = "SelectIncome";
            global.StoreProcedure = "ClientDashboard_USP";
            ds = dl.GetGlobalMasterTransactionSingle(global);
            List<CorpDashIncomeExpenesGraph> dashBoard = new List<CorpDashIncomeExpenesGraph>();

            dashBoard = ConvertDataTable<CorpDashIncomeExpenesGraph>(ds.Tables[0]);
            CorpDashIncomeExpenesGraph[] dash1 = dashBoard.ToArray();
            //return new JavaScriptSerializer().Serialize(dash1);

            return Json(JsonConvert.SerializeObject(dash1), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetMonthWiseExpensesGraphPoint()
        {
            DataSet ds = new DataSet();

            if (CUserModel != null)
            {


                global.CompanyID = CUserModel.CompanyID;
                global.FYId = CUserModel.FyId;

                global.param1 = "UserId";
                global.param1Value = CUserModel.UserID;



            }
            global.TransactionType = "SelectExpenses";
            global.StoreProcedure = "ClientDashboard_USP";
            ds = dl.GetGlobalMasterTransactionSingle(global);
            List<CorpDashIncomeExpenesGraph> dashBoard = new List<CorpDashIncomeExpenesGraph>();

            dashBoard = ConvertDataTable<CorpDashIncomeExpenesGraph>(ds.Tables[0]);
            CorpDashIncomeExpenesGraph[] dash1 = dashBoard.ToArray();
            //return new JavaScriptSerializer().Serialize(dash1);

            return Json(JsonConvert.SerializeObject(dash1), JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult InsertUpdateUser(UserModel entity)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                long id = dl.InsertUpdateUser(entity);
                if (id > 0)
                {
                    Status.Id = 1;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult InsertUpdateProjectWiseEmp(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (SUserModel != null)
                    {
                        project.UserId = SUserModel.UserID;

                    }
                    else if (EUserModel != null)
                    {
                        project.UserId = EUserModel.UserID;
                    }
                    else if (CUserModel != null)
                    {
                        project.UserId = CUserModel.UserID;
                    }
                }
                else
                {

                    project.UserId = UserModel.UserID;

                }

                long id = dl.InsertUpdateProjectWiseEmp(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult InsertUpdateProjectTaskWiseEmp(ProjectEntry project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (SUserModel != null)
                    {
                        project.UserId = SUserModel.UserID;

                    }
                    else if (EUserModel != null)
                    {
                        project.UserId = EUserModel.UserID;
                    }
                    else if (CUserModel != null)
                    {
                        project.UserId = CUserModel.UserID;
                    }
                }
                else
                {

                    project.UserId = UserModel.UserID;

                }

                long id = dl.InsertUpdateProjectTaskWiseEmp(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ProjectAssesmentType(ProjectAssesmentType entity)
        {
         
            StatusResponse Status = new StatusResponse();
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
                            entity.UserId = EUserModel.EmpUnder;
                        }
                    }
                    else
                    {
                        entity.UserId = CUserModel.UserID;
                    }
                }
                else
                {
                    entity.UserId = SUserModel.UserID;
                }

            }
            else
            {
                entity.UserId = UserModel.UserID;
            }

            try
            {
                if (UserModel != null)
                {
                    entity.UserId = UserModel.UserID;
                }

                else if (CUserModel != null)
                {
                    entity.UserId = CUserModel.UserID;
                }
                else if (EUserModel != null)
                {
                    entity.UserId = EUserModel.EmpUnder;
                }
                else
                {
                    entity.UserId = SUserModel.UserID;

                }

                long id = DAL.InsertUpdate<ProjectAssesmentType>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ProjectIndicatorType(ProjectIndicatorType entity)
        {

            StatusResponse Status = new StatusResponse();
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
                            entity.UserId = EUserModel.EmpUnder;
                        }
                    }
                    else
                    {
                        entity.UserId = CUserModel.UserID;
                    }
                }
                else
                {
                    entity.UserId = SUserModel.UserID;
                }

            }
            else
            {
                entity.UserId = UserModel.UserID;
            }

            try
            {
                long id = DAL.InsertUpdate<ProjectIndicatorType>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public ActionResult ProjectQuestionMaster(ProjectQuestionMaster entity)
        {
            StatusResponse Status = new StatusResponse();

            try
            {
                long id = DAL.InsertUpdate<ProjectQuestionMaster>(entity);
                if (id > 0)
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            finally
            {
                GC.Collect();
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult InsertUpdateAddTraining(AddTraining training)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {
                        training.CompanyId = Convert.ToInt32(CUserModel.CompanyID);

                        training.UserId = CUserModel.UserID;

                    }
                }
                else
                {
                    training.CompanyId = Convert.ToInt32(UserModel.CompanyID);

                    training.UserId = UserModel.UserID;
                }





                long id = dl.InsertUpdateAddTraining(training);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetSelectTraining(GlobalData global)
        {

            if (UserModel == null)
            {
                if (CUserModel != null)
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


            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);


            AddTraining training = new AddTraining();
            training = GetItem1<AddTraining>(ds.Tables[0]);


            var GlobalData = training;
            return Json(GlobalData, JsonRequestBehavior.AllowGet);

        }
        [HttpPost]
        public JsonResult GetProjectCardList()
        {

            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        
                    }
                    else
                    {
                       
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
            List<ProjectEntry> lst = new List<ProjectEntry>();

            global.StoreProcedure = "ProjectEntry_USP";
            global.TransactionType = "SelectCardList";
            global.param1 = "PE_Id";
            global.param1Value = null;
            if (CUserModel != null)
            {
                global.param2 = "PE_ClientId";
                global.param2Value = global.UserID;
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
            return Json(List, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetEmployeeLeaveSettings(GlobalData global)
        {
            DataSet ds = new DataSet();
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
            //global.CompanyID = UserModel.CompanyID;
            //global.FYId = UserModel.FyId;

            ds = dl.GetGlobalMasterTransactionSingle1(global);

            EmpLeaveSchedule dash = new EmpLeaveSchedule();
            dash = GetItem1<EmpLeaveSchedule>(ds.Tables[0]);
            //itemStock.ItemStockTransList = ConvertDataTable<ItemStockEntryTransaction>(ds.Tables[1]);
            var Srecord = dash;

            return Json(Srecord, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult InsertUpdateEmployeeLeaveSettings(EmpLeaveSchedule emp)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                //emp.CompanyID = UserModel.CompanyID;
                //emp.UserID = UserModel.UserID;


                long id = dl.InsertUpdateEmployeeLeaveSettings(emp);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TrainingList()
        {

            List<AddTraining> lst = new List<AddTraining>();

            global.StoreProcedure = "TrainingEntry_USP";
            global.TransactionType = "Select";

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)

                lst = ConvertDataTable<AddTraining>(ds.Tables[0]);



            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TrainingWiseImageList(GlobalData global)
        {
            List<EmployeeMaster> lst = new List<EmployeeMaster>();
            global.StoreProcedure = "TrainingWiseEmployeeImage_USP";
            global.TransactionType = "SelectEmpForTraning";
            global.param1 = "TWE_TE_Id";
            global.param1Value = global.param1Value;
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<EmployeeMaster>(ds.Tables[0]);
            var jsonResult = Json(lst, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;
        }

        public JsonResult GetEmployeeForTraningList(GlobalData global)
        {

            List<EmployeeMaster> lst = new List<EmployeeMaster>();

            global.StoreProcedure = "TrainingWiseEmployee_USP";
            global.TransactionType = "SelectEmpForTraning";

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)

                lst = ConvertDataTable<EmployeeMaster>(ds.Tables[0]);



            var List = lst;
            // return Json(List, JsonRequestBehavior.AllowGet,,Int32.MaxValue);
            var jsonResult = Json(List, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = Int32.MaxValue;
            return jsonResult;

        }

        [HttpPost]
        public JsonResult InsertUpdateTrainingWiseEmployee(TrainingWiseEmployee tratinaloocation)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                //if (UserModel == null)
                //{
                //    if (CUserModel != null)
                //    {

                //        project.CompanyID = CUserModel.CompanyID;
                //        project.UserId = CUserModel.UserID;
                //        project.FYId = CUserModel.FyId;
                //    }
                //    else if (EUserModel != null)
                //    {

                //        project.CompanyID = EUserModel.CompanyID;
                //        project.UserId = EUserModel.UserID;
                //        project.FYId = EUserModel.FyId;
                //    }
                //}
                //else
                //{
                //    project.CompanyID = UserModel.CompanyID;
                //    project.UserId = UserModel.UserID;
                //    project.FYId = UserModel.FyId;
                //}

                long id = dl.InsertUpdateTrainingWiseEmployee(tratinaloocation);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }



            return Json(Status, JsonRequestBehavior.AllowGet);
        }

      
        [HttpPost]
        public JsonResult InsertUpdateTrainingWiseDocuments(TrainingWiseDocuments doc)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                //if (UserModel == null)
                //{
                //    if (CUserModel != null)
                //    {

                //        project.CompanyID = CUserModel.CompanyID;
                //        project.UserId = CUserModel.UserID;
                //        project.FYId = CUserModel.FyId;
                //    }
                //    else if (EUserModel != null)
                //    {

                //        project.CompanyID = EUserModel.CompanyID;
                //        project.UserId = EUserModel.UserID;
                //        project.FYId = EUserModel.FyId;
                //    }
                //}
                //else
                //{
                //    project.CompanyID = UserModel.CompanyID;
                //    project.UserId = UserModel.UserID;
                //    project.FYId = UserModel.FyId;
                //}

                long id = dl.InsertUpdateTrainingWiseDocuments(doc);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }

            var jsonResult = Json(Status, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;

            //return Json(Status, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TrainingWiseDocumentsList(GlobalData global)
        {

            List<TrainingWiseDocuments> lst = new List<TrainingWiseDocuments>();

            global.StoreProcedure = "TrainingWiseDocuments_USP";
            global.TransactionType = "SelectTrainingDoc";
            global.param1 = "TWD_TE_Id";
            global.param1Value = global.param1Value;

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<TrainingWiseDocuments>(ds.Tables[0]);
            var List = lst;

            var jsonResult = Json(List, JsonRequestBehavior.AllowGet);
            jsonResult.MaxJsonLength = int.MaxValue;
            return jsonResult;

            //return Json(List, JsonRequestBehavior.AllowGet);
        }

       
        [HttpPost]
        public JsonResult GetCorporateCardList()
        {

            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {


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
            DataTable dt = new DataTable();
            List<CorporateClient> lst = new List<CorporateClient>();

            global.StoreProcedure = "CorporateClient_USP";
            global.TransactionType = "Select";
            global.param1 = "CC_Id";
            global.param1Value = null;
            global.CompanyID = global.CompanyID;
            global.FYId = global.FYId;
            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<CorporateClient>(ds.Tables[0]);

            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }


        [HttpPost]
        public JsonResult GetSMMECardList()
        {
            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {
                       
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

            global.StoreProcedure = "SSME_USP";


            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<SSME>(ds.Tables[0]);

            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }




        public JsonResult TrainingPhase(TrainingPhase TrainingPhase)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = dl.InsertUpdateTrainingPhase(TrainingPhase);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        public JsonResult TrainingPhaseList(GlobalData global)
        {
            List<TrainingPhase> lst = new List<TrainingPhase>();
            global.StoreProcedure = "TrainingPhase_USP";
            global.TransactionType = "Select";
            global.param1 = "TWD_TE_Id";
            global.param1Value = global.param1Value;

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<TrainingPhase>(ds.Tables[0]);
            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }


        #region Project Indicator
        [HttpPost]
        public JsonResult InsertUpdateProjectIndicator(ProjectIncomeBudget project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectIndicator(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProjectIndicator(GlobalData global)
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
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectIncomeBudget project = new ProjectIncomeBudget();
            try
            {

                project = GetItem1<ProjectIncomeBudget>(ds.Tables[0]);//Single Row 
                project.ProjectIndicatorReturnData = ConvertDataTable<ProjectIndicatorReturnData>(ds.Tables[1]);//List view 
            }
            catch (Exception ex)
            {

            }

            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion

        #region Project Performance Indicator
        [HttpPost]
        public JsonResult InsertUpdateProjectPerformanceIndicator(ProjectIncomeBudget project)
        {
            StatusResponse Status = new StatusResponse();
            try
            {

                if (UserModel == null)
                {
                    if (CUserModel != null)
                    {

                        project.CompanyID = CUserModel.CompanyID;
                        project.UserId = CUserModel.UserID;
                        project.FYId = CUserModel.FyId;
                    }
                }
                else
                {
                    project.CompanyID = UserModel.CompanyID;
                    project.UserId = UserModel.UserID;
                    project.FYId = UserModel.FyId;
                }

                long id = dl.InsertUpdateProjectPerformanceIndicator(project);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult ProjectPerformanceIndicator(GlobalData global)
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
            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectIncomeBudget project = new ProjectIncomeBudget();
            try
            {

                project = GetItem1<ProjectIncomeBudget>(ds.Tables[0]);//Single Row 
                project.ProjectPerformanceIndicatorReturnData = ConvertDataTable<ProjectPerformanceIndicatorReturnData>(ds.Tables[1]);//List view 
            }
            catch (Exception ex)
            {

            }

            var Srecord = project;

            return Json(Srecord, JsonRequestBehavior.AllowGet);
        }
        #endregion


        public JsonResult InsertUpdatePrevWorkingList(EmployeePrevWorkingDetails PrevWorkingList)
        {

            StatusResponse Status = new StatusResponse();
            try
            {
                long id = dl.InsertUpdateEmployeePrevWorking(PrevWorkingList);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process fails...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }





        [HttpPost]
        public JsonResult InsertUpdateEmployeeMasterPost(EmployeeMaster emp)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (emp.UserID == 0 || emp.UserID == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            emp.UserID = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            emp.UserID = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            emp.UserID = UserModel.UserID;
                        }
                    }
                    else
                    {

                        emp.UserID = CUserModel.UserID;

                    }
                }
                

                long id = dl.InsertUpdateEmployeeMaster(emp);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


       
        #region InsertUpdateProjectWiseQuestion

        [HttpPost]
        public JsonResult InsertUpdateProjectWiseQuestion(ProjectWiseQuestion emp)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (emp.UserID == 0 || emp.UserID == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            emp.UserID = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            emp.UserID = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            emp.UserID = UserModel.UserID;
                        }
                    }
                    else
                    {

                        emp.UserID = CUserModel.UserID;

                    }
                }
                long id = dl.InsertUpdateProjectWiseQuestion(emp);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }


        #endregion

        [HttpPost]
        public ActionResult GetProjectWiseQuestion(GlobalData global)
        {
            DataSet ds = new DataSet();
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
            //global.CompanyID = UserModel.CompanyID;
            //global.FYId = UserModel.FyId;

            ds = dl.GetGlobalMasterTransactionSingle1(global);

            ProjectWiseQuestion dash = new ProjectWiseQuestion();
            //dash = GetItem1<ProjectWiseQuestion>(ds.Tables[0]);
            dash.ProjectQuestionList = ConvertDataTable<ProjectWiseQuestion>(ds.Tables[0]);
            var Srecord = dash;

            return Json(Srecord, JsonRequestBehavior.AllowGet);

        }


        #region InsertUpdateEmpLeaveApplication

        [HttpPost]
        public JsonResult InsertUpdateEmpLeaveApplication(EmpLeaveApplication emp)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                ////emp.CompanyID = UserModel.CompanyID;
                //emp.UserId = UserModel.UserID;
                if (emp.UserId == 0 || emp.UserId == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            emp.UserId = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            emp.UserId = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            emp.UserId = UserModel.UserID;
                        }
                    }
                    else
                    {

                        emp.UserId = CUserModel.UserID;

                    }
                }
                long id = dl.InsertUpdateEmpLeaveApplication(emp);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        #endregion


        [HttpPost]
        public ActionResult GetEmpBalnceLeave(GlobalData global)
        {
            DataSet ds = new DataSet();

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
            //global.CompanyID = UserModel.CompanyID;
            //global.FYId = UserModel.FyId;
            ds = dl.GetGlobalMasterTransactionSingle1(global);

            EmployeeLeaveDetails dash = new EmployeeLeaveDetails();
            dash = GetItem1<EmployeeLeaveDetails>(ds.Tables[0]);
            //itemStock.ItemStockTransList = ConvertDataTable<ItemStockEntryTransaction>(ds.Tables[1]);
            var Srecord = dash;

            return Json(Srecord, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult InsertUpdateProjectWisePhase(ProjectPhase phase)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (phase.UserId == 0 || phase.UserId == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            phase.UserId = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            phase.UserId = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            phase.UserId = UserModel.UserID;
                        }
                    }
                    else
                    {

                        phase.UserId = CUserModel.UserID;

                    }
                }


                long id = dl.InsertUpdateProjectWisePhase(phase);
                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult GetProjectPhase(GlobalData global)
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
            DataSet ds = new DataSet();

            ds = dl.GetGlobalMasterTransactionSingle(global);
            ProjectPhase phaseSingle = new ProjectPhase();
            phaseSingle = GetItem1<ProjectPhase>(ds.Tables[0]);//Single Row 

            var Srecord = phaseSingle;
            return Json(Srecord, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult InsertUpdateProjectTaskWisePhase(ProjectPhase phase)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (phase.UserId == 0 || phase.UserId == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            phase.UserId = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            phase.UserId = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            phase.UserId = UserModel.UserID;
                        }
                    }
                    else
                    {

                        phase.UserId = CUserModel.UserID;

                    }
                }


                long id = dl.InsertUpdateProjectTaskWisePhase(phase);

                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetPhaseWisetaskList(GlobalData global)
        {

            List<ProjectWiseTask> lst = new List<ProjectWiseTask>();

            global.StoreProcedure = "ProjectPhase_USP";
            global.TransactionType = "SelectProjectPhaseTask";

            DataSet ds = new DataSet();
            ds = dl.GetGlobalMasterTransactionSingle1(global);
            if (ds.Tables.Count > 0)

                lst = ConvertDataTable<ProjectWiseTask>(ds.Tables[0]);

            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);

        }

        [HttpPost]
        public JsonResult UpdateProjectTask(ProjectWiseTask phase)
        {
            StatusResponse Status = new StatusResponse();
            try
            {
                if (phase.UserId == 0 || phase.UserId == null)
                {

                    if (CUserModel == null)
                    {
                        if (SUserModel != null)
                        {

                            phase.UserId = SUserModel.UserID;

                        }
                        else if (EUserModel != null)
                        {
                            phase.UserId = EUserModel.EmpUnder;
                        }
                        else if (UserModel != null)
                        {
                            phase.UserId = UserModel.UserID;
                        }
                    }
                    else
                    {

                        phase.UserId = CUserModel.UserID;

                    }
                }


                long id = dl.UpdateProjectTask(phase);

                if (id > 0)
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record saved successfully...";
                }
                else
                {
                    Status.Id = id;
                    Status.ExMessage = "";
                    Status.IsSuccess = true;
                    Status.Message = "Record not saved successfully...";
                }

            }
            catch (Exception ex)
            {
                Status.Id = -1;
                Status.IsSuccess = false;
                Status.ExMessage = ex.Message;
                Status.Message = "Process falils...";
            }
            return Json(Status, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult GetProjectWiseSMMEList()
        {

            if (UserModel == null)
            {
                if (CUserModel == null)
                {
                    if (EUserModel == null)
                    {

                        //  return RedirectToAction("AppLogin", "Account");
                    }
                    else
                    {
                        global.param1Value = EUserModel.EmpUnder;
                        global.CompanyID = EUserModel.CompanyID;
                        global.FYId = EUserModel.FyId;
                    }
                }
                else
                {
                    global.param1Value = CUserModel.UserID;
                    global.CompanyID = CUserModel.CompanyID;
                    global.FYId = CUserModel.FyId;
                }

            }
            else
            {
                global.param1Value = UserModel.UserID;
                global.CompanyID = UserModel.CompanyID;
                global.FYId = UserModel.FyId;
            }

            DataTable dt = new DataTable();
            List<ProjectWiseSMME> lst = new List<ProjectWiseSMME>();

            global.StoreProcedure = "ProjectWiseSMME_USP";
            global.TransactionType = "AllProjectSMME";

            //global.TransactionType = "SelectSMMENotinPrject";
            global.param1 = "UserId";

            DataSet ds = dl.GetGlobalMasterTransactionSingle(global);

            if (ds.Tables.Count > 0)
                lst = ConvertDataTable<ProjectWiseSMME>(ds.Tables[0]);

            var List = lst;
            return Json(List, JsonRequestBehavior.AllowGet);
        }
    }
}