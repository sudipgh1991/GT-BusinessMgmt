var MonthList = [];
var BudgetRow = [];
var Budget = [];
var disabledCol = [];
BudgetRow.ItemId = 0;
BudgetRow.UnitId = 0;
BudgetRow.MonthList = [];
var startyear = getParameterByName('start').substring(6, 10);
var endyear = getParameterByName('end').substring(6, 10);
var startmonth = parseInt(getParameterByName('start').substring(0, 2));
var endmonth = parseInt(getParameterByName('end').substring(0, 2));
var year = [];
var month = [];
var Id = getParameterByName('Id');

$(document).ready(function () {
    
    var ddlYear = "";
    year = [];
    month = [];
    month.push(startmonth);
    month.push(endmonth);
    for (var i = startyear; i <= endyear; i++) {
        year.push(parseInt(i));
        ddlYear = ddlYear + '<option value="' + i + '">' + i + '</option>';
    }
    $('#ddlYear').append(ddlYear);
    var selectedYear = parseInt($('#ddlYear').val());
    colDisabled(selectedYear);
    GetAllMonths(selectedYear.toString());    
    if (Id != '') {
        retrive(Id, selectedYear.toString());

    }
    
});

function InitUI3() {

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


$(document).off('change', '#ddlYear').on('change', '#ddlYear', function () {
    $("div.dynamicColumnsInputsValue").remove();
    var selectedYear = parseInt($(this).val());
    colDisabled(selectedYear);
    ClearData();
    $(".dynamicColumnsInputs").find(".dynamic-column-item-value").prop('disabled', false);
    $(".dynamicColumnsInputs").find(".dynamic-column-item-value").attr('data-year', selectedYear);
    $(".dynamicColumnsInputs").find(".dynamic-column-item-value").each(function (e) {
        if (disabledCol.indexOf(parseInt($(this).attr('data-val')) - 1) !== -1) {
            $(this).prop('disabled', true);
        }
    });

    if (Id != '') {
        retrive(Id, selectedYear.toString());
    }
});


function colDisabled(selectedYear) {
    disabledCol = [];
    if (year.indexOf(selectedYear) === 0) {
        for (var i = 0; i < month[0] - 1; i++) {
            disabledCol.push(i);
        }
    }
    else if (year.indexOf(selectedYear) === year.length - 1) {
        for (var i = month[1]; i < 12; i++) {
            disabledCol.push(i);
        }
    }
}


function GetAllMonths(year) {
    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'start',
            param2: 'end',
            paramString: '1/1/' + year,
            paramString2: '12/31/' + year,
            StoreProcedure: 'GetBudgetMonths_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetAllMonths',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var outputHtml = "<div class='dynamic-column-item'>Accounting</div><div class='dynamic-column-item'>Item</div><div class='dynamic-column-item'>Unit</div><div class='dynamic-column-item'>Description</div>";
            var outputHtml2 = '<select class="form-control input-sm  dynamic-column-item-ddl accounting" id="ddlAccounting"></select><select class="form-control input-sm  drop_down dynamic-column-item-ddl" id="ddlItem"></select><select class="form-control input-sm  drop_down2 dynamic-column-item-ddl" id="ddlUnit"></select><input type="text" class="form-control input-sm  thtxt frm dynamic-column-item-value-desc" id="txtDesc">';
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    outputHtml += "<div class='dynamic-column-item' data-val=" + data[i].MonthNumber + " data-year=" + data[i].MonthYear + ">" + data[i].MonthName.substring(0, 3) + "</div>";
                    if (disabledCol.indexOf(i) != -1) {
                        outputHtml2 += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + data[i].MonthNumber + '" data-year="' + data[i].MonthYear + '" disabled>';

                    }
                    else {
                        outputHtml2 += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + data[i].MonthNumber + '" data-year="' + data[i].MonthYear + '">';
                    }
                    if (i == 1)
                    {
                        outputHtml2 += '</br></br></br>';
                    }
                    
                }

            }
            outputHtml += "<div class='dynamic-column-item'>Total</div><div class='dynamic-column-item'>Action</div>";
            outputHtml2 += '<input type="text" class="form-control input-sm  thtxt frm colrate col-total col-total-main" data-val="1" disabled><div class="dynamic-column-item-btn"><button type="button"  class="btn btn-social btn-xs btn-success" id="add-row"><span class="la la-check"></span> Add</button></div>';
            $(".dynamicColumns").html(outputHtml);
            $(".dynamicColumnsInputs").html(outputHtml2);
            InitUI();
            InitUI2();
            InitUI3();
        },
        error: function (data) {

        }
    });
    return false;

}


