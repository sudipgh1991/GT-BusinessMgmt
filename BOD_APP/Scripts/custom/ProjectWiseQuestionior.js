
$(document).ready(function () {

    var projectId = parseInt($("#hdprojectId").val());
    
    if (projectId > 0) {
        retrive(projectId);
    }
});


//for select all checkbox for instances
$('[name="checkboxForAll"]').click(function () {

    if ($('[name="checkboxForAll"]').prop("checked") == true) {
        $('.tblQuestion tbody .custom-checkbox input[type="checkbox').prop("checked", true);

    }
    else {
        $('.tblQuestion tbody .custom-checkbox input[type="checkbox').prop("checked", false);

    }

});

//if select any checkbox then show the delete,
$('[name="checkboxForSingle"]').click(function () {

    if ($(this).prop("checked") == false) {

        $('[name="checkboxForAll"]').prop("checked", false);
    }
    if ($('[name="checkboxForSingle"]:checked').length > 0) {
        if ($('[name="checkboxForSingle"]:checked').length > 1) {

        }
        else {

            var row = $(".tblQuestion >tbody .custom-checkbox input[type=checkbox]:checked").closest("tr")[0];

        }
    }
    else {

    }
});


function SaveRecords() {

    var arrQuesId = [];

    $(".tblQuestion >tbody .custom-checkbox input[type=checkbox]:checked").each(function () {
        var row = $(this).closest("tr")[0];
        var questionId = $(row).find("td:eq(0) input[type=hidden]").val();
        var projectId = parseInt($("#hdprojectId").val());
       
        arrQuesId.push({
            PWQ_PQM_Id: questionId,
            PWQ_ProjectId: projectId,

        });
    });

    //var a = parseInt($("#hdnUserId").val())
    var projectId = document.getElementById('Id');
    var _data = JSON.stringify({
        emp: {
            PWQ_ProjectId: parseInt($("#hdprojectId").val()),
            ProjectQuestionList: arrQuesId,

        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateProjectWiseQuestion',
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


                window.location.href = '/Project/ProjectList';

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

            TransactionType: 'Select',
            StoreProcedure: 'ProjectWiseQuestion_USP',
            param1: 'PWQ_ProjectId ',
            param1Value: parseInt(id)
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetProjectWiseQuestion",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            if (data.ProjectQuestionList.length > 0) {

                for (var i = 0; i < data.ProjectQuestionList.length; i++) {
                  
                    $("#chk" + data.ProjectQuestionList[i].PWQ_PQM_Id).prop('checked', true)
                }

            }
 
        },
        error: function (data) {

        }
    });
    return false;

}
