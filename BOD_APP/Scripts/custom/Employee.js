var formElem = $("#frmEmp");
var path;
var pathString;
var switchStatus = false;

var IsManager = 0;
//$("#switch9").on('change', function () {
//    if ($(this).is(':checked')) {
//        switchStatus =true;
//        $('#btnSubmitPermission').prop('disabled', true);
//    }
//    else {
//        switchStatus = fasle;
//        $('#btnSubmitPermission').prop('disabled', false);
//    }
//});

//$("#chkManager").on('change', function () {
//    if ($(this).is(':checked')) {
//        IsManager = 1;
//    }
//    else {
//        IsManager = 0;

//    }

//});


$("#sizelist li").click(function () {
    $("#sizelist  li").removeClass('current');
    $(this).addClass('current');
    var managerid = this.id;
  
    $(".modal-body #hdnmanagerId").val(managerid);
    var managername = $(this).attr("data-value");
    $("#frmEmp #txtManagerName").val(managername);

    $('#exampleModal2').modal('hide');

    //alert(this.id); // id of clicked li by directly accessing DOMElement property
    //alert($(this).attr('id')); // jQuery's .attr() method, same but more verbose
    //alert($(this).html()); // gets innerHTML of clicked li

    //var managername = $(this).text();
    //alert(managername); // gets text contents of clicked li


});

//$(document).on("click", ".addmanager", function () {

//    var myBookId = $(this).data('id');
//    $(".modal-body #hdnId").val(myBookId);

//});

function OpenManagerPopUp() {
    $('#exampleModal2').modal('show');
}
function ShowManager(empName, EM_EmpId) {

    $("#txtManagerName").val(empName);
    $("#hdnmanagerId").val(EM_EmpId);
    $('#exampleModal2').modal('hide');
}

$(document).ready(function () {
    $("#switch9").on('change', function () {
        if ($(this).is(':checked')) {
            switchStatus = true;
            $('#btnSubmitPermission').prop('disabled', true);
        }
        else {
            switchStatus = fasle;
            $('#btnSubmitPermission').prop('disabled', false);
        }
    });

    $("#chkManager").on('change', function () {
        if ($(this).is(':checked')) {
            IsManager = 1;
        }
        else {
            IsManager = 0;

        }

    });
    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });

    $('#prfpicIMG').prop('src', '/images/ImageEmpty.png');
    $("#alrtmainDiv").hide();
    $("#dvHide").hide();
    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: true,
    //    showDropdowns: true,
    //    autoApply: true,

    //}, function (chosen_date) {
    //    $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
    //});
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!

    var yyyy = today.getFullYear();
    if (dd < 10) {
        dd = '0' + dd;
    }
    if (mm < 10) {
        mm = '0' + mm;
    }
    var today = mm + '/' + dd + '/' + yyyy;
    document.getElementById("txtDOJ").value = today;
    InitUI();
    // InitValidationRules();
    var Id = getParameterByName('Id')
    var SMId = getParameterByName('SMId')
    var CCId = getParameterByName('CCId')
    var Mode = getParameterByName('Mode')

    if (Mode == "O" && SMId!=null) {

        $('#hdnUserId').val(SMId);
    }
    else if (Mode == "O" && CCId != null) {
        
        $('#hdnUserId').val(CCId);
    
    }
    if (Id != '') {

        {
            retrive(Id);
        }
    }

});



$(".custom-input-file").change(function () {
    if (typeof (FileReader) != "undefined") {
        var dvPreview = $(".pic");
        dvPreview.html("");
        //var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

        var fileSize = this.files[0].size / 1024;

        if (fileSize >= 50 && fileSize <= 100) {

            $($(this)[0].files).each(function () {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.css({ "height": "70px", "width": "80px", "cursor": "pointer" });
                        img.attr("src", e.target.result);
                        dvPreview.html(img);
                        pathString = e.target.result;
                    }
                    reader.readAsDataURL(file[0]);
                }
                else {

                    dvPreview.html("");
                    return false;
                }
            });
        }
        else {

            Swal.fire({
                title: "Error!",
                text: 'Please check file size.50 KB To 100 Kb',
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });

            dvPreview.html("");
            return false;
        }
    }
    else {

    }
});








