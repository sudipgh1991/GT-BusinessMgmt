$(document).ready(function () {

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
    let totalRowCount = $("#tblInKindContributions tr").length;
    var ddlAccounting = $("#ddlAccounting").val();
    let RowCount = parseInt(totalRowCount) + 1;
    let ddlCategoryContribution = $("#ddlCategoryContribution").val();
    let txtNameOfContributor = $("#txtNameOfContributor").val();
    let txtDate = $("#txtDate").val();
    let txtAmount = $("#txtAmount").val();
    let txtContact = $("#txtContact").val();
    let txtBankAccount = $("#txtBankAccount").val();
    let txtSpecify = $("#txtSpecify").val();
    let txtTimeLine = $("#txtTimeLine").val();
    let txtDescription = $("#txtDescription").val(); 
    var markup = '<tr>' +
        '<td class="width-350" style="padding:0px !important;"><div class="card-body" style="padding:4px !important;"><div class="form-group tblxs"><select class="form-control input-sm  drop_down" id="ddlAccounting_'
        + RowCount + '"></select></div></div></td><td class="width-350" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<select class="form-control input-sm ddlCategoryContribution" id="ddlCategoryContribution_' + RowCount + '">' +
        '<option value="" ' + ((ddlCategoryContribution == '') ? 'selected' : '') + '>Select</option>' +
        '<option value="SERVICES" ' + ((ddlCategoryContribution == 'SERVICES') ? 'selected' : '') + '>SERVICES</option>' +
        '<option value="ASSET/ EQUIPMENT USAGE" ' + ((ddlCategoryContribution == 'ASSET/ EQUIPMENT USAGE') ? 'selected' : '') + '>ASSET/ EQUIPMENT USAGE</option>' +
        '<option value="MATERIALS" ' + ((ddlCategoryContribution == 'MATERIALS') ? 'selected' : '') + '>MATERIALS</option>' +
        '<option value="SPONSORSHIPS" ' + ((ddlCategoryContribution == 'SPONSORSHIPS') ? 'selected' : '') + '>SPONSORSHIPS</option>' +
        '</select>' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtNameOfContributor" id="txtNameOfContributor_' + RowCount + '" value="' + txtNameOfContributor + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  singledate thtxt txtDate" id="txtDate_' + RowCount + '" value="' + txtDate + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtAmount allownumericWithdecimal" id="txtAmount_' + RowCount + '" value="' + txtAmount + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtContact" id="txtContact_' + RowCount + '" value="' + txtContact + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtBankAccount" id="txtBankAccount_' + RowCount + '" value="' + txtBankAccount + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtSpecify" id="txtSpecify_' + RowCount + '" value="' + txtSpecify + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtTimeLine" id="txtTimeLine_' + RowCount + '" value="' + txtTimeLine + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        '<td class="width-250" style="padding:0px !important;">' +
        '<div class="card-body" style="padding:4px !important;">' +
        '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtDescription" id="txtDescription_' + RowCount + '" value="' + txtDescription + '">' +
        '</div>' +
        '</div>' +
        '</td>' +
        "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin-bottom:5px !important;line-height: normal !important;' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td></tr>";
    $("#tblInKindContributions tbody").append(markup);
    $("#ddlCategoryContribution").val('');
    $("#txtNameOfContributor").val('');
    $("#txtDate").val('');
    $("#txtAmount").val('');
    $("#txtContact").val('');
    $("#txtBankAccount").val('');
    $("#txtSpecify").val('');
    $("#txtTimeLine").val('');
    $("#txtDescription").val(''); 
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
    var tblInKindContributions = document.getElementById("tblInKindContributions");
    var InKindContributionsArr = [];
    for (var i = 2; i < tblInKindContributions.rows.length; i++) {
        var count = i + 1;
        var ddlCategoryContribution = document.getElementById("ddlCategoryContribution_" + count).value;
        var txtNameOfContributor = document.getElementById("txtNameOfContributor_" + count).value;
        var txtDate = document.getElementById("txtDate_" + count).value;
        var txtAmount = document.getElementById("txtAmount_" + count).value;
        var txtContact = document.getElementById("txtContact_" + count).value;
        var txtBankAccount = document.getElementById("txtBankAccount_" + count).value;
        var txtSpecify = document.getElementById("txtSpecify_" + count).value;
        var txtTimeLine = document.getElementById("txtTimeLine_" + count).value;
        var txtDescription = document.getElementById("txtDescription_" + count).value;
        var ddlAccounting = document.getElementById("ddlAccounting_" + count).value;

        InKindContributionsArr.push({
            IKC_CategoryContribution: ddlCategoryContribution,
            IKC_NameOfContributor: txtNameOfContributor,
            IKC_Date: new Date(txtDate),
            IKC_Amount: txtAmount,
            IKC_Contact: txtContact,
            IKC_BankAccount: txtBankAccount,
            IKC_Specify: txtSpecify,
            IKC_TimeLine: txtTimeLine,
            IKC_Description: txtDescription,
            IKC_Accounting: ddlAccounting
        });

    }


    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            InKindContributions: InKindContributionsArr,

        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateInKindContributions",
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
            param1: 'IKC_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'InKindContributions_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetInKindContributions',
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

            if (data.InKindContributions.length > 0) {

                $.each(data.InKindContributions, function (index, value) {
                    var totalRowCount = $("#tblInKindContributions tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;


                    var markup = '<tr>' +
                        '<td class="width-350" style="padding:0px !important;"><div class="card-body" style="padding:4px !important;"><div class="form-group tblxs"><select class="form-control input-sm  drop_down" id="ddlAccounting_'
                        + RowCount + '"></select></div></div></td><td class="width-350" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<select class="form-control input-sm ddlCategoryContribution" id="ddlCategoryContribution_' + RowCount + '">' +
                        '<option value="" ' + ((value.IKC_CategoryContribution == '') ? 'selected' : '') + '>Select</option>' +
                        '<option value="SERVICES" ' + ((value.IKC_CategoryContribution == 'SERVICES') ? 'selected' : '') + '>SERVICES</option>' +
                        '<option value="ASSET/ EQUIPMENT USAGE" ' + ((value.IKC_CategoryContribution == 'ASSET/ EQUIPMENT USAGE') ? 'selected' : '') + '>ASSET/ EQUIPMENT USAGE</option>' +
                        '<option value="MATERIALS" ' + ((value.IKC_CategoryContribution == 'MATERIALS') ? 'selected' : '') + '>MATERIALS</option>' +
                        '<option value="SPONSORSHIPS" ' + ((value.IKC_CategoryContribution == 'SPONSORSHIPS') ? 'selected' : '') + '>SPONSORSHIPS</option>' +
                        '</select>' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtNameOfContributor" id="txtNameOfContributor_' + RowCount + '" value="' + value.IKC_NameOfContributor + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  singledate thtxt txtDate" id="txtDate_' + RowCount + '" value="' + value.IKC_Date + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtAmount allownumericWithdecimal" id="txtAmount_' + RowCount + '" value="' + value.IKC_Amount + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtContact" id="txtContact_' + RowCount + '" value="' + value.IKC_Contact + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtBankAccount" id="txtBankAccount_' + RowCount + '" value="' + value.IKC_BankAccount + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtSpecify" id="txtSpecify_' + RowCount + '" value="' + value.IKC_Specify + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtTimeLine" id="txtTimeLine_' + RowCount + '" value="' + value.IKC_TimeLine + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        '<td class="width-250" style="padding:0px !important;">' +
                        '<div class="card-body" style="padding:4px !important;">' +
                        '<div class="form-group tblxs">' +
                        '<input type="text" class="form-control input-sm  thtxt frm rate txtDescription" id="txtDescription_' + RowCount + '" value="' + value.IKC_Description + '">' +
                        '</div>' +
                        '</div>' +
                        '</td>' +
                        "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' onclick='DeleteRow(this)'><i class='la la-trash '></i> </button></div></td></tr>";
                    $("#tblInKindContributions tbody").append(markup);

                    var accountingId = "#ddlAccounting_" + RowCount;
                    InitUIByAccountingId(accountingId);
                    $("#ddlAccounting_" + RowCount).val(value.IKC_Accounting);
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