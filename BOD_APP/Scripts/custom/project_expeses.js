$(document).ready(function () {
    InitUI();

    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });
    var Id = getParameterByName('Id')

    if (Id != '') {
        retrive(Id);

    }

});
function InitUI() {

    DropdownBinder.DDLData = {
        tableName: "ItemMaster_IM",
        Text: 'IM_Name',
        Value: 'IM_Id',
        ColumnName: 'IM_CreateBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(".item");

    DropdownBinder.Execute();

    DropdownBinder.DDLData = {
        tableName: "UnitMaster_UM",
        Text: 'UM_UnitName',
        Value: 'UM_Id'
    };

    DropdownBinder.DDLElem = $(".unit");

    DropdownBinder.Execute();

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
function InitUIById(id) {

    DropdownBinder.DDLData = {
        tableName: "UnitMaster_UM",
        Text: 'UM_UnitName',
        Value: 'UM_Id'
    };

    DropdownBinder.DDLElem = $(id);

    DropdownBinder.Execute();

}
function InitUIByItemId(id) {

    DropdownBinder.DDLData = {
        tableName: "ItemMaster_IM",
        Text: 'IM_Name',
        Value: 'IM_Id',
        ColumnName: 'IM_CreateBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(id);

    DropdownBinder.Execute();

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
$("#add-row").click(function () {
    var totalRowCount = $("#tblExpenses tr").length;
    var RowCount = parseInt(totalRowCount) + 1;
    var ddlAccounting = $("#ddlAccounting").val();
    var ddlItem = $("#ddlItem").val();
    var ddlUnit = $("#ddlUnit").val();

    var txtDate = $("#txtDate").val();
    var txtRate = $("#txtRate").val();
    var txtQty = $("#txtQty").val();
    var txtNetAmount = $("#txtNetAmount").val();

    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlItem_"
        + RowCount + "'></select></div></div></td><td class='width-150' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlUnit_"
        + RowCount + "'></select></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
        + txtDate + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtRate frm rate'  id='txtRate_" + RowCount + "' value='"
        + txtRate + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtQty frm qty'  id='txtQty_" + RowCount + "'  value='"
        + txtQty + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtNetAmount total' disabled id='txtNetAmount_" + RowCount + "' value='"
        + txtNetAmount + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td></tr>";
    $("#tblExpenses tbody").append(markup);
    var accounting = "#ddlAccounting_" + RowCount;
    var unitId = "#ddlUnit_" + RowCount;
    var itemId = "#ddlItem_" + RowCount;
    InitUIById(unitId);
    InitUIByItemId(itemId);
    InitUIByAccountingId(accounting);
    $("#ddlUnit_" + RowCount).val(ddlUnit);
    $("#ddlItem_" + RowCount).val(ddlItem);
    $("#ddlAccounting_" + RowCount).val(ddlAccounting);
    $(".thtxt").val('');
    $("#ddlUnit").val('');
    $("#ddlItem").val('');
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

$(document).on('keyup', 'input.frm', function () {

    $rate = $(this).parents('tr').find('.rate');
    $qty = $(this).parents('tr').find('.qty');
    $expenseTotal = $(this).parents('tr').find('.total');

    var qty = $qty.val() == "" ? 1 : $qty.val();
    $qty.val(qty);
    $expenseTotal.val(parseFloat($rate.val()) * parseInt($qty.val()));

});
$(".qty").on("focus", function () {
    $(this).select();
});
function SaveRecords() {
    var tblExpenses = document.getElementById("tblExpenses");
    var ExpensesArr = [];
    for (var i = 2; i < tblExpenses.rows.length; i++) {
        var count = i + 1;
        var ddlUnit = document.getElementById("ddlUnit_" + count).value;
        var ddlItem = document.getElementById("ddlItem_" + count).value;
        var ddlAccounting = document.getElementById("ddlAccounting_" + count).value;
        var txtRate = document.getElementById("txtRate_" + count).value;
        var txtDate = document.getElementById("txtDate_" + count).value;
        var txtQty = document.getElementById("txtQty_" + count).value;
        var txtNetAmount = document.getElementById("txtNetAmount_" + count).value;

        ExpensesArr.push({
            PWE_Item: parseInt(ddlItem),
            PWE_UnitId: parseInt(ddlUnit),
            PWE_Date: txtDate,
            PWE_Rate: parseFloat(txtRate),
            PWE_Qty: parseInt(txtQty),
            PWE_Amount: parseFloat(txtNetAmount),
            PWE_Accounting: parseFloat(ddlAccounting),
        });

    }


    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            ExpensesList: ExpensesArr,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectExpenses",
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
            TransactionType: 'SelectExpenses',
            param1: 'PWE_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'ProjectWiseExpenses_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetProjectWiseExpenses',
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

            if (data.ExpensesList.length > 0) {

                $.each(data.ExpensesList, function (index, value) {
                    var totalRowCount = $("#tblExpenses tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;


                    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
                        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlItem_"
                        + RowCount + "'></select></div></div></td><td class='width-150' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlUnit_" + RowCount + "'></select></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
                        + value.PWE_Date + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtRate frm rate'  id='txtRate_" + RowCount + "' value='"
                        + value.PWE_Rate + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtQty frm qty'  id='txtQty_" + RowCount + "'  value='"
                        + value.PWE_Qty + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtNetAmount total' disabled id='txtNetAmount_" + RowCount + "' value='"
                        + value.PWE_Amount + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td</tr>";
                    $("#tblExpenses tbody").append(markup);
                    var unitId = "#ddlUnit_" + RowCount;
                    var itemId = "#ddlItem_" + RowCount;
                    var accountingId = "#ddlAccounting_" + RowCount;
                    InitUIById(unitId);
                    InitUIByItemId(itemId);
                    InitUIByAccountingId(accountingId);
                    $("#ddlUnit_" + RowCount).val(value.PWE_UnitId);
                    $("#ddlItem_" + RowCount).val(value.PWE_Item);
                    $("#ddlAccounting_" + RowCount).val(value.PWE_Accounting);

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}