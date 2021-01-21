var formElem = $("#frmEmpLeaveSetting");

$(document).ready(function () {

    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });

    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: false,
    //    showDropdowns: true,
    //    autoApply: true,

    //}, function (chosen_date) {
    //    $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
    //});
    InitUI();
    //InitValidationRules();

    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
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

    //today = dd + '/' + mm + '/' + yyyy;
    //$('.dt').val(today);
    //$(document).on('click', '.txtEmp', function () {
    //    AutoComplete_Teacher(this);
    //});

});
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function InitUI() {
    $(".select2-placeholder-multiple").select2({
        dropdownAutoWidth: true,
        width: '100%',
        placeholder: "Select days",
    });
   

    DropdownBinder.DDLData = {
        tableName: "WeekDays_WD",
        Text: 'WD_Days',
        Value: 'WD_Id'
    };

    DropdownBinder.DDLElem = $("#ddlWeekL");

    DropdownBinder.Execute();


}


function EmpLeaveValidate() {
    $(".error").remove();

    //var txtName = $('#txtName').val();
    var txtFrom = $('#txtFrom').val();
    var txtTo = $('#txtTo').val();
    var ddlWeekL = $('#ddlWeekL').val();
    var txtLeave = $('#txtLeave').val();


    //if (txtName == "") {
    //    $("#txtName").after('<span class="error">Please enter Project Name.</span>');
    //    return false;
    //}

    //if (txtFrom == "") {

    //    $("#txtFrom").after('<span class="error">Please enter from date.</span>');
    //    return false;
    //}
    //if (txtTo == "") {

    //    $("#txtTo").after('<span class="error">Please enter To date.</span>');
    //    return false;
    //}
    if (ddlWeekL == "") {

        $("#ddlWeekL").after('<span class="error">Please select day.</span>');
        return false;
    }
    if (txtLeave == "") {

        $("#txtLeave").after('<span class="error">Please enter Leave.</span>');
        return false;
    }
    return true;
    
}

function SaveRecord() {

    //Validation   
    if (EmpLeaveValidate() == false) {
        return false;
    }

    var selMulti = $.map($("#ddlWeekL option:selected"), function (el, i) {
        return $(el).val();
    });

    var weekday = selMulti.join(",");
   
        var _data = JSON.stringify({
            emp: {
              
                ELS_EM_Id: parseInt($("#hdnId").val()),
                ELS_Leave: parseInt($("#txtLeave").val()),
                ELS_From: '01/01/2020',
                ELS_To: '12/31/2020',
                ELS_WeekLeave: $.trim(weekday),
                //ELS_WeekLeave: parseInt($("#ddlWeekL").val()),

                ELS_Medical: parseInt($("#txtMedical").val()),
                ELS_EarnedLeave: parseInt($("#txtEL").val()),
                ELS_CasualLeave: parseInt($("#txtCL").val()),
            }
        });

        $.ajax({
            type: "POST",
            url: '/ScriptJson/InsertUpdateEmployeeLeaveSettings',
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
                    window.location.href = '/Home/EmployeeLeave';
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


function retrive(id) {
    var _data = JSON.stringify({
        global: {

            TransactionType: 'Select',
            StoreProcedure: 'EmpLeaveSchedule_USP',
            param1: 'ELS_EM_Id ',
            param1Value: parseInt(id)
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetEmployeeLeaveSettings",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            //$("#hdnId").val(id);
            $('#txtLeave').val(data["ELS_Leave"]);
            $('#txtFrom').val(data["ELS_From"]);
            $('#txtTo').val(data["ELS_To"]);
            var values = data["ELS_WeekLeave"];
            $.each(values.split(","), function (i, e) {
                $("#ddlWeekL option[value='" + e + "']").prop("selected", true);
            });

            //$('#ddlWeekL').val(data["ELS_WeekLeave"]);
            $('#txtMedical').val(data["ELS_Medical"]);
            $('#txtCL').val(data["ELS_CasualLeave"]);
            $('#txtEL').val(data["ELS_EarnedLeave"]);
        },
        error: function (data) {

        }
    });
    return false;

}
function Calculate() {
    var txtMedical = ($('#txtMedical').val() == "") ? parseInt('0') : parseInt($('#txtMedical').val());
    var txtCL = ($('#txtCL').val() == "") ? parseInt('0') : parseInt($('#txtCL').val());
    var txtEL = ($('#txtEL').val() == "") ? parseInt('0') : parseInt($('#txtEL').val());

    var cal = parseInt(txtMedical) + parseInt(txtCL) + parseInt(txtEL);
    $('#txtLeave').val(cal);

}