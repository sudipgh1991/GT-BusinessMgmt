var type;
var switchStatus = false;
$("#switch9").on('change', function () {
    if ($(this).is(':checked')) {
        switchStatus = $(this).is(':checked');
        $("input[type='checkbox']:checkbox").prop('checked', true);
        $("input[type='checkbox']:checkbox").prop('disabled', false);
    }
    else {
        switchStatus = $(this).is(':checked');
        $("input[type='checkbox']:checkbox").prop('checked', false);
        $(".mainMenu").prop('disabled', false);
        $(".subMenu").prop('disabled', true);

    }
});
$(document).ready(function () {
   

    var Id = getParameterByName('Id'); //Get Data From URL QueryString
    var mode = getParameterByName('mode');
    type = getParameterByName('type');
    //if (Id != '') {
    //    retrive(Id, mode);  //for edit retrive data
    //}
})

//Get Data From URL   
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

$(document).on('click', '#btnSave', function () {
    //SaveRecord();
    checked();
})
function checked() {
    debugger;
    var menuArr = [];
    //$('#active-accounts tbody tr').each(function () {
        
    //    if ($(this).find('.mainMenu')[0].checked) {
    //        menuArr.push({ MenuId: parseInt($(this).find('.mainMenu').value) });
    //    }
    //    var subcheck = $(this).find('.subMenu');
    //    if ($(this).find('.subMenu')[0].checked) {
    //        menuArr.push({ MenuId: parseInt(this.value) });
    //    }  
    //})
    $('input:checkbox[class=mainMenu]').each(function () {
        if (this.checked) {
            menuArr.push({ MenuId: parseInt(this.value) });
        }
    });

    $('input:checkbox[class=subMenu]').each(function () {
        if (this.checked) {
            menuArr.push({ MenuId: parseInt(this.value) });
        }
    });

}

function SaveRecord() {

    var menuArr = [];

    $('input:checkbox[class=mainMenu]').each(function () {
        if (this.checked) {
            menuArr.push({ MenuId: parseInt(this.value) });
        }
    });

    $('input:checkbox[class=subMenu]').each(function () {
        if (this.checked) {
            menuArr.push({ MenuId: parseInt(this.value) });
        }
    });

    var _data = JSON.stringify({
        entity: {
            UserId: parseInt($("#User_ID").val()),
            UserLoginID: $.trim($("#username").val()),
            Password: $.trim($("#password").val()),
            UserName: $.trim($("#fullname").val()),
            status: $.trim($('#status').val()),
            mainmenuList: menuArr,
            IsSuper: switchStatus

        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateUser',
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
                if (type == "S") {
                    window.location.href = "/Home/SMMEWiseEmployeeList";
                }
                else if (mode == "U") {
                    window.location.href = "/Home/UserList";
                }
                else {
                    window.location.href = "/Home/EmployeeMasterList";
                }


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


//function retrive(id, mode) {

//    var _data = JSON.stringify({
//        global: {
//            TransactionType: globalData.TransactionType,
//            Param: globalData.Param,
//            paramValue: parseInt(id),
//            StoreProcedure: globalData.StoreProcedure
//        }
//    });

//    $.ajax({
//        type: "POST",
//        url: "/ScriptJson/GetGlobalMaster",
//        data: _data,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (data) {

//            $('#User_Id').val(data["UserID"]);
//            $('#fullname').val(data["UserName"]).siblings('label').addClass('active');
//            $('#username').val(data["UserLoginID"]).siblings('label').addClass('active');
//            $('#password').val(data["Password"]).siblings('label').addClass('active');
//            $('#status').val(data["status"]).change();



//            if (mode == 'v') {
//                $(document).find('input, textarea, select').attr('disabled', 'disabled');
//                $('#btnSave').attr('id', 'btnEdit').html('Edit');

//                $(document).on('click', '#btnEdit', function () {
//                    $(document).find('input, textarea, select').removeAttr('disabled');
//                    $('#btnEdit').attr('id', 'btnSave').html('Submit');
//                })
//            }
//        },
//        error: function (data) {
//            swal({
//                title: 'Process not completed',
//                icon: 'error'
//            })
//        }
//    });
//    return false;

//}

$('#password, #confirm_password').on('keyup', function () {
    if ($('#password').val() == $('#confirm_password').val()) {
        $('#confirm_password').css('border-color', 'green');
       

    } else
        $('#confirm_password').css('border-color', 'red');
   
});