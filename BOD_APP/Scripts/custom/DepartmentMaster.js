/// <reference path="financialyearmaster.js" />
var formElem = $("#frmMaster");

$(document).ready(function () {

    InitUI();
    InitValidationRules();

});

function InitValidationRules() {
    formElem.validate({
        rules: {
            Name: {
                required: true
            }
        }
    });
}

function InitUI() {

    $("#alrtmainDiv").hide();
    $("#lnkSave").click(function () {
        SaveRecord();
    });

    var Id = getParameterByName('Id');
    if (Id != '') {
        retrive(Id);
    }
}


function SaveRecord() {
    if (!formElem.valid()) {
        return false;
    }
    var _data = formElem.serialize();
    $.ajax({
        type: "POST",
        url: URLList.SaveRecord,
        data: _data,
        async: false,
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                $("#alrtmainDiv").addClass("alert alert-close alert-success");
                $("#alrtSub").addClass("bg-green alert-icon");
                $("#alrtI").addClass(" glyph-icon icon-check");
                $("#alrtmainDiv").show();
                $("#alrtP").html(data.Message);
                $('.form-control').val('');

            }
            else {
                $("#alrtmainDiv").addClass("alert alert-close alert-danger");
                $("#alrtSub").addClass("bg-red alert-icon");
                $("#alrtI").addClass(" glyph-icon icon-times");
                $("#alrtmainDiv").show();

                $("#alrtP").html(data.Message);

            }
        },
        error: function (data) {
            $("#alrtmainDiv").addClass("alert alert-close alert-danger");
            $("#alrtSub").addClass("bg-red alert-icon");
            $("#alrtI").addClass(" glyph-icon icon-times");
            $("#alrtmainDiv").show();
            $("#alrtP").html("Process Not Complete");

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
            $('#Id').val(data["DM_Id"]);
            $('#Name').val(data["DM_Name"]);

        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
    return false;

}