function InitUI() {
    DropdownBinder.DDLData = {
        tableName: "ProvinceMaster_PM",
        Text: 'PM_Name',
        Value: 'PM_Id'
    };

    DropdownBinder.DDLElem = $("#ddlState");

    DropdownBinder.Execute();

    /*=======================================*/

    DropdownBinder.DDLData = {
        tableName: "EmpDesignation_ED",
        Text: 'ED_DesignationName',
        Value: 'ED_Id'
    };

    DropdownBinder.DDLElem = $("#ddlDesg");
    DropdownBinder.Execute();


    DropdownBinder.DDLData = {
        tableName: "DepartmentMaster_DM",
        Text: 'DM_Name',
        Value: 'DM_Id'
    };

    DropdownBinder.DDLElem = $("#ddlDepartment");
    DropdownBinder.Execute();



}


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


    //var DOJformat = DOJ.toString();
   
    var myDate = DOJ.split("/");
    var myDateConverted = myDate[1] + "/" + myDate[0] + "/" + myDate[2];

   
  
    var today = new Date();
    var output = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  
    //var toDays = dateText.split("/");
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;


    if (Name == "") {
        $("#txtName").after('<span class="error">Please enter Name.</span>');
        return false;
    }
    else if (Sex == "") {
        $("#ddlSex").after('<span class="error">Please enter Gender.</span>');
        return false;
    }
    else if (DOJ == "") {
        $("#txtDOJ").after('<span class="error">Please enter Date of Joining.</span>');
        return false;
    }

   
  
    else if (myDateConverted >= output) {
        $("#txtDOJ").after('<span class="error">Date of Joining Can not be greater Than Today.</span>');
        return false;
    }


    else if (Department == "") {
        $("#ddlDepartment").after('<span class="error">Please enter Department.</span>');
        return false;
    }
    else if (Designation == "") {
        $("#ddlDesg").after('<span class="error">Please enter Designation.</span>');
        return false;
    }
    else if (DOB == "") {
        $("#txtDOB").after('<span class="error">Please enter DOB.</span>');
        return false;
    }
    else if (FathersName == "") {
        $("#txtFather").after('<span class="error">Please enter Fathers Name.</span>');
        return false;
    }
    else if (Mother == "") {
        $("#txtMother").after('<span class="error">Please enter Mother Name.</span>');
        return false;
    }
    else if (MOB == "") {
        $("#txtMob").after('<span class="error">Please enter Mobile No.</span>');
        return false;
    }


    else if (reg.test(Email) == false) {
        $("#txtEmail").after('<span class="error">Please enter Proper Email.</span>');
          return false;
        }

    //else if (!MailFormat.test(Email)) {
    //    $("#txtEmail").after('<span class="error">Please enter Proper Email.</span>');
    //    return false;
    //}


    else if (Email == "") {
        $("#txtEmail").after('<span class="error">Please enter Email.</span>');
        return false;
    }


    else if (NID == "") {
        $("#txtNID").after('<span class="error">Please enter National ID Number .</span>');
        return false;
    }
    else if (Province == "") {
        $("#ddlState").after('<span class="error">Please enter Province .</span>');
        return false;
    }
    else if (ZipCode == "") {
        $("#txtZipCode").after('<span class="error">Please enter ZipCode .</span>');
        return false;
    }
    else if (Degree == "") {
        $("#txtDegree").after('<span class="error">Please enter Highest Qualification .</span>');
        return false;
    }

    return true;
}

