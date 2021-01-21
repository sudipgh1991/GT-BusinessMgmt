var Id;
var TaskId;
var Type;
$(document).ready(function () {
     Id = getParameterByName('Id')
     TaskId = getParameterByName('TaskId')
     Type = getParameterByName('Type')
     if (Type == 'A') {
         $("#hHeader").text("Activity Details");
     }
     else
     {
         $("#hHeader").text("Task Details");
     }
     if(Type=='T'){
         $("#btnAddTask").hide();
     }
     else {
         $("#btnAddTask").show();
     }
    if (Id != '') {
        retrive(Id, TaskId,'Load');

    }

});


function retrive(id, TaskId,Load) {
    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'PTWC_TaskId',
            param1Value: parseInt(TaskId),
            param2: 'PTWC_ProjectId',
            param2Value: parseInt(id),
            StoreProcedure: 'ProjectTaskWiseComment_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetProjectWiseTaskComment',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (Load == "Load") {
                if (Type == "A")
                {
                   
                    $('#tasktticket').text('Activity #' + data["PWT_TaskId"])
                }
                else {
                    $('#tasktticket').text('Task #' + data["PWT_TaskId"])
                }
                
                $('#tasktitle').text(data["PWT_TaskTitle"]);
                $('#taskdetails').text(data["PWT_Description"]);
                
                $('#status').val(data["PWT_Status"]);
                $('#spnCorp').text(data["CC_TradingName"]);
                $('#spnCon').text(data["CC_PhoneNo"]);

                $('#strtdate').text('Start Date : ' + data["PWT_StartDate"]);
                $('#endddate').text('End Date : ' + data["PWT_EndDate"]);



                $('#prority').append("<div class='badge badge-primary badge-square'> <i class='la la-calendar font-medium-2'></i> <span > Priority : " + data["PWT_Priority"] + "</span></div>");
                $('#spnEmail').text(data["CC_Email"]);
                $('#spnPhNo').text(data["CC_PhoneNo"]);
                $('#spnCreatedDate').text(data["PWT_CreatedDate"]);
            }
            $('#commentsection').html('');
            if (data.cmmntlist.length > 0) {
              
                $.each(data.cmmntlist, function (index, value) {
                   
                   var html = '<div class="media">'
                       + '<img class="mr-3 ticket-img rounded-circle style="height=30px width=30px" src="' + value.UserIamge+'" alt=" Generic placeholder image">'
                       + '<div class="media-body">'
                    if (value.PTWC_File != '')
                    {
                        html = html + '<a href="'+ value.PTWC_File +'" class="float-right ticket-options-icon text-light" download="cmnt"><i class="la la-download text-success"></i> </a>'
                    }
                       html = html +  '<h5 class="mb-0">' + value.UserName+' <span class="text-muted">replied</span></h5>'
                       + '<span class="">' + value.PTWC_CreatedDate+'</span>'
                       
                        + '<p>' + value.PTWC_Comment + '</p></div>'
                    
                      $('#commentsection').append(html);
                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}

function SaveRecords() {
  
    $('#btnSubmit').prop('disabled', true);
    $("#btnSubmit").html('Please Wait...');

    var _data = JSON.stringify({
        project: {
            PTWC_TaskId: parseInt(getParameterByName('TaskId')),
            PTWC_ProjectId: parseInt(getParameterByName('Id')),
            PTWC_Comment: $('#comment').val(),
            PTWC_File: $('#filestring').val()
        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWiseComment",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                //Swal.fire({
                //    title: "Good job!",
                //    text: data.Message,
                //    type: "success",
                //    confirmButtonClass: 'btn btn-primary',
                //    buttonsStyling: false,
                //});
              //  alert('good job')
               
                retrive(Id, TaskId,'Post');
                $('#comment').val('');
                $('#file-1').val('');
                $('#filestring').val('');

            }
            else {
                //Swal.fire({
                //    title: "Error!",
                //    text: data.Message,
                //    type: "error",
                //    confirmButtonClass: 'btn btn-primary',
                //    buttonsStyling: false,
                //});
            }
            $('#btnSubmit').prop('disabled', false);
            $("#btnSubmit").html('Post a comment');
        },
        error: function (data) {
            //Swal.fire({
            //    title: "Error!",
            //    text: "Process Not Complete",
            //    type: "error",
            //    confirmButtonClass: 'btn btn-primary',
            //    buttonsStyling: false,
            //});

        }
    });
}


function UpdateStatusComment(cmnt) {

   

    var _data = JSON.stringify({
        project: {
            PTWC_TaskId: parseInt(getParameterByName('TaskId')),
            PTWC_ProjectId: parseInt(getParameterByName('Id')),
            PTWC_Comment: cmnt,
            PTWC_File: ''
        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWiseComment",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                return true;
            }
            
           
        },
        error: function (data) {
           
            return false;
        }
    });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function encodeImgtoBase64(element) {
    //alert(id);
    var img = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('#filestring').val(reader.result);
    }
    reader.readAsDataURL(img);
}



function UpdateStatus() {
    if (UpdateStatusComment($.trim($("#status").val())) == true) {
        return false;
    }
    var _data = JSON.stringify({
        phase: {
            PWT_Id: parseInt(TaskId),
           
            PWT_Status: $.trim($("#status").val()),
        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/UpdateProjectTask',
        data: _data,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                
                    Swal.fire({
                        title: "Change Status Successfully...!",
                        text: data.Message,
                        type: "success",
                        confirmButtonClass: 'btn btn-primary',
                        buttonsStyling: false,
                    });
                   
                    retrive(Id, TaskId, 'Post');
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