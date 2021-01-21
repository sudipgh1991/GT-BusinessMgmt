
var Id;
$(document).ready(function () {
   Id = getParameterByName('Id')
    //TaskId = getParameterByName('TaskId')

  

    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });

});


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function retriveTask(PhaseId) {
    $('#hdnPhaseId').val('');
    var _data = JSON.stringify({
        global: {

            param1: 'PP_ProjectId',
            param1Value: parseInt($('#hdnProject').val()),
            param2: 'PP_Id',
            param2Value: parseInt(PhaseId),

        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetPhaseWisetaskList',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            $('#hdnPhaseId').val(PhaseId);
            $('#chkTask').html('');
            var i = 1;
            $.each(data, function (index, value) {
                $('#chkTask').append('<div class="card border"><div class="px-3 py-2 row align-items-center"><div class="col-10"><div> <input Id="' + value.PWT_Id + '" type="checkbox" ' + value.chkchecked + ' value="' + value.PWT_Id + '">&nbsp;&nbsp;&nbsp; <label class="h6 text-sm">' + value.PWT_TaskTitle + '</label></div></div></div></div>')
                i++;
            });

            var startDateId = "#hdnStartDate_" + PhaseId;
            var endDateId = "#hdnEndDate_" + PhaseId;
            var hPhaseId = "#hPhaseName_" + PhaseId
            var startDate = $(startDateId).val();
            var endDate = $(endDateId).val();
            var PhaseName = $(hPhaseId).text();
            $('#txtStartDateView').val(startDate);
            $('#txtEndDateView').val(endDate);

            $('#hPhaseNm').text(PhaseName);

            $('#modal-task-view').modal('show');

        },
        error: function (data) {

        }
    });
    return false;

}

function retrive(id, TaskId, Type) {
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
        url: '/ScriptJson/GetProjectPhase',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (Type == "Load") {
                $('#tasktticket').text('Activity #' + data["PWT_TaskId"])
                $('#tasktitle').text(data["PWT_TaskTitle"]);
                $('#taskdetails').text(data["PWT_Description"]);

                $('#spnCorp').text(data["CC_TradingName"]);
                $('#spnCon').text(data["CC_PhoneNo"]);

                $('#strtdate').text('Start Date : ' + data["PWT_StartDate"]);

            }


        },
        error: function (data) {

        }
    });
    return false;

}

function SaveRecords() {
    if (PhaseValidate() == false) {

        return false;
    }

    var _data = JSON.stringify({
        phase: {
            PP_Id: parseInt($('#hdnPhase').val()),
            PP_ProjectId: parseInt($('#hdnProject').val()),
            PP_Description: $('#txtPhaseDescription').val(),
            PP_Name: $('#txtPhaseHeading').val(),
            PP_FromDate: $('#txtStartDate').val(),
            PP_ToDate: $('#txtEndDate').val()
        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectWisePhase",
        data: _data,
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
                //  alert('good job')

              
                window.location.href = "/Project/ProjectPlanningList?Id=" + Id;
                //$('#modal-task-create').attr("data-dismiss", "modal");

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

function AddTask() {



    var _data = JSON.stringify({
        phase: {
            PP_Id: parseInt(getParameterByName('TaskId')),
            PP_ProjectId: parseInt(getParameterByName('Id')),

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWisePhase",
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



function PhaseValidate() {
    $(".error").remove();
    var ProjectName = $("#txtPhaseHeading").val();

    var StartDate = $("#txtStartDate").val();
    var EndDate = $("#txtEndDate").val();


    if (ProjectName == "") {
        $("#txtPhaseHeading").after('<span class="error">Please enter Phase Heading.</span>');
        return false;
    }

    else if (StartDate == "") {
        $("#txtStartDate").after('<span class="error">Please enter Start Date.</span>');
        return false;
    }
    else if (EndDate == "") {
        $("#txtEndDate").after('<span class="error">Please enter End Date.</span>');
        return false;
    }


    return true;
}


function SaveTaskPhase() {


    var selecteditems = [];

    $("#chkTask").find('input[type=checkbox]:checked').each(function (i, ob) {


        selecteditems.push({
            PWP_TaskId: parseInt($(ob).val()),

        });
    });
    var _data = JSON.stringify({
        phase: {

            PP_Id: parseInt($('#hdnPhaseId').val()),
            PP_ProjectId: parseInt($('#hdnProject').val()),
            projectTaskWisePase: selecteditems,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWisePhase",
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

                window.location.reload();
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


function retrivePhase(PhaseId, Phase, PP_FromDate, PP_ToDate, PP_Description) {



    $('#txtStartDateView').val(hdnPhaseId);
    $('#txtStartDate').val(PP_FromDate);
    $('#txtEndDate').val(PP_ToDate);

    $('#txtPhaseHeading').val(Phase);
    $('#txtPhaseDescription').val(PP_Description);

    $('#modal-task-create').modal('show');


}