function SaveRecord(permission) {
    $("#switch9").on('change', function () {
        if ($(this).is(':checked')) {
            switchStatus = true;
            $('#btnSubmitPermission').prop('disabled', true);
        }
        else {
            switchStatus = fasle;
            $('#btnSubmitPermission').prop('disabled', false);
        }
    });

    $("#chkManager").on('change', function () {
        if ($(this).is(':checked')) {
            IsManager = 1;
        }
        else {
            IsManager = 0;

        }

    });
    //Validation   
    if (EmployeeValidate() == false) {
        return false;
    }


    ////var TransactionArr = [];
    ////var tableArr = [];
    ////if (isActive == true) {
    ////    var tbl = document.getElementById('tblStock');
    ////    for (var i = 1; i < tbl.rows.length; i++) {
    ////        var txtExam_ = 'txtExam_' + i;
    ////        var txtGrpSub_ = 'txtGrpSub_' + i;
    ////        var txtPassingYr_ = 'txtPassingYr_' + i;
    ////        var txtGpa_ = 'txtGpa_' + i;
    ////        TransactionArr.push({
    ////            ED_ExamName: document.getElementById(txtExam_).value,
    ////            ED_GroupSubject: document.getElementById(txtGrpSub_).value,

    ////            ED_PassingYear: document.getElementById(txtPassingYr_).value,
    ////            ED_GPA: document.getElementById(txtGpa_).value,

    ////        });
    ////    }


    ////    //var tblEmp = document.getElementById('tblEmp');

    ////    //for (var i = 1; i < tblEmp.rows.length; i++) {
    ////    //    tableArr.push({
    ////    //        EMT_Name: $.trim(tblEmp.rows[i].cells[0].innerHTML),
    ////    //        EMT_File: $.trim(tblEmp.rows[i].cells[1].innerHTML),

    ////    //    });
    ////    //}
    ////}
    var a = parseInt($("#hdnUserId").val())
    var _data = JSON.stringify({
        emp: {
            UserID: parseInt($("#hdnUserId").val()),
            // empList: tableArr,
            EM_EmpId: parseInt($("#hdnId").val()),
            EM_EmpName: $.trim($("#txtName").val()),
            // EM_TotalSal: parseFloat($("#txtSal").val()),
            EM_EmpDOJ: $.trim($("#txtDOJ").val()),
            EM_EmpFathers: $.trim($("#txtFather").val()),
            EM_EmpAddress: $.trim($("#txtAddrs").val()),
            EM_EmpContactNo: $.trim($("#txtMob").val()),
            EM_Degree: $.trim($("#txtDegree").val()),
            EM_EmpDesignationId: parseInt($("#ddlDesg").val()),
            EM_NIDNo: $.trim($("#txtNID").val()),
            
            EM_Email: $.trim($("#txtEmail").val()),
            EM_StateId: parseInt($("#ddlState").val()),
            EM_ZipCode: $.trim($("#txtZipCode").val()),
            //EM_ProvidentFund: parseFloat($("#txtPF").val()),
            EM_ProfilePic: pathString,
            //EM_Ptax: parseFloat($("#txtPTAX").val()),
            //EM_TDS: parseFloat($("#txtTDS").val()),
            //List: TransactionArr,

            //IsActive: isActive,
            EM_DepartmentID: parseInt($("#ddlDepartment").val()),
            EM_IsSuper: switchStatus,
            //EM_Bank: $.trim($("#txtBank").val()),
            //EM_AccountNo: $.trim($("#txtAccountNo").val()),
            //EM_IFSC: $.trim($("#txtIFSC").val()),

            EM_Sex: $.trim($("#ddlSex").val()),


            //EM_PunchingCode: $.trim($("#txtPunchingCode").val()),


            EM_DOB: $.trim($("#txtDOB").val()),
            EM_MotherName: $.trim($("#txtMother").val()),
            EM_IsManager: IsManager,
            EM_ManagerId: parseInt($("#hdnmanagerId").val()),
            


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
                Upload('flPic');
               
                if (parseInt(a) > 0) {
                    if (permission == "N") {
                        window.location.href = '/Home/SMMEWiseEmployeeList'
                    }

                    else { window.location.href = '/Home/UserPermission?Id=' + data.Id + '&type=S&SmId=' + a };
                }
                else
                    if (permission == "N") {
                        window.location.href = '/Home/EmployeeMasterList';
                    }
                    else {
                        window.location.href = '/Home/UserPermission?Id=' + data.Id;
                    }
            }
            else {

                Swal.fire({
                    title: "Error!",
                    text: data.Message,
                    type: "error",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });
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
function Upload(flPic) {
    var formData = new FormData();
    var totalFiles = document.getElementById(flPic).files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById(flPic).files[i];
        formData.append(flPic, file);
    }
    $.ajax({
        type: "POST",
        url: '/ScriptJson/Upload',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response) {
            AddErrorAlert("success", response);
        },
        error: function (error) {
            AddErrorAlert("error", "Picture not Uploaded..");
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
    $("#tbodyid").empty();
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
           // var $checkbox = $('#switch9').find(':checkbox');
            if (data["EM_IsSuper"] == true) {
               
                $("#switch9").prop("checked", true);


            }
            else {
                $("#switch9").prop("checked", false);
            }

           // var $checkbox = $('#chkManager').find(':checkbox');
            if (data["EM_IsManager"] == 1) {
                
                $("#chkManager").prop("checked", true);


            }
            else {
                $("#chkManager").prop("checked", false);
            }

            if (data['EM_ProfilePic'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['EM_ProfilePic']);
                pathString = data['EM_ProfilePic'];
                user_image = data['EM_ProfilePic'];
            }
            $('#hdnId').val(data["EM_EmpId"]);
            $('#txtEmpCode').val(data["EM_EmpCode"]);
            $('#txtName').val(data["EM_EmpName"]);
            //$('#txtSal').val(data["EM_TotalSal"]);
            $('#txtMob').val(data["EM_EmpContactNo"]);
            $('#txtDegree').val(data["EM_Degree"]);
            $('#ddlDesg').val(data["EM_EmpDesignationId"]);

            $('#txtDOJ').val(data["EM_EmpDOJ"]);
            $('#txtFather').val(data["EM_EmpFathers"]);
            $('#txtAddrs').val(data["EM_EmpAddress"]);
            $("#txtNID").val(data["EM_NIDNo"]);
            $("#txtEmail").val(data["EM_Email"]);


            $("#ddlState").val(data["EM_StateId"])
            
            $('#ddlDepartment').val(data["EM_DepartmentID"]);
            //$('#txtBank').val(data["EM_Bank"]);
            //$("#txtAccountNo").val(data["EM_AccountNo"]);
            //$("#txtIFSC").val(data["EM_IFSC"]);
            $("#ddlSex").val(data["EM_Sex"]);

            //$('#txtBrsnch').val(data["EM_BranchName"]);
            $('#txtMother').val(data["EM_MotherName"]);
            $('#txtDOB').val(data["EM_DOB"]);
            $('#txtMother').val(data["EM_MotherName"]);
            $('#txtZipCode').val(data["EM_ZipCode"]);

            $("#hdnmanagerId").val(data["EM_ManagerId"]);
          
            $("#txtManagerName").val(data["ManagerName"]);
            
            var trHTML = '';

            var trHTML1 = '';


        },
        error: function (data) {

        }
    });
    return false;

}

$(".profile_pic").change(function () {
    if (typeof (FileReader) != "undefined") {
        var dvPreview = $(".pic");
        dvPreview.html("");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
        $($(this)[0].files).each(function () {
            var file = $(this);
            if (regex.test(file[0].name.toLowerCase())) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    var img = $("<img />");
                    img.css({ "height": "70px", "width": "80px", "cursor": "pointer" });
                    img.attr("src", e.target.result);
                    dvPreview.html(img);
                    pathString = e.target.result;

                }
                reader.readAsDataURL(file[0]);
            }
            else {

                dvPreview.html("");
                return false;
            }
        });
    }
    else {

    }
});
var pathFl, pathStringFl;

