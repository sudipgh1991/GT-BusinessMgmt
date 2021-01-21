$(document).ready(function () {

    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    },
    function (chosen_date) {
            $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
          $(this.element[0]).val(chosen_date.format('DD/MM/YYYY'));
        });
  

    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: false,
    //    showDropdowns: true,
    //    autoApply: true,
    //    minDate: new Date()

    //}, function (chosen_date) {
    //    $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
    //    //$(this.element[0]).val(chosen_date.format('DD/MM/YYYY'));
    //});

    DropdownBinder.DDLData = {
        tableName: "EmpLeaveSchedule_ELS",
        Text: 'ELS_Name',
        Value: 'ELS_Id',
        ColumnName: 'ELS_EM_Id',
        PId: parseInt($('#hdnId').val())
    };

    DropdownBinder.DDLElem = $("#ddlELSId");
    DropdownBinder.Execute();

    var Id = getParameterByName('Id')
    var SMId = getParameterByName('SMId')
    var Mode = getParameterByName('Mode')

    if (Mode == "O") {

        $('#hdnUserId').val(SMId);
    }
    if (Id != '') {

        {
            GetBalance();
        }
    }



});


$('#txtTo').on('apply.datepicker', function (ev, picker) {
    $('#txtDays').val("");
    var start = process($('#txtFrom').val());
    var end = process($('#txtTo').val());
    var fromdate = $.trim($("#txtFrom").val())
    // end - start returns difference in milliseconds 
    var diff = new Date(end - start);

    if (fromdate == "") {

        return false;
    }
    //if (diff > 0) {
    //    alert("Hi");
    //}

    // get days
    var days = diff / 1000 / 60 / 60 / 24;

    if (days < 0) {
        $("#txtTo").after('<span class="error">Todate should be greater than Fromdate.</span>');

        return false;
    }
    $('#txtDays').val(days + 1);
});

$('#txtFrom').on('apply.datepicker', function (ev, picker) {
    $('#txtDays').val("");
    $(".error").remove();
    var fromdate = $.trim($("#txtFrom").val())
    var todate = $.trim($("#txtTo").val())


    if (fromdate == "" || todate == "") {
        //alert("Please select Fromdate and ToDate");
        return false;
    }
    else {
        var start = process($('#txtFrom').val());
        var end = process($('#txtTo').val());
        var diff = new Date(end - start);

        // get days
        var days = diff / 1000 / 60 / 60 / 24;

        if (days < 0 || fromdate == "") {
            $("#txtFrom").after('<span class="error">Fromdate should be less than Todate</span>');

            return false;
        }
        $('#txtDays').val(days + 1);
    }

});

function EmployeeValidate() {
    $(".error").remove();
    var txtFrom = $("#txtFrom").val();
    var txtTo = $("#txtTo").val();
    var ddlELSId = $("#ddlELSId").val();
    var ddlType = $("#ddlType").val();
    var txtDays = $("#txtDays").val();
    
    if (ddlELSId == "") {
        $("#ddlELSId").after('<span class="error">Please select range.</span>');
        return false();
    }
    else if (ddlType == "") {
        $("#ddlType").after('<span class="error">Please select leave type.</span>');
        return false();
    }
    else if (txtFrom == "") {
        $("#txtFrom").after('<span class="error">Please select FromDate.</span>');
        return false();
    }
    else if (txtTo == "") {
        $("#txtTo").after('<span class="error">Please select ToDate.</span>');
        return false();
    }
    if (txtDays == "") {
        $("#txtDays").after('<span class="error">Days should be greater than 0.</span>');
        return false();
    }

    return true;
}
//$("#txtTo").click(function () {
//    var todate = $.trim($("#txtTo").val())
//    var fromdate = $.trim($("#txtFrom").val())

//    if (todate < fromdate)
//    {
//        alert("wrong");
//    }

//    //alert(this.id); // id of clicked li by directly accessing DOMElement property
//    //alert($(this).attr('id')); // jQuery's .attr() method, same but more verbose
//    //alert($(this).html()); // gets innerHTML of clicked li

//    //var managername = $(this).text();
//    //alert(managername); // gets text contents of clicked li


//});

function process(date) {
    var parts = date.split("/");
    return new Date(parts[2], parts[0] - 1, parts[1]);
}

function SaveRecord() {
    //Validation   
    if (EmployeeValidate() == false) {
        return false;
    }
    var _data = JSON.stringify({
        emp: {
            ELA_Id: parseInt($("#hdnELId").val()),
            ELA_EM_Id: parseInt($("#hdnId").val()),
            ELA_ELS_Id: parseInt($("#ddlELSId").val()),
            ELA_TotalDays: parseFloat($("#txtDays").val()),
            ELA_From: $.trim($("#txtFrom").val()),
            ELA_To: $.trim($("#txtTo").val()),
            ELA_Type: $.trim($("#ddlType").val()),
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateEmpLeaveApplication',
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
                window.location.reload();
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
function GetBalance(id) {

    var _data = JSON.stringify({
        global: {
            TransactionType: "Selectleave",
            param1: "ELA_EM_Id",
            param1Value: $.trim($('#hdnId').val()),
            param2: "ELA_ELS_Id",
            //param2Value: 12,
            param2Value: $.trim($('#ddlELSId').val()),
            StoreProcedure: "EmpLeaveApplication_USP"
        }
    });
    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetEmpBalnceLeave',
        contentType: "application/json; charset=utf-8",
        data: _data,
        dataType: "json",
        success: function (data) {
            $('#lbltotalCl').text(data["CL"]);
            $('#lbltotalEl').text(data["EL"]);
            $('#lbltotalMl').text(data["ML"]);
            $('#lblBalaneCl').text(data["BalanceCL"]);
            $('#lblBalaneEl').text(data["BalanceEL"]);
            $('#lblBalaneMl').text(data["BalanceML"]);
            //$('#txtBL').text(data["Message"]);

        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
}

$("#ddlELSId").change(function () {
    var selectedValue = $(this).val();

    GetBalance(selectedValue);
    //var selectedText = $(this).find("option:selected").text();
    //var selectedValue = $(this).val();

    //alert(selectedValue);
    //alert("Selected Text: " + selectedText + " Value: " + selectedValue);
});

function retrive() {
    var _data = JSON.stringify({
        emp: {
            EM_EmpId: parseInt($('#hdnId').val()),
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

            //$('#txtCode').val(data["EM_EmpCode"]);


        },
        error: function (data) {

        }
    });
    return false;

}
