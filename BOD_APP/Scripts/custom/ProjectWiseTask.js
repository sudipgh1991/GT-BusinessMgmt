var pathString = "";
var pathStringDoc = "";
var user_image = "";
var TaskId;

function clearImgs() {
    $('#profile_pic').val(null).change().clone(true);

    if (user_image != "") {
        $('.media').html('<img id="user_image" src="' + user_image + '" alt="profile image" height="100" width="100" style="border-radius: 50%" />');
    }
    else {
        $('.media').html('<img id="user_image" src="../Content/WebContent/assets/icons/myavatar.png" alt="profile image" height="100" width="100" style="border-radius: 50%" />');
    }
}



//$("#btnSubmit").click(function () {

//    //Validation   
//    if (ProjectWiseTaskValidate() == false) {
//        return false;
//    }
 
//    SaveRecord();
//});

//function ProjectWiseTaskValidate() {

//    var TaskTitle = $("#TaskTitle").val();
//    var Description = $("#Description").val();
//    var StartDate = $("#StartDate").val();
//    var EndDate = $("#EndDate").val();
//    var Priority = $("#Priority").val();


//    if (TaskTitle == "") {
//        $("#TaskTitle").after('<span class="error">Please enter Assessment Type.</span>');
//        return false();
//    }
//    if (Description == "") {
//        $("#Description").after('<span class="error">Please enter Sector.</span>');
//        return false();
//    }
//    if (StartDate == "") {
//        $("#StartDate").after('<span class="error">Please enter Answer Type.</span>');
//        return false();
//    }
//    if (EndDate == "") {
//        $("#EndDate").after('<span class="error">Please enter Show On.</span>');
//        return false();
//    }
//    if (Priority == "") {
//        $("#Priority").after('<span class="error">Please Type your Question.</span>');
//        return false();
//    }

//    return true;
//}




function SaveRecord() {
    //if (!formElem.valid()) {
    //    return false;
    //}
    var _data = JSON.stringify({
        project: {
            PWT_Id: parseInt($("#Id").val()),
            PWT_TaskTitle: $.trim($("#TaskTitle").val()),
          
            PWT_Attachment: $.trim(pathStringDoc),
            PWT_ProjectId: parseInt($("#projectId").val()),
            PWT_ParentTaskId: parseInt(TaskId),
            PWT_Image: $.trim(""),
            PWT_StartDate: $.trim($("#StartDate").val()),
            PWT_EndDate: $.trim($("#EndDate").val()),
            PWT_Description: $.trim($("#Description").val()),
            PWT_Priority: $.trim($("#Priority").val()),
        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateProjectWiseTask',
        data: _data,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                if (parseInt(TaskId) > 0)
                {
                    Swal.fire({
                        title: "New Task Created!",
                        text: data.Message,
                        type: "success",
                        confirmButtonClass: 'btn btn-primary',
                        buttonsStyling: false,
                    });
                    $('.form-control').val('');
                    window.location.href = '/SSME/TaskList?ProjectId=' + parseInt($("#projectId").val()) + '&Id= ' + parseInt(TaskId);
                   
                }
                else
                {
                    Swal.fire({
                        title: "New Activity Created!",
                        text: data.Message,
                        type: "success",
                        confirmButtonClass: 'btn btn-primary',
                        buttonsStyling: false,
                    });
                    $('.form-control').val('');
                    window.location.href = 'ProjectWiseTaskList';
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

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
$(document).ready(function () {


    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });
    //$("#format").on("change", function () {
    //    $("#datepicker").datepicker("option", "dateFormat", 'mm/dd/yyyy');
    //});


    var Id = getParameterByName('Id')
     TaskId = getParameterByName('TaskId')
    if (Id != '') {
        $('#projectId').val(Id);


    }
    if (TaskId != '') {
        $('#htaskTitle').text('Add Task');
        $('#hTitel').text('Task');

    }
    else {
        $('#htaskTitle').text('Add  Activity');
        $('#hTitel').text('Activity');
    }

    
    $('#EndDate').val('');

});

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