function deleteconfirmBoxClick(rowNo) {
    var ret;
    $.confirm({
        title: "Delete Contents..",
        content: "Are you sure you want to delete?",
        theme: 'material',
        type: 'red',
        buttons: {
            confirm: function () {
                DeleteItem(rowNo);
                $(rowNo).closest('tr').remove();

                $.alert("Record Deleted ...");

            },
            cancel: function () {
                btnClass: 'btn-red',
                $.alert("Cancel..");

            }


        }
    });


}
function ShowPreview(input) {
    if (input.files && input.files[0]) {
        var ImageDir = new FileReader();
        ImageDir.onload = function (e) {
            $('#prfpicIMG').attr('src', e.target.result);
        }




        ImageDir.readAsDataURL(input.files[0]);
        path = $('#flPic').val().substring(12);
        //path = $('#flPic').val();
        pathString = '/images/' + path;
        // SaveRecord();
    }
}
function DeleteItem(t) {

    var photoFileName = $(t).closest('tr').find("td:eq(1)").html().split('/Upload/')[1];

    var _data = "{photoFileName:'" + photoFileName + "'}";

    $.ajax({
        type: "POST",
        url: '/ScriptJson/DeletePhoto',
        data: _data,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: false,
        async: false,
        success: function (response) {

            AddErrorAlert("success", response);
        },
        error: function (error) {
            AddErrorAlert("error", "Picture not Deleted..");
        }
    });
}

