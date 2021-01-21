﻿var MonthList = [];
var BudgetRow = [];
var Budget = [];
BudgetRow.ItemId = 0;
BudgetRow.UnitId = 0;
BudgetRow.MonthList = [];
var Id = getParameterByName('Id');
var startyear = getParameterByName('start').substring(6, 10);
var endyear = getParameterByName('end').substring(6, 10);
var startmonth = parseInt(getParameterByName('start').substring(0, 2));
var endmonth = parseInt(getParameterByName('end').substring(0, 2));
var YearId = 0;
$(document).ready(function () {

    var ddlYear = "";
    for (var i = startyear; i <= endyear; i++) {
        ddlYear = ddlYear + '<option value="' + i + '">' + i + '</option>';
    }
    $('#ddlYear').append(ddlYear);
    GetAllMonths();

    if (Id != '') {
        retrive(Id);

    }
    //$(".allownumericWithdecimal").keyup(function () {

    //    // alert("Handler for .keypress() called.");
    //    var totalinput = 0;
    //    var total = 0;
    //    $(this).closest('.dynamicColumnsInputs').find('.dynamic-column-item-value').each(function (e) {
    //        totalinput = totalinput + parseFloat($(this).val() == "" ? 0 : $(this).val())
    //    });
    //    $(this).closest('.dynamicColumnsInputs').find('.dynamic-column-item-value-total').val(totalinput);
    //    $(this).closest('.dynamicColumnsInputsValue').find('.dynamic-column-item-value').each(function (e) {
    //        total = total + parseFloat($(this).val() == "" ? 0 : $(this).val())
    //    });
    //    $(this).closest('.dynamicColumnsInputsValue').find('.dynamic-column-item-value-total').val(total);
    //});



});

