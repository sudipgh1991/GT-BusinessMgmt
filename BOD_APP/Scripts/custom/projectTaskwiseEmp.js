function SaveRecord(projectId,taskId) {
    var empList = document.getElementById("users-contacts");
    var Employee = [];
    for (var i = 1; i < empList.rows.length; i++) {
        if ($("#checkboxsmall_" + i).prop("checked") == true) {
            var count = i + 1;
            var hdnCreatedbyProject = document.getElementById("hdnCreatedbyProject_" + i).value;
            var hdnIsSuper = document.getElementById("hdnIsSuper_" + i).value;
            var emp = document.getElementById("emp_" + i).value;
            //if (hdnIsSuper != true) {
               // if (hdnCreatedbyProject <= 0) {
                    Employee.push({
                        PWE_EmpId: parseInt(emp),

                    });
               // }
            //}

        }

    }
    var _data = JSON.stringify({
        project: {

            PE_Id: parseInt(projectId),
            TaskId: parseInt(taskId),
            prjectWiseEmp: Employee,

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateProjectTaskWiseEmp",
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