function InitUI() {
    DropdownBinder.DDLData = {
        tableName: "ItemMaster_IM",
        Text: 'IM_Name',
        Value: 'IM_Id',
        ColumnName: 'IM_CreateBy',
        PId: parseInt($('#UserId').val()),
    };
    DropdownBinder.DDLElem = $(".drop_down");
    DropdownBinder.Execute();
}
function InitUI2() {

    DropdownBinder.DDLData = {
        tableName: "UnitMaster_UM",
        Text: 'UM_UnitName',
        Value: 'UM_Id'
    };
    DropdownBinder.DDLElem = $(".drop_down2");
    DropdownBinder.Execute();
}

function InitUIById(id) {
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

function InitUIById2(id) {
    DropdownBinder.DDLData = {
        tableName: "UnitMaster_UM",
        Text: 'UM_UnitName',
        Value: 'UM_Id'
    };
    DropdownBinder.DDLElem = $(id);
    DropdownBinder.Execute();
}


$(document).off('click', "#add-row").on('click', '#add-row', function (e) {
    var coltotal = $('.col-total-main').val();
    var ItemId = $(this).closest('.dynamicColumnsInputs').find('#ddlItem').val();
    var UnitId = $(this).closest('.dynamicColumnsInputs').find('#ddlUnit').val();
    var Desc = $(this).closest('.dynamicColumnsInputs').find('#txtDesc').val();
    var ddlAccounting = $("#ddlAccounting").val();
    MonthList = [];
    BudgetRow = [];
    $(this).closest('.dynamicColumnsInputs').find('.dynamic-column-item-value').each(function (e) {
        MonthList.push({
            "Id": $(this).attr('data-val'),
            "Year": $(this).attr('data-year'),
            "Value": $(this).val()
        });
    });
    BudgetRow.push({
        "ItemId": ItemId,
        "UnitId": UnitId,
        "MonthList": MonthList
    });
    var dataHtml = '<div class="dynamicColumnsInputsValue tbl-row" style="display: flex;">';
    if (BudgetRow.length > 0) {
        var rowCount = $(".dynamicColumnsInputsValue").length+1;
        dataHtml += '<select class="form-control input-sm  drop_down dynamic-column-item-ddl" id="ddlAccounting_' + rowCount + '"></select><select class="form-control input-sm  drop_down dynamic-column-item-ddl" id="ddlItem_' + rowCount + '"></select><select class="form-control input-sm  drop_down2 dynamic-column-item-ddl" id="ddlUnit_' + rowCount + '"></select><input type="text" class="form-control input-sm  thtxt frm dynamic-column-item-value-desc" id="txtDesc_' + rowCount + '" value="'+Desc+'"/>';
        
        if (BudgetRow[0].MonthList.length > 0) {
            for (var i = 0; i < BudgetRow[0].MonthList.length; i++) {
                
                if (disabledCol.indexOf(i) != -1) {
                    dataHtml += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '" disabled>';
                }
                else {
                    dataHtml += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                }
                
            }
        }
        dataHtml += '<input type="text" class="form-control input-sm  thtxt frm colrate col-total" data-val="1" value="' + coltotal+'" disabled><div class="dynamic-column-item-btn"><button type="button" class="btn btn-social-icon btn-xs btn-danger delete" style="height:1.5rem!important" onclick="DeleteRow(this)"><i class="la la-trash" style="margin-top: -3px;"></i> </button></div>';
        dataHtml += '</div>';
        $(".row-data").append(dataHtml);
        var ddlItem = "#ddlItem_" + rowCount;
        InitUIById(ddlItem);
        $("#ddlItem_" + rowCount).val(BudgetRow[0].ItemId);
        var ddlUnit = "#ddlUnit_" + rowCount;
        InitUIById2(ddlUnit);
        $("#ddlUnit_" + rowCount).val(BudgetRow[0].UnitId);
        var accounting = "#ddlAccounting_" + rowCount;
        InitUIByAccountingId(accounting);
        $("#ddlAccounting_" + rowCount).val(ddlAccounting);
        
    }
    ClearData();
    
});



function DeleteRow(rowNo) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to deleted this records!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes I Delete!',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger ml-1',
        buttonsStyling: false,

    }).then(function (result) {
        if (result.value) {
            $(rowNo).closest('.dynamicColumnsInputsValue').remove();
            PageLoadColTotal();
            Swal.fire({
                type: "success",
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                confirmButtonClass: 'btn btn-success',
            })
        }
    })
}