function InitUI3() {

    DropdownBinder.DDLData = {
        tableName: "ProjectIndicatorType_PIT",
        Text: 'PIT_Name',
        Value: 'PIT_Id',
        ColumnName: 'PIT_CreatedBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(".IndicatorType");

    DropdownBinder.Execute();
    $(".IndicatorType").find('option:eq(0)').prop('value', 0);
}

function InitUIByIndicatorTypeId(id) {

    DropdownBinder.DDLData = {
        tableName: "ProjectIndicatorType_PIT",
        Text: 'PIT_Name',
        Value: 'PIT_Id',
        ColumnName: 'PIT_CreatedBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $(id);

    DropdownBinder.Execute();
    $(id).find('option:eq(0)').prop('value', 0);
}


function RefreshTable() {

    $(".rate").val("");
    $(".dynamicColumns").html("");
    $(".dynamicColumnsInputs").html("");
    // $(".dynamicColumnsInputsValue").html("");
    $("div.dynamicColumnsInputsValue").remove();
    ClearData();
    GetAllMonths();
    retrive(Id);
}


function GetAllMonths() {
    YearId = $('#ddlYear').val();
    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'FM_Id',
            StoreProcedure: 'GetAllMonths_USP',
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
            var outputHtml = "<div class='dynamic-column-item-performance'>IndicatorType</div><div class='dynamic-column-item-performance'>Description</div>";
            var outputHtml2 = '<select class="form-control input-sm  dynamic-column-item-ddl-perfromance IndicatorType" id="ddlIndicatorType"></select><input type="text" id="txtDesc" class="form-control input-sm  thtxt frm rate desc-performance ">';
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    outputHtml += "<div class='dynamic-column-item-performance' data-val=" + data[i].MonthNumber + " data-year=" + YearId + ">" + data[i].MonthName.substring(0, 3) + "</div>";
                   
                }

            }
            // outputHtml += "<div class='dynamic-column-item'>Total</div><div class='dynamic-column-item'>Action</div>";
            //outputHtml2 += '<input type="text" id="txtTotal" disabled  class="form-control input-sm total colrate thtxt frm rate dynamic-column-item-value-total col-total col-total-main"><div class="dynamic-column-item-btn"><button type="button"  class="btn btn-social btn-xs btn-success" id="add-row"><span class="la la-check"></span> Add</button></div>';
            $(".dynamicColumns").html(outputHtml);
            //$(".dynamicColumnsInputs").html(outputHtml2);
            //InitUI();
            //InitUI2();
            InitUI3();
        },
        error: function (data) {

        }
    });
    return false;

}


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
        for (var i = 0; i < count; i++) {
            MonthList = [];
            BudgetRow = [];
            BudgetRow.ItemId = 0; 
            BudgetRow.UnitId = 0;
            BudgetRow.MonthList = [];
            var index = i + 1;
            //var TypeId = parseInt($($(".dynamicColumnsInputsValue")[i]).find('.drop_down').val());
            //var ContributorId = parseInt($($(".dynamicColumnsInputsValue")[i]).find('.drop_down2').val());
            //var Description = $(this).closest('.dynamicColumnsInputs').find('.desc').val();
            var Description = $($(".dynamicColumnsInputsValue")[i]).find('.desc-performance').val()
            var ddlIndicatorType = document.getElementById("ddlIndicatorType_" + index).value;

            $($(".dynamicColumnsInputsValue")[i]).find('.dynamic-column-item-value-performance').each(function (e) {
                var month = parseInt($(this).attr('data-val'));
                var group = parseInt($(this).attr('data-grp'));
               
                var inputNumber = $("#txt_" + month + group).val();
                MonthList.push({
                    "Id": parseInt($(this).attr('data-val')),
                    "Year": parseInt($(this).attr('data-year')),
                    "Value": parseFloat($(this).val()),
                    "InputNumber": parseFloat(inputNumber)
                });
            });


            Budget.push({
                //"TypeId": TypeId,
                "IndicatorTypeId": ddlIndicatorType,
                //"ContributorId": ContributorId,
                "Description": Description,
                "MonthList": MonthList
            });


        }



        _data = JSON.stringify({
            project: {
                //  PE_Id: parseInt($('#hdnProject').val()),
                PE_Id: Id,
                YearId: $('#ddlYear').val(),
                ProjectIndicator: Budget,

            }
        });


        $.ajax({
            type: "POST",
            url: "/ScriptJson/InsertUpdateProjectPerformanceIndicator",
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

    $(".dynamicColumnsInputs").find(".dynamic-column-item-value-performance").val("");
    $(".dynamicColumnsInputs").find(".dynamic-column-item-ddl-perfromance").val("");
    $(".dynamicColumnsInputs").find(".desc-performance").val("");
    $(".dynamicColumnsInputs").find(".dynamic-column-item-value-total").val("");
    $("#ddlIndicatorType").val("0");
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

function retrive(id) {

    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'PPI_ProjectId',
            YearId: $('#ddlYear').val(),
            param1Value: parseInt(id),
            StoreProcedure: 'ProjectPerformanceIndicator_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/ProjectPerformanceIndicator',
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
            // console.log(data.BudgetReturnData);

            if (data.ProjectPerformanceIndicatorReturnData.length > 0) {
                MonthList = [];
                BudgetRow = [];
                var tempIndex = [];
                for (var i = 0; i < data.ProjectPerformanceIndicatorReturnData.length; i++) {
                    if (tempIndex.length == 0) {
                        tempIndex.push(data.ProjectPerformanceIndicatorReturnData[i].PPI_Group);
                    }
                    else {
                        if (tempIndex.indexOf(data.ProjectPerformanceIndicatorReturnData[i].PPI_Group) == -1) {
                            tempIndex.push(data.ProjectPerformanceIndicatorReturnData[i].PPI_Group);
                        }
                    }
                }
                for (var j = 0; j < tempIndex.length; j++) {
                    var dataHtml = '<div class="dynamicColumnsInputsValue tbl-row" style="display: flex;">';
                    var rowCount = $(".dynamicColumnsInputsValue").length + 1;
                    dataHtml += '<select class="form-control input-sm  dynamic-column-item-ddl-perfromance" disabled id="ddlIndicatorType_' + rowCount + '"></select><input type="text" disabled id="txtDesc_' + rowCount + '" class="form-control input-sm  thtxt frm rate desc-performance ">';
                    MonthList = [];
                    BudgetRow = [];
                    var TypeId = 0;
                    var ContributorId = 0;
                    var description = "";
                    var total = 0;
                    var IndicatorType = 0;
                    for (var i = 0; i < data.ProjectPerformanceIndicatorReturnData.length; i++) {
                        if (tempIndex[j] == data.ProjectPerformanceIndicatorReturnData[i].PPI_Group) {
                            //TypeId = data.BudgetReturnData[i].IB_typeId;
                            //ContributorId = data.BudgetReturnData[i].IB_ContributorId;
                            description = data.ProjectPerformanceIndicatorReturnData[i].PPI_Description;
                            IndicatorType = data.ProjectPerformanceIndicatorReturnData[i].PPI_IndicatorTypeId;
                            MonthList.push({
                                "Id": data.ProjectPerformanceIndicatorReturnData[i].PPI_MonthId,
                                "Year": data.ProjectPerformanceIndicatorReturnData[i].PPI_Year,
                                "Value": data.ProjectPerformanceIndicatorReturnData[i].PPI_Number,
                                "InputNumber": data.ProjectPerformanceIndicatorReturnData[i].PPI_InputNumber,
                                "Group": data.ProjectPerformanceIndicatorReturnData[i].PPI_Group,
                                
                            });
                        }

                    }
                    BudgetRow.push({
                        //"TypeId": TypeId,
                        //"ContributorId": ContributorId,
                        "description": description,
                        "MonthList": MonthList,
                        "IndicatorTypeId": IndicatorType
                    });
                    if (BudgetRow.length > 0) {

                        if (BudgetRow[0].MonthList.length > 0) {
                            for (var i = 0; i < BudgetRow[0].MonthList.length; i++) {
                                total = total + parseFloat(BudgetRow[0].MonthList[i].Value == "" ? 0 : BudgetRow[0].MonthList[i].Value)
                                if (YearId == startyear) {
                                    if (BudgetRow[0].MonthList[i].Id >= startmonth) {
                                        dataHtml += '<input type="text" disabled  class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                        dataHtml += '<input type="text" id="txt_' + BudgetRow[0].MonthList[i].Id + '' + BudgetRow[0].MonthList[i].Group + '" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-input-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].InputNumber + '" >';
                                    }
                                    else {
                                        dataHtml += '<input type="text" disabled class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                        dataHtml += '<input type="text" disabled id="txt_' + BudgetRow[0].MonthList[i].Id + '' + BudgetRow[0].MonthList[i].Group + '" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-input-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].InputNumber + '" >';
                                    }
                                 
                                }
                                else if (YearId == endyear) {
                                    if (BudgetRow[0].MonthList[i].Id <= endmonth) {
                                        dataHtml += '<input type="text" disabled  class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-performance" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                        dataHtml += '<input type="text" id="txt_' + BudgetRow[0].MonthList[i].Id + '' + BudgetRow[0].MonthList[i].Group + '" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-input-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].InputNumber + '" >';
                                    }
                                    else {
                                        dataHtml += '<input type="text" disabled class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-performance" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                        dataHtml += '<input type="text" disabled id="txt_' + BudgetRow[0].MonthList[i].Id + '' + BudgetRow[0].MonthList[i].Group + '" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-input-performance" size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].InputNumber + '" >';
                                    }
                                   
                                }
                                else {
                                    dataHtml += '<input type="text" disabled class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-performance" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                                    dataHtml += '<input type="text" id="txt_' + BudgetRow[0].MonthList[i].Id + '' + BudgetRow[0].MonthList[i].Group + '" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value-input-performance" data-grp="' + BudgetRow[0].MonthList[i].Group + '"  size="40" data-grp="' + BudgetRow[0].MonthList[i].Group + '" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].InputNumber + '" >';
                                }
                                //  dataHtml += '<input type="text" class="form-control input-sm  thtxt frm rate allownumericWithdecimal dynamic-column-item-value" data-val="' + BudgetRow[0].MonthList[i].Id + '" data-year="' + BudgetRow[0].MonthList[i].Year + '" value="' + BudgetRow[0].MonthList[i].Value + '">';
                            }
                        }
                        //dataHtml += '<input type="text" disabled  id="txtTotal_' + rowCount + '"  class="form-control total colrate input-sm  thtxt frm rate dynamic-column-item-value-total col-total" ><div class="dynamic-column-item-btn"><button type="button" class="btn btn-social-icon btn-xs btn-danger delete" style="height:1.5rem!important" onclick="DeleteRow(this)"><i class="la la-trash" style="margin-top: -3px;"></i> </button></div>';
                        dataHtml += '</div>';
                    }
                    $(".row-data").append(dataHtml);
                    //var ddlType = "#ddlType_" + rowCount;
                    //InitUIById(ddlType);
                    //$("#ddlType_" + rowCount).val(BudgetRow[0].TypeId);
                    //var ddlContributor = "#ddlContributor_" + rowCount;
                    //InitUIById2(ddlContributor, BudgetRow[0].ContributorId);
                    //$("#ddlContributor_" + rowCount).val(BudgetRow[0].ContributorId);
                    $("#txtDesc_" + rowCount).val(BudgetRow[0].description);
                    //$("#txtTotal_" + rowCount).val(total);
                    var IndicatorTypeId = "#ddlIndicatorType_" + rowCount;
                    InitUIByIndicatorTypeId(IndicatorTypeId);
                    $("#ddlIndicatorType_" + rowCount).val(BudgetRow[0].IndicatorTypeId);
                }
                //$(".allownumericWithdecimal").keyup(function () {
                //    TotalCalculation();
                //    //var total = 0;
                //    //$(this).closest('.dynamicColumnsInputsValue').find('.dynamic-column-item-value').each(function (e) {
                //    //    total = total + parseFloat($(this).val() == "" ? 0 : $(this).val())
                //    //});
                //    //$(this).closest('.dynamicColumnsInputsValue').find('.dynamic-column-item-value-total').val(total);
                //});

                //PageLoadColTotal();


            }

        },
        error: function (data) {

        }
    });
    return false;

}


//function FillContributor(e) {
//    var icm_itm_id = $(e).val();
//    var id = $(e).attr('id')
//    id = id.replace("ddlType", "ddlContributor");

//    InitUIById2('#' + id + '', icm_itm_id);

//}

function TotalCalculation() {
    for (var i = 1; i < 11; i++) {
        var total = 0;
        var nettotal = 0;
        $('.dynamicColumnsInputsValue').find("input[data-val='" + i + "']").each(function () {
            // $("input[data-val='1']").each(function () {
            // alert($(this).val());
            total = total + parseFloat($(this).val() == "" ? 0 : $(this).val())
        });
        $("#total_" + i + "").val(total);

        $('.dynamicColumnsInputsValue').find(".total ").each(function () {
            // $("input[data-val='1']").each(function () {
            // alert($(this).val());
            nettotal = nettotal + parseFloat($(this).val() == "" ? 0 : $(this).val())
        });
        $("#nettotal").val(nettotal);

        //  total_1

    }
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
        for (var i = 1; i <= 12; i++) {
            ColTotal(i);
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

