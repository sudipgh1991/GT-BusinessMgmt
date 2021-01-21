var formElem = $("#frmProject");
var path;
var pathString;

$(document).ready(function () {

    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });


    InitUI();
    var Id = getParameterByName('Id')
   
    $('#EndDate').val('');
    if (Id != '') {
        retrive(Id);

    }
   
    var ClientId = $('#hdnClintId').val();
    if (parseInt(ClientId) > 0) {
        $('#ClientId').val(ClientId);
    }
    
});





var pathString = "";
var user_image = "";


$(".custom-input-file").change(function () {
    if (typeof (FileReader) != "undefined") {
        var dvPreview = $(".pic");
        dvPreview.html("");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

        var fileSize = this.files[0].size / 1024;

        if (fileSize >= 50 && fileSize <= 100) {

            $($(this)[0].files).each(function () {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.css({ "height": "70px", "width": "80px", "cursor": "pointer" });
                        img.attr("src", e.target.result);
                        dvPreview.html(img);
                        pathString = e.target.result;
                    }
                    reader.readAsDataURL(file[0]);
                }
                else {

                    dvPreview.html("");
                    return false;
                }
            });
        }
        else {

            Swal.fire({
                title: "Error!",
                text: 'Please check file size.50 KB To 100 Kb',
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });

            dvPreview.html("");
            return false;
        }
    }
    else {

    }
});



function InitUI() {
    $(".select2-placeholder-multiple").select2({
        dropdownAutoWidth: true,
        width: '100%',
        placeholder: "Select Province(s)",
    });
    DropdownBinder.DDLData = {
        tableName: "ProjectIndustryMaster_PIM",
        Text: 'PIM_Name',
        Value: 'PIM_Id'
    };

    DropdownBinder.DDLElem = $("#IndustryId");

    DropdownBinder.Execute();

    DropdownBinder.DDLData = {
        tableName: "CorporateClient_CC",
        Text: 'CC_CorporateName',
        Value: 'CC_Id'
    };

    DropdownBinder.DDLElem = $("#ClientId");

    DropdownBinder.Execute();

    DropdownBinder.DDLData = {
        tableName: "ProvinceMaster_PM",
        Text: 'PM_Name',
        Value: 'PM_Id'
    };

    DropdownBinder.DDLElem = $("#ProjectOparate");

    DropdownBinder.Execute();
    
}

function ProjectValidate() {
    $(".error").remove();
    var ProjectName = $("#ProjectName").val();
    var ProjectOparate = $("#ProjectOparate").val();
    var ClientId = $("#ClientId").val();
    var IndustryId = $("#IndustryId").val();
    var StartDate = $("#StartDate").val();
    var EndDate = $("#EndDate").val();
    var ProjectCName = $("#ProjectCName").val();
    var ProjectCPhno = $("#ProjectCPhno").val();
   

    if (ProjectName == "") {
        $("#ProjectName").after('<span class="error">Please enter Project Name.</span>');
        return false;
    }
    else if (ProjectOparate == "") {
        $("#ProjectOparate").after('<span class="error">Please enter Province(s).</span>');
        return false;
    }
    else if (ClientId == "") {
        $("#ClientId").after('<span class="error">Please enter Project Create.</span>');
        return false;
    }
    else if (IndustryId == "") {
        $("#IndustryId").after('<span class="error">Please enter SectorName.</span>');
        return false;
    }
    else if (StartDate == "") {
        $("#StartDate").after('<span class="error">Please enter Start Date.</span>');
        return false;
    }
    else if (EndDate == "") {
        $("#EndDate").after('<span class="error">Please enter End Date.</span>');
        return false;
    }
    else if (ProjectCName == "") {
        $("#ProjectCName").after('<span class="error">Please enter Project Contact Person .</span>');
        return false;
    }
    else if (ProjectCPhno == "") {
        $("#ProjectCPhno").after('<span class="error">Please enter Project Contact Person Ph.</span>');
        return false;
    }
   
    return true;
}

