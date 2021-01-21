
var formElem = $("#frmCatmaster");

$(document).ready(function () {

    InitUI();
    //InitValidationRules();

});

function InitValidationRules() {
    formElem.validate({
        rules: {
            ItemName: {
                required: true
            }
        }
    });
}
function ItemMasterValidate() {
    $(".error").remove();
    var ItemName = $("#Name").val();
  

    if (ItemName == "") {
        $("#Id").after('<span class="error">Please enter Item Name.</span>');
        return false();
    }
    

    return true;
}
function InitUI() {

    //$("#alrtmainDiv").hide();
    $("#btnSubmit").click(function () {

        //Validation   
        if (ItemMasterValidate() == false) {
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
                window.location.href = 'ItemMasterList';
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
            $('#Id').val(data["IM_Id"]);
            $('#Name').val(data["IM_Name"]);
            $('#Description').val(data["IM_Description"]);
        },
        error: function (data) {
            alert("Process Not Sucess");
        }
    });
    return false;

}