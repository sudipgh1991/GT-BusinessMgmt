var formElem = $("#frmEmpSalary");
var path;
var pathString;
var switchStatus = false;
//$("#switch9").on('change', function () {
//    if ($(this).is(':checked')) {
//        switchStatus = $(this).is(':checked');
//        $('#btnSubmitPermission').prop('disabled', true);
//    }
//    else {
//        switchStatus = $(this).is(':checked');

//    }
//});
$(document).ready(function () {

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

function Calculation() {
    var Cal = "0";
    var deduct = "0";

    var txtBasic = ($('#txtBasic').val() == "") ? parseInt('0') : parseInt($('#txtBasic').val());
    var txtHRA = ($('#txtHRA').val() == "") ? parseInt('0') : parseInt($('#txtHRA').val());
    var txtDA = ($('#txtDA').val() == "") ? parseInt('0') : parseInt($('#txtDA').val());


    var txtConveyance = ($('#txtConveyance').val() == "") ? "0" : parseInt($('#txtConveyance').val());

    var txtMdclAllnc = ($('#txtMdclAllnc').val() == "") ? "0" : parseInt($('#txtMdclAllnc').val());
    var txtTlphAllnc = ($('#txtTlphAllnc').val() == "") ? "0" : parseInt($('#txtTlphAllnc').val());


    var txtPF = ($('#txtPF').val() == "") ? "0" : parseInt($('#txtPF').val());
    var txtPTAX = ($('#txtPTAX').val() == "") ? "0" : parseInt($('#txtPTAX').val());
    var txtTDS = ($('#txtTDS').val() == "") ? "0" : parseInt($('#txtTDS').val());



    Cal = parseInt(txtBasic) + parseInt(txtHRA) + parseInt(txtConveyance) + parseInt(txtDA) + parseInt(txtMdclAllnc) + parseInt(txtTlphAllnc);
    deduct = parseInt(txtPF) + parseInt(txtPTAX) + parseInt(txtTDS);
    $('#txtSal').val(parseInt(Cal) - parseInt(deduct));
}

function EmployeeSalaryValidate() {
    $(".error").remove();
    var Basic = $("#txtBasic").val();
    var HRA = $("#txtHRA").val();
    var DA = $("#txtDA").val();
    var Conveyance = $("#txtConveyance").val();
    var MdclAllnc = $("#txtMdclAllnc").val();
    var TlphAllnc = $("#txtTlphAllnc").val();
    var PF = $("#txtPF").val();
    var PTAX = $("#txtPTAX").val();
    var TDS = $("#txtTDS").val();
    var Bank = $("#txtBank").val();
    var AccountNo = $("#txtAccountNo").val();
    var IFSC = $("#txtIFSC").val();
    var Brsnch = $("#txtBrsnch").val();



    if (Basic == "") {
        $("#txtBasic").after('<span class="error">Please enter Basic.</span>');
        return false;
    }
    else if (HRA == "") {
        $("#txtHRA").after('<span class="error">Please enter HRA.</span>');
        return false;
    }
    else if (DA == "") {
        $("#txtDA").after('<span class="error">Please enter Date of DA.</span>');
        return false;
    }
    else if (Conveyance == "") {
        $("#txtConveyance").after('<span class="error">Please enter Conveyance.</span>');
        return false;
    }
    else if (MdclAllnc == "") {
        $("#txtMdclAllnc").after('<span class="error">Please enter Medical Allownce.</span>');
        return false;
    }
    else if (TlphAllnc == "") {
        $("#txtTlphAllnc").after('<span class="error">Please enter Telephone Allownce.</span>');
        return false;
    }
    else if (PF == "") {
        $("#txtPF").after('<span class="error">Please enter PF.</span>');
        return false;
    }
    else if (PTAX == "") {
        $("#txtPTAX").after('<span class="error">Please enter PTAX.</span>');
        return false;
    }
    else if (TDS == "") {
        $("#txtTDS").after('<span class="error">Please enter TDS.</span>');
        return false;
    }
    else if (Bank == "") {
        $("#txtBank").after('<span class="error">Please enter Bank Name.</span>');
        return false;
    }
    else if (AccountNo == "") {
        $("#txtAccountNo").after('<span class="error">Please enter AccountNo Number .</span>');
        return false;
    }
    else if (IFSC == "") {
        $("#txtIFSC").after('<span class="error">Please enter IFSC Number .</span>');
        return false;
    }
    else if (Brsnch == "") {
        $("#txtBrsnch").after('<span class="error">Please enter Branch Name .</span>');
        return false;
    }


    return true;
}

function SaveRecord() {

    //Validation   
    if (EmployeeSalaryValidate() == false) {
        return false;
    }


    var a = parseInt($("#hdnUserId").val())

    var _data = JSON.stringify({
        emp: {
            UserID: parseInt($("#hdnUserId").val()),
            // empList: tableArr,
            EM_EmpId: parseInt($("#hdnId").val()),
            //EM_EmpName: $.trim($("#txtName").val()),
            EM_TotalSal: parseFloat($("#txtSal").val()),
          
            EM_Basic: parseFloat($("#txtBasic").val()),
            EM_HRA: parseFloat($("#txtHRA").val()),
            EM_DA: parseFloat($("#txtDA").val()),
            EM_MedicalAllowance: parseFloat($("#txtMdclAllnc").val()),
            EM_Conveyance: parseFloat($("#txtConveyance").val()),
            EM_TelephoneAllowance: parseFloat($("#txtTlphAllnc").val()),
          
            EM_ProvidentFund: parseFloat($("#txtPF").val()),
        
            EM_Ptax: parseFloat($("#txtPTAX").val()),
            EM_TDS: parseFloat($("#txtTDS").val()),
           
            EM_Bank: $.trim($("#txtBank").val()),
            EM_AccountNo: $.trim($("#txtAccountNo").val()),
            EM_IFSC: $.trim($("#txtIFSC").val()),
            EM_BranchName: $.trim($("#txtBrsnch").val()),

       
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
                window.location.href = '/Home/EmployeeSalarySettings';
                //if (parseInt(a) > 0) {
                //    if (permission == "N") {
                //        window.location.href = '/Home/SMMEWiseEmployeeList'
                //    }

                //    else { window.location.href = '/Home/UserPermission?Id=' + data.Id + '&type=S&SmId=' + a };
                //}
                //else
                //    if (permission == "N") {
                //        window.location.href = '/Home/EmployeeMasterList';
                //    }
                //    else {
                //        window.location.href = '/Home/UserPermission?Id=' + data.Id;
                //    }
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
          
            //if (data['EM_ProfilePic'] != "") {
            //    $('#user_image').attr('src', '');
            //    $('#user_image').attr('src', data['EM_ProfilePic']);
            //    pathString = data['EM_ProfilePic'];
            //    user_image = data['EM_ProfilePic'];
            //}
            $('#hdnId').val(data["EM_EmpId"]);
           
            $('#txtSal').val(data["EM_TotalSal"]);
            $('#txtBasic').val(data["EM_Basic"]);
            $('#txtHRA').val(data["EM_HRA"]);
            $('#txtDA').val(data["EM_DA"]);
            $("#txtMdclAllnc").val(data["EM_MedicalAllowance"]);


            $('#txtConveyance').val(data["EM_Conveyance"]);
            $("#txtTlphAllnc").val(data["EM_TelephoneAllowance"]);


            $('#txtPF').val(data["EM_ProvidentFund"]);
            $("#txtPTAX").val(data["EM_Ptax"]);
            $("#txtTDS").val(data["EM_TDS"]);

            $('#txtBank').val(data["EM_Bank"]);
            $("#txtAccountNo").val(data["EM_AccountNo"]);
            $("#txtIFSC").val(data["EM_IFSC"]);


            $('#txtBrsnch').val(data["EM_BranchName"]);
   
            //var divHTML = '';

            //divHTML = "<h4  class='media-heading'><span class=users-view-name'>" + data["EM_EmpName"] + "</span></h4><span>Emp Code: </span><span class='users-view-id'>" + data["EM_EmpCode"] + "</span>";
            //$('#divEmpnameCode').append(divHTML)

            //var trHTML = '';
       
            //trHTML = "<tr><td>Date of Joining:</td><td>" + data["EM_EmpDOJ"] + "</td></tr><tr><td>D.O.B:</td><td>" + data["EM_DOB"] + "</td></tr> <tr><td>Email:</td><td>" + data["EM_Email"] + "</td></tr><tr><td>Contact Number:</td><td>" + data["EM_EmpContactNo"] + "</td></tr>";
            //$('#tblempdetails').append(trHTML)

            //var trHTML1 = '';

            //trHTML1 = "<tr><tr><td>Designation:</td><td>" + data["EM_Designation"] + "</td></tr><tr><td>National ID Number:</td><td>" + data["EM_NIDNo"] + "</td></tr><tr><td>Highest Qualification:</td><td>" + data["EM_Degree"] + "</td></tr>";
            //$('#tbledetails').append(trHTML1)
            
            //var trHTML1 = '';



            //$.each(data.List, function (i, item) {
            //    i = i + 1;
            //    trHTML1 += "<tr><td><input type='text' class='form-control' id='txtExam_" + i + "' value='" + item.ED_ExamName + "'/></td><td><input type='text' class='form-control' id='txtGrpSub_" + i + "' value='" + item.ED_GroupSubject + "'/></td></td><td><input type='text' class='form-control' id='txtPassingYr_" + i + "' value='" + item.ED_PassingYear + "'/></td><td><input type='text' class='form-control' id='txtGpa_" + i + "'' value='" + item.ED_GPA + "'/></td></tr>";
            //});

            //$('#tblStock').append(trHTML1)

        },
        error: function (data) {

        }
    });
    return false;

}

//$(".profile_pic").change(function () {
//    if (typeof (FileReader) != "undefined") {
//        var dvPreview = $(".pic");
//        dvPreview.html("");
//        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;
//        $($(this)[0].files).each(function () {
//            var file = $(this);
//            if (regex.test(file[0].name.toLowerCase())) {
//                var reader = new FileReader();
//                reader.onload = function (e) {
//                    var img = $("<img />");
//                    img.css({ "height": "70px", "width": "80px", "cursor": "pointer" });
//                    img.attr("src", e.target.result);
//                    dvPreview.html(img);
//                    pathString = e.target.result;

//                }
//                reader.readAsDataURL(file[0]);
//            }
//            else {

//                dvPreview.html("");
//                return false;
//            }
//        });
//    }
//    else {

//    }
//});
var pathFl, pathStringFl;
//function AddItemIndividual() {
//    if (itemAddValidation() == false) {
//        return false;
//    }

//    var table = document.getElementById("tblEmp");
//    var RNo;
//    var row = table.insertRow(RNo);
//    var Cell1 = row.insertCell(0);
//    var Cell2 = row.insertCell(1);
//    var Cell3 = row.insertCell(2);
//    pathFl = $('#fl').val().substring(12);

//    pathStringFl = '/Upload/' + pathFl;
//    UploadDoc('fl');
//    Cell1.innerHTML = $('#txtTitel').val();
//    Cell2.innerHTML = pathStringFl;

//    Cell3.innerHTML = "<a title='Delete...' onclick='deleteconfirmBoxClick(this)' style='cursor:pointer'><img src='../../Content/images/delete.png' /></a>";



//}
//function itemAddValidation() {
//    var txtTitel = $('#txtTitel').val();



//    if (txtTitel == 0) {
//        AddErrorAlert("error", "Enter titel..");
//        return false;
//    }
//    if (pathString == "") {
//        AddErrorAlert("error", "select Any file..");
//        return false;
//    }

//    return true
//}
//function deleteconfirmBoxClick(rowNo) {
//    var ret;
//    $.confirm({
//        title: "Delete Contents..",
//        content: "Are you sure you want to delete?",
//        theme: 'material',
//        type: 'red',
//        buttons: {
//            confirm: function () {
//                DeleteItem(rowNo);
//                $(rowNo).closest('tr').remove();

//                $.alert("Record Deleted ...");

//            },
//            cancel: function () {
//                btnClass: 'btn-red',
//                $.alert("Cancel..");

//            }


//        }
//    });


//}
//function ShowPreview(input) {
//    if (input.files && input.files[0]) {
//        var ImageDir = new FileReader();
//        ImageDir.onload = function (e) {
//            $('#prfpicIMG').attr('src', e.target.result);
//        }




//        ImageDir.readAsDataURL(input.files[0]);
//        path = $('#flPic').val().substring(12);
//        //path = $('#flPic').val();
//        pathString = '/images/' + path;
//        // SaveRecord();
//    }
//}
//function DeleteItem(t) {

//    var photoFileName = $(t).closest('tr').find("td:eq(1)").html().split('/Upload/')[1];

//    var _data = "{photoFileName:'" + photoFileName + "'}";

//    $.ajax({
//        type: "POST",
//        url: '/ScriptJson/DeletePhoto',
//        data: _data,
//        dataType: 'json',
//        contentType: 'application/json; charset=utf-8',
//        processData: false,
//        async: false,
//        success: function (response) {

//            AddErrorAlert("success", response);
//        },
//        error: function (error) {
//            AddErrorAlert("error", "Picture not Deleted..");
//        }
//    });
//}

//function GeTEmpDeatils(id) {

//    var _data = JSON.stringify({
//        emp: {
//            EM_EmpId: parseInt(id)
//        }
//    });
//    $.ajax({
//        type: "POST",
//        url: "/ScriptJson/GetEmployeeMaster",
//        data: _data,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (data) {

//            $('.form-control').prop('disabled', true);
//            $('.en').prop('disabled', false);
//            $('#hdnId').val(data["EM_EmpId"]);
//            $('#txtEmpCode').val(data["EM_EmpCode"]);
//            $('#txtName').val(data["EM_EmpName"]);
//            $('#txtSal').val(data["EM_TotalSal"]);
//            $('#txtMob').val(data["EM_EmpContactNo"]);
//            $('#txtDegree').val(data["EM_Degree"]);
//            $('#ddlDesg').val(data["EM_EmpDesignationId"]);

//            $('#txtDOJ').val(data["EM_EmpDOJ"]);
//            $('#txtFather').val(data["EM_EmpFathers"]);
//            $('#txtAddrs').val(data["EM_EmpAddress"]);
//            $("#txtNID").val(data["EM_NIDNo"]);
//            $("#txtEmail").val(data["EM_Email"]);





//            $('#ddlDepartment').val(data["EM_DepartmentID"]);

//            $("#ddlSex").val(data["EM_Sex"]);


//            $('#txtMother').val(data["EM_MotherName"]);
//            $('#txtDOB').val(data["EM_DOB"]);
//            $("#txtExp").val(data["EM_PrevExp"]);

//            $("#txtPunchingCode").val(data["EM_PunchingCode"]);




//        },
//        error: function (data) {

//        }
//    });
//    return false;

//}
