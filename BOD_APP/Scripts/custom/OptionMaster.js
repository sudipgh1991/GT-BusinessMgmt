// <reference path="ProjectType.js" />
// <reference path="financialyearmaster.js" />
var formElem = $("#frmOptionMaster");

$(document).ready(function () {
    DropdownBinder.DDLData = {
        tableName: "OptionTypeMaster_OTM",
        Text: 'OTM_Name',
        Value: 'OTM_ID'
    };

    DropdownBinder.DDLElem = $("#OTM_Id");

    DropdownBinder.Execute();

    InitUI();
    // InitValidationRules();


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
function OptionMasterValidate() {
    $(".error").remove();
    var OptionName = $("#Name").val();
    var OptionType = $("#OTM_Id").val();
  

    if (OptionName == "") {
        $("#Name").after('<span class="error">Please enter  Option Master Name.</span>');
        return false();
    }

    if (OptionType == "") {
        $("#OTM_Id").after('<span class="error">Please enter  Option Type.</span>');
        return false();
    }


    return true;
}
function InitUI() {

    //$("#alrtmainDiv").hide();
    $("#btnIcnSubmit").click(function () {
        //Validation   
        if (OptionMasterValidate() == false) {
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
                window.location.href = 'OptionMasterList';
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
            $('#Id').val(data["OM_Id"]);
            $('#Name').val(data["OM_Name"]);
            $('#OTM_Id').val(data["OM_OTM_Id"]);
            $('#Description').val(data["OM_Description"]);
        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
    return false;

}