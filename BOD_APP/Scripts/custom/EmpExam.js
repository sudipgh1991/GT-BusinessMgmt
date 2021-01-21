var formElem = $("#frmEmpEducation");
var path;
var pathString;
var switchStatus = false;

$(document).ready(function () {
  
    // InitValidationRules();
    var Id = getParameterByName('Id')
    var SMId = getParameterByName('SMId')
    var Mode = getParameterByName('Mode')
  
    if (Mode == "O") {

        $('#hdnUserId').val(SMId);
    }
    if (Id != '') {

        {
            retrive(Id);
        }
    }

});


function EmployeeValidate() {
    $(".error").remove();
    var Name = $("#txtName").val();
    var Sex = $("#ddlSex").val();
    var DOJ = $("#txtDOJ").val();
    var Department = $("#ddlDepartment").val();
    var Designation = $("#ddlDesg").val();
    var DOB = $("#txtDOB").val();
    var FathersName = $("#txtFather").val();
    var Mother = $("#txtMother").val();
    var MOB = $("#txtMob").val();
    var Email = $("#txtEmail").val();
    var NID = $("#txtNID").val();
    var Province = $("#ddlState").val();
    var ZipCode = $("#txtZipCode").val();
    var Degree = $("#txtDegree").val();
   

    if (Name == "") {
        $("#txtName").after('<span class="error">Please enter Name.</span>');
        return false();
    }
    else if (Sex == "") {
        $("#ddlSex").after('<span class="error">Please enter Gender.</span>');
        return false();
    }
    else if (DOJ == "") {
        $("#txtDOJ").after('<span class="error">Please enter Date of Joining.</span>');
        return false();
    }
    else if (Department == "") {
        $("#ddlDepartment").after('<span class="error">Please enter Department.</span>');
        return false();
    }
    else if (Designation == "") {
        $("#ddlDesg").after('<span class="error">Please enter Designation.</span>');
        return false();
    }
    else if (DOB == "") {
        $("#txtDOB").after('<span class="error">Please enter DOB.</span>');
        return false();
    }
    else if (FathersName == "") {
        $("#txtFather").after('<span class="error">Please enter Fathers Name.</span>');
        return false();
    }
    else if (Mother == "") {
        $("#txtMother").after('<span class="error">Please enter Mother Name.</span>');
        return false();
    }
    else if (MOB == "") {
        $("#txtMob").after('<span class="error">Please enter Mobile No.</span>');
        return false();
    }
    else if (Email == "") {
        $("#txtEmail").after('<span class="error">Please enter Email.</span>');
        return false();
    }
    else if (NID == "") {
        $("#txtNID").after('<span class="error">Please enter National ID Number .</span>');
        return false();
    }
    else if (Province == "") {
        $("#ddlState").after('<span class="error">Please enter Province .</span>');
        return false();
    }
    else if (ZipCode == "") {
        $("#txtZipCode").after('<span class="error">Please enter ZipCode .</span>');
        return false();
    }
    else if (Degree == "") {
        $("#txtDegree").after('<span class="error">Please enter Highest Qualification .</span>');
        return false();
    }
    
    return true;
}

