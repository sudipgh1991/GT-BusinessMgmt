using BOD_DAL.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using BOD_DAL;
using BOD_APP.Utility;
using BOD_APP.Models;
using BOD_APP.Customvalidation;
using System.ComponentModel.DataAnnotations.Schema;
using System.Web.WebSockets;
using System.IO;

namespace BOD_APP.Controllers
{
    public class AccountController : Controller
    {
        public static string Role = "";
        public static UserModel UserModel
        {
            get
            {
                if (Role == "C")
                {
                    return (UserModel)System.Web.HttpContext.Current.Session["CUserDataModel"];
                }
                else if (Role == "SM")
                {
                    return (UserModel)System.Web.HttpContext.Current.Session["SMUserDataModel"];
                }
                else if (Role == "E")
                {
                    return (UserModel)System.Web.HttpContext.Current.Session["EUserDataModel"];
                }
                else
                {
                    return (UserModel)System.Web.HttpContext.Current.Session["UserDataModel"];
                }

            }
        }
        public static SSME ssme = new SSME();

        public static CorporateClient clinet = new CorporateClient();
        public static AuthorisedModule AuthorisedModule
        {
            get
            {
                return (AuthorisedModule)System.Web.HttpContext.Current.Session["AuthorisedModuleModel"];
            }
        }

        DAL dl = new DAL();
        public ActionResult AppLogin()
        {
            System.Web.HttpContext.Current.Session.Clear();
            DAL dl = new DAL();
            DDLList ddl = new DDLList();
            List<DDLList> ObjList1 = new List<DDLList>();

            List<SelectListItem> ObjList = new List<SelectListItem>();
            SelectListItem obj = null;
            ddl.tableName = "FinancialYearMaster_FM";
            ddl.Text = "FM_Name";
            ddl.Value = "FM_Id";
            ObjList1 = dl.GetDDLList(ddl);

            foreach (var VM in ObjList1)
            {
                obj = new SelectListItem();
                obj.Text = VM.Text;
                obj.Value = VM.Value;
                ObjList.Add(obj);
            }
            ViewBag.Session = ObjList;
            Session["SelectListItem"] = ObjList;
            ViewBag.Comp = false;
            return View();


        }
        [HttpPost]
        public ActionResult AppLogin(FormCollection data)
        {
            UserModel User = new UserModel();
            List<SelectListItem> ObjList = new List<SelectListItem>();
            List<DDLList> ObjList1 = new List<DDLList>();
            SelectListItem obj = null;

            try
            {
                UserModel UserObj = new UserModel();
                UserObj.UserLoginID = data["txtUid"].ToString();
                UserObj.Password = data["txtPwd"].ToString();

                User = dl.GetUserLogin(UserObj);
                if (User.UserID != 0)
                {
                    User.FyId = 1;
                    Role = User.Role;
                    if (Role == "C")
                    {
                        Session["CUserDataModel"] = User;

                    }
                    else if (Role == "SM")
                    {
                        Session["SMUserDataModel"] = User;
                    }
                    else if (Role == "E")
                    {
                        Session["EUserDataModel"] = User;
                    }
                    else
                    {
                        Session["UserDataModel"] = User;
                    }
                    //return RedirectToAction("EventDashboard", "Home");

                    ObjList1 = dl.GetUserWiseCompanyist(User);
                    Session["CompanyModel1"] = ObjList1;

                    foreach (var VM in ObjList1)
                    {
                        obj = new SelectListItem();
                        obj.Text = VM.Text;
                        obj.Value = VM.Value;
                        ObjList.Add(obj);
                    }

                    Session["CompanyModel"] = ObjList;

                    if (ObjList1.Count > 1)
                    {
                        ViewBag.Company = ObjList;
                        ViewBag.Comp = true;
                        return View();
                    }

                    else
                    {
                        //ViewBag.Comp = false;
                        foreach (var VM in ObjList1)
                        {
                            User.CompanyID = Convert.ToInt32(VM.Value);
                            User.CompanyName = VM.Text;
                        }
                        if (Role == "C")
                        {
                            Session["CUserDataModel"] = User;

                        }
                        else if (Role == "SM")
                        {
                            Session["SMUserDataModel"] = User;
                        }
                        else if (Role == "E")
                        {
                            Session["EUserDataModel"] = User;
                        }
                        else
                        {
                            Session["UserDataModel"] = User;
                        }
                        //if (User.Module > 0x0)
                        //{
                        TempData["UserId"] = User.UserID;
                        TempData["UserLogin"] = User.UserLoginID;
                        TempData["CompanyId"] = User.CompanyID;
                        return RedirectToAction("SelectModule");
                        //}
                    }
                }
                else
                {
                    ViewBag.Messege = "Login Not Sucessfull";
                    ViewBag.Session = Session["SelectListItem"];
                    ViewBag.Comp = false;
                    return View();//RedirectToAction("AppLogin", "Account");
                }
            }
            catch (NullReferenceException ex)
            {
                if (Role == "C")
                {
                    User = Session["CUserDataModel"] as UserModel;

                }
                else if (Role == "SM")
                {
                    Session["SMUserDataModel"] = User;
                }
                else
                {
                    User = Session["UserDataModel"] as UserModel;
                }



                User.CompanyID = Convert.ToInt32(data["ddlCompany"]);
                User.CompanyName = data["hdnCompany"];
                if (Role == "C")
                {
                    Session["CUserDataModel"] = User;

                }
                else if (Role == "SM")
                {
                    Session["SMUserDataModel"] = User;
                }
                else
                {
                    Session["UserDataModel"] = User;
                }

                ObjList1 = Session["CompanyModel1"] as List<DDLList>;
                foreach (var VM in ObjList1)
                {
                    obj = new SelectListItem();
                    obj.Text = VM.Text;
                    obj.Value = VM.Value;
                    obj.Selected = Convert.ToString(User.CompanyID) == VM.Value;
                    ObjList.Add(obj);
                }
                Session["CompanyModel"] = ObjList;
                return RedirectToAction("SelectModule");
            }
            return View();
        }


