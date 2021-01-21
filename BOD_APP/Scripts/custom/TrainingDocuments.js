
var formElem = $("#frmTrainingDocumentsmaster");

$(document).ready(function () {

    InitUI();
    //InitValidationRules();

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
function TrainingDocumentsValidate() {
    $(".error").remove();
    var TrainingDocuments = $("#Name").val();


    if (TrainingDocuments == "") {
        $("#Name").after('<span class="error">Please enter Training Documents Title.</span>');
        return false();
    }


    return true;
}
function InitUI() {

    //$("#alrtmainDiv").hide();
    $("#btnItmSubmit").click(function () {

        //Validation   
        if (TrainingDocumentsValidate() == false) {
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
                window.location.href = 'TrainingDocumentsMaster';
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
$("#inputGroupFile02").change(function () {
    if (typeof (FileReader) != "undefined") {

        $($(this)[0].files).each(function () {
            var file = $(this);
            var reader = new FileReader();
            reader.onload = function (e) {

                var fileMimeType = $('#inputGroupFile02')[0].files[0].type;
                var fileType = fileMimeType.split('/')[0];

                var img = $("<img />");


                $('#Description').val(e.target.result);
            }
            reader.readAsDataURL(file[0]);
            //$('div#clr_btn').html('<button type="button" style="margin-bottom: 30px" class="waves-effect waves-light btn gradient-45deg-red-pink btn-floating border-round z-depth-3 mr-1" onclick="clearImgs()"><i class="material-icons">clear</i></button>&emsp;<button type="button" style="margin-bottom: 30px" class="waves-effect waves-light btn gradient-45deg-light-blue-cyan btn-floating border-round z-depth-3 mr-1" onclick="clearImgsAndReselect()"><i class="material-icons">refresh</i></button>');
        });
    }
    else {
        AddErrorAlert("error", "This browser does not support HTML5 FileReader.");
    }
});

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
            $('#Id').val(data["TDM_Id"]);
            $('#Name').val(data["TDM_Title"]);
            $('#Description').val(data["TDM_Documents"]);
        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
    return false;

}