using BOD_DAL.Convertor;
using BOD_DAL.Model.Interface;
using BOD_DAL.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;
using System.Drawing;
using BOD_DAL.Models;

namespace BOD_DAL
{
    public class DAL
    {
        private static string GetConnectionString()
        {
            return ConfigurationManager.ConnectionStrings["ConStr"].ConnectionString;
        }
        public UserModel GetUserLogin(UserModel user)
        {

            UserModel UserObj = new UserModel();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@UserLogin", user.UserLoginID));
            arrParams.Add(new SqlParameter("@PassWord", user.Password));
            //  arrParams.Add(new SqlParameter("@TransType", "DoctorLogin"));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "UserLogin_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    UserObj.UserID = Convert.ToInt32(rdr["UM_Id"]);
                    UserObj.UserName = Convert.ToString(rdr["UM_Name"]);
                    UserObj.CompanyID = Convert.ToInt32(rdr["UM_CM_Id"]);
                    UserObj.CompanyName = Convert.ToString(rdr["CM_Name"]);
                    UserObj.StateId = Convert.ToInt32(rdr["StateId"]);
                    UserObj.Role = Convert.ToString(rdr["UM_Role"]);
                    UserObj.UM_MainID = Convert.ToInt32(rdr["UM_MainID"]);
                    UserObj.Logo = Convert.ToString(rdr["Logo"]);
                    UserObj.UM_AssesmentGiven = Convert.ToBoolean(rdr["UM_AssesmentGiven"]);
                    UserObj.IndustryId = Convert.ToInt32(rdr["IndustryId"]);
                    UserObj.EmpUnder = Convert.ToInt32(rdr["EmpUnder"]);
                    UserObj.IsSuper = Convert.ToBoolean(rdr["IsSuper"]);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return UserObj;

        }
        #region GetGlobalMasterList

        public static IList<T> GetGlobalMasterList<T>(GlobalData global) where T : IModelBase, new()
        {
            IList<T> entityList;
            entityList = Convertor.HelperFunctions.ToList<T>(GetGlobalMasterList(global));
            return entityList;
        }
        public static DataTable GetGlobalMasterList(GlobalData global)
        {
            DataTable dt = new DataTable();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", global.TransactionType));
            for (int i = 0; i < global.Param.Length; i++)
            {
                var sqlparam = new SqlParameter();
                sqlparam.ParameterName = global.Param[i];
                if (global.paramValue != null && global.paramValue.Length > i)
                {
                    sqlparam.Value = global.paramValue[i];
                }
                arrParams.Add(sqlparam);
            }
            //arrParams.Add(new SqlParameter("@CompanyID", global.CompanyID));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            dt = SqlHelper.ExecuteDataTable(GetConnectionString(), CommandType.StoredProcedure, global.StoreProcedure, arrParams.ToArray());

            return dt;
        }
        public DataTable GetGlobalMasterTransaction(GlobalData global)
        {
            DataTable dt = new DataTable();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", global.TransactionType));
            arrParams.Add(new SqlParameter("@" + global.param1, global.paramValue));
            arrParams.Add(new SqlParameter("@CompanyID", global.CompanyID));
            arrParams.Add(new SqlParameter("@FYId", global.FYId));
            if (global.ParamFromDate != null)
            {
                arrParams.Add(new SqlParameter("@" + global.ParamFromDate, global.ParamFromDateValue == "" ? null : global.ParamFromDateValue));
                arrParams.Add(new SqlParameter("@" + global.ParamToDate, global.ParamToDateValue == "" ? null : global.ParamToDateValue));

            }

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            dt = SqlHelper.ExecuteDataTable(GetConnectionString(), CommandType.StoredProcedure, global.StoreProcedure, arrParams.ToArray());

            return dt;
        }

        public DataSet GetGlobalMasterTransactionSingle(GlobalData global)
        {
            DataSet ds = new DataSet();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", global.TransactionType));
            if (global.param1Value != null)
            {

                arrParams.Add(new SqlParameter("@" + global.param1, global.param1Value));
            }
            else if (global.paramString != null)
            {
                arrParams.Add(new SqlParameter("@" + global.param1, global.paramString));
            }

            if (global.param2 != null)
            {
                if (global.param2Value != null)
                {

                    arrParams.Add(new SqlParameter("@" + global.param2, global.param2Value));
                }
                else if (global.paramString2 != null)
                {
                    arrParams.Add(new SqlParameter("@" + global.param2, global.paramString2));
                }
            }
            if (global.param3 != null)
            {
                if (global.param3Value != null)
                {

                    arrParams.Add(new SqlParameter("@" + global.param3, global.param3Value));
                }
                else
                {
                    arrParams.Add(new SqlParameter("@" + global.param3, global.paramString3));
                }
            }
            if (global.CompanyID != null && global.CompanyID != 0)
            {
                arrParams.Add(new SqlParameter("@CompanyID", global.CompanyID));
            }

            if (global.FYId != null && global.FYId != 0)
            {
                arrParams.Add(new SqlParameter("@FYId", global.FYId));
            }
            if (global.YearId != null && global.YearId != "")
            {
                arrParams.Add(new SqlParameter("@YearId", global.YearId));
            }

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            ds = SqlHelper.ExecuteDataset(GetConnectionString(), CommandType.StoredProcedure, global.StoreProcedure, arrParams.ToArray());

            return ds;
        }
        public DataSet GetGlobalMasterTransactionSingle1(GlobalData global)
        {
            DataSet ds = new DataSet();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", global.TransactionType));
            if (global.param1Value != null)
            {

                arrParams.Add(new SqlParameter("@" + global.param1, global.param1Value));
            }
            else if (global.paramString != null)
            {
                arrParams.Add(new SqlParameter("@" + global.param1, global.paramString));
            }
            if (global.param2 != null)
            {
                if (global.param2Value != null)
                {

                    arrParams.Add(new SqlParameter("@" + global.param2, global.param2Value));
                }
                else if (global.paramString2 != null)
                {
                    arrParams.Add(new SqlParameter("@" + global.param2, global.paramString2));
                }
            }
            if (global.param3 != null)
            {
                if (global.param3Value != null)
                {

                    arrParams.Add(new SqlParameter("@" + global.param3, global.param3Value));
                }
                else
                {
                    arrParams.Add(new SqlParameter("@" + global.param3, global.paramString3));
                }
            }
            if (global.CompanyID != null && global.CompanyID != 0)
            {
                arrParams.Add(new SqlParameter("@CompanyID", global.CompanyID));
            }

            if (global.FYId != null && global.FYId != 0)
            {
                arrParams.Add(new SqlParameter("@FYId", global.FYId));
            }
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            ds = SqlHelper.ExecuteDataset(GetConnectionString(), CommandType.StoredProcedure, global.StoreProcedure, arrParams.ToArray());

            return ds;
        }

        #endregion
        #region GetGlobalMaster
        public DataTable GetGlobalMaster(GlobalData global)
        {
            DataTable dt = new DataTable();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", global.TransactionType));
            //arrParams.Add(new SqlParameter("@" + global.Param, global.paramValue));
            for (int i = 0; i < global.Param.Length; i++)
            {
                var sqlparam = new SqlParameter();
                sqlparam.ParameterName = global.Param[i];
                if (global.paramValue != null && global.paramValue.Length > i)
                {
                    sqlparam.Value = global.paramValue[i];
                }
                arrParams.Add(sqlparam);
            }
            if((global.UserID>0)||(global.UserID!=null))
            {
                arrParams.Add(new SqlParameter("@UserId", global.UserID));
            }
           

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            dt = SqlHelper.ExecuteDataTable(GetConnectionString(), CommandType.StoredProcedure, global.StoreProcedure, arrParams.ToArray());

            return dt;
        }
        #endregion
        #region Validation
        public DDLList GetValidation(DDLList obj)
        {

            DDLList UserObj = new DDLList();
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@tableName", obj.tableName));
            arrParams.Add(new SqlParameter("@Text", obj.Text));
            arrParams.Add(new SqlParameter("@ColumnName", obj.ColumnName));
            //arrParams.Add(new SqlParameter("@Value", obj.Value));
            arrParams.Add(new SqlParameter("@param", obj.param));
            arrParams.Add(new SqlParameter("@ColumnName1", obj.ColumnName1));
            arrParams.Add(new SqlParameter("@PId", obj.PId));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "Validation_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    UserObj.PId = Convert.ToDecimal(rdr["OutPutId"]);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return UserObj;

        }
        #endregion

