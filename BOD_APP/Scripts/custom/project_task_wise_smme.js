function SelectforTask(Id,projectId) {
    var tblSMME = document.getElementById("users-contacts");
    var SMME = [];
    for (var i = 1; i < tblSMME.rows.length; i++) {
        if ($("#checkboxsmall_"+i).prop("checked") == true) {
            var count = i + 1;
            var hdnSmme = document.getElementById("smm_"+i).value;
            SMME.push({
                PWS_SM_Id: parseInt(hdnSmme),

            });
        }

    }
    var _data = JSON.stringify({
        project: {
            PWT_Id: parseInt(Id),
            PWT_ProjectId: parseInt(projectId),
            smmlist: SMME,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWiseSMME",
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
