
function confirmBoxClick(id) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do You Want To Approve",
        type: 'green',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'approve!',
        confirmButtonClass: 'btn btn-success',
        cancelButtonClass: 'btn btn-danger ml-1',
        buttonsStyling: false,

    }).then(function (result) {
        if (result.value) {
            SaveRecord(id);
            //$(rowNo).closest('tr').remove();
            Swal.fire({
                type: "success",
                title: 'Approved!',
                text: 'Your leave has been Approved.',
                confirmButtonClass: 'btn btn-success',
            })
        }
    })
}

//function confirmBoxClick(id) {
//    var ret;
//    $.confirm({
//        title: "Confirm",
//        content: "Do You Want To Confirm?",
//        theme: 'material',
//        type: 'green',
//        buttons: {
//            confirm: function () {
//                SaveRecord(id)

//            },

//            cancel: function () {
//                $.alert('Your are cancel this print!');
//            }


//        }
//    });


//}

function SaveRecord(Id) {

    var _data = JSON.stringify({
        emp: {
            ELA_Id: parseInt(Id),

        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateEmpLeaveApplication',
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

                window.location.href = '/Home/EmpLeaveApplicationList';
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