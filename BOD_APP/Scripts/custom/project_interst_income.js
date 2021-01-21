$(document).ready(function () {
   //$('.singledate').daterangepicker({
   //     singleDatePicker: true,
   //     autoUpdateInput: true,
   //     showDropdowns: true,

   // });
    var Id = getParameterByName('Id')

    if (Id != '') {
        retrive(Id);

    }
    InitUI();
});
function InitUI() {

    DropdownBinder.DDLData = {
        tableName: "AccountingCode_AC",
        Text: 'AC_Code',
        Value: 'AC_Id',
        ColumnName: 'AC_CreatedBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(".accounting");

    DropdownBinder.Execute();
    $(".accounting").find('option:eq(0)').prop('value', 0);
}

function InitUIByAccountingId(id) {

    DropdownBinder.DDLData = {
        tableName: "AccountingCode_AC",
        Text: 'AC_Code',
        Value: 'AC_Id',
        ColumnName: 'AC_CreatedBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(id);

    DropdownBinder.Execute();
    $(id).find('option:eq(0)').prop('value', 0);
}
function InitUIById(id) {

    DropdownBinder.DDLData = {
        tableName: "UnitMaster_UM",
        Text: 'UM_UnitName',
        Value: 'UM_Id'
    };

    DropdownBinder.DDLElem = $(id);

    DropdownBinder.Execute();

}
$("#add-row").click(function () {
    var totalRowCount = $("#tblInterestincome tr").length;
    var RowCount = parseInt(totalRowCount) + 1;
    var txtItem = $("#txtItem").val();
    var txtHolding = $("#txtHolding").val();
    var ddlAccounting = $("#ddlAccounting").val();
    var txtDate = $("#txtDate").val();
    var txtRate = $("#txtRate").val();
    var txtpaymentTerms = $("#txtpaymentTerms").val();
   
    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm ' id='txtItem_" + RowCount + "'  value='"
                           + txtItem + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtHolding_" + RowCount + "'  value='"
                            + txtHolding + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
                          + txtDate + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtRate frm rate'  id='txtRate_" + RowCount + "' value='"
                           + txtRate + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  frm qty'  id='txtpaymentTerms_" + RowCount + "'  value='"

                           + txtpaymentTerms + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td</tr>";
    $("#tblInterestincome tbody").append(markup);
    
    $(".thtxt").val('');
    var accounting = "#ddlAccounting_" + RowCount;
    InitUIByAccountingId(accounting);
    $("#ddlAccounting_" + RowCount).val(ddlAccounting);
    $("#ddlAccounting").val('0');
});

function DeleteRow(rowNo) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to deleted this records!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Your I Delete!',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger ml-1',
        buttonsStyling: false,

    }).then(function (result) {
        if (result.value) {
            $(rowNo).closest('tr').remove();
            Swal.fire({
                type: "success",
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                confirmButtonClass: 'btn btn-success',
            })
        }
    })
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(".qty").on("focus", function () {
    $(this).select();
});
function SaveRecords() {
    var tblExpenses = document.getElementById("tblInterestincome");
    var ExpensesArr = [];
    for (var i = 2; i < tblExpenses.rows.length; i++) {
        var count = i + 1;
      
        var txtItem = document.getElementById("txtItem_" + count).value;

        var txtRate = document.getElementById("txtRate_" + count).value;
        var txtDate = document.getElementById("txtDate_" + count).value;
        var txtHolding = document.getElementById("txtHolding_" + count).value;
        var txtpaymentTerms = document.getElementById("txtpaymentTerms_" + count).value;
        var ddlAccounting = document.getElementById("ddlAccounting_" + count).value;
        ExpensesArr.push({       
          
            II_Date: txtDate,
            II_InterestInstrument: txtItem,
            II_InstitutionHolding:txtHolding,
            II_InterestRate: parseInt(txtRate),           
            II_InterestPaymentTerms: txtpaymentTerms,
            II_Accounting: ddlAccounting
        });

    }


    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            InterestIncome: ExpensesArr,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateInterestIncome",
        data: _data,
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
            param1: 'II_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'InterestIncome_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetInterestIncome',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            $('#projectName').text(data["PE_ProjectName"])
            $('#client').text(data["CC_CorporateName"]);
            $('#startdate').text(data["PE_StartDate"]);
            $('#enddate').text(data["PE_EndDate"]);
            $('#hdnProject').val(data["PE_Id"]);

            if (data.InterestIncome.length > 0) {

                $.each(data.InterestIncome, function (index, value) {
                    var totalRowCount = $("#tblInterestincome tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;


                    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
                        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm ' id='txtItem_" + RowCount + "'  value='"
                        + value.II_InterestInstrument + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtHolding_" + RowCount + "'  value='"
                         + value.II_InstitutionHolding + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
                       + value.II_Date + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtRate frm rate'  id='txtRate_" + RowCount + "' value='"
                        + value.II_InterestRate + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm frm qty'  id='txtpaymentTerms_" + RowCount + "'  value='"
                       
                        + value.II_InterestPaymentTerms + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin-bottom:5px !important;line-height: normal !important;' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td</tr>";
                    $("#tblInterestincome tbody").append(markup);
                   
                    var accountingId = "#ddlAccounting_" + RowCount;
                    InitUIByAccountingId(accountingId);
                    $("#ddlAccounting_" + RowCount).val(value.II_Accounting);

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}