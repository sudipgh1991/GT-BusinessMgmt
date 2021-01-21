$(document).ready(function () {

    var Id = getParameterByName('Id')

    if (Id != '') {
        retrive(Id);

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
            TransactionType: 'Select',
            param1: 'OE_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'OtherEarnings_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetOtherEarnings',
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



        },
        error: function (data) {

        }
    });
    return false;

}

function SaveRecord(projectId) {
    var smme = [];
    var ssmeList = document.getElementById("users-contacts");

    for (var i = 1; i < ssmeList.rows.length; i++) {
        if ($("#checkboxsmall_" + i).prop("checked") == true) {
            var count = i + 1;
            var ssme = document.getElementById("emp_" + i).value;

            smme.push({
                PWS_SM_Id: parseInt(ssme),

            });
        }
    }
    var _data = JSON.stringify({
        project: {
            PE_Id: parseInt($('#hdnProject').val()),

            ProjectWiseSMME: smme,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectWiseSMME",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                Swal.fire({
                    title: "Added Successfully!",
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

//function SaveRecords() {
//    var smme = [];
//    var ssmeList = document.getElementById("users-contacts");

//    for (var i = 1; i < ssmeList.rows.length; i++) {
//        if ($("#checkboxsmall_" + i).prop("checked") == true) {
//            var count = i + 1;
//            var ssme = document.getElementById("emp_" + i).value;

//                    smme.push({
//                        PWS_SM_Id: parseInt(ssme),

//                    });
//        }
//    }

//    var _data = JSON.stringify({
//        project: {
//            PE_Id: parseInt($('#hdnProject').val()),

//            ProjectWiseSMME: smme,

//        }
//    }); $.ajax({
//        type: "POST",
//        url: "/ScriptJson/InsertUpdateProjectWiseSMME",
//        data: _data,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            if (data != null && data != undefined && data.IsSuccess == true) {
//                Swal.fire({
//                    title: "Good job!",
//                    text: data.Message,
//                    type: "success",
//                    confirmButtonClass: 'btn btn-primary',
//                    buttonsStyling: false,
//                });


//            }
//            else {
//                Swal.fire({
//                    title: "Error!",
//                    text: data.Message,
//                    type: "error",
//                    confirmButtonClass: 'btn btn-primary',
//                    buttonsStyling: false,
//                });
//            }
//        },
//        error: function (data) {
//            Swal.fire({
//                title: "Error!",
//                text: "Process Not Complete",
//                type: "error",
//                confirmButtonClass: 'btn btn-primary',
//                buttonsStyling: false,
//            });

//        }
//    });
//}