        public ActionResult SelectModule()
        {
            UserModel User = new UserModel();



            if (Role == "C")
            {
                User = Session["CUserDataModel"] as UserModel;

            }
            else if (Role == "SM")
            {
                User = Session["SMUserDataModel"] as UserModel;

            }
            else if (Role == "E")
            {
                User = Session["EUserDataModel"] as UserModel;

            }
            else
            {
                User = Session["UserDataModel"] as UserModel;
            }
            if (User == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            int userid = Convert.ToInt32(User.UserID);

            var modules = CustomAuth.GetModulesByUser(userid);
            Session["AuthorisedModuleModel"] = modules;
            if (modules.Count == 1)
            {
                return RedirectToAction("SelectedModule", new { selectedmoduleId = modules.First().Id, redirUrl = modules.First().Url });
                //return Redirect(modules.First().Url);
            }
            return View(modules);
        }

        public ActionResult SelectedModule(int selectedmoduleId, string con, string act, string redirUrl)
        {
            if (UserModel == null)
            {
                return RedirectToAction("AppLogin", "Account");
            }
            var usermodel = UserModel;
            usermodel.SelectedModule = selectedmoduleId;
            var modules = System.Web.HttpContext.Current.Session["AuthorisedModuleModel"];
            if (Role == "C")
            {
                System.Web.HttpContext.Current.Session["CUserDataModel"] = usermodel;
            }
            else if (Role == "SM")
            {
                System.Web.HttpContext.Current.Session["SMUserDataModel"] = usermodel;
            }
            else if (Role == "E")
            {
                System.Web.HttpContext.Current.Session["EUserDataModel"] = usermodel;
            }
            else
            {
                System.Web.HttpContext.Current.Session["UserDataModel"] = usermodel;
            }

            ViewBag.Company = Session["CompanyModel"];
            ViewBag.Comp = true;
            Session["DashBoardUrl"] = redirUrl;
            return Redirect(redirUrl);
            //return RedirectToAction(act, con);
        }

        [HttpGet]
        public ActionResult ChangeCompany(int? id)
        {
            UserModel UserObj = new UserModel();
            List<SelectListItem> ObjList = new List<SelectListItem>();
            List<DDLList> ObjList1 = new List<DDLList>();
            SelectListItem obj = null;
            if (Role == "C")
            {
                UserObj = Session["CUserDataModel"] as UserModel;
            }
            else
            {
                UserObj = Session["UserDataModel"] as UserModel;
            }

            UserObj.CompanyID = id;
            //UserObj.CompanyName = Comp;
            if (Role == "C")
            {
                Session["CUserDataModel"] = UserObj;
            }
            else
            {
                Session["UserDataModel"] = UserObj;
            }
            ObjList1 = Session["CompanyModel1"] as List<DDLList>;
            foreach (var VM in ObjList1)
            {
                obj = new SelectListItem();
                obj.Text = VM.Text;
                obj.Value = VM.Value;
                obj.Selected = Convert.ToString(id) == VM.Value;
                ObjList.Add(obj);
            }
            Session["CompanyModel"] = ObjList;


            return RedirectToAction("Home", "Home");
        }
        public List<SelectListItem> GetFinancialYear()
        {
            DAL fdl = new DAL();
            DDLList fddl = new DDLList();
            List<DDLList> listFinancialYear = new List<DDLList>();

            List<SelectListItem> financialYear = new List<SelectListItem>();
            financialYear.Add(new SelectListItem { Text = "--Select--", Value = "" });
            SelectListItem fobj = null;
            fddl.tableName = "FinancialYearMaster_FM";
            fddl.Text = "FM_Name";
            fddl.Value = "FM_Id";
            listFinancialYear = fdl.GetDDLList(fddl);

            foreach (var VM in listFinancialYear)
            {
                fobj = new SelectListItem();
                fobj.Text = VM.Text;
                fobj.Value = VM.Value;
                financialYear.Add(fobj);
            }
            return financialYear;
        }

        public List<SelectListItem> GetCompanyList()
        {
            DAL cdl = new DAL();
            DDLList cddl = new DDLList();
            List<DDLList> listCompany = new List<DDLList>();

            List<SelectListItem> company = new List<SelectListItem>();
            company.Add(new SelectListItem { Text = "--Select--", Value = "" });
            SelectListItem cobj = null;
            cddl.tableName = "CompanyMaster_CM";
            cddl.Text = "CM_Name";
            cddl.Value = "CM_Id";
            listCompany = cdl.GetDDLList(cddl);

            foreach (var VM in listCompany)
            {
                cobj = new SelectListItem();
                cobj.Text = VM.Text;
                cobj.Value = VM.Value;
                company.Add(cobj);
            }

            return company;
        }

        public List<SelectListItem> GetIndustryList()
        {
            DAL cdl = new DAL();
            DDLList cddl = new DDLList();
            List<DDLList> listindustry = new List<DDLList>();

            List<SelectListItem> industry = new List<SelectListItem>();
            industry.Add(new SelectListItem { Text = "--Select Industry--", Value = "" });
            SelectListItem cobj = null;
            cddl.tableName = "ProjectIndustryMaster_PIM";
            cddl.Text = "PIM_Name";
            cddl.Value = "PIM_Id";
            listindustry = cdl.GetDDLList(cddl);

            foreach (var VM in listindustry)
            {
                cobj = new SelectListItem();
                cobj.Text = VM.Text;
                cobj.Value = VM.Value;
                industry.Add(cobj);
            }

            return industry;
        }
        #region  RegisterClientUser
        [HttpGet]
        public ActionResult RegisterClientUser()
        {
            ViewBag.UserId = "none";
            ViewBag.Email = "none";
            ViewBag.GoingWrong = "none";


            return View();
        }

        [HttpPost]
        [ValidateAjax]
        public ActionResult RegisterClientUser(FormCollection fc)
        {


            ViewBag.UserId = "none";
            ViewBag.Email = "none";
            ViewBag.GoingWrong = "none";


            if (dl.IsUserIdOrEmailExist("Email", fc["useremail"].ToString(), "C"))
            {
                ViewBag.UserId = "none";
                ViewBag.Email = "block";
                ViewBag.GoingWrong = "none";

            }
            else if (fc["userpassword"].ToString().Trim() != fc["confirmpassword"].ToString().Trim())
            {
                ViewBag.GoingWrong = "block";
                ViewBag.UserId = "none";
                ViewBag.Email = "none";


            }
            else
            {

                clinet.CC_UserId = fc["useremail"].ToString().Trim();
                clinet.CC_Password = fc["userpassword"].ToString().Trim();
                clinet.CC_Email = fc["useremail"].ToString().Trim();


                return RedirectToAction("RegisterClientUserNextStep", "Account");
            }

            return View();


        }


        [HttpGet]
        public ActionResult RegisterClientUserNextStep()
        {

            var fyear = GetFinancialYear();
            var company = GetCompanyList();

            ViewBag.fyear = fyear;
            ViewBag.company = company;

            clinet.QA = GetClientQuestion("C");
            ViewBag.QCategory = GetQuestionCategory();
            DDLList data = new DDLList();
            data.tableName = "ProjectIndustryMaster_PIM";
            data.Text = "PIM_Name";
            data.Value = "PIM_Id";
            clinet.dropdownIndustryList = dl.GetDDLList(data);
            return View(clinet);
        }

        [HttpPost]
        public ActionResult RegisterClientUserNextStep(CorporateClient model)
        {
            var fyear = GetFinancialYear();
            var company = GetCompanyList();

            ViewBag.fyear = fyear;
            ViewBag.company = company;
            List<SelectListItem> ObjList = new List<SelectListItem>();
            List<DDLList> ObjList1 = new List<DDLList>();
            SelectListItem obj = null;

            model.CC_UserId = clinet.CC_UserId;
            model.CC_Email = clinet.CC_Email;
            model.CC_Password = clinet.CC_Password;
            model.CC_PIM_Id = clinet.CC_PIM_Id;
            model.UM_AssesmentGiven = true;
            long login = dl.InsertUpdateCorporateClient(model);
            if (login != 0)
            {
                UserModel User = new UserModel();
                User.UserID = Convert.ToInt32(login);
                User.UserName = model.CC_TradingName;
                User.CompanyID = 1;
                User.CompanyName = "";
                User.StateId = 0;
                User.Role = "C";
                Role = "C";
                Session["CUserDataModel"] = User;
                ObjList1 = dl.GetUserWiseCompanyist(User);
                Session["CompanyModel1"] = ObjList1;

                foreach (var VM in ObjList1)
                {
                    obj = new SelectListItem();
                    obj.Text = VM.Text;
                    obj.Value = VM.Value;
                    ObjList.Add(obj);
                }

                Session["CompanyModel"] = ObjList;

                if (ObjList1.Count > 1)
                {
                    ViewBag.Company = ObjList;
                    ViewBag.Comp = true;
                    return View();
                }

                else
                {
                    //ViewBag.Comp = false;
                    foreach (var VM in ObjList1)
                    {
                        User.CompanyID = Convert.ToInt32(VM.Value);
                        User.CompanyName = VM.Text;
                    }
                    if (Role == "C")
                    {
                        Session["CUserDataModel"] = User;

                    }
                    else if (Role == "SM")
                    {
                        Session["SMUserDataModel"] = User;
                    }
                    else
                    {
                        Session["UserDataModel"] = User;
                    }
                    //if (User.Module > 0x0)
                    //{
                    TempData["UserId"] = User.UserID;
                    TempData["UserLogin"] = User.UserLoginID;
                    TempData["CompanyId"] = User.CompanyID;
                    return RedirectToAction("SelectModule");
                }
            }

            return View(model);

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
                    Required = item.Required,
                    QM_DropdownType = item.QM_DropdownType,
                    DropDowns = item.DropDowns
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

        #endregion
        #region RegisterSSME
        [HttpGet]
        public ActionResult RegisterSSME()
        {
            ViewBag.UserId = "none";
            ViewBag.Email = "none";
            ViewBag.GoingWrong = "none";

            return View();
        }
        [HttpPost]
        public ActionResult RegisterSSME(FormCollection fc)
        {

            ViewBag.UserId = "none";
            ViewBag.Email = "none";
            ViewBag.GoingWrong = "none";

            if (dl.IsUserIdOrEmailExist("UserID", fc["useremail"].ToString(), "SSME"))
            {
                ViewBag.UserId = "block";
                ViewBag.Email = "none";
                ViewBag.GoingWrong = "none";

            }
            else if (dl.IsUserIdOrEmailExist("Email", fc["useremail"].ToString(), "SSME"))
            {
                ViewBag.UserId = "none";
                ViewBag.Email = "block";
                ViewBag.GoingWrong = "none";

            }
            else if (fc["userpassword"].ToString().Trim() != fc["confirmpassword"].ToString().Trim())
            {
                ViewBag.GoingWrong = "block";
                ViewBag.UserId = "none";
                ViewBag.Email = "none";


            }
            else
            {

                ssme.SM_UserId = fc["useremail"].ToString().Trim();
                ssme.SM_Password = fc["userpassword"].ToString().Trim();
                ssme.SM_Email = fc["useremail"].ToString().Trim();
                ssme.SM_PIM_Id = Convert.ToInt32(fc["IndustryId"]);
                Session["IndustryId"] = Convert.ToInt32(fc["IndustryId"]);
                return RedirectToAction("RegisterSSMENextStep", "Account");
            }
            return View();
        }
        [HttpGet]
        public ActionResult RegisterSSMENextStep()
        {
            var fyear = GetFinancialYear();
            var company = GetCompanyList();

            ViewBag.fyear = fyear;
            ViewBag.company = company;

            ssme.QA = GetClientQuestion("S");
            DDLList data = new DDLList();
            data.tableName = "ProjectIndustryMaster_PIM";
            data.Text = "PIM_Name";
            data.Value = "PIM_Id";
            ssme.dropdownIndustryList = dl.GetDDLList(data);
            ViewBag.QCategory = GetQuestionCategory();
            return View(ssme);

        }
        [HttpPost]
        public ActionResult RegisterSSMENextStep(SSME model)
        {
            var fyear = GetFinancialYear();
            var company = GetCompanyList();

            ViewBag.fyear = fyear;
            ViewBag.company = company;

            model.SM_UserId = ssme.SM_UserId;
            model.SM_Email = ssme.SM_Email;
            model.SM_Password = ssme.SM_Password;
            model.SM_PIM_Id = ssme.SM_PIM_Id;
            model.UM_AssesmentGiven = true;
            List<SelectListItem> ObjList = new List<SelectListItem>();
            List<DDLList> ObjList1 = new List<DDLList>();
            SelectListItem obj = null;
            long login = dl.InsertUpdateSSME(model);
            if (login != 0)
            {
                UserModel User = new UserModel();
                User.UserID = Convert.ToInt32(login);
                User.UserName = model.SM_TradingName;
                User.CompanyID = 1;
                User.CompanyName = "";
                User.StateId = 0;
                User.Role = "SM";
                Role = "SM";
                Session["CUserDataModel"] = User;
                ObjList1 = dl.GetUserWiseCompanyist(User);
                Session["CompanyModel1"] = ObjList1;

                foreach (var VM in ObjList1)
                {
                    obj = new SelectListItem();
                    obj.Text = VM.Text;
                    obj.Value = VM.Value;
                    ObjList.Add(obj);
                }

                Session["CompanyModel"] = ObjList;

                if (ObjList1.Count > 1)
                {
                    ViewBag.Company = ObjList;
                    ViewBag.Comp = true;
                    return View();
                }

                else
                {
                    //ViewBag.Comp = false;
                    foreach (var VM in ObjList1)
                    {
                        User.CompanyID = Convert.ToInt32(VM.Value);
                        User.CompanyName = VM.Text;
                    }
                    if (Role == "C")
                    {
                        Session["CUserDataModel"] = User;

                    }
                    else if (Role == "SM")
                    {
                        Session["SMUserDataModel"] = User;
                    }
                    else
                    {
                        Session["UserDataModel"] = User;
                    }
                    //if (User.Module > 0x0)
                    //{
                    TempData["UserId"] = User.UserID;
                    TempData["UserLogin"] = User.UserLoginID;
                    TempData["CompanyId"] = User.CompanyID;
                    return RedirectToAction("SelectModule");
                }
            }
            return View(model);

        }

        #endregion


    }
}