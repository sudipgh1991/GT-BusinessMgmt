$(document).ready(function () {
    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: true,
    //    showDropdowns: true,

    //});
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
$("#add-row").click(function () {
    var totalRowCount = $("#tblInterestincome tr").length;
    var RowCount = parseInt(totalRowCount) + 1;
    var txtItem = $("#txtItem").val();
    var txtSupportingEvidence = $("#txtSupportingEvidence").val();
    var ddlAccounting = $("#ddlAccounting").val();
    var txtDate = $("#txtDate").val();
    var txtAssumptions = $("#txtAssumptions").val();
    var txtDescription = $("#txtDescription").val();

    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm ' id='txtItem_" + RowCount + "'  value='"
                           + txtItem + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtSupportingEvidence_" + RowCount + "'  value='"
                            + txtSupportingEvidence + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
                          + txtDate + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtAssumptions frm rate'  id='txtAssumptions_" + RowCount + "' value='"
                           + txtAssumptions + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  frm qty'  id='txtDescription_" + RowCount + "'  value='"

                           + txtDescription + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin-bottom:5px !important;line-height: normal !important;' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td</tr>";
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

        var txtAssumptions = document.getElementById("txtAssumptions_" + count).value;
        var txtDate = document.getElementById("txtDate_" + count).value;
        var txtSupportingEvidence = document.getElementById("txtSupportingEvidence_" + count).value;
        var txtDescription = document.getElementById("txtDescription_" + count).value;
        var ddlAccounting = document.getElementById("ddlAccounting_" + count).value;
        ExpensesArr.push({
            OE_Date: txtDate,
            OE_OtherEarnings: txtItem,
            OE_SupportingEvidence: txtSupportingEvidence,
            OE_Assumptions: txtAssumptions,
            OE_Description: txtDescription,
            OE_Accounting: ddlAccounting
        });

    }


    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            OtherEarnings: ExpensesArr,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateOtherEarnings",
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
            param1: 'OE_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'OtherEarnings_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetOtherEarnings',
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

            if (data.OtherEarnings.length > 0) {

                $.each(data.OtherEarnings, function (index, value) {
                    var totalRowCount = $("#tblInterestincome tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;


                    var markup = "<tr><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><select class='form-control input-sm  drop_down' id='ddlAccounting_"
                        + RowCount + "'></select></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm ' id='txtItem_" + RowCount + "'  value='"
                        + value.OE_OtherEarnings + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtSupportingEvidence_" + RowCount + "'  value='"
                         + value.OE_SupportingEvidence + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  singledate' id='txtDate_" + RowCount + "'  value='"
                       + value.OE_Date + "'></div></div></td><td style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm  txtAssumptions frm rate'  id='txtAssumptions_" + RowCount + "' value='"
                        + value.OE_Assumptions + "'></div></div></td><td class='width-350' style='padding:0px !important;'><div class='card-body' style='padding:4px !important;'><div class='form-group tblxs'><input type='text' class='form-control input-sm frm qty'  id='txtDescription_" + RowCount + "'  value='"

                        + value.OE_Description + "'></div></div></td><td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' id='add-row' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td</tr>";
                    $("#tblInterestincome tbody").append(markup);
                    var accountingId = "#ddlAccounting_" + RowCount;
                    InitUIByAccountingId(accountingId);
                    $("#ddlAccounting_" + RowCount).val(value.OE_Accounting);

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}