function SaveRecord() {

    //Validation   
    if (ProjectValidate() == false) {
        return false;
    }

    //if (!formElem.valid()) {
    //    return false;
    //}
    var PE_GrantFunding = "";
  if ( $('#input-radio-1').is(':checked'))
    {
        PE_GrantFunding = $('#input-radio-1:checked').val();
    }
  else if ($('#input-radio-2').is(':checked')) {
      PE_GrantFunding = $('#input-radio-2:checked').val();
  }
  else if ($('#input-radio-3').is(':checked')) {
      PE_GrantFunding = $('#input-radio-3:checked').val();
  }
  else {
      PE_GrantFunding = $('#input-radio-4:checked').val();
  }

  var selMulti = $.map($("#ProjectOparate option:selected"), function (el, i) {
      return $(el).val();
  });
  var ProjectOparate =selMulti.join(",");
    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($("#Id").val()),
            PE_IndustryId: parseInt($("#IndustryId").val()),
            PE_ProjectName: $.trim($("#ProjectName").val()),
            PE_JobFundno: $.trim($("#JobFundno").val()),
            PE_ProjectOparate: $.trim(ProjectOparate),
            PE_StartDate: $.trim($("#StartDate").val()),
            PE_EndDate: $.trim($("#EndDate").val()),
            PE_ContactPerson: $.trim($("#ProjectCName").val()),
            PE_ContactPersonNo: $.trim($("#ProjectCPhno").val()),
            PE_GrantFunding: '',
            PE_Description: $.trim($("#ProjectDetails").val()),
            PE_ClientId: parseInt($("#ClientId").val()),
            PE_Image: $.trim(pathString),

        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateProjectEntry',
        data: _data,
        async: false,
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

                $('.form-control').val('');
                window.location.href = 'ProjectList';
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
        url: "/ScriptJson/GetGlobalMaster",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data['PE_Image'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['PE_Image']);
                pathString = data['PE_Image'];
                user_image = data['PE_Image'];
            }
           
            var Value = $.trim(data["PE_GrantFunding"]);
            if (Value == "Support For Work Seekers") {
                $('#input-radio-3').prop('checked', true);
            }
            
           // $("#x").prop("checked", true);
            $('#Id').val(data["PE_Id"]);
            $('#ProjectName').val(data["PE_ProjectName"]);
            $('#JobFundno').val(data["PE_JobFundno"]);
           // $('#ProjectOparate').val(data["PE_ProjectOparate"]);


            var values = data["PE_ProjectOparate"];
            $.each(values.split(","), function (i, e) {
                $("#ProjectOparate option[value='" + e + "']").prop("selected", true);
            });
            $('#IndustryId').val(data["PE_IndustryId"]);
            $('#StartDate').val(data["PE_StartDate"]);
            $("#ClientId").val(data["PE_ClientId"])
           
            $('#EndDate').val(data["PE_EndDate"]);

            $('#ProjectCName').val(data["PE_ContactPerson"]);
            $('#ProjectCPhno').val(data["PE_ContactPersonNo"]);
            $('#ProjectDetails').val(data["PE_Description"]);
           
            if (Value == "Enterprise Developement")
            {
                $('#dvEnterprise .iradio_line-blue').addClass('checked');
                $("#input-radio-1").prop("checked", true);
            }

            if (Value == "Support For Work Seekers") {
                $('#dvSupport .iradio_line-blue').addClass('checked');
                $("#input-radio-3").prop("checked", true);
            }
            if (Value == "Infrastructure") {
                $('#dvInfrastructure .iradio_line-blue').addClass('checked');
                $("#input-radio-2").prop("checked", true);
            }
            if (Value == "Institutional Capacity") {
                $('#dvInstitutional .iradio_line-blue').addClass('checked');
                $("#input-radio-4").prop("checked", true);
            }

        },
        error: function (data) {

        }
    });
    return false;

}