$(document).off('click', '.btnSave').on('click', '.btnSave', function (e) {
    var count = $(".dynamicColumnsInputsValue").length;
    var _data = "";
    if (count > 0) {
        Budget = [];
        for (var i = 0; i < count;i++) {
            MonthList = [];
            BudgetRow = [];
            BudgetRow.ItemId = 0;
            BudgetRow.UnitId = 0;
            BudgetRow.MonthList = [];
            var index = i + 1;
            var ddlAccounting = document.getElementById("ddlAccounting_" + index).value;
            var ItemId = parseInt($($(".dynamicColumnsInputsValue")[i]).find('.drop_down').val());
            var UnitId = parseInt($($(".dynamicColumnsInputsValue")[i]).find('.drop_down2').val());
            var Desc = $($(".dynamicColumnsInputsValue")[i]).find('.dynamic-column-item-value-desc').val();
            $($(".dynamicColumnsInputsValue")[i]).find('.dynamic-column-item-value').each(function (e) {
                MonthList.push({
                    "Id": parseInt($(this).attr('data-val')),
                    "Year": parseInt($(this).attr('data-year')),
                    "Value": parseFloat($(this).val())
                });
            });
            
            
            Budget.push({
                "ItemId": ItemId,
                "UnitId": UnitId,
                "Accounting": ddlAccounting,
                "Desc": Desc,
                "MonthList": MonthList
            });
            
            
        }
        
        
        
        _data = JSON.stringify({
            project: {
                PE_Id: parseInt($('#hdnProject').val()),
                Budget: Budget,

            }
        });

        
        $.ajax({
            type: "POST",
            url: "/ScriptJson/InsertUpdateBudget",
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
});



function ClearData() {
    $(".dynamicColumnsInputs").find(".dynamic-column-item-value").val("");
    $(".dynamicColumnsInputs").find(".dynamic-column-item-ddl").val("");
    $("#txtDesc").val("");
    $(".col-total-main").val("");
    $("#ddlAccounting").val("0");
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


$(document).off("keypress keyup blur", ".allownumericWithdecimal").on("keypress keyup blur", ".allownumericWithdecimal", function (event) {
    if ((event.which != 46 || $(this).val().indexOf('.') != -1) && ((event.which < 48 || event.which > 57) && (event.which != 0 && event.which != 8))) { event.preventDefault(); } var text = $(this).val(); if ((text.indexOf('.') != -1) && (text.substring(text.indexOf('.')).length > 2) && (event.which != 0 && event.which != 8) && ($(this)[0].selectionStart >= text.length - 2)) { event.preventDefault(); }
});


function retrive(id, year) {
    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'BM_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'Budget_USP',
            param2: 'year',
            paramString2: year,
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetBudgets',
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
            $('#Income').text(data["TotalIncome"]);
            $('#Expense').text(data["TotalExpenses"]);
            $('#startdate').text(data["PE_StartDate"]);
            $('#enddate').text(data["PE_EndDate"]);
            if (data.BudgetReturnData.length > 0) { 
                MonthList = [];
                BudgetRow = [];
                var tempIndex = [];
                for (var i = 0; i < data.BudgetReturnData.length; i++) {
                    if (tempIndex.length == 0) {
                        tempIndex.push(data.BudgetReturnData[i].BM_Group);
                    }
                    else {
                        if (tempIndex.indexOf(data.BudgetReturnData[i].BM_Group)==-1) {
                            tempIndex.push(data.BudgetReturnData[i].BM_Group);
                        }
                    }
                }
                for (var j = 0; j < tempIndex.length; j++) {
                    MonthList = [];
                    BudgetRow = [];
                    var ItemId = 0;
                    var UnitId = 0;
                    var Accounting = 0;
                    var Desc = '';
                    for (var i = 0; i < data.BudgetReturnData.length; i++) {
                        if (tempIndex[j] == data.BudgetReturnData[i].BM_Group) {
                            ItemId = data.BudgetReturnData[i].BM_ItemId;
                            UnitId = data.BudgetReturnData[i].BM_UnitId;
                            Accounting = data.BudgetReturnData[i].BM_Accounting;
                            Desc = data.BudgetReturnData[i].BM_Description;
                            MonthList.push({
                                "Id": data.BudgetReturnData[i].BM_MonthId,
                                "Year": data.BudgetReturnData[i].BM_Year,
                                "Value": data.BudgetReturnData[i].BM_Amount
                            });
                        }

                    }
                    var dataHtml = '<div class="dynamicColumnsInputsValue tbl-row" style="display: flex;">';
                    var rowCount = $(".dynamicColumnsInputsValue").length + 1;
                    dataHtml += '<select class="form-control input-sm  dynamic-column-item-ddl" id="ddlAccounting_' + rowCount + '"></select><select class="form-control input-sm  drop_down dynamic-column-item-ddl" id="ddlItem_' + rowCount + '"></select><select class="form-control input-sm  drop_down2 dynamic-column-item-ddl" id="ddlUnit_' + rowCount + '"></select><input type="text" class="form-control input-sm  thtxt frm dynamic-column-item-value-desc" id="txtDesc_' + rowCount + '" value="' + Desc+'">';
                    
                    BudgetRow.push({
                        "ItemId": ItemId,
                        "UnitId": UnitId,
                        "MonthList": MonthList,
                        "Accounting": Accounting
                    });
                    if (BudgetRow.length > 0) {

                        if (BudgetRow[0].MonthList.length > 0) {
                            for (var i = 0; i < BudgetRow[0].MonthList.length; i++) {
                                if (disabledCol.indexOf(i) != -1) {
                                    dataHtml += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '" disabled>';
                                }
                                else {
                                    dataHtml += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                }
                                
                            }
                        }
                        dataHtml += '<input type="text" class="form-control input-sm  thtxt frm colrate col-total" data-val="1" disabled><div class="dynamic-column-item-btn"><button type="button" class="btn btn-social-icon btn-xs btn-danger delete" style="height:1.5rem!important" onclick="DeleteRow(this)"><i class="la la-trash" style="margin-top: -3px;"></i> </button></div>';
                        dataHtml += '</div>';
                    }
                    
                    $(".row-data").append(dataHtml);
                    var ddlItem = "#ddlItem_" + rowCount;
                    InitUIById(ddlItem);
                    $("#ddlItem_" + rowCount).val(BudgetRow[0].ItemId);
                    var ddlUnit = "#ddlUnit_" + rowCount;
                    InitUIById2(ddlUnit);
                    $("#ddlUnit_" + rowCount).val(BudgetRow[0].UnitId);
                    var accountingId = "#ddlAccounting_" + rowCount;
                    InitUIByAccountingId(accountingId);
                    $("#ddlAccounting_" + rowCount).val(BudgetRow[0].Accounting);
                }
                
                
            }

        },
        complete: function () {
            PageLoadColTotal();
        },
        error: function (data) {

        }
    });
    return false;

}


$(document).off('keyup', '.rate').on('keyup', '.rate', function (e) {
    var col = $(this).attr('data-val');
    ColTotal(col);
    var rowTotal = 0;
    $(this).closest('.tbl-row').find('.allownumericWithdecimal').each(function (e) {
        rowTotal += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
    });
    $(this).closest('.tbl-row').find('.colrate').val(rowTotal);
    RowColTotal();
    RemoveZero();
});





function PageLoadRowTotal() {
    $(".dynamicColumnsInputsValue").each(function (e) {
        var rowTotal = 0;
        $(this).find('.allownumericWithdecimal').each(function (f) {            
            rowTotal += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());

        });
        $(this).find('.colrate').val(rowTotal);
    });
    RowColTotal();
    RemoveZero();
}



function RowColTotal() {
    var total = 0;
    $(".col-total").each(function (f) {
        total += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
    });
    $(".row-col-total").val(total);
}


function ColTotal(i) {
    var colTotal = 0;
    $(".dynamicColumnsInputs").find(".allownumericWithdecimal").each(function (e) {
        if ($(this).attr('data-val') === i.toString()) {
            colTotal += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
        }
    });
    $(".dynamicColumnsInputsValue").find(".allownumericWithdecimal").each(function (e) {
        if ($(this).attr('data-val') === i.toString()) {
          //  colTotal += parseFloat($(this).val());
            colTotal += isNaN(parseFloat($(this).val())) ? 0 : parseFloat($(this).val());
        }
    });
    $('.rate' + i).val(colTotal);
}

function PageLoadColTotal() {
    if ($(".dynamicColumnsInputs").length == 0) {
        PageLoadColTotal();
    }
    else {
        for (var i = 1; i <= 12; i++) {
            $('.rate' + i).val(0);
        }
        for (var j = 1; j <= 132; j++) {
            ColTotal(j);
        }
        PageLoadRowTotal();
    }
    
}

function RemoveZero() {
    $(".rate").each(function () {
        if ($(this).val() == 0) {
            $(this).val('');
        }
    })
}