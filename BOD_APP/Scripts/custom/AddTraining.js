var formElem = $("#frmTraining");
var path;
var pathString;
var pathStringDoc = "";
$(document).ready(function () {
    InitUI();
    
    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });

    $('.singledate').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: true,
        showDropdowns: true,

    });
    $('#EndDate').val('');
    var Id = getParameterByName('id');
    if (Id != '') {

        retrive(Id);

    }

});

function InitUI() {
 
    DropdownBinder.DDLData = {
        tableName: "TrainingTypeMaster_TTM",
        Text: 'TTM_Name',
        Value: 'TTM_Id'
    };

    DropdownBinder.DDLElem = $("#TrainingType");

    DropdownBinder.Execute();

}
$(".custom-input-file").change(function () {
    if (typeof (FileReader) != "undefined") {
        var dvPreview = $(".pic");
        dvPreview.html("");
        //var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png)$/;



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
           // $(this).next("span").remove();
           // $(this).after('<span class="error">Please check file size.</span>');

            Swal.fire({
                title: "Error!",
                text: 'Please check file size.',
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


function ProjectValidate() {
    $(".error").remove();
    var TrainingName = $("#TrainingName").val();
    var TrainingType = $("#TrainingType").val();
    var StartDate = $("#StartDate").val();
    var EndDate = $("#EndDate").val();
    
    


    if (TrainingName == "") {
        $("#TrainingName").after('<span class="error">Please enter Training Name.</span>');
        return false;
    }
    else if (TrainingType == "") {
        $("#Ttype").after('<span class="error">Please select Training Type.</span>');
        return false;
    }
    else if (StartDate == "") {
        $("#StartDate").after('<span class="error">Please enter Start Date.</span>');
        return false;
    }
    else if (EndDate == "") {
        $("#Edate").after('<span class="error">Please enter End Date.</span>');
        return false;
    }
  
    return true;
}

function SaveRecord() {

    //Validation   
    if (ProjectValidate() == false) {
        return false;
    }

    var _data = JSON.stringify({
        Training: {
            TE_Id: parseInt($("#Id").val()),
            TE_Name: $.trim($("#TrainingName").val()),
            TE_TrainingTypeId: $.trim($("#TrainingType").val()),
            TE_FromDate: $.trim($("#StartDate").val()),
            TE_ToDate: $.trim($("#EndDate").val()),
            TE_Pic: $.trim(pathString),
            TE_Certificate: $.trim(pathStringDoc),
            TE_Description: $.trim($("#ProjectDetails").val())
        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateAddTraining',
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
                if (type == "P") {
                    window.location.href = 'AddTraining';

                }
               /* else {
                    window.location.href = 'TrainingList';
                }*/
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

$("#file-1").change(function () {
    if (typeof (FileReader) != "undefined") {

        $($(this)[0].files).each(function () {
            var file = $(this);
            var reader = new FileReader();
            reader.onload = function (e) {

                var fileMimeType = $('#file-1')[0].files[0].type;
                var fileType = fileMimeType.split('/')[0];

                var img = $("<img />");


                pathStringDoc = e.target.result;
            }
            reader.readAsDataURL(file[0]);
            //$('div#clr_btn').html('<button type="button" style="margin-bottom: 30px" class="waves-effect waves-light btn gradient-45deg-red-pink btn-floating border-round z-depth-3 mr-1" onclick="clearImgs()"><i class="material-icons">clear</i></button>&emsp;<button type="button" style="margin-bottom: 30px" class="waves-effect waves-light btn gradient-45deg-light-blue-cyan btn-floating border-round z-depth-3 mr-1" onclick="clearImgsAndReselect()"><i class="material-icons">refresh</i></button>');
        });
    }
    else {
        AddErrorAlert("error", "This browser does not support HTML5 FileReader.");
    }
});


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function retrive(id) {
    var _data = JSON.stringify({
        global: {
            TransactionType: 'SelectForEdit',
            param1:'TE_Id',
            param1Value: parseInt(id),
            StoreProcedure: 'TrainingEntry_USP'
        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetSelectTraining",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
         
            if (data['TE_Pic'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['TE_Pic']);
                pathString = data['TE_Pic'];
                user_image = data['TE_Pic'];
            }
            $('#Id').val(data["TE_ID"]);
            $('#TrainingName').val(data["TE_Name"]);
            $('#TrainingType').val(data["TE_TrainingTypeId"]);
            $('#StartDate').val(data["TE_FromDate"]);  
            $('#EndDate').val(data["TE_ToDate"]);
           
            pathStringDoc = data["TE_Certificate"];
            if (data["TE_Certificate"] != "") {
                
                    $('#addcertificatediv').addClass("col-md-3");
                    $('#addcertificatediv').removeClass("col-md-4");
                $('.downloadbtn').css('display', 'block');
                $('#downloadbtn').attr('href', data["TE_Certificate"] );
            }
            else {
               
            }
            $('#ProjectDetails').val(data["TE_Description"]);
           
        },
        error: function (data) {

        }
    });
    return false;

}