function SaveRecord() {


    //Validation   
    //if (EmployeeValidate() == false) {
    //    return false;
    //}


    var TransactionArr = [];
        var tbl = document.getElementById('tblStock');
        for (var i = 1; i < tbl.rows.length; i++) {
            var txtExam_ = 'txtExam_' + i;
            var txtGrpSub_ = 'txtGrpSub_' + i;
            var txtPassingYr_ = 'txtPassingYr_' + i;
            var txtGpa_ = 'txtGpa_' + i;
            TransactionArr.push({
                ED_ExamName: document.getElementById(txtExam_).value,
                ED_GroupSubject: document.getElementById(txtGrpSub_).value,

                ED_PassingYear: document.getElementById(txtPassingYr_).value,
                ED_GPA: document.getElementById(txtGpa_).value,

            });
        }

    var a = parseInt($("#hdnUserId").val())
    var _data = JSON.stringify({
        emp: {
            UserID: parseInt($("#hdnUserId").val()),
            // empList: tableArr,
            EM_EmpId: parseInt($("#hdnId").val()),
            //EM_EmpName: $.trim($("#txtName").val()),
            //// EM_TotalSal: parseFloat($("#txtSal").val()),
            //EM_EmpDOJ: $.trim($("#txtDOJ").val()),
            //EM_EmpFathers: $.trim($("#txtFather").val()),
            //EM_EmpAddress: $.trim($("#txtAddrs").val()),
            //EM_EmpContactNo: $.trim($("#txtMob").val()),
            //EM_Degree: $.trim($("#txtDegree").val()),
            //EM_EmpDesignationId: parseInt($("#ddlDesg").val()),
            //EM_NIDNo: $.trim($("#txtNID").val()),
            ////EM_Basic: parseFloat($("#txtBasic").val()),
            ////EM_HRA: parseFloat($("#txtHRA").val()),
            ////EM_DA: parseFloat($("#txtDA").val()),
            ////EM_MedicalAllowance: parseFloat($("#txtMdclAllnc").val()),
            ////EM_Conveyance: parseFloat($("#txtConveyance").val()),
            ////EM_TelephoneAllowance: parseFloat($("#txtTlphAllnc").val()),
            //EM_Email: $.trim($("#txtEmail").val()),
            //EM_StateId: parseInt($("#ddlState").val()),
            //EM_ZipCode: $.trim($("#txtZipCode").val()),
            //EM_ProvidentFund: parseFloat($("#txtPF").val()),
            //EM_ProfilePic: pathString,
            //EM_Ptax: parseFloat($("#txtPTAX").val()),
            //EM_TDS: parseFloat($("#txtTDS").val()),
            List: TransactionArr,

            ////IsActive: isActive,
            //EM_DepartmentID: parseInt($("#ddlDepartment").val()),
            //EM_IsSuper: switchStatus,
            ////EM_Bank: $.trim($("#txtBank").val()),
            ////EM_AccountNo: $.trim($("#txtAccountNo").val()),
            ////EM_IFSC: $.trim($("#txtIFSC").val()),

            //EM_Sex: $.trim($("#ddlSex").val()),


            ////EM_PunchingCode: $.trim($("#txtPunchingCode").val()),


            //EM_DOB: $.trim($("#txtDOB").val()),
            //EM_MotherName: $.trim($("#txtMother").val()),
            //EM_PrevExp: $.trim($("#txtExp").val()),
            //EM_BranchName: $.trim($("#txtBrsnch").val()),

            //EM_Refferrence1: $.trim($("#txtRfrnce1").val()),
            //EM_Refferrence2: $.trim($("#txtRfrnce2").val()),


            //EM_Ref1MobNo: $.trim($("#txtRContactNo").val()),
            //EM_Ref1MobNo2: $.trim($("#txtRContactNo2").val()),


            //EM_Ref1City: $.trim($("#txtRCity").val()),
            //EM_Ref1City2: $.trim($("#txtRCity2").val()),
            //EM_DeactivateDate: $.trim($("#txtDDate").val()),
            //EM_DeactivateReason: $.trim($("#txtReason").val()),
        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateEmployeeMasterPost',
        data: _data,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                Swal.fire({
                    title: "Good job!",
                    text: data.Message,
                    type: "success",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });

                $('.form-control').val('');
                window.location.href = '/Home/EmployeeMasterList';
            }
        },
        error: function (data) {

            Swal.fire({
                title: "Error!",
                text: "Process Not Complete",
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });
        }
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function retrive(id) {
   
    var _data = JSON.stringify({
        emp: {
            EM_EmpId: parseInt(id)
        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetEmployeeMaster",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {


            $('#hdnId').val(data["EM_EmpId"]);
            //$('#txtEmpCode').val(data["EM_EmpCode"]);
            //$('#txtName').val(data["EM_EmpName"]);

            var trHTML = '';

            var trHTML1 = '';

            if (data.List.length > 0) {
                $("#tbodyid").empty();
                $.each(data.List, function (i, item) {
                    i = i + 1;
                    trHTML1 += "<tr><td><input type='text' class='form-control' id='txtExam_" + i + "' value='" + item.ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + i + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + i + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + i + "'' value='" + item.ED_GPA + "'/></td></tr>";
                });

                $('#tblStock').append(trHTML1)
            }
            else {

            }


            //var divHTML = '';

            //divHTML = "<h4  class='media-heading'><span class=users-view-name'>" + data["EM_EmpName"] + "</span></h4><span>Emp Code: </span><span class='users-view-id'>" + data["EM_EmpCode"] + "</span>";
            //$('#divEmpnameCode').append(divHTML)

            //var trHTML2 = '';

            //trHTML2 = "<tr><td>Date of Joining:</td><td>" + data["EM_EmpDOJ"] + "</td></tr><tr><td>D.O.B:</td><td>" + data["EM_DOB"] + "</td></tr> <tr><td>Email:</td><td>" + data["EM_Email"] + "</td></tr><tr><td>Contact Number:</td><td>" + data["EM_EmpContactNo"] + "</td></tr>";
            //$('#tblempdetails').append(trHTML2)

            //var trHTML3 = '';

            //trHTML3 = "<tr><tr><td>Designation:</td><td>" + data["EM_Designation"] + "</td></tr><tr><td>National ID Number:</td><td>" + data["EM_NIDNo"] + "</td></tr><tr><td>Highest Qualification:</td><td>" + data["EM_Degree"] + "</td></tr>";
           
            //$('#tbledetails').append(trHTML3)
            //if (data.List.length > 0) {
            //    $("#tbodyid").empty();
            //    //$.each(data.List, function (i, item) {
            //    //    i = i + 1;
            //    trHTML1 = "<tr><td><input type='text' class='form-control' id='txtExam_" + 1 + "' value='" + data.List[0].ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + 1 + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + 1 + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + 1 + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //    trHTML1 = "<tr><td><input type='text' class='form-control' id='txtExam_" + 2 + "' value='" + data.List[1].ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + 2 + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + 2 + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + 2 + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //    trHTML1 = "<tr><td><input type='text' class='form-control' id='txtExam_" + 3 + "' value='" + data.List[2].ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + 3 + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + 3 + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + 3 + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //    trHTML1 = "<tr><td><input type='text' class='form-control' id='txtExam_" + 4 + "' value='" + data.List[3].ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + 4 + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + 4 + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + 4 + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //    trHTML1 = "<tr><td><input type='text' class='form-control' id='txtExam_" + 5 + "' value='" + data.List[4].ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + 5 + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + 5 + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + 5 + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //    //});

            //    $('#tblStock').append(trHTML1)
            //}
            //else {

            //}
           

        },
        error: function (data) {

        }
    });
    return false;

}


