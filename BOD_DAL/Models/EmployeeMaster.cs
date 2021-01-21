
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace BOD_DAL.Models
{
    public class EmployeeMaster
    {
        public int CreatedbyProject { get; set; }
        public int? CreatedBy { get; set; }
        public int? SM_UserId { get; set; }
        public string AssociateProject { get; set; }
        public bool? EM_IsSuper { get; set; }
        public int? EM_EmpId { get; set; }
        public string EM_EmpCode { get; set; }
        public string EM_EmpName { get; set; }
        public string EM_EmpDOJ { get; set; }
        public int? EM_EmpDesignationId { get; set; }
        public string EM_EmpFathers { get; set; }
        public string EM_EmpAddress { get; set; }
        public string EM_EmpContactNo { get; set; }
        public string EM_NIDNo { get; set; }
        public decimal? EM_TotalSal { get; set; }
        public string EM_Designation { get; set; }
        public string EM_Degree { get; set; }
        public decimal? EM_DA { get; set; }
        public decimal? EM_Basic { get; set; }
        public decimal? EM_HRA { get; set; }
        public string EM_PunchingCode { get; set; }
        public decimal? EM_MedicalAllowance { get; set; }
        public decimal? EM_Conveyance { get; set; }
        public decimal? EM_TelephoneAllowance { get; set; }
        public decimal? EM_SpecialAllowance { get; set; }
        public decimal? EM_Reimbursement { get; set; }
        public decimal? EM_ProvidentFund { get; set; }
        public decimal? EM_Ptax { get; set; }
        public decimal? EM_TDS { get; set; }

        public string EM_Email { get; set; }
        public int? EM_DepartmentID { get; set; }
        public string EM_Bank { get; set; }
        public string EM_AccountNo { get; set; }
        public string EM_IFSC { get; set; }
        public int? CompanyID { get; set; }
        public int? UserID { get; set; }
        public string EM_ProfilePic { get; set; }
        public string UpdateUser { get; set; }
        public string EM_Sex { get; set; }
        public string EM_PrevExp { get; set; }
        public string EM_DOB { get; set; }
        public string EM_MotherName { get; set; }
        public string EM_Refferrence1 { get; set; }
        public string EM_Ref1MobNo { get; set; }
        public string EM_Ref1City { get; set; }
        public string EM_Refferrence2 { get; set; }
        public string EM_Ref1MobNo2 { get; set; }
        public string EM_Ref1City2 { get; set; }
        public string EM_BranchName { get; set; }
        public bool? IsActive { get; set; }
        public string EM_DeactivateDate { get; set; }
        public string EM_DeactivateReason { get; set; }
        public string EM_ZipCode { get; set; }
        public int? EM_StateId { get; set; }
        public string SM_CorporateName { get; set; }
        public string EM_Status { get; set; }
        public int? EM_IsManager { get; set; }
        public int? EM_ManagerId { get; set; }
        public string ManagerName { get; set; }
        public EmployeeMaster()
        {
            cList = new List<EmployeeMaster>();
            managerList = new List<EmployeeMaster>();
            empList = new List<EmployeeMasterTransaction>();
            List = new List<ExamDetails>();
            PrevWorkingList = new List<EmployeePrevWorkingDetails>();
        }
        public List<EmployeeMaster> cList { get; set; }
        public List<EmployeeMaster> managerList { get; set; }
        public List<EmployeeMasterTransaction> empList { get; set; }
        public List<ExamDetails> List { get; set; }
        public List<EmployeePrevWorkingDetails> PrevWorkingList { get; set; }
    }
}