function OpenManagerPopUp(empId) {
    $("#hdnEmpId").val(empId)
    $("#modal-reporting-manager").modal('show');
}

function SaveRecord(managerId) {

    var _data = JSON.stringify({
        emp: {

            EM_EmpId: parseInt($("#hdnEmpId").val()),
            EM_ManagerId: parseInt(managerId),
            EM_Status:'UpdateManager',

        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateEmployeeMasterPost',
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

                $('.form-control').val('');
                window.location.href = '/Home/EmployeeMasterList';
                //        if (parseInt(a) > 0) {
                //            if (permission == "N") {
                //                window.location.href = '/Home/SMMEWiseEmployeeList'
                //            }

                //            else { window.location.href = '/Home/UserPermission?Id=' + data.Id + '&type=S&SmId=' + a };
                //        }
                //        else
                //            if (permission == "N") {
                //                window.location.href = '/Home/EmployeeMasterList';
                //            }
                //            else {
                //                window.location.href = '/Home/UserPermission?Id=' + data.Id;
                //            }
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