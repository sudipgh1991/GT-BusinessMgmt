/// <reference path="ProjectType.js" />
/// <reference path="financialyearmaster.js" />
var formElem = $("#frmIncomeContributer");

$(document).ready(function () {

   
    // InitValidationRules();
    DropdownBinder.DDLData = {
        tableName: "IncomeTypeMaster_ITM",
        Text: 'ITM_Name',
        Value: 'ITM_Id'
    };

    DropdownBinder.DDLElem = $("#ITM_Id");

    DropdownBinder.Execute();
     InitUI();

});

function InitValidationRules() {
    formElem.validate({
        rules: {
            CategoryName: {
                required: true
            }
        }
    });
}
function IncomeContributerValidate() {
    $(".error").remove();
    var ContributerName = $("#Name").val();
    var Contributertype = $("#ITM_Id").val();

    if (ContributerName == "") {
        $("#Name").after('<span class="error">Please enter Contributer Name.</span>');
        return false();
    }
    else if (Contributertype == "") {
        $("#ITM_Id").after('<span class="error">Please enter Contributer Type.</span>');
        return false();
    }

    return true;
}
function InitUI() {

    //$("#alrtmainDiv").hide();
    $("#btnSubmit").click(function () {

        //Validation   
        if (IncomeContributerValidate() == false) {
            return false;
        }

        SaveRecord();
    });

    var Id = getParameterByName('Id');
    if (Id != '') {
        retrive(Id);
    }
}


function SaveRecord() {
    //if (!formElem.valid()) {
    //    return false;
    //}
    var _data = formElem.serialize();
    $.ajax({
        type: "POST",
        url: URLList.SaveRecord,
        data: _data,
        async: false,
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
                window.location.href = 'IncomeContributerNameList';
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
    var _data = JSON.stringify({
        global: {
            TransactionType: globalData.TransactionType,
            Param: globalData.Param,
            paramValue: parseInt(id),
            StoreProcedure: globalData.StoreProcedure
        }
    });

    $.ajax({
        type: "POST",
        url: URLList.GetEntityMasterById,
        contentType: "application/json; charset=utf-8",
        data: _data,
        dataType: "json",
        success: function (data) {
            //data = JSON.parse(data);
            $('#Id').val(data["ICM_Id"]);
            $('#Name').val(data["ICM_Name"]);          
            $('#ITM_Id').val(data["ICM_ITM_Id"]);
            $('#Description').val(data["ICM_Description"]);
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
    return false;

}