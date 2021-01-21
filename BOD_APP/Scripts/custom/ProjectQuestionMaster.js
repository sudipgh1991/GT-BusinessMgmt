/// <reference path="ProjectType.js" />
/// <reference path="financialyearmaster.js" />
var formElem = $("#frmQs");

$(document).ready(function () {

    InitUI();


    var Id = getParameterByName('Id');
    if (Id != '') {
        retrive(Id);
    }
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

function InitUI() {
    DropdownBinder.DDLData = {
        tableName: "ProjectAssesmentType_PAT",
        Text: 'PAT_Name',
        Value: 'PAT_Id',
         ColumnName: 'PAT_CreatedBy',
        PId: parseInt($('#UserId').val()),
    };

    DropdownBinder.DDLElem = $("#CategoryId");

    DropdownBinder.Execute();
    DropdownBinder.DDLData = {
        tableName: "ProjectIndustryMaster_PIM",
        Text: 'PIM_Name',
        Value: 'PIM_Id'
    };

    DropdownBinder.DDLElem = $("#PIM_Id");

    DropdownBinder.Execute();


    DropdownBinder.Execute();
    //DropdownBinder.DDLData = {
    //    tableName: "OptionTypeMaster_OTM",
    //    Text: 'OTM_Name',
    //    Value: 'OTM_Id'
    //};

    //DropdownBinder.DDLElem = $("#DropdownType");
    //DropdownBinder.Execute();

    //$("#alrtmainDiv").hide();
    function ProjectQuestionMasterValidate() {
        $(".error").remove();
        var AssessmentType = $("#CategoryId").val();
        var Sector = $("#PIM_Id").val();
        var AnswerType = $("#Container").val();
        var ShowOn = $("#IsForLogin").val();
        var Question = $("#Name").val();
        

        if (AssessmentType == "") {
            $("#CategoryId").after('<span class="error">Please select Assessment Type.</span>');
            return false;
        }
        if (Sector == "") {
            $("#PIM_Id").after('<span class="error">Please enter Sector</span>');
            return false;
        }
        if (AnswerType == "") {
            $("#Container").after('<span class="error">Please enter Answer Type.</span>');
            return false;
        }
        if (ShowOn == "") {
            $("#ForLogin").after('<span class="error">Please enter Show On.</span>');
            return false;
        }
        if (Question == "") {
            $("#Name").after('<span class="error">Please Type your Question.</span>');
            return false;
        }

        return true;
    }
    $("#btnSubmit").click(function () {

        //Validation   
        if (ProjectQuestionMasterValidate() == false) {
            return false;
        }

        SaveRecord();
    });

}



function SaveRecord() {
    //if (!formElem.valid()) {
    //    return false;
    //}
        var S = document.getElementById('check_group2').checked == true ? true : false;
    var E = document.getElementById('check_group3').checked == true ? true : false;
    var R = document.getElementById('check_group4').checked == true ? true : false;
    var LoginFor = $('#IsForLogin').val()=="0"?false:true;
   
    $('#ForSME').val(S);
    $('#ForEMP').val(E);
    $('#IsRequired').val(R);
    //$('#ForLogin').val(LoginFor);
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
                window.location.href = '/Home/ProjectQuestionMasterList';
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
            $('#Id').val(data["PQM_Id"]);
            $('#Name').val(data["PQM_Name"]);
            $('#Container').val(data["PQM_Container"]);
            $('#CategoryId').val(data["PQM_CategoryId"]);

            $('#PIM_Id').val(data["PQM_PIM_Id"]);
            if (data["PQM_ForClient"] == true) {

                // $("#uniform-inlineCheckbox113 span").addClass('checked');
                $('#dvForClient .icheckbox_square-green').addClass('checked');
                $("#check_group1").prop("checked", true);
            }
            if (data["PQM_ForSME"] == true) {

                $('#dvForSME .icheckbox_square-green').addClass('checked');
                $("#check_group2").prop("checked", true);
            }
            

            if (data["PQM_ForEmp"] == true) {

                $('#dvForEMP .icheckbox_square-green').addClass('checked');
                $("#check_group3").prop("checked", true);
            }
            if (data["PQM_IsRequired"] == true) {

                $('#dvForRequire .icheckbox_square-green').addClass('checked');
                $("#check_group4").prop("checked", true);
            }
            //if (data["QM_ForLogin"] == true) {

            //    $('#IsForLogin').val(1);
            //}

        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
    return false;
}