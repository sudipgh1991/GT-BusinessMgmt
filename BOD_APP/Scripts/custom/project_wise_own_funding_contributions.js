﻿$(document).ready(function () {

    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: true,
    //    showDropdowns: true,

    //});
    var Id = getParameterByName('Id');

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

$(document).off('click', '#add-row').on('click', '#add-row', function (e) {
    let totalRowCount = $("#tblMatchedFunding tr").length;
    var ddlAccounting = $("#ddlAccounting").val();
    let RowCount = parseInt(totalRowCount) + 1;
    let txtDate = $("#txtDate").val();
    let ddlStatus = $("#ddlStatus").val();
    let txtAmount = $("#txtAmount").val();
    var markup = '<tr><td class="width-350" style="padding:0px !important;"><div class="card-body" style="padding:4px !important;"><div class="form-group tblxs"><select class="form-control input-sm  drop_down" id="ddlAccounting_'
        + RowCount + '"></select></div></div></td><td class="width-350" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<select class="form-control input-sm ddlStatus" id="ddlStatus_' + RowCount + '">' +
        '<option value="" ' + ((ddlStatus == '') ? 'selected' : '') + '>Select</option>' +
        '<option value="Applied for Funding" ' + ((ddlStatus == 'Applied for Funding') ? 'selected' : '') + '>Applied for Funding</option>' +
        '<option value="Funding dependent on project activities" ' + ((ddlStatus == 'Funding dependent on project activities') ? 'selected' : '') + '>Funding dependent on project activities</option>' +
        '<option value="Funding pledge/ part funding secured" ' + ((ddlStatus == 'Funding pledge/ part funding secured') ? 'selected' : '') + '>Funding pledge/ part funding secured</option>' +
        '<option value="Full Funding secured" ' + ((ddlStatus == 'Full Funding secured') ? 'selected' : '') + '>Full Funding secured</option>' +
        '<option value="Funding received - in part or in full" ' + ((ddlStatus == 'Funding received - in part or in full') ? 'selected' : '') + '>Funding received - in part or in full</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  singledate thtxt txtDate" value="' + txtDate + '" id="txtDate_' + RowCount + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtAmount" value="' + txtAmount + '" id="txtAmount_' + RowCount + '">' +
        '</div>' +
        '</div>' +
        '</td>' +        
        "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin-bottom:0.4rem !important;line-height: normal !important;' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td></tr>";
    $("#tblMatchedFunding tbody").append(markup);
    $("#ddlStatus").val('');
    $("#txtDate").val('');
    $("#txtAmount").val('');
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


function SaveRecords() {
    var tblMatchedFunding = document.getElementById("tblMatchedFunding");
    var OwnFundingContributionsArr = [];
    for (var i = 2; i < tblMatchedFunding.rows.length; i++) {
        var count = i + 1;
        var txtDate = document.getElementById("txtDate_" + count).value;
        var txtAmount = document.getElementById("txtAmount_" + count).value;
        var ddlStatus = document.getElementById("ddlStatus_" + count).value;
        var ddlAccounting = document.getElementById("ddlAccounting_" + count).value;

        OwnFundingContributionsArr.push({
            OFC_Date: new Date(txtDate),
            OFC_Amount: txtAmount,
            OFC_Status: ddlStatus,
            OFC_Accounting: ddlAccounting
        });

    }


    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            OwnFundingContributions: OwnFundingContributionsArr,

        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectOwnFundingContributions",
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
            param1: 'OFC_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'OwnFundingContributions_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetProjectWiseOwnFundingContributions',
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

            if (data.OwnFundingContributions.length > 0) {

                $.each(data.OwnFundingContributions, function (index, value) {
                    var totalRowCount = $("#tblMatchedFunding tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;


                    var markup = '<tr><td class="width-350" style="padding:0px !important;"><div class="card-body" style="padding:4px !important;"><div class="form-group tblxs"><select class="form-control input-sm  drop_down" id="ddlAccounting_'
                        + RowCount + '"></select></div></div></td><td class="width-150" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<select class="form-control input-sm ddlStatus" id="ddlStatus_' + RowCount + '">' +
                        '<option value="" ' + ((value.OFC_Status == '') ? 'selected' : '') + '>Select</option>' +
                        '<option value="Applied for Funding" ' + ((value.OFC_Status == 'Applied for Funding') ? 'selected' : '') + '>Applied for Funding</option>' +
                        '<option value="Funding dependent on project activities" ' + ((value.OFC_Status == 'Funding dependent on project activities') ? 'selected' : '') + '>Funding dependent on project activities</option>' +
                        '<option value="Funding pledge/ part funding secured" ' + ((value.OFC_Status == 'Funding pledge/ part funding secured') ? 'selected' : '') + '>Funding pledge/ part funding secured</option>' +
                        '<option value="Full Funding secured" ' + ((value.OFC_Status == 'Full Funding secured') ? 'selected' : '') + '>Full Funding secured</option>' +
                        '<option value="Funding received - in part or in full" ' + ((value.OFC_Status == 'Funding received - in part or in full') ? 'selected' : '') + '>Funding received - in part or in full</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  singledate thtxt txtDate" value="' + value.OFC_Date + '" id="txtDate_' + RowCount + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtAmount" value="' + value.OFC_Amount + '" id="txtAmount_' + RowCount + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td></tr>";
                    $("#tblMatchedFunding tbody").append(markup);
                    var accountingId = "#ddlAccounting_" + RowCount;
                    InitUIByAccountingId(accountingId);
                    $("#ddlAccounting_" + RowCount).val(value.OFC_Accounting);

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}

$(document).off("keypress keyup blur", ".allownumericWithdecimal").on("keypress keyup blur", ".allownumericWithdecimal", function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && ((event.which < 48 || event.which > 57) && (event.which != 0 && event.which != 8))) { event.preventDefault(); } var text = $(this).val(); if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= text.length - 2)) { event.preventDefault(); }
});