        #region GetDDLList
        public List<DDLList> GetDDLList(DDLList ddlList)
        {
            List<DDLList> DDLObjList = new List<DDLList>();
            DDLList DDLObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@tableName", ddlList.tableName));
            arrParams.Add(new SqlParameter("@param", ddlList.param));
            arrParams.Add(new SqlParameter("@PId", ddlList.PId));
            arrParams.Add(new SqlParameter("@ColumnName", ddlList.ColumnName));
            arrParams.Add(new SqlParameter("@PId1", ddlList.PId1));
            arrParams.Add(new SqlParameter("@ColumnName1", ddlList.ColumnName1));
            arrParams.Add(new SqlParameter("@Text", ddlList.Text));
            arrParams.Add(new SqlParameter("@Value", ddlList.Value));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "DropDown_For_ALL_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    DDLObj = new DDLList();
                    DDLObj.Value = Convert.ToString(rdr["Value"]);
                    DDLObj.Text = Convert.ToString(rdr["Text"]);
                    DDLObjList.Add(DDLObj);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return DDLObjList;
        }
        #endregion
        #region GetDDLJoinList
        public List<DDLJoinList> GetDDLJoinList(DDLJoinList ddlList)
        {
            List<DDLJoinList> DDLObjList = new List<DDLJoinList>();
            DDLJoinList DDLObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@tableName1", ddlList.tableName1));
            arrParams.Add(new SqlParameter("@tableName2", ddlList.tableName2));
            arrParams.Add(new SqlParameter("@Param", ddlList.Param));
            arrParams.Add(new SqlParameter("@PId", ddlList.PId));
            arrParams.Add(new SqlParameter("@Param1", ddlList.Param1));
            arrParams.Add(new SqlParameter("@PId1", ddlList.PId1));
            arrParams.Add(new SqlParameter("@ColumnName", ddlList.ColumnName));
            arrParams.Add(new SqlParameter("@ColumnName1", ddlList.ColumnName1));
            arrParams.Add(new SqlParameter("@Text", ddlList.Text));
            arrParams.Add(new SqlParameter("@Value", ddlList.Value));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "DropDown_For_JOIN_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    DDLObj = new DDLJoinList();
                    DDLObj.Value = Convert.ToString(rdr["Value"]);
                    DDLObj.Text = Convert.ToString(rdr["Text"]);
                    DDLObjList.Add(DDLObj);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return DDLObjList;
        }
        #endregion
        #region InsertUpdateAll
        public static long InsertUpdate<T>(T entity) where T : IModelBase
        {
            try
            {
                var sqlparams = HelperFunctions.GenerateSqlParams<T>(entity,
                    entity.Id == 0 ? HelperFunctions.SqlOptType.Insert : HelperFunctions.SqlOptType.Update);

                var uspName = entity.GetType().Name + "_USP";

                SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, uspName, sqlparams.ToArray());
                long val = Convert.ToInt64(sqlparams[sqlparams.Count - 1].Value);
                return val;

            }
            catch (Exception ex)
            {

                throw ex;
            }
        }
        #endregion
        #region Menu
        public List<MainMenu> GetMainMenu(int? moduleId, int? userId)
        {
            List<MainMenu> ObjMainMenu = new List<MainMenu>();
            MainMenu mainObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "MainMenu"));
            arrParams.Add(new SqlParameter("@ModuleId", moduleId));
            arrParams.Add(new SqlParameter("@UserId", userId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "Menu_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    mainObj = new MainMenu();
                    mainObj.MenuId = Convert.ToInt32(rdr["MenuID"].ToString());
                    mainObj.MainMenuURL = rdr["MenuURL"].ToString();
                    mainObj.MainMenuItem = rdr["MenuName"].ToString();
                    mainObj.MenuIcon = rdr["Icon"].ToString();
                    mainObj.Checked = "";
                    ObjMainMenu.Add(mainObj);
                }
                rdr.Close();
            }
            rdr.Dispose();

            return ObjMainMenu;
        }
        public List<SubMenu> GetSubMenu(int? moduleId, int? userId)
        {
            List<SubMenu> ObjSubMenu = new List<SubMenu>();
            SubMenu submainObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "ChildMenu"));
            arrParams.Add(new SqlParameter("@ModuleId", moduleId));
            arrParams.Add(new SqlParameter("@UserId", userId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "Menu_SP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    submainObj = new SubMenu();
                    submainObj.MenuId = Convert.ToInt32(rdr["MenuID"].ToString());
                    submainObj.SubMenuURL = rdr["MenuURL"].ToString();
                    submainObj.SubMenuItem = rdr["MenuName"].ToString();
                    submainObj.SubMenuIcon = rdr["Icon"].ToString();
                    submainObj.MainMenuID = Convert.ToInt32(rdr["ParentMenuID"].ToString());
                    submainObj.Checked = "disabled";
                    ObjSubMenu.Add(submainObj);
                }
                rdr.Close();
            }
            rdr.Dispose();

            return ObjSubMenu;
        }
        #endregion
        public IList<AuthorisedModule> GetModulesByUser(int companyid, string userLogin)
        {
            return GetModulesByUser(companyid, 0, userLogin);
        }

        public IList<AuthorisedModule> GetModulesByUser(int userId)
        {
            return GetModulesByUser(0, userId, string.Empty);
        }
        private IList<AuthorisedModule> GetModulesByUser(int companyId = 0, int userId = 0, string userLogin = "")
        {
            if (userId == 0 && (string.IsNullOrEmpty(userLogin) || companyId == 0))
            {
                throw new Exception("Invalid User information");
            }

            IList<AuthorisedModule> modules = new List<AuthorisedModule>();
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@UM_Id", userId));
            arrParams.Add(new SqlParameter("@UM_Login", userLogin));
            arrParams.Add(new SqlParameter("@UM_CM_Id", companyId));
            //  arrParams.Add(new SqlParameter("@TransType", "DoctorLogin"));
            //SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            //OutPutId.Direction = ParameterDirection.Output;
            //arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "[ModuleList]", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    modules.Add(new AuthorisedModule()
                    {
                        Id = Convert.ToInt32(rdr["MM_Id"]),
                        Name = Convert.ToString(rdr["MM_Name"]),
                        Url = Convert.ToString(rdr["MM_Url"]),
                        Image = Convert.ToString(rdr["MM_Image"])
                    });
                }
                rdr.Close();
            }
            rdr.Dispose();
            return modules;
        }
        public List<DDLList> GetUserWiseCompanyist(UserModel UserModel)
        {
            List<DDLList> DDLObjList = new List<DDLList>();
            DDLList DDLObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@UserID", UserModel.UserID));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "UserWiseCompanyList_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    DDLObj = new DDLList();
                    DDLObj.Value = Convert.ToString(rdr["Value"]);
                    DDLObj.Text = Convert.ToString(rdr["Text"]);
                    DDLObjList.Add(DDLObj);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return DDLObjList;
        }


        #region GlobalDelete
        public long GlobalDelete(GlobalDelete del)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@param", del.param));
            arrParams.Add(new SqlParameter("@tableName", del.tableName));
            arrParams.Add(new SqlParameter("@ColumnName", del.ColumnName));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "Delete_For_ALL", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion
        #region GlobalDeleteTransaction
        public long GlobalDeleteTransaction(GlobalDelTrans del)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@DelId", del.DelId));
            arrParams.Add(new SqlParameter("@TransactionType", del.TransactionType));
            arrParams.Add(new SqlParameter("@CompanyId", del.CompanyId));
            arrParams.Add(new SqlParameter("@UserId", del.UserId));
            arrParams.Add(new SqlParameter("@FyId", del.FyId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "Delete_For_ALLTrans", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion
        #region InsertUpdateCorporateClient
        public long InsertUpdateCorporateClient(CorporateClient client)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();

            List.Columns.Add("UQM_QM_ID", typeof(int));

            List.Columns.Add("UQM_Answer", typeof(string));

            foreach (var MD in client.QA)
            {
                DataRow dr = List.NewRow();
                dr["UQM_QM_ID"] = MD.QAId;
                if (MD.Type == "R")
                {
                    MD.Answer = MD.RadioOptions == true ? "Yes" : "No";
                }
                else if (MD.Type == "M")
                {
                    MD.Answer = string.Join(",", MD.Answer2);
                }
                dr["UQM_Answer"] = MD.Answer;

                List.Rows.Add(dr);
            }
       /*=============================================================*/

            DataTable docList = new DataTable();



            docList.Columns.Add("CD_Document", typeof(string));
            docList.Columns.Add("CD_DocName", typeof(string));
            
            foreach (var MD in client.CorporateClientDocumentList)
            {
                DataRow dr = docList.NewRow();
                dr["CD_Document"] = MD.CD_Document;
                dr["CD_DocName"] = MD.CD_DocName;
               
                docList.Rows.Add(dr);
            }
     /***********************************************************************/
            if (client.CC_Id == 0 || client.CC_Id == null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
                arrParams.Add(new SqlParameter("@UM_AssesmentGiven", client.UM_AssesmentGiven));
            }
            else
            {

                arrParams.Add(new SqlParameter("@TransactionType", "Update"));
                arrParams.Add(new SqlParameter("@CC_Id", client.CC_Id));


            }
            arrParams.Add(new SqlParameter("@CC_Email", client.CC_Email));
            arrParams.Add(new SqlParameter("@CC_UserId", client.CC_UserId));
            arrParams.Add(new SqlParameter("@CC_CorporateName", client.CC_CorporateName));
            arrParams.Add(new SqlParameter("@CC_TradingName", client.CC_TradingName));
            arrParams.Add(new SqlParameter("@CC_CIPC_RegistrationNo", client.CC_CIPC_RegistrationNo));
            arrParams.Add(new SqlParameter("@CC_SARS_VATNo", client.CC_SARS_VATNo));
            arrParams.Add(new SqlParameter("@CC_Address", client.CC_Address));
            arrParams.Add(new SqlParameter("@CC_Zipcode", client.CC_Zipcode));
            arrParams.Add(new SqlParameter("@CC_PostalAddress", client.CC_PostalAddress));
            arrParams.Add(new SqlParameter("@CC_PhoneNo", client.CC_PhoneNo));

            arrParams.Add(new SqlParameter("@CC_ContactPersonName", client.CC_ContactPersonName));
            arrParams.Add(new SqlParameter("@CompanyId", client.CC_CompanyId));
            arrParams.Add(new SqlParameter("@FyId", client.CC_FyId));
            arrParams.Add(new SqlParameter("@CC_Logo", client.CC_Logo));
            arrParams.Add(new SqlParameter("@CC_PIM_Id", client.CC_PIM_Id));
            arrParams.Add(new SqlParameter("@CC_Password", client.CC_Password));

            arrParams.Add(new SqlParameter("@CC_ContactPersonEmail", client.CC_ContactPersonEmail));
            arrParams.Add(new SqlParameter("@CC_ContactPersonPhNo", client.CC_ContactPersonPhNo));
            arrParams.Add(new SqlParameter("@UserQuestionMap", List));
            arrParams.Add(new SqlParameter("@CorporateClientDocument", docList));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "CorporateClient_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProject
        public long InsertUpdateProjectEntry(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            if (project.PE_Id == 0 || project.PE_Id == null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }
            else
            {

                arrParams.Add(new SqlParameter("@TransactionType", "Update"));



            }
            arrParams.Add(new SqlParameter("@PE_Id", project.PE_Id));
            arrParams.Add(new SqlParameter("@PE_IndustryId", project.PE_IndustryId));
            arrParams.Add(new SqlParameter("@PE_ProjectName", project.PE_ProjectName));

            arrParams.Add(new SqlParameter("@PE_ProjectOparate", project.PE_ProjectOparate));
            arrParams.Add(new SqlParameter("@PE_JobFundno", project.PE_JobFundno));
            arrParams.Add(new SqlParameter("@PE_GrantFunding", project.PE_GrantFunding));
            arrParams.Add(new SqlParameter("@PE_Image", project.PE_Image));
            arrParams.Add(new SqlParameter("@PE_StartDate", project.PE_StartDate));
            arrParams.Add(new SqlParameter("@PE_EndDate", project.PE_EndDate));
            arrParams.Add(new SqlParameter("@PE_ContactPerson", project.PE_ContactPerson));
            arrParams.Add(new SqlParameter("@PE_ContactPersonNo", project.PE_ContactPersonNo));
            arrParams.Add(new SqlParameter("@PE_Description", project.PE_Description));
            arrParams.Add(new SqlParameter("@PE_ClientId", project.PE_ClientId));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            arrParams.Add(new SqlParameter("@role", project.role));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectEntry_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region client user register
        public CURegisterModel RegisterClientUser(CURegisterModel user)
        {

            CURegisterModel model = new CURegisterModel();
            try
            {
                List<SqlParameter> arrParams = new List<SqlParameter>();
                arrParams.Add(new SqlParameter("@UserName", user.UserName));
                arrParams.Add(new SqlParameter("@Password", user.Password));
                arrParams.Add(new SqlParameter("@UserId", user.UserId));
                arrParams.Add(new SqlParameter("@Email", user.Email));
                arrParams.Add(new SqlParameter("@IndustryId", user.IndustryId));
                arrParams.Add(new SqlParameter("@Flag", "Step 1"));
                //SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
                //OutPutId.Direction = ParameterDirection.Output;
                //arrParams.Add(OutPutId);

                SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "RegisterClientUser_USP", arrParams.ToArray());
                if (rdr != null)
                {
                    while (rdr.Read())
                    {
                        model.UMId = Convert.ToInt32(rdr["UMId"]);
                        model.CCId = Convert.ToInt32(rdr["CCId"]);
                        model.UserId = rdr["UserId"].ToString();
                        model.UserName = rdr["UserName"].ToString();
                        model.Email = rdr["Email"].ToString();
                        model.Password = rdr["Password"].ToString();
                        model.IndustryId = Convert.ToInt32(rdr["CC_PIM_Id"]);
                    }
                    rdr.Close();
                }
                rdr.Dispose();
            }
            catch (Exception ex)
            {

            }

            return model;

        }

        public List<QuestionModel> GetQuestions(int flag, string Transactiontype)
        {
            List<QuestionModel> model = new List<QuestionModel>();
            try
            {
                DataSet ds = new DataSet();
                List<List<DDL>> DropDownsContainer = new List<List<DDL>>();
                List<DDL> DropDowns = new List<DDL>();
                List<DDL> DropDownsData = new List<DDL>();
                List<SqlParameter> arrParams = new List<SqlParameter>();
                arrParams.Add(new SqlParameter("@QM_ForClient", flag));

                arrParams.Add(new SqlParameter("@Transactiontype", Transactiontype));

                //SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "GetQuestions_USP", arrParams.ToArray());

                ds = SqlHelper.ExecuteDataset(GetConnectionString(), CommandType.StoredProcedure, "GetQuestions_USP", arrParams.ToArray());
                if (ds.Tables.Count > 1)
                {
                    for (var i = 1; i < ds.Tables.Count; i++)
                    {
                        DropDowns = new List<DDL>();
                        for (var j = 0; j < ds.Tables[i].Rows.Count; j++)
                        {
                            DropDowns.Add(new DDL
                            {
                                OM_Id = Convert.ToInt32(ds.Tables[i].Rows[j]["OM_Id"]),
                                OM_Name = ds.Tables[i].Rows[j]["OM_Name"].ToString(),
                                OM_OTM_Id = Convert.ToInt32(ds.Tables[i].Rows[j]["OM_OTM_Id"])
                            });
                        }
                        DropDownsContainer.Add(DropDowns);
                    }
                }
                if (ds.Tables.Count > 0)
                {
                    for (var i = 0; i < ds.Tables[0].Rows.Count; i++)
                    {
                        if (ds.Tables[0].Rows[i]["QM_Container"].ToString() == "M" || ds.Tables[0].Rows[i]["QM_Container"].ToString() == "D")
                        {
                            DropDownsData = new List<DDL>();
                            for (var j = 0; j < DropDownsContainer.Count; j++)
                            {
                                if (DropDownsContainer[j][0].OM_OTM_Id == Convert.ToInt32(ds.Tables[0].Rows[i]["QM_DropdownType"]))
                                {
                                    DropDownsData = DropDownsContainer[j];
                                }
                            }
                            model.Add(new QuestionModel()
                            {
                                QM_ID = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_ID"]),
                                QM_Name = ds.Tables[0].Rows[i]["QM_Name"].ToString(),
                                QM_Container = ds.Tables[0].Rows[i]["QM_Container"].ToString(),
                                QM_QC_Id = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_QC_Id"]),
                                Required = ds.Tables[0].Rows[i]["Required"].ToString(),
                                QM_DropdownType = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_DropdownType"]),
                                DropDowns = DropDownsData
                            });
                        }
                        else
                        {
                            DropDownsData = new List<DDL>();
                            model.Add(new QuestionModel()
                            {
                                QM_ID = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_ID"]),
                                QM_Name = ds.Tables[0].Rows[i]["QM_Name"].ToString(),
                                QM_Container = ds.Tables[0].Rows[i]["QM_Container"].ToString(),
                                QM_QC_Id = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_QC_Id"]),
                                Required = ds.Tables[0].Rows[i]["Required"].ToString(),
                                QM_DropdownType = Convert.ToInt32(ds.Tables[0].Rows[i]["QM_DropdownType"]),
                                DropDowns = DropDownsData
                            });
                        }


                    }

                }

            }
            catch (Exception ex)
            {

            }
            return model;
        }


        public List<QuestionCategoryModel> GetQuestionsCaterory(string Transactiontype)
        {
            List<QuestionCategoryModel> model = new List<QuestionCategoryModel>();
            try
            {
                List<SqlParameter> arrParams = new List<SqlParameter>();
                //arrParams.Add(new SqlParameter("@QM_ForClient", flag));
                //arrParams.Add(new SqlParameter("@IndustryId", industryid));
                //arrParams.Add(new SqlParameter("@Transactiontype", Transactiontype));

                string storeproc = "";
                if (Transactiontype == "Project")
                {
                    storeproc = "GetProjectQuestionsCategory_USP";
                }
                else
                {
                    storeproc = "GetQuestionsCategory_USP";
                }
                SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, storeproc);


                if (rdr != null)
                {
                    while (rdr.Read())
                    {
                        model.Add(new QuestionCategoryModel()
                        {
                            QC_Id = Convert.ToInt32(rdr["QC_Id"]),
                            QC_Name = rdr["QC_Name"].ToString()
                        });
                    }
                    rdr.Close();
                }
                rdr.Dispose();
            }
            catch (Exception ex)
            {

            }
            return model;
        }

        public bool IsUserIdOrEmailExist(string flag, string Email, string TransactionType)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@flag", flag));
            arrParams.Add(new SqlParameter("@TransactionType", TransactionType));

            arrParams.Add(new SqlParameter("@Email", Email));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "IsUserIdOrEmailExist_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    return true;
                }
                rdr.Close();
            }
            rdr.Dispose();
            return false;
        }
        #endregion

        #region InsertUpdateProjectExpenses
        public long InsertUpdateProjectExpenses(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("PWE_Item", typeof(int));
            List.Columns.Add("PWE_UnitId", typeof(int));
            List.Columns.Add("PWE_Date", typeof(string));
            List.Columns.Add("PWE_Rate", typeof(decimal));
            List.Columns.Add("PWE_Qty", typeof(int));
            List.Columns.Add("PWE_Amount", typeof(decimal));
            List.Columns.Add("PWE_Accounting", typeof(int));
            foreach (var MD in project.ExpensesList)
            {
                DataRow dr = List.NewRow();
                dr["PWE_Item"] = MD.PWE_Item;
                dr["PWE_UnitId"] = MD.PWE_UnitId;
                dr["PWE_Date"] = MD.PWE_Date;
                dr["PWE_Rate"] = MD.PWE_Rate;
                dr["PWE_Qty"] = MD.PWE_Qty;
                dr["PWE_Amount"] = MD.PWE_Amount;
                dr["PWE_Accounting"] = MD.PWE_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@PWE_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@ProjectWiseExpenses", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseExpenses_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateSSME
        public long InsertUpdateSSME(SSME client)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();

            List.Columns.Add("UQM_QM_ID", typeof(int));

            List.Columns.Add("UQM_Answer", typeof(string));

            foreach (var MD in client.QA)
            {
                DataRow dr = List.NewRow();
                dr["UQM_QM_ID"] = MD.QAId;
                if (MD.Type == "R")
                {
                    MD.Answer = MD.RadioOptions == true ? "Yes" : "No";
                }
                else if (MD.Type == "M")
                {
                    MD.Answer = string.Join(",", MD.Answer2);
                }
                dr["UQM_Answer"] = MD.Answer;

                List.Rows.Add(dr);
            }
            /*=============================================================*/

            DataTable docList = new DataTable();



            docList.Columns.Add("SD_Document", typeof(string));
            docList.Columns.Add("SD_DocName", typeof(string));

            foreach (var MD in client.SMMEDocumentList)
            {
                DataRow dr = docList.NewRow();
                dr["SD_Document"] = MD.SD_Document;
                dr["SD_DocName"] = MD.SD_DocName;

                docList.Rows.Add(dr);
            }
            /***********************************************************************/
            if (client.SM_Id == 0 || client.SM_Id == null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
                arrParams.Add(new SqlParameter("@SM_UserId", client.SM_UserId));
                arrParams.Add(new SqlParameter("@SM_Password", client.SM_Password));
                arrParams.Add(new SqlParameter("@UM_AssesmentGiven", client.UM_AssesmentGiven));

            }
            else
            {

                arrParams.Add(new SqlParameter("@TransactionType", "Update"));
                arrParams.Add(new SqlParameter("@SM_Id", client.SM_Id));


            }

            arrParams.Add(new SqlParameter("@InputFrom", client.InputFrom));
            arrParams.Add(new SqlParameter("@SM_CorporateName", client.SM_CorporateName));
            arrParams.Add(new SqlParameter("@SM_TradingName", client.SM_TradingName));
            arrParams.Add(new SqlParameter("@SM_CIPC_RegistrationNo", client.SM_CIPC_RegistrationNo));
            arrParams.Add(new SqlParameter("@SM_SARS_VATNo", client.SM_SARS_VATNo));
            arrParams.Add(new SqlParameter("@SM_Address", client.SM_Address));
            arrParams.Add(new SqlParameter("@SM_Zipcode", client.SM_Zipcode));
            arrParams.Add(new SqlParameter("@SM_PostalAddress", client.SM_PostalAddress));
            arrParams.Add(new SqlParameter("@SM_PhoneNo", client.SM_PhoneNo));
            arrParams.Add(new SqlParameter("@SM_Email", client.SM_Email));
            arrParams.Add(new SqlParameter("@SM_ContactPersonName", client.SM_ContactPersonName));
            arrParams.Add(new SqlParameter("@CompanyId", client.SM_CompanyId));
            arrParams.Add(new SqlParameter("@FyId", client.SM_FyId));
            arrParams.Add(new SqlParameter("@SM_Image", client.SM_Image));
            arrParams.Add(new SqlParameter("@CWS_ClientId", client.UserId));
            arrParams.Add(new SqlParameter("@SM_PIM_Id", client.SM_PIM_Id));

            arrParams.Add(new SqlParameter("@SM_ContactPersonEmail", client.SM_ContactPersonEmail));
            arrParams.Add(new SqlParameter("@SM_ContactPersonPhone", client.SM_ContactPersonPhone));
            arrParams.Add(new SqlParameter("@UserQuestionMap", List));
            arrParams.Add(new SqlParameter("@SSMEDocument", docList));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "SSME_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectFundGrant
        public long InsertUpdateProjectFundGrant(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("PWJFG_JobsFundGrant", typeof(string));
            List.Columns.Add("PWJFG_EnterDate", typeof(string));
            List.Columns.Add("PWJFG_Amount", typeof(decimal));
            List.Columns.Add("PWJFG_Status", typeof(string));
            List.Columns.Add("PWJFG_Accounting", typeof(string));
            foreach (var MD in project.FundGrants)
            {
                DataRow dr = List.NewRow();
                dr["PWJFG_JobsFundGrant"] = MD.PWJFG_JobsFundGrant;
                dr["PWJFG_EnterDate"] = MD.PWJFG_EnterDate;
                dr["PWJFG_Amount"] = MD.PWJFG_Amount;
                dr["PWJFG_Status"] = MD.PWJFG_Status;
                dr["PWJFG_Accounting"] = MD.PWJFG_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@PWJFG_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@ProjectWiseJobsFundGrant", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseJobsFundGrant_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion


        #region InsertUpdateProjectOwnFundingContributions
        public long InsertUpdateProjectOwnFundingContributions(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("OFC_Status", typeof(string));
            List.Columns.Add("OFC_Date", typeof(string));
            List.Columns.Add("OFC_Amount", typeof(decimal));
            List.Columns.Add("OFC_Accounting", typeof(int));
            foreach (var MD in project.OwnFundingContributions)
            {
                DataRow dr = List.NewRow();
                dr["OFC_Status"] = MD.OFC_Status;
                dr["OFC_Date"] = Convert.ToDateTime(MD.OFC_Date).ToString("MM/dd/yyyy");
                dr["OFC_Amount"] = MD.OFC_Amount;
                dr["OFC_Accounting"] = MD.OFC_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@OFC_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@OwnFundingContributions", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "OwnFundingContributions_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateLoanFinancing
        public long InsertUpdateLoanFinancing(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("LF_LendingInstitution", typeof(string));
            List.Columns.Add("LF_Date", typeof(string));
            List.Columns.Add("LF_LoanAmount", typeof(decimal));
            List.Columns.Add("LF_LoanTerm", typeof(string));
            List.Columns.Add("LF_InterestTerm", typeof(decimal));
            List.Columns.Add("LF_PaymentTerm", typeof(decimal));
            List.Columns.Add("LF_Accounting", typeof(int));
            foreach (var MD in project.LoanFinancing)
            {
                DataRow dr = List.NewRow();
                dr["LF_LendingInstitution"] = MD.LF_LendingInstitution;
                dr["LF_Date"] = Convert.ToDateTime(MD.LF_Date).ToString("MM/dd/yyyy");
                dr["LF_LoanAmount"] = MD.LF_LoanAmount;
                dr["LF_LoanTerm"] = MD.LF_LoanTerm;
                dr["LF_InterestTerm"] = MD.LF_InterestTerm;
                dr["LF_PaymentTerm"] = MD.LF_PaymentTerm;
                dr["LF_Accounting"] = MD.LF_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@LF_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@LoanFinancing", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "LoanFinancing_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateOtherContributions
        public long InsertUpdateOtherContributions(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("OC_FunderName", typeof(string));
            List.Columns.Add("OC_Activity", typeof(string));
            List.Columns.Add("OC_Date", typeof(string));
            List.Columns.Add("OC_Amount", typeof(decimal));
            List.Columns.Add("OC_Status", typeof(string));
            List.Columns.Add("OC_FundingSecured", typeof(decimal));
            List.Columns.Add("OC_Conditions", typeof(string));
            List.Columns.Add("OC_Description", typeof(string));
            List.Columns.Add("OC_Accounting", typeof(int));
            foreach (var MD in project.OtherContributions)
            {
                DataRow dr = List.NewRow();
                dr["OC_FunderName"] = MD.OC_FunderName;
                dr["OC_Activity"] = MD.OC_Activity;
                dr["OC_Date"] = Convert.ToDateTime(MD.OC_Date).ToString("MM/dd/yyyy");
                dr["OC_Amount"] = MD.OC_Amount;
                dr["OC_Status"] = MD.OC_Status;
                dr["OC_FundingSecured"] = MD.OC_FundingSecured;
                dr["OC_Conditions"] = MD.OC_Conditions;
                dr["OC_Description"] = MD.OC_Description;
                dr["OC_Accounting"] = MD.OC_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@OC_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@OtherContributions", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "OtherContributions_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateInKindContributions
        public long InsertUpdateInKindContributions(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("IKC_CategoryContribution", typeof(string));
            List.Columns.Add("IKC_NameOfContributor", typeof(string));
            List.Columns.Add("IKC_Date", typeof(string));
            List.Columns.Add("IKC_Amount", typeof(decimal));
            List.Columns.Add("IKC_Contact", typeof(string));
            List.Columns.Add("IKC_BankAccount", typeof(string));
            List.Columns.Add("IKC_Specify", typeof(string));
            List.Columns.Add("IKC_TimeLine", typeof(string));
            List.Columns.Add("IKC_Description", typeof(string));
            List.Columns.Add("IKC_Accounting", typeof(int));
            foreach (var MD in project.InKindContributions)
            {
                DataRow dr = List.NewRow();
                dr["IKC_CategoryContribution"] = MD.IKC_CategoryContribution;
                dr["IKC_NameOfContributor"] = MD.IKC_NameOfContributor;
                dr["IKC_Date"] = Convert.ToDateTime(MD.IKC_Date).ToString("MM/dd/yyyy");
                dr["IKC_Amount"] = MD.IKC_Amount;
                dr["IKC_Contact"] = MD.IKC_Contact;
                dr["IKC_BankAccount"] = MD.IKC_BankAccount;
                dr["IKC_Specify"] = MD.IKC_Specify;
                dr["IKC_TimeLine"] = MD.IKC_TimeLine;
                dr["IKC_Description"] = MD.IKC_Description;
                dr["IKC_Accounting"] = MD.IKC_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@IKC_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@InKindContributions", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "InKindContributions_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateOtherEarnings
        public long InsertUpdateOtherEarnings(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("OE_OtherEarnings", typeof(string));

            List.Columns.Add("OE_Date", typeof(string));
            List.Columns.Add("OE_Description", typeof(string));
            List.Columns.Add("OE_SupportingEvidence", typeof(string));
            List.Columns.Add("OE_Assumptions", typeof(string));
            List.Columns.Add("OE_Accounting", typeof(int));
            foreach (var MD in project.OtherEarnings)
            {
                DataRow dr = List.NewRow();
                dr["OE_OtherEarnings"] = MD.OE_OtherEarnings;

                dr["OE_Date"] = MD.OE_Date;
                dr["OE_Description"] = MD.OE_Description;
                dr["OE_SupportingEvidence"] = MD.OE_SupportingEvidence;
                dr["OE_Assumptions"] = MD.OE_Assumptions;
                dr["OE_Accounting"] = MD.OE_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@OE_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@OtherEarnings", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "OtherEarnings_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateInterestIncome
        public long InsertUpdateInterestIncome(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();
            List.Columns.Add("II_Date", typeof(string));

            List.Columns.Add("II_InterestInstrument", typeof(string));
            List.Columns.Add("II_InstitutionHolding", typeof(string));
            List.Columns.Add("II_InterestRate", typeof(int));
            List.Columns.Add("II_InterestPaymentTerms", typeof(string));
            List.Columns.Add("II_Accounting", typeof(int));
            foreach (var MD in project.InterestIncome)
            {
                DataRow dr = List.NewRow();


                dr["II_Date"] = MD.II_Date;
                dr["II_InterestInstrument"] = MD.II_InterestInstrument;
                dr["II_InstitutionHolding"] = MD.II_InstitutionHolding;
                dr["II_InterestRate"] = MD.II_InterestRate;
                dr["II_InterestPaymentTerms"] = MD.II_InterestPaymentTerms;
                dr["II_Accounting"] = MD.II_Accounting;
                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@II_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@InterestIncome", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "InterestIncome_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectWiseSMME
        public long InsertUpdateProjectWiseSMME(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("PWS_SM_Id", typeof(int));


            foreach (var MD in project.ProjectWiseSMME)
            {
                DataRow dr = List.NewRow();
                dr["PWS_SM_Id"] = MD.PWS_SM_Id;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@PWS_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@ProjectWiseSMME", List));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseSMME_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateProjectWiseTask
        public long InsertUpdateProjectWiseTask(ProjectWiseTask project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();



            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@PWT_ProjectId", project.PWT_ProjectId));
            arrParams.Add(new SqlParameter("@PWT_Description", project.PWT_Description));

            arrParams.Add(new SqlParameter("@PWT_TaskTitle", project.PWT_TaskTitle));
            arrParams.Add(new SqlParameter("@PWT_Attachment", project.PWT_Attachment));

            arrParams.Add(new SqlParameter("@PWT_Image", project.PWT_Image));
            arrParams.Add(new SqlParameter("@PWT_ParentTaskId", project.PWT_ParentTaskId));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyId));
            arrParams.Add(new SqlParameter("@FyId", project.FyId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            arrParams.Add(new SqlParameter("@PWT_Priority", project.PWT_Priority));
            arrParams.Add(new SqlParameter("@PWT_EndDate", project.PWT_EndDate));
            arrParams.Add(new SqlParameter("@PWT_StartDate", project.PWT_StartDate));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseTask_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectTaskWiseSMME
        public long InsertUpdateProjectTaskWiseSMME(ProjectWiseTask project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("PWS_SM_Id", typeof(int));


            foreach (var MD in project.smmlist)
            {
                DataRow dr = List.NewRow();
                dr["PWS_SM_Id"] = MD.PWS_SM_Id;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            arrParams.Add(new SqlParameter("@PWS_TaskId", project.PWT_Id));
            arrParams.Add(new SqlParameter("@PWS_ProjectId", project.PWT_ProjectId));
            arrParams.Add(new SqlParameter("@ProjectWiseSMME", List));
            //arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            //arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectTaskWiseSMME_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region Budget
        public long InsertUpdateBudget(ProjectEntry project)
        {

            long val = 0;
            int index = 0;
            foreach (var MD in project.Budget)
            {
                List<SqlParameter> arrParams = new List<SqlParameter>();

                DataTable List = new DataTable();
                List.Columns.Add("BM_ItemId", typeof(int));

                List.Columns.Add("BM_UnitId", typeof(int));
                List.Columns.Add("BM_MonthId", typeof(string));
                List.Columns.Add("BM_Amount", typeof(decimal));
                List.Columns.Add("BM_Group", typeof(decimal));
                List.Columns.Add("BM_Year", typeof(int));
                List.Columns.Add("BM_Accounting", typeof(int));
                index++;
                foreach (var item in MD.MonthList)
                {
                    DataRow dr = List.NewRow();
                    dr["BM_ItemId"] = MD.ItemId;
                    dr["BM_UnitId"] = MD.UnitId;
                    dr["BM_MonthId"] = item.Id;
                    dr["BM_Amount"] = item.Value;
                    dr["BM_Group"] = index;
                    dr["BM_Year"] = item.Year;
                    dr["BM_Accounting"] = MD.Accounting;
                    List.Rows.Add(dr);
                }




                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
                arrParams.Add(new SqlParameter("@Desc", MD.Desc));
                arrParams.Add(new SqlParameter("@BM_ProjectId", project.PE_Id));
                arrParams.Add(new SqlParameter("@Budget", List));
                arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
                arrParams.Add(new SqlParameter("@FyId", project.FYId));
                arrParams.Add(new SqlParameter("@UserId", project.UserId));
                SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
                OutPutId.Direction = ParameterDirection.Output;
                arrParams.Add(OutPutId);
                SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "Budget_USP", arrParams.ToArray());
                val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            }

            return val;
        }

        #endregion
        #region Income Budget
        public long InsertUpdateIncomeBudget(ProjectIncomeBudget project)
        {

            long val = 0;
            int index = 0;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();
            List.Columns.Add("IB_typeId", typeof(int));
            List.Columns.Add("IB_ContributorId", typeof(int));
            List.Columns.Add("IB_Description", typeof(string));
            List.Columns.Add("IB_MonthId", typeof(int));
            List.Columns.Add("IB_Amount", typeof(decimal));
            List.Columns.Add("IB_Year", typeof(string));
            List.Columns.Add("IB_Group", typeof(int));
            List.Columns.Add("IB_Accounting", typeof(int));
            foreach (var MD in project.IncomeBudget)
            {
                index++;
                foreach (var item in MD.MonthList)
                {
                    DataRow dr = List.NewRow();
                    dr["IB_typeId"] = MD.TypeId;
                    dr["IB_ContributorId"] = MD.ContributorId;
                    dr["IB_Description"] = MD.Description;
                    dr["IB_MonthId"] = item.Id;
                    dr["IB_Amount"] = item.Value;
                    dr["IB_Year"] = project.YearId;
                    dr["IB_Group"] = index;
                    dr["IB_Accounting"] = MD.Accounting;
                    List.Rows.Add(dr);
                }
            }
            arrParams.Add(new SqlParameter("@IncomeBudget", List));
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            arrParams.Add(new SqlParameter("@IB_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            arrParams.Add(new SqlParameter("@YearId", project.YearId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "IncomeBudget_USP", arrParams.ToArray());
            val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateClientSMME
        public long InsertUpdateClienttWiseSMME(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("CWS_SMMEId", typeof(int));


            foreach (var MD in project.ClientWiseSMME)
            {
                DataRow dr = List.NewRow();
                dr["CWS_SMMEId"] = MD.CWS_SMMEId;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@CWS_ClientId", project.PE_Id));
            arrParams.Add(new SqlParameter("@ClientWiseSSME", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ClientWiseSMME_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectWiseTaskComment
        public long InsertUpdateProjectWiseTaskComment(ProjectTaskWiseComment project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@PTWC_TaskId", project.PTWC_TaskId));
            arrParams.Add(new SqlParameter("@PTWC_ProjectId", project.PTWC_ProjectId));
            arrParams.Add(new SqlParameter("@PTWC_Comment", project.PTWC_Comment));
            arrParams.Add(new SqlParameter("@PTWC_File", project.PTWC_File));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectTaskWiseComment_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateQuestion
        public long InsertUpdateQuestion(List<QA> QA, string storeproc, int UserId)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();

            List.Columns.Add("UQM_QM_ID", typeof(int));

            List.Columns.Add("UQM_Answer", typeof(string));

            foreach (var MD in QA)
            {
                DataRow dr = List.NewRow();
                dr["UQM_QM_ID"] = MD.QAId;
                if (MD.Type == "R")
                {
                    MD.Answer = MD.RadioOptions == true ? "Yes" : "No";
                }
                dr["UQM_Answer"] = MD.Answer;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertQuestion"));
            arrParams.Add(new SqlParameter("@UserId", UserId));

            arrParams.Add(new SqlParameter("@UserQuestionMap", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, storeproc, arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateAssestment
        public long InsertUpdateAssestment(List<QuestionView> QA, string storeproc, int UserId)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();

            List.Columns.Add("UQM_QM_ID", typeof(int));

            List.Columns.Add("UQM_Answer", typeof(string));

            foreach (var MD in QA)
            {
                DataRow dr = List.NewRow();
                dr["UQM_QM_ID"] = MD.QM_Id;
                if (MD.QM_Container == "R")
                {
                    MD.UQM_Answer = MD.RadioOptions == true ? "Yes" : "No";
                }
                dr["UQM_Answer"] = MD.UQM_Answer;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertAssesmentQuestion"));
            arrParams.Add(new SqlParameter("@UserId", UserId));

            arrParams.Add(new SqlParameter("@UserQuestionMap", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, storeproc, arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateEmployeeMaster
        public long InsertUpdateEmployeeMaster(EmployeeMaster emp)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable ItemLedger = new DataTable();

            ItemLedger.Columns.Add("ED_ExamName", typeof(String));
            ItemLedger.Columns.Add("ED_GroupSubject", typeof(String));
            ItemLedger.Columns.Add("ED_PassingYear", typeof(String));
            ItemLedger.Columns.Add("ED_GPA", typeof(String));
            foreach (var MD in emp.List)
            {
                DataRow dr = ItemLedger.NewRow();
                dr["ED_ExamName"] = MD.ED_ExamName;
                dr["ED_GroupSubject"] = MD.ED_GroupSubject;
                dr["ED_PassingYear"] = MD.ED_PassingYear;
                dr["ED_GPA"] = MD.ED_GPA;
                ItemLedger.Rows.Add(dr);
            }

            DataTable emplistt = new DataTable();
            emplistt.Columns.Add("EMT_Name", typeof(String));
            emplistt.Columns.Add("EMT_File", typeof(String));


            foreach (var MD in emp.empList)
            {
                DataRow dr = emplistt.NewRow();

                dr["EMT_Name"] = MD.EMT_Name;
                dr["EMT_File"] = MD.EMT_File;
                emplistt.Rows.Add(dr);
            }
            if (emp.EM_EmpId == 0 || emp.EM_EmpId == null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }
            else
            {

                if (emp.IsActive == false)
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "Deactivated"));

                }
                else if (emp.EM_Basic >= 0 && (emp.EM_AccountNo != "" || emp.EM_AccountNo != null))
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "UpdateSalary"));

                }
                else if (emp.List.Count > 0)
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "UpdateExam"));

                }
                else if (emp.empList.Count > 0)
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "UpdateDocument"));

                }
                else if (emp.PrevWorkingList.Count > 0)
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "UpdatePrevWorking"));

                }

                else if ((emp.EM_ManagerId != 0 || emp.EM_ManagerId != null) && (emp.EM_EmpName == "" || emp.EM_EmpName == null))
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "UpdateManagerDetails"));

                }
                else if (emp.EM_EmpName != "" || emp.EM_EmpName != null)
                {
                    arrParams.Add(new SqlParameter("@TransactionType", "Update"));
                }
                //if(emp.EM_Status== "UpdateManager")
                //{
                //    arrParams.Add(new SqlParameter("@TransactionType", "UpdateManagerDetails"));
                //}
                //else if (emp.IsActive == false)
                //{
                //    arrParams.Add(new SqlParameter("@TransactionType", "Deactivated"));

                //}
                //else
                //{
                //    arrParams.Add(new SqlParameter("@TransactionType", "Update"));

                //}

            }
            arrParams.Add(new SqlParameter("@EM_EmpId", emp.EM_EmpId));
            arrParams.Add(new SqlParameter("@EM_EmpName", emp.EM_EmpName));
            arrParams.Add(new SqlParameter("@EM_EmpDOJ", emp.EM_EmpDOJ));
            arrParams.Add(new SqlParameter("@EM_EmpDesignationId", emp.EM_EmpDesignationId));
            arrParams.Add(new SqlParameter("@EM_EmpContactNo", emp.EM_EmpContactNo));
            arrParams.Add(new SqlParameter("@EM_EmpAddress", emp.EM_EmpAddress));
            arrParams.Add(new SqlParameter("@EM_TotalSal", emp.EM_TotalSal));
            arrParams.Add(new SqlParameter("@EM_EmpFathers", emp.EM_EmpFathers));
            arrParams.Add(new SqlParameter("@EM_Degree", emp.EM_Degree));
            arrParams.Add(new SqlParameter("@EM_NIDNo", emp.EM_NIDNo));
            arrParams.Add(new SqlParameter("@EM_ProfilePic", emp.EM_ProfilePic));
            arrParams.Add(new SqlParameter("@EM_Email", emp.EM_Email));
            arrParams.Add(new SqlParameter("@EM_Basic", emp.EM_Basic));
            arrParams.Add(new SqlParameter("@EM_IsSuper", emp.EM_IsSuper));

            arrParams.Add(new SqlParameter("@EM_HRA", emp.EM_HRA));
            arrParams.Add(new SqlParameter("@EM_DA", emp.EM_DA));
            arrParams.Add(new SqlParameter("@EM_MedicalAllowance", emp.EM_MedicalAllowance));
            arrParams.Add(new SqlParameter("@EM_Conveyance", emp.EM_Conveyance));
            arrParams.Add(new SqlParameter("@EmployeeMasterTransactionList", emplistt));
            arrParams.Add(new SqlParameter("@EM_TelephoneAllowance", emp.EM_TelephoneAllowance));

            arrParams.Add(new SqlParameter("@EM_ProvidentFund", emp.EM_ProvidentFund));
            arrParams.Add(new SqlParameter("@EM_Ptax", emp.EM_Ptax));
            arrParams.Add(new SqlParameter("@EM_TDS", emp.EM_TDS));

            arrParams.Add(new SqlParameter("@EM_DepartmentID", emp.EM_DepartmentID));
            arrParams.Add(new SqlParameter("@EM_Bank", emp.EM_Bank));
            arrParams.Add(new SqlParameter("@EM_AccountNo", emp.EM_AccountNo));
            arrParams.Add(new SqlParameter("@EM_IFSC", emp.EM_IFSC));
            arrParams.Add(new SqlParameter("@UM_Id", emp.UserID));
            arrParams.Add(new SqlParameter("@EM_Sex", emp.EM_Sex));
            arrParams.Add(new SqlParameter("@CompanyID", emp.CompanyID));
            arrParams.Add(new SqlParameter("@EM_MotherName", emp.EM_MotherName));
            arrParams.Add(new SqlParameter("@EM_ZipCode", emp.EM_ZipCode));
            arrParams.Add(new SqlParameter("@EM_IsManager", emp.EM_IsManager));
            arrParams.Add(new SqlParameter("@EM_ManagerId", emp.EM_ManagerId));


            arrParams.Add(new SqlParameter("@EM_DOB", emp.EM_DOB));
            arrParams.Add(new SqlParameter("@EM_PrevExp", emp.EM_PrevExp));
            arrParams.Add(new SqlParameter("@EM_Refferrence1", emp.EM_Refferrence1));
            arrParams.Add(new SqlParameter("@EM_Refferrence2", emp.EM_Refferrence2));
            arrParams.Add(new SqlParameter("@EM_Ref1MobNo", emp.EM_Ref1MobNo));
            arrParams.Add(new SqlParameter("@EM_Ref1MobNo2", emp.EM_Ref1MobNo2));
            arrParams.Add(new SqlParameter("@EM_Ref1City", emp.EM_Ref1City));
            arrParams.Add(new SqlParameter("@EM_Ref1City2", emp.EM_Ref1City2));
            arrParams.Add(new SqlParameter("@EM_BranchName", emp.EM_BranchName));
            arrParams.Add(new SqlParameter("@ExamDetails", ItemLedger));
            arrParams.Add(new SqlParameter("@EM_PunchingCode", emp.EM_PunchingCode));
            arrParams.Add(new SqlParameter("@EM_DeactivateReason", emp.EM_DeactivateReason));
            arrParams.Add(new SqlParameter("@EM_DeactivateDate", emp.EM_DeactivateDate));
            arrParams.Add(new SqlParameter("@EM_StateId", emp.EM_StateId));

            arrParams.Add(new SqlParameter("@UserId", emp.UserID));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion
        #region GetEmployeeMasterSingle
        public EmployeeMaster GetEmployeeMasterSingle(EmployeeMaster emp)
        {
            EmployeeMaster employeObj = new EmployeeMaster();
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "Select"));
            arrParams.Add(new SqlParameter("@EM_EmpId", emp.EM_EmpId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    employeObj.EM_EmpId = Convert.ToInt32(rdr["EM_EmpId"]);
                    employeObj.EM_EmpCode = Convert.ToString(rdr["EM_EmpCode"]);
                    employeObj.EM_EmpName = Convert.ToString(rdr["EM_EmpName"]);
                    employeObj.EM_EmpDOJ = Convert.ToString(rdr["EM_EmpDOJ"]);
                    employeObj.EM_EmpDesignationId = Convert.ToInt32(rdr["EM_EmpDesignationId"]);
                    employeObj.EM_EmpAddress = Convert.ToString(rdr["EM_EmpAddress"]);
                    employeObj.EM_EmpFathers = Convert.ToString(rdr["EM_EmpFathers"]);
                    employeObj.EM_TotalSal = Convert.ToDecimal(rdr["EM_TotalSal"]);
                    employeObj.EM_EmpContactNo = Convert.ToString(rdr["EM_EmpContactNo"]);
                    employeObj.EM_Degree = Convert.ToString(rdr["EM_Degree"]);
                    employeObj.EM_NIDNo = Convert.ToString(rdr["EM_NIDNo"]);
                    employeObj.EM_ProfilePic = Convert.ToString(rdr["EM_ProfilePic"]);
                    employeObj.EM_DA = Convert.ToDecimal(rdr["EM_DA"]);
                    employeObj.EM_Basic = Convert.ToDecimal(rdr["EM_Basic"]);
                    employeObj.EM_Conveyance = Convert.ToDecimal(rdr["EM_Conveyance"]);
                    employeObj.EM_HRA = Convert.ToDecimal(rdr["EM_HRA"]);
                    employeObj.EM_Email = Convert.ToString(rdr["EM_Email"]);
                    employeObj.EM_StateId = Convert.ToInt32(rdr["EM_StateId"]);

                    employeObj.EM_MedicalAllowance = Convert.ToDecimal(rdr["EM_MedicalAllowance"]);
                    employeObj.EM_TelephoneAllowance = Convert.ToDecimal(rdr["EM_TelephoneAllowance"]);

                    //employeObj.EM_Leave = Convert.ToInt32(rdr["EM_Leave"]);
                    employeObj.EM_Ptax = Convert.ToDecimal(rdr["EM_Ptax"]);
                    employeObj.EM_ProvidentFund = Convert.ToDecimal(rdr["EM_ProvidentFund"]);
                    employeObj.EM_TDS = Convert.ToDecimal(rdr["EM_TDS"]);

                    employeObj.EM_DepartmentID = Convert.ToInt32(rdr["EM_DepartmentID"]);
                    employeObj.EM_Bank = Convert.ToString(rdr["EM_Bank"]);
                    employeObj.EM_AccountNo = Convert.ToString(rdr["EM_AccountNo"]);
                    employeObj.EM_IFSC = Convert.ToString(rdr["EM_IFSC"]);

                    employeObj.EM_Sex = Convert.ToString(rdr["EM_Sex"]);
                    employeObj.EM_IsSuper = Convert.ToBoolean(rdr["EM_IsSuper"]);
                    employeObj.EM_IsManager = Convert.ToInt32(rdr["EM_IsManager"]);

                    employeObj.EM_Ref1MobNo = Convert.ToString(rdr["EM_Ref1MobNo"]);
                    employeObj.EM_Ref1MobNo2 = Convert.ToString(rdr["EM_Ref1MobNo2"]);

                    employeObj.EM_Ref1City = Convert.ToString(rdr["EM_Ref1City"]);
                    employeObj.EM_Ref1City2 = Convert.ToString(rdr["EM_Ref1City2"]);
                    employeObj.EM_Refferrence1 = Convert.ToString(rdr["EM_Refferrence1"]);
                    employeObj.EM_Refferrence2 = Convert.ToString(rdr["EM_Refferrence2"]);

                    employeObj.IsActive = Convert.ToBoolean(rdr["IsActive"]);
                    employeObj.EM_DOB = Convert.ToString(rdr["EM_DOB"]);
                    employeObj.EM_BranchName = Convert.ToString(rdr["EM_BranchName"]);
                    employeObj.EM_MotherName = Convert.ToString(rdr["EM_MotherName"]);
                    employeObj.EM_ZipCode = Convert.ToString(rdr["EM_ZipCode"]);

                    employeObj.EM_PrevExp = Convert.ToString(rdr["EM_PrevExp"]);
                    employeObj.EM_PunchingCode = Convert.ToString(rdr["EM_PunchingCode"]);
                    employeObj.EM_ManagerId = Convert.ToInt32(rdr["EM_ManagerId"]);
                    employeObj.ManagerName = Convert.ToString(rdr["ManagerName"]);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return employeObj;
        }
        public List<EmployeeMasterTransaction> GetEmployeeMasterTransactionList(int? Id)
        {
            List<EmployeeMasterTransaction> CLMObjList = new List<EmployeeMasterTransaction>();
            EmployeeMasterTransaction clinicalObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "SelectTran"));

            arrParams.Add(new SqlParameter("@EM_EmpId", Id));


            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    clinicalObj = new EmployeeMasterTransaction();
                    clinicalObj.EMT_Name = Convert.ToString(rdr["EMT_Name"]);
                    clinicalObj.EMT_File = Convert.ToString(rdr["EMT_File"]);

                    CLMObjList.Add(clinicalObj);
                }
                rdr.Close();

            }
            rdr.Dispose();
            return CLMObjList;
        }
        public List<ExamDetails> GetExamDetailsMasterTransactionList(int? Id)
        {
            List<ExamDetails> CLMObjList = new List<ExamDetails>();
            ExamDetails clinicalObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "SelectExamDetails"));

            arrParams.Add(new SqlParameter("@EM_EmpId", Id));


            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    clinicalObj = new ExamDetails();
                    clinicalObj.ED_ExamName = Convert.ToString(rdr["ED_ExamName"]);
                    clinicalObj.ED_GPA = Convert.ToString(rdr["ED_GPA"]);
                    clinicalObj.ED_GroupSubject = Convert.ToString(rdr["ED_GroupSubject"]);
                    clinicalObj.ED_PassingYear = Convert.ToString(rdr["ED_PassingYear"]);

                    CLMObjList.Add(clinicalObj);
                }
                rdr.Close();

            }
            rdr.Dispose();
            return CLMObjList;
        }
        #endregion
        #region Menu For User Access
        public List<MainMenu> GetMainMenuForUser(int moduleId, int userId, int? UM_Id)
        {
            List<MainMenu> ObjMainMenu = new List<MainMenu>();
            MainMenu mainObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "MainMenu"));
            arrParams.Add(new SqlParameter("@ModuleId", moduleId));
            arrParams.Add(new SqlParameter("@UM_UserId", userId));
            arrParams.Add(new SqlParameter("@UM_Id", UM_Id));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "UserMaster_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    mainObj = new MainMenu();
                    mainObj.MenuId = Convert.ToInt32(rdr["MenuID"].ToString());
                    mainObj.MainMenuURL = rdr["MenuURL"].ToString();
                    mainObj.MainMenuItem = rdr["MenuName"].ToString();
                    mainObj.MenuIcon = rdr["Icon"].ToString();
                    mainObj.Checked = rdr["checked"].ToString();
                    ObjMainMenu.Add(mainObj);
                }
                rdr.Close();
            }
            rdr.Dispose();

            return ObjMainMenu;
        }
        public List<SubMenu> GetSubMenuForUser(int moduleId, int userId, int? UM_Id)
        {
            List<SubMenu> ObjSubMenu = new List<SubMenu>();
            SubMenu submainObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "ChildMenu"));
            arrParams.Add(new SqlParameter("@ModuleId", moduleId));
            arrParams.Add(new SqlParameter("@UM_UserId", userId));
            arrParams.Add(new SqlParameter("@UM_Id", UM_Id));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "UserMaster_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    submainObj = new SubMenu();
                    submainObj.MenuId = Convert.ToInt32(rdr["MenuID"].ToString());
                    submainObj.SubMenuURL = rdr["MenuURL"].ToString();
                    submainObj.SubMenuItem = rdr["MenuName"].ToString();
                    submainObj.SubMenuIcon = rdr["Icon"].ToString();
                    submainObj.MainMenuID = Convert.ToInt32(rdr["ParentMenuID"].ToString());
                    submainObj.Checked = rdr["ISchecked"].ToString();
                    ObjSubMenu.Add(submainObj);
                }
                rdr.Close();
            }
            rdr.Dispose();

            return ObjSubMenu;
        }
        #endregion
        public long InsertUpdateUser(UserModel entity)
        {
            DataTable List = new DataTable();
            List.Columns.Add("MenuId", typeof(int));
            foreach (var MD in entity.mainmenuList)
            {
                if (MD.MenuId != null)
                {
                    DataRow dr = List.NewRow();
                    dr["MenuId"] = MD.MenuId;
                    List.Rows.Add(dr);
                }
            }
            List<SqlParameter> arrParams = new List<SqlParameter>();
            if ((entity.Password != null) || entity.Password != "")
            {
                arrParams.Add(new SqlParameter("@TransactionType", "UpdatePassword"));
            }
            else
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }


            arrParams.Add(new SqlParameter("@UM_Id", entity.UserID));
            arrParams.Add(new SqlParameter("@UM_UserId", entity.UserLoginID));
            arrParams.Add(new SqlParameter("@UM_Name", entity.UserName));
            arrParams.Add(new SqlParameter("@UM_Password", entity.Password));
            arrParams.Add(new SqlParameter("@UM_Active", entity.status));
            arrParams.Add(new SqlParameter("@IsSuper", entity.IsSuper));

            arrParams.Add(new SqlParameter("@MenuPermission", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "UserMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #region InsertUpdateProjectWiseEmp
        public long InsertUpdateProjectWiseEmp(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("PWE_EmpId", typeof(int));


            foreach (var MD in project.prjectWiseEmp)
            {
                DataRow dr = List.NewRow();
                dr["PWE_EmpId"] = MD.PWE_EmpId;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertProjectWiseEmp"));

            arrParams.Add(new SqlParameter("@ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@ProjectWiseEmployee", List));
            //arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            //arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectTaskWiseEmp
        public long InsertUpdateProjectTaskWiseEmp(ProjectEntry project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("PTE_EmpId", typeof(int));


            foreach (var MD in project.prjectWiseEmp)
            {
                DataRow dr = List.NewRow();
                dr["PTE_EmpId"] = MD.PWE_EmpId;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertProjectTaskWiseEmp"));

            arrParams.Add(new SqlParameter("@ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@TaskId", project.TaskId));
            arrParams.Add(new SqlParameter("@ProjectTaskWiseEmp", List));
            //arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            //arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseTask_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        public List<EmployeePrevWorkingDetails> GetEmployeeMasterPrevWorkingList(int? Id)
        {
            List<EmployeePrevWorkingDetails> CLMObjList = new List<EmployeePrevWorkingDetails>();
            EmployeePrevWorkingDetails clinicalObj = null;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@TransactionType", "SelectPrevEmplyoment"));

            arrParams.Add(new SqlParameter("@EM_EmpId", Id));


            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.Decimal);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "EmployeeMaster_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    clinicalObj = new EmployeePrevWorkingDetails();
                    clinicalObj.EPWD_Id = Convert.ToInt32(rdr["EPWD_Id"]);
                    clinicalObj.EPWD_EmployeeId = Convert.ToInt32(rdr["EPWD_EmployeeId"]);
                    clinicalObj.EPWD_CompanyName = Convert.ToString(rdr["EPWD_CompanyName"]);
                    clinicalObj.EPWD_CompanyName = Convert.ToString(rdr["EPWD_CompanyName"]);
                    clinicalObj.EPWD_DOJ = Convert.ToString(rdr["EPWD_DOJ"]);
                    clinicalObj.EPWD_RealiseDate = Convert.ToString(rdr["EPWD_RealiseDate"]);
                    clinicalObj.EMPWD_Designation = Convert.ToString(rdr["EMPWD_Designation"]);
                    clinicalObj.EMPWD_Details = Convert.ToString(rdr["EMPWD_Details"]);
                    CLMObjList.Add(clinicalObj);
                }
                rdr.Close();

            }
            rdr.Dispose();
            return CLMObjList;
        }
        public long InsertUpdateAddTraining(AddTraining entity)
        {

            List<SqlParameter> arrParams = new List<SqlParameter>();
            if (entity.TE_ID != null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Update"));
            }
            else
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }


            arrParams.Add(new SqlParameter("@TE_Id", entity.TE_ID));
            arrParams.Add(new SqlParameter("@TE_Name", entity.TE_Name));
            arrParams.Add(new SqlParameter("@TE_TrainingTypeID", entity.TE_TrainingTypeId));
            arrParams.Add(new SqlParameter("@TE_FromDate", entity.TE_FromDate));
            arrParams.Add(new SqlParameter("@TE_ToDate", entity.TE_ToDate));
            arrParams.Add(new SqlParameter("@TE_Pic", entity.TE_Pic));
            arrParams.Add(new SqlParameter("@TE_Certificate", entity.TE_Certificate));
            arrParams.Add(new SqlParameter("@TE_Description", entity.TE_Description));
            arrParams.Add(new SqlParameter("@UserId", entity.UserId));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "TrainingEntry_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #region InsertUpdateEmployeeLeaveSettings
        public long InsertUpdateEmployeeLeaveSettings(EmpLeaveSchedule emp)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@ELS_To", emp.ELS_To));
            arrParams.Add(new SqlParameter("@ELS_From", emp.ELS_From));
            arrParams.Add(new SqlParameter("@ELS_EM_Id", emp.ELS_EM_Id));
            arrParams.Add(new SqlParameter("@ELS_Leave", emp.ELS_Leave));
            arrParams.Add(new SqlParameter("@ELS_WeekLeave", emp.ELS_WeekLeave));

            arrParams.Add(new SqlParameter("@ELS_EarnedLeave", emp.ELS_EarnedLeave));
            arrParams.Add(new SqlParameter("@ELS_CasualLeave", emp.ELS_CasualLeave));
            arrParams.Add(new SqlParameter("@ELS_Medical", emp.ELS_Medical));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "EmpLeaveSchedule_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        public long InsertUpdateTrainingWiseEmployee(TrainingWiseEmployee project)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("TWE_EmpId", typeof(int));


            foreach (var MD in project.trainingWiseEmployee)
            {
                DataRow dr = List.NewRow();
                dr["TWE_EmpId"] = MD.TWE_EmpId;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@TWE_TE_Id", project.TWE_TE_Id));
            arrParams.Add(new SqlParameter("@TrainingWiseEmployee", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "TrainingWiseEmployee_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        public long InsertUpdateTrainingWiseDocuments(TrainingWiseDocuments doc)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            DataTable List = new DataTable();


            List.Columns.Add("TWD_Documents", typeof(string));
            List.Columns.Add("TWD_DocName", typeof(string));

            foreach (var MD in doc.TrainingWiseDocumentsList)
            {
                DataRow dr = List.NewRow();
                dr["TWD_Documents"] = MD.TWD_Documents;
                dr["TWD_DocName"] = MD.TWD_DocName;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            arrParams.Add(new SqlParameter("@TWD_TE_Id", doc.TWD_TE_Id));
            arrParams.Add(new SqlParameter("@TrainingWiseDocuments", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "TrainingWiseDocuments_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        public long InsertUpdateTrainingPhase(TrainingPhase TrainingPhase)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            arrParams.Add(new SqlParameter("@TP_Title", TrainingPhase.TP_Title));
            arrParams.Add(new SqlParameter("@TP_FromDate", TrainingPhase.TP_FromDate));
            arrParams.Add(new SqlParameter("@TP_ToDate", TrainingPhase.TP_ToDate));
            arrParams.Add(new SqlParameter("@TWD_TE_Id", TrainingPhase.TWD_TE_Id));
            arrParams.Add(new SqlParameter("@TP_Id", TrainingPhase.TP_Id));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "TrainingPhase_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #region Project Indicator
        public long InsertUpdateProjectIndicator(ProjectIncomeBudget project)
        {

            long val = 0;
            int index = 0;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();
            List.Columns.Add("PI_IndicatorTypeId", typeof(int));
            List.Columns.Add("PI_Description", typeof(string));
            List.Columns.Add("PI_MonthId", typeof(int));
            List.Columns.Add("PI_Number", typeof(decimal));
            List.Columns.Add("PI_Year", typeof(string));
            List.Columns.Add("PI_Group", typeof(int));
            foreach (var MD in project.ProjectIndicator)
            {
                index++;
                foreach (var item in MD.MonthList)
                {
                    DataRow dr = List.NewRow();
                    dr["PI_IndicatorTypeId"] = MD.IndicatorTypeId;
                    dr["PI_Description"] = MD.Description;
                    dr["PI_MonthId"] = item.Id;
                    dr["PI_Number"] = item.Value;
                    dr["PI_Year"] = project.YearId;
                    dr["PI_Group"] = index;
                    List.Rows.Add(dr);
                }
            }
            arrParams.Add(new SqlParameter("@ProjectIndicator", List));
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            arrParams.Add(new SqlParameter("@PI_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            arrParams.Add(new SqlParameter("@YearId", project.YearId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectIndicator_USP", arrParams.ToArray());
            val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region Project Performance Indicator
        public long InsertUpdateProjectPerformanceIndicator(ProjectIncomeBudget project)
        {

            long val = 0;
            int index = 0;
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();
            List.Columns.Add("PPI_IndicatorTypeId", typeof(int));
            List.Columns.Add("PPI_Description", typeof(string));
            List.Columns.Add("PPI_MonthId", typeof(int));
            List.Columns.Add("PPI_Number", typeof(decimal));
            List.Columns.Add("PPI_InputNumber", typeof(decimal));
            List.Columns.Add("PPI_Year", typeof(string));
            List.Columns.Add("PPI_Group", typeof(int));
            foreach (var MD in project.ProjectIndicator)
            {
                index++;
                foreach (var item in MD.MonthList)
                {
                    DataRow dr = List.NewRow();
                    dr["PPI_IndicatorTypeId"] = MD.IndicatorTypeId;
                    dr["PPI_Description"] = MD.Description;
                    dr["PPI_MonthId"] = item.Id;
                    dr["PPI_Number"] = item.Value;
                    dr["PPI_InputNumber"] = item.InputNumber;
                    dr["PPI_Year"] = project.YearId;
                    dr["PPI_Group"] = index;
                    List.Rows.Add(dr);
                }
            }
            arrParams.Add(new SqlParameter("@ProjectPerformanceIndicator", List));
            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            arrParams.Add(new SqlParameter("@PPI_ProjectId", project.PE_Id));
            arrParams.Add(new SqlParameter("@CompanyID", project.CompanyID));
            arrParams.Add(new SqlParameter("@FyId", project.FYId));
            arrParams.Add(new SqlParameter("@UserId", project.UserId));
            arrParams.Add(new SqlParameter("@YearId", project.YearId));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectPerformanceIndicator_USP", arrParams.ToArray());
            val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        public long InsertUpdateEmployeePrevWorking(EmployeePrevWorkingDetails EmployeePrevWorkingDetails)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            if (EmployeePrevWorkingDetails.EPWD_Id > 0)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Update"));
            }
            else
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }
            arrParams.Add(new SqlParameter("@EPWD_Id", EmployeePrevWorkingDetails.EPWD_Id));
            arrParams.Add(new SqlParameter("@EPWD_EmployeeId", EmployeePrevWorkingDetails.EPWD_EmployeeId));
            arrParams.Add(new SqlParameter("@EPWD_CompanyName", EmployeePrevWorkingDetails.EPWD_CompanyName));
            arrParams.Add(new SqlParameter("@EPWD_DOJ", EmployeePrevWorkingDetails.EPWD_DOJ));
            arrParams.Add(new SqlParameter("@EPWD_RealiseDate", EmployeePrevWorkingDetails.EPWD_RealiseDate));
            arrParams.Add(new SqlParameter("@EMPWD_Designation", EmployeePrevWorkingDetails.EMPWD_Designation));
            arrParams.Add(new SqlParameter("@EMPWD_Details", EmployeePrevWorkingDetails.EMPWD_Details));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "EmployeePrevWorkingDetails_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #region InsertUpdateProjectAssestment
        public long InsertUpdateProjectAssestment(List<ProjectQuestionView> QA, string storeproc, int UserId, int projectId)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();

            List.Columns.Add("PUQM_PQM_ID", typeof(int));

            List.Columns.Add("PUQM_Answer", typeof(string));

            foreach (var MD in QA)
            {
                DataRow dr = List.NewRow();
                dr["PUQM_PQM_ID"] = MD.PWQ_PQM_Id;
                if (MD.PQM_Container == "R")
                {
                    MD.PQM_Answer = MD.RadioOptions == true ? "Yes" : "No";
                }
                dr["PUQM_Answer"] = MD.PQM_Answer;

                List.Rows.Add(dr);
            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertProjectAssesmentQuestion"));
            arrParams.Add(new SqlParameter("@PUQM_ProjectId", projectId));
            arrParams.Add(new SqlParameter("@UserId", UserId));
            arrParams.Add(new SqlParameter("@ProjectUserQuestionMap", List));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, storeproc, arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion
        #region InsertUpdateProjectWiseQuestion
        public long InsertUpdateProjectWiseQuestion(ProjectWiseQuestion emp)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));

            DataTable dt = new DataTable();

            dt.Columns.Add("PWQ_ProjectId", typeof(int));
            dt.Columns.Add("PWQ_PQM_Id", typeof(int));



            foreach (var MD in emp.ProjectQuestionList)
            {
                DataRow dr = dt.NewRow();
                dr["PWQ_ProjectId"] = MD.PWQ_ProjectId;
                dr["PWQ_PQM_Id"] = MD.PWQ_PQM_Id;

                dt.Rows.Add(dr);
            }

            arrParams.Add(new SqlParameter("@PWQ_ProjectId", emp.PWQ_ProjectId));
            arrParams.Add(new SqlParameter("@UserId", emp.UserID));
            arrParams.Add(new SqlParameter("@ProjectWiseQuestion", dt));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseQuestion_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion

        #region InsertUpdateEmpLeaveApplication
        public long InsertUpdateEmpLeaveApplication(EmpLeaveApplication emp)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            if (emp.ELA_Id == 0 || emp.ELA_Id == null)
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Insert"));
            }
            else
            {
                arrParams.Add(new SqlParameter("@TransactionType", "Approved"));
            }


            arrParams.Add(new SqlParameter("@UserId", emp.UserId));
            arrParams.Add(new SqlParameter("@ELA_Id", emp.ELA_Id));
            arrParams.Add(new SqlParameter("@ELA_To", emp.ELA_To));
            arrParams.Add(new SqlParameter("@ELA_From", emp.ELA_From));
            arrParams.Add(new SqlParameter("@ELA_EM_Id", emp.ELA_EM_Id));
            arrParams.Add(new SqlParameter("@ELA_Type", emp.ELA_Type));
            arrParams.Add(new SqlParameter("@ELA_TotalDays", emp.ELA_TotalDays));
            arrParams.Add(new SqlParameter("@ELA_ELS_Id", emp.ELA_ELS_Id));
            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "EmpLeaveApplication_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }

        #endregion

        #region InsertUpdateProjectWisePhase
        public long InsertUpdateProjectWisePhase(ProjectPhase phase)
        {
            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "Insert"));


            arrParams.Add(new SqlParameter("@PP_ProjectId", phase.PP_ProjectId));
            arrParams.Add(new SqlParameter("@UserId", phase.UserId));

            arrParams.Add(new SqlParameter("@PP_ToDate", phase.PP_ToDate));
            arrParams.Add(new SqlParameter("@PP_FromDate", phase.PP_FromDate));

            arrParams.Add(new SqlParameter("@PP_Description", phase.PP_Description));
            arrParams.Add(new SqlParameter("@PP_Id", phase.PP_Id));
            arrParams.Add(new SqlParameter("@PP_Name", phase.PP_Name));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectPhase_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion
        #region InsertUpdateProjectWisePhase
        public long InsertUpdateProjectTaskWisePhase(ProjectPhase phase)
        {

            List<SqlParameter> arrParams = new List<SqlParameter>();
            DataTable List = new DataTable();
            List.Columns.Add("PWP_TaskId", typeof(int));

            foreach (var MD in phase.projectTaskWisePase)
            {
                DataRow dr = List.NewRow();
                dr["PWP_TaskId"] = MD.PWP_TaskId;
                List.Rows.Add(dr);

            }
            arrParams.Add(new SqlParameter("@TransactionType", "InsertPhaseWiseTask"));
            arrParams.Add(new SqlParameter("@PP_ProjectId", phase.PP_ProjectId));
            arrParams.Add(new SqlParameter("@UserId", phase.UserId));
            arrParams.Add(new SqlParameter("@ProjectTaskWisePase", List));
            arrParams.Add(new SqlParameter("@PP_Id", phase.PP_Id));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectPhase_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion

        #region UpdateProjectTask
        public long UpdateProjectTask(ProjectWiseTask phase)
        {

            List<SqlParameter> arrParams = new List<SqlParameter>();

            arrParams.Add(new SqlParameter("@TransactionType", "UpdateStatus"));
            arrParams.Add(new SqlParameter("@PWT_Status", phase.PWT_Status));
            arrParams.Add(new SqlParameter("@UserId", phase.UserId));

            arrParams.Add(new SqlParameter("@PWT_Id", phase.PWT_Id));

            SqlParameter OutPutId = new SqlParameter("@OutPutId", SqlDbType.BigInt);
            OutPutId.Direction = ParameterDirection.Output;
            arrParams.Add(OutPutId);
            SqlHelper.ExecuteNonQuery(GetConnectionString(), CommandType.StoredProcedure, "ProjectWiseTask_USP", arrParams.ToArray());
            long val = Convert.ToInt64(arrParams[arrParams.Count - 1].Value);
            return val;
        }
        #endregion



        public List<QuestionView> GetAsessmentQuestionAnswer(int? Id, string type)
        {
            return IGetAsessmentQuestionAnswer(Id, type);
        }

        public List<QuestionCategory> GetQuestionCategory(int? Id, string type)
        {
            return IGetQuestionCategory(Id, type);
        }

        public UserModel GetUserDetails(int? userId)
        {
            return GetUserDetailsByUser(userId);
        }

        public List<QuestionView> IGetAsessmentQuestionAnswer(int? Id, string type)
        {
            return IIGetAsessmentQuestionAnswer(Id, type);
        }
        private List<QuestionView> IIGetAsessmentQuestionAnswer(int? Id, string type)
        {

            List<QuestionView> modules = new List<QuestionView>();
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@UserId", Id));
            arrParams.Add(new SqlParameter("@Type", type));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "AsessmentQuestionAnswer_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    modules.Add(new QuestionView()
                    {
                        QM_Id = Convert.ToInt32(rdr["QM_Id"]),
                        QM_QC_Id = Convert.ToInt32(rdr["QM_QC_Id"]),
                        QM_Name = Convert.ToString(rdr["QM_Name"]),
                        UQM_Answer = Convert.ToString(rdr["UQM_Answer"]),
                        QM_Container = Convert.ToString(rdr["QM_Container"]),
                        Required = Convert.ToString(rdr["Required"]),
                        RadioOptions = Convert.ToBoolean(rdr["RadioOptions"])
                    });
                }
                rdr.Close();
            }
            rdr.Dispose();
            return modules;
        }

        public List<QuestionCategory> IGetQuestionCategory(int? Id, string type)
        {
            return IIIGetQuestionCategory(Id, type);
        }
        private List<QuestionCategory> IIIGetQuestionCategory(int? Id, string type)
        {

            List<QuestionCategory> modules = new List<QuestionCategory>();
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@UserId", Id));
            arrParams.Add(new SqlParameter("@Type", type));
            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "GetQuestionCategory_USP", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    modules.Add(new QuestionCategory()
                    {
                        Id = Convert.ToInt32(rdr["Id"]),
                        Name = Convert.ToString(rdr["Name"]),
                    });
                }
                rdr.Close();
            }
            rdr.Dispose();
            return modules;
        }

        public UserModel GetUserDetailsByUser(int? userId)
        {
            return GetDetailsByUser(userId);
        }
        private UserModel GetDetailsByUser(int? userId)
        {
            UserModel modules = new UserModel();
            List<SqlParameter> arrParams = new List<SqlParameter>();
            arrParams.Add(new SqlParameter("@UM_Id", userId));

            SqlDataReader rdr = SqlHelper.ExecuteReader(GetConnectionString(), CommandType.StoredProcedure, "UserDetailsById", arrParams.ToArray());
            if (rdr != null)
            {
                while (rdr.Read())
                {
                    modules.Role = Convert.ToString(rdr["UM_Role"]);
                }
                rdr.Close();
            }
            rdr.Dispose();
            return modules;
        }
    }

}
