var formElem = $("#frmEmpDocuments");

$(document).ready(function () {
   
  
    var Id = getParameterByName('Id')
    var SMId = getParameterByName('SMId')
    var Mode = getParameterByName('Mode')

    if (Mode == "O") {

        $('#hdnUserId').val(SMId);
    }
    if (Id != '') {

        {
            retrive(Id);
        }
    }

});

function EmployeeDocumentValidate() {
    $(".error").remove();
    var Title = $("#txtTitel").val();
    var pathString = $("#fl").val();
   

    if (Title == "") {
        $("#txtTitel").after('<span class="error">Please enter Title.</span>');
        return false();
    }
    else if (pathString == "") {
        $("#fl").after('<span class="error">Please select any file.</span>');
        return false();
    }
   
    return true;
}

function SaveRecord() {

    var tblemplyoment = document.getElementById("tblemplyoment");
    var tableArr = [];
    for (var i = 2; i < tblemplyoment.rows.length; i++) {
        var count = i + 1;
        var txtTitel = document.getElementById("txtTitel_" + count).value;
        var fl = document.getElementById("fl_" + count).value;
      

        tableArr.push({
            EMT_Name: txtTitel,
            EMT_File: fl,
      
        });

    }


    var _data = JSON.stringify({
        emp: {
            UserID: parseInt($("#hdnUserId").val()),
            empList: tableArr,
            EM_EmpId: parseInt($("#hdnId").val()),
            
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
                //if (parseInt(a) > 0) {
                //    if (permission == "N") {
                //        window.location.href = '/Home/SMMEWiseEmployeeList'
                //    }

                //    else { window.location.href = '/Home/UserPermission?Id=' + data.Id + '&type=S&SmId=' + a };
                //}
                //else
                //    if (permission == "N") {
                //        window.location.href = '/Home/EmployeeMasterList';
                //    }
                //    else {
                //        window.location.href = '/Home/UserPermission?Id=' + data.Id;
                //    }
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

    //$("#tbodyid").empty();
    var _data = JSON.stringify({
        emp: {
            EM_EmpId: parseInt(id)
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetEmployeeMaster',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {


            //$('#projectName').text(data["PE_ProjectName"])
            //$('#client').text(data["CC_CorporateName"]);
            //$('#startdate').text(data["PE_StartDate"]);
            //$('#enddate').text(data["PE_EndDate"]);
            //$('#hdnProject').val(data["PE_Id"]);
            $('#hdnId').val(data["EM_EmpId"]);

            //var divHTML = '';

            //divHTML = "<h4  class='media-heading'><span class=users-view-name'>" + data["EM_EmpName"] + "</span></h4><span>Emp Code: </span><span class='users-view-id'>" + data["EM_EmpCode"] + "</span>";
            //$('#divEmpnameCode').append(divHTML)

            //var trHTML2 = '';

            //trHTML2 = "<tr><td>Date of Joining:</td><td>" + data["EM_EmpDOJ"] + "</td></tr><tr><td>D.O.B:</td><td>" + data["EM_DOB"] + "</td></tr> <tr><td>Email:</td><td>" + data["EM_Email"] + "</td></tr><tr><td>Contact Number:</td><td>" + data["EM_EmpContactNo"] + "</td></tr>";
            //$('#tblempdetails').append(trHTML2)

            //var trHTML3 = '';

            //trHTML3 = "<tr><tr><td>Designation:</td><td>" + data["EM_Designation"] + "</td></tr><tr><td>National ID Number:</td><td>" + data["EM_NIDNo"] + "</td></tr><tr><td>Highest Qualification:</td><td>" + data["EM_Degree"] + "</td></tr>";
            //$('#tbledetails').append(trHTML3)
            if (data.empList.length > 0) {


                $.each(data.empList, function (i, item) {
                    var totalRowCount = $("#tblemplyoment tr").length;
                    var RowCount = parseInt(totalRowCount) + 1;

                    var markup = '<tr><td class="width-350" style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm thtxt txtTitel" value="' + item.EMT_Name + '" name="txtTitel" id="txtTitel_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate fl" value="' + item.EMT_File + '"   name="fl" id="fl_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' onclick='deleteconfirmBoxClick(this)'><i class='la la-trash '></i> </button></div></td></tr>";

                    $("#tblemplyoment tbody").append(markup);

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}


function retrive(id) {
    $("#tbodyid").empty();
    var _data = JSON.stringify({
        emp: {
            EM_EmpId: parseInt(id)
        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetEmployeeMaster",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            $('#hdnId').val(data["EM_EmpId"]);
           
            //var trHTML = '';

            $.each(data.empList, function (i, item) {

                //trHTML += "<tr><td>" + item.EMT_Name + "</td><td>" + item.EMT_File + "</td><td><a title='Delete...' onclick='deleteconfirmBoxClick(this)' style='cursor:pointer'><img src='../../Content/images/delete.png' /></a></td></tr>";
                $('#tblemplyoment').append('<li class="list-group-item"> <div class="row align-items-center"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Title</small></div> <div class="col-sm-8"> <strong>' + item.EMT_Name + '</strong> </div> </div> </li> <li class="list-group-item"> <div class="row"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Document</small></div><div class="col-sm-8">  <div class="row mb-3"> <strong>' + item.EMT_File + '</strong> </div>  </div> </div> </li> <li style="border-style: outset"></li>')
            });

            

           

        },
        error: function (data) {

        }
    });
    return false;

}
function OpenAddPopUp() {
    $("#hdnUserId").val('0');
    $("#EMT_Name").val('');
    $("#EMT_File").val('');
    $("#modal").modal('show');
}


var pathFl, pathStringFl;
function AddItemIndividual() {
   
    if (EmployeeDocumentValidate() == false) {
        return false;
    }

    var table = document.getElementById("tblEmp");
    var RNo;
    var row = table.insertRow(RNo);
    var Cell1 = row.insertCell(0);
    var Cell2 = row.insertCell(1);
    var Cell3 = row.insertCell(2);
    pathFl = $('#fl').val().substring(12);

    pathStringFl = '/Upload/' + pathFl;
    UploadDoc('fl');
    

    Cell1.innerHTML = $('#txtTitel').val();
    Cell2.innerHTML = pathStringFl;

    Cell3.innerHTML = "<a title='Delete...' onclick='deleteconfirmBoxClick(this)' style='cursor:pointer'><img src='../../Content/images/delete.png' /></a>";

    AllClear();

}

function AllClear() {
    $('#fl').val('');
    $('#txtTitel').val('');

}

function UploadDoc(flPic) {
    var formData = new FormData();
    var totalFiles = document.getElementById(flPic).files.length;
    for (var i = 0; i < totalFiles; i++) {
        var file = document.getElementById(flPic).files[i];
        formData.append(flPic, file);
    }
    $.ajax({
        type: "POST",
        url: '/ScriptJson/Upload',
        data: formData,
        dataType: 'json',
        contentType: false,
        processData: false,
        success: function (response) {
            //Swal.fire({
            //    title: "Good job!",
            //    text: "Record upload successfully",
            //    type: "success",
            //    confirmButtonClass: 'btn btn-primary',
            //    buttonsStyling: false,
            //});
        },
        error: function (error) {
            //Swal.fire({
            //    title: "Error!",
            //    text: "",
            //    type: "error",
            //    confirmButtonClass: 'btn btn-primary',
            //    buttonsStyling: false,
            //});
           
        }
    });
}

//function deleteconfirmBoxClick(rowNo) {
////    $(rowNo).closest('tr').remove();
////}
//    var ret;
//    $.confirm({
//        title: "Delete Contents..",
//        content: "Are you sure you want to delete?",
//        theme: 'material',
//        type: 'red',
//        buttons: {
//            confirm: function () {
//               // DeleteItem(rowNo);
//                $(rowNo).closest('tr').remove();

//                Swal.fire({
//                    title: "Good job!",
//                    text: "Record deleted successfully",
//                    type: "success",
//                    confirmButtonClass: 'btn btn-primary',
//                    buttonsStyling: false,
//                });

//            },
//            cancel: function () {
//                btnClass: 'btn-red';
//                //$.alert("Cancel..");

//            }
//        }
//    });


//}

function DeleteItem(t) {

    var photoFileName = $(t).closest('tr').find("td:eq(1)").html().split('/Upload/')[1];

    var _data = "{photoFileName:'" + photoFileName + "'}";

    $.ajax({
        type: "POST",
        url: '/ScriptJson/DeletePhoto',
        data: _data,
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        processData: false,
        async: false,
        success: function (response) {

            AddErrorAlert("success", response);
        },
        error: function (error) {
            AddErrorAlert("error", "Picture not Deleted..");
        }
    });
}

$(document).off('click', '#add-row').on('click', '#add-row', function (e) {
    if (EmployeeDocumentValidate() == false) {
        return false;
    }
  
    pathFl = $('#fl').val().substring(12);

    pathStringFl = '/Upload/' + pathFl;
    UploadDoc('fl');


    //Cell1.innerHTML = $('#txtTitel').val();
    //Cell2.innerHTML = pathStringFl;


    let totalRowCount = $("#tblemplyoment tr").length;
    //var ddlAccounting = $("#txtCompanyName").val();
    let RowCount = parseInt(totalRowCount) + 1;
    let txtTitel = $("#txtTitel").val();
    //let txtDesignation = $("#txtDesignation").val();
    //let txtDOJ = $("#txtDOJ").val();
    //let txtDOR = $("#txtDOR").val();
    var markup = '<tr><td class="width-350" style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm thtxt txtTitel" value="' + txtTitel + '"  name="txtTitel" id="txtTitel_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate fl" value="' + pathStringFl + '"   name="fl" id="fl_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +    
                "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' onclick='deleteconfirmBoxClick(this)'><i class='la la-trash '></i> </button></div></td></tr>";

    $("#tblemplyoment tbody").append(markup);
    AllClear();

});

function deleteconfirmBoxClick(rowNo) {
    Swal.fire({
        title: 'Are you sure?',
        text: "You want to deleted this records!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Your I Delete!',
        confirmButtonClass: 'btn btn-primary',
        cancelButtonClass: 'btn btn-danger ml-1',
        buttonsStyling: false,

    }).then(function (result) {
        if (result.value) {
            $(rowNo).closest('tr').remove();
            Swal.fire({
                type: "success",
                title: 'Deleted!',
                text: 'Your file has been deleted.',
                confirmButtonClass: 'btn btn-success',
            })
        }
    })
}

