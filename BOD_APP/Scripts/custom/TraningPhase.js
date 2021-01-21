$(document).ready(function () {
    $("#TP_Id").val('0');
    appenedTraningPhase();
});

function appenedTraningPhase() {    
    var trainingId = getParameterByName('id');
    var traningName = getParameterByName('name');
    $("#traningName").html(traningName);
    var traningPhase = [];
    var _data = JSON.stringify({
        global: {
            param1Value: trainingId
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/TrainingPhaseList",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var pattern = /Date\(([^)]+)\)/;           
            $.each(data, function (index, value) {

                var results = pattern.exec(value.TP_FromDate);
                var dt = new Date(parseFloat(results[1]));
                var TP_FromDate = dt.getFullYear() + "-" + ('0' + (dt.getMonth() + 1)).slice(-2) + "-" + ('0' + dt.getDate()).slice(-2);

                var results1 = pattern.exec(value.TP_ToDate);
                var dt1 = new Date(parseFloat(results1[1]));
                var TP_ToDate = dt1.getFullYear() + "-" + ('0' + (dt1.getMonth() + 1)).slice(-2) + "-" + ('0' + dt1.getDate()).slice(-2);

                var TP_Title = value.TP_Title;
                console.log(value.TP_Id);

                $("#TraningPhaseData").append('<tr> <th scope="row"> <div class="media align-items-center"> <div> <img alt="Image placeholder" src="../../assets/img/theme/light/brand-avatar-1.png" class="avatar rounded-circle"> </div> <div class="media-body ml-4"> <a href="#" onclick="return OpenEditPopUp(\'' + value.TP_Id + '\',\'' + trainingId + '\',\'' + TP_Title + '\',\'' + TP_FromDate + '\',\'' + TP_ToDate + '\')" class="name mb-0 h6 text-sm">' + TP_Title + '</a> </div> </div> </th> <td class="budget"> ' + TP_FromDate + ' </td> <td class="budget"> ' + TP_ToDate + ' </td> <td> <span class="badge badge-dot mr-4"> <i class="' + value.TP_Color + '"></i> <span class="status">' + value.TP_Status + '</span> </span> </td> </tr>');

            });


        }
    });
}


function OpenEditPopUp(TP_Id, trainingId, TP_Title, TP_FromDate, TP_ToDate) {
    $("#TP_Title").val(TP_Title);
    $("#TP_FromDate").val(TP_FromDate);
    $("#TP_ToDate").val(TP_ToDate);
    $("#TWD_TE_Id").val(trainingId);
    $("#TP_Id").val(TP_Id);

    $("#modal-project-create").modal('show');
}

function OpenEventCalender() {
    var trainingId = getParameterByName('id');
    window.location.href = '../EventCalender?id=' + trainingId;
}
    $("#btnSave").on("click", function () {

    var trainingId = getParameterByName('id');   

        var _data = JSON.stringify({
            TrainingPhase: {
                TWD_TE_Id: $("#TWD_TE_Id").val(),
                TP_Title: $("#TP_Title").val(),
                TP_FromDate: formatDate($("#TP_FromDate").val()),
                TP_ToDate: formatDate($("#TP_ToDate").val()),
                TWD_TE_Id: trainingId,
                TP_Id: $("#TP_Id").val()
            }
        });

        console.log(_data);

    $.ajax({
        type: "POST",
        url: "/ScriptJson/TrainingPhase",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            Swal.fire({
                title: "Good job!",
                text: data.Message,
                type: "success",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });
            $("#TP_Id").val('0');
            $("#TraningPhaseData tr").each(function () {
                this.parentNode.removeChild(this);
            });
            appenedTraningPhase();
        }
    });      

});

function formatDate(date) {

    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}