var formElem = $("#frmEmpPrevEmplyoment");

$(document).ready(function () {


    $(".datepicker").datepicker();
    ({

        dateFormat: 'mm/dd/yyyy'
    });
    //$('.singledate').daterangepicker({
    //    singleDatePicker: true,
    //    autoUpdateInput: false,
    //    showDropdowns: true,
    //    autoApply: true,

    //}, function (chosen_date) {
    //    $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
    //});

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

function EmployeePrevEmplyomentValidate() {
    $(".error").remove();
    var CompanyName = $("#txtCompanyName").val();
    var Designation = $("#txtDesignation").val();
    var DOJ = $("#txtDOJ").val();
    var DOR = $("#txtDOR").val();


    if (CompanyName == "") {
        $("#txtCompanyName").after('<span class="error">Please enter company name.</span>');
        return false();
    }
    else if (Designation == "") {
        $("#txtDesignation").after('<span class="error">Please select Designation.</span>');
        return false();
    }
    else if (DOJ == "") {
        $("#txtDOJ").after('<span class="error">Please select date of joining.</span>');
        return false();
    }
    else if (DOR == "") {
        $("#txtDOR").after('<span class="error">Please select date of realise.</span>');
        return false();
    }

    return true;
}



function SaveRecords() {
    //var tblemplyoment = document.getElementById("tblemplyoment");
    //var tableArr = [];    

    //tableArr.push({
    //    //PWJFG_EnterDate: new Date(txtEnterDate),
    //    EPWD_CompanyName: $("#txtCompanyName").val(),
    //    EMPWD_Designation: $("#txtDesignation").val(),
    //    EPWD_DOJ: new Date($("#txtDOJ").val()),
    //    EPWD_RealiseDate: new Date($("#txtDOR").val()),
    //});

    //for (var i = 2; i < tblemplyoment.rows.length; i++) {
    //    var count = i + 1;
    //    var txtCompanyName = document.getElementById("txtCompanyName_" + count).value;
    //    var txtDesignation = document.getElementById("txtDesignation_" + count).value;
    //    var txtDOJ = document.getElementById("txtDOJ_" + count).value;
    //    var txtDOR = document.getElementById("txtDOR_" + count).value;
    //}
   

    //var _data = JSON.stringify({
    //    emp: {
    //        PrevWorkingList: tableArr,
    //        EM_EmpId: getParameterByName('Id'),

    //    }
    //});

    

    var _data = JSON.stringify({
        PrevWorkingList: {
            EPWD_Id: $("#EPWD_Id").val(),
            EPWD_CompanyName: $("#txtCompanyName").val(),
            EMPWD_Designation: $("#txtDesignation").val(),
            EPWD_DOJ: formatDate($("#txtDOJ").val()),
            EPWD_RealiseDate: formatDate($("#txtDOR").val()),
            EMPWD_Details: $("#txtDetails").val(),
            EPWD_EmployeeId : getParameterByName('Id')
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdatePrevWorkingList',
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
                
                $('#tblemplyoment li').remove();
                retrive(getParameterByName('Id'));

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

//function SaveRecord(permission) {

//    var tableArr = [];
//    var tblemplyoment = document.getElementById('tblemplyoment');

//    for (var i = 1; i < tblemplyoment.rows.length; i++) {
//        tableArr.push({
//            EPWD_CompanyName: $.trim(tblemplyoment.rows[i].cells[0].innerHTML),
//            EMPWD_Designation: $.trim(tblemplyoment.rows[i].cells[1].innerHTML),
//            EPWD_DOJ: $.trim(tblemplyoment.rows[i].cells[2].innerHTML),
//            EPWD_RealiseDate: $.trim(tblemplyoment.rows[i].cells[3].innerHTML),

//        });
//    }

   
//    var a = parseInt($("#hdnUserId").val())

//    var b = parseInt($("#hdnId").val())

//    var _data = JSON.stringify({
//        emp: {
//            UserID: parseInt($("#hdnUserId").val()),
//            PrevWorkingList: tableArr,
//            EM_EmpId: parseInt($("#hdnId").val()),

//        }

        

//    });

  

//    $.ajax({
//        type: "POST",
//        url: '/ScriptJson/InsertUpdateEmployeeMasterPost',
//        data: _data,
//        async: false,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        success: function (data) {
//            if (data != null && data != undefined && data.IsSuccess == true) {
//                Swal.fire({
//                    title: "Good job!",
//                    text: data.Message,
//                    type: "success",
//                    confirmButtonClass: 'btn btn-primary',
//                    buttonsStyling: false,
//                });

//                $('.form-control').val('');
//                window.location.href = '/Home/EmployeeMasterList';
//                //if (parseInt(a) > 0) {
//                //    if (permission == "N") {
//                //        window.location.href = '/Home/SMMEWiseEmployeeList'
//                //    }

//                //    else { window.location.href = '/Home/UserPermission?Id=' + data.Id + '&type=S&SmId=' + a };
//                //}
//                //else
//                //    if (permission == "N") {
//                //        window.location.href = '/Home/EmployeeMasterList';
//                //    }
//                //    else {
//                //        window.location.href = '/Home/UserPermission?Id=' + data.Id;
//                //    }
//            }
//            else {

//                Swal.fire({
//                    title: "Error!",
//                    text: data.Message,
//                    type: "error",
//                    confirmButtonClass: 'btn btn-primary',
//                    buttonsStyling: false,
//                });
//            }
//        },
//        error: function (data) {

//            Swal.fire({
//                title: "Error!",
//                text: "Process Not Complete",
//                type: "error",
//                confirmButtonClass: 'btn btn-primary',
//                buttonsStyling: false,
//            });

//        }
//    });
//}

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
//function retrive(id) {
//    $("#tbodyid").empty();
//    var _data = JSON.stringify({
//        emp: {
//            EM_EmpId: parseInt(id)
//        }
//    });
//    $.ajax({
//        type: "POST",
//        url: "/ScriptJson/GetEmployeeMaster",
//        data: _data,
//        contentType: "application/json; charset=utf-8",
//        dataType: "json",
//        async: false,
//        success: function (data) {
//            $('#hdnId').val(data["EM_EmpId"]);
//            var trHTML = '';

//            $.each(data.PrevWorkingList, function (i, item) {

//                trHTML += "<tr><td>" + item.EPWD_CompanyName + "</td><td>" + item.EMPWD_Designation + "</td><td>" + item.EPWD_DOJ + "</td><td>" + item.EPWD_RealiseDate + "</td><td><a title='Delete...' onclick='deleteconfirmBoxClick(this)' style='cursor:pointer'><img src='../../Content/images/delete.png' /></a></td></tr>";
//            });

//            $('#tblemplyoment').append(trHTML)

//        },
//        error: function (data) {

//        }
//    });
//    return false;

//}

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
            //$('#hdnId').val(data["EM_EmpId"]);

            //var divHTML = '';

            //divHTML = "<h4  class='media-heading'><span class=users-view-name'>" + data["EM_EmpName"] + "</span></h4><span>Emp Code: </span><span class='users-view-id'>" + data["EM_EmpCode"] + "</span>";
            //$('#divEmpnameCode').append(divHTML)

            //var trHTML2 = '';

            //trHTML2 = "<tr><td>Date of Joining:</td><td>" + data["EM_EmpDOJ"] + "</td></tr><tr><td>D.O.B:</td><td>" + data["EM_DOB"] + "</td></tr> <tr><td>Email:</td><td>" + data["EM_Email"] + "</td></tr><tr><td>Contact Number:</td><td>" + data["EM_EmpContactNo"] + "</td></tr>";
            //$('#tblempdetails').append(trHTML2)

            //var trHTML3 = '';

            //trHTML3 = "<tr><tr><td>Designation:</td><td>" + data["EM_Designation"] + "</td></tr><tr><td>National ID Number:</td><td>" + data["EM_NIDNo"] + "</td></tr><tr><td>Highest Qualification:</td><td>" + data["EM_Degree"] + "</td></tr>";
            //$('#tbledetails').append(trHTML3)
            if (data.PrevWorkingList.length > 0) {

                console.log(data.PrevWorkingList);
               
                $.each(data.PrevWorkingList, function (i, item) {
                    //var totalRowCount = $("#tblemplyoment tr").length;
                    //var RowCount = parseInt(totalRowCount) + 1;
                   
                    //var markup = '<tr><td class="width-350" style="padding:0px !important;">' +
                    //               '<div class="card-body" style="padding:4px !important;">' +
                    //               '<div class="form-group tblxs">' +
                    //       '<input type="text" class="form-control input-sm thtxt txtCompanyName" value="' + item.EPWD_CompanyName + '"  name="txtCompanyName" id="txtCompanyName_' + RowCount + '">' +
                    //               '</div>' +
                    //               '</div>' +
                    //               '</td>' +
                    //               '<td style="padding:0px !important;">' +
                    //               '<div class="card-body" style="padding:4px !important;">' +
                    //               '<div class="form-group tblxs">' +
                    //       '<input type="text" class="form-control input-sm  thtxt frm rate txtDesignation" value="' + item.EMPWD_Designation + '"   name="txtDesignation" id="txtDesignation_' + RowCount + '">' +
                    //               '</div>' +
                    //               '</div>' +
                    //               '</td>' +
                    //               '<td style="padding:0px !important;">' +
                    //               '<div class="card-body" style="padding:4px !important;">' +
                    //               '<div class="form-group tblxs">' +
                    //       '<input type="text" class="form-control input-sm  singledate thtxt txtDOJ" value="' + item.EPWD_DOJ + '" name="txtDOJ" placeholder="mm/dd/yyyy" id="txtDOJ_' + RowCount + '">' +
                    //               '</div>' +
                    //               '</div>' +
                    //               '</td>' +
                    //               '<td class="width-350" style="padding:0px !important;">' +
                    //               '<div class="card-body" style="padding:4px !important;">' +
                    //               '<div class="form-group tblxs">' +
                    //       '<input type="text" class="form-control input-sm  singledate thtxt txtDOR" value="' + item.EPWD_RealiseDate + '" name="txtDOR" placeholder="mm/dd/yyyy"  id="txtDOR_' + RowCount + '">' +
                    //               '</div>' +
                    //               '</div>' +
                    //       '</td>' +
                    //       "<td style='padding:0px !important;'><div class='form-group tblxs'> <button type='button' class='btn btn-social-icon btn-xs mb-1 mr-1 btn-danger' style='margin:5px' onclick='deleteconfirmBoxClick(this)'><i class='la la-trash '></i> </button></div></td></tr>";

                    $("#tblemplyoment").append('<li class="list-group-item"> <div class="row align-items-center"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Company Name</small></div> <div class="col-sm-8"> <strong>' + item.EPWD_CompanyName + '</strong> </div> </div> </li> <li class="list-group-item"> <div class="row"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Designation</small></div> <div class="col-sm-8">  <div class="row mb-3"> <strong>' + item.EMPWD_Designation + '</strong> </div>  </div> </div> </li> <li class="list-group-item"> <div class="row"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Date of Joining</small></div> <div class="col-sm-8"> <strong>' + item.EPWD_DOJ + '</strong> </div> </div> </li> <li class="list-group-item"> <div class="row"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Date of Realise</small></div> <div class="col-sm-8"> <strong>' + item.EPWD_RealiseDate + '</strong> </div> </div> </li> <li class="list-group-item"> <div class="row"> <div class="col-sm-4"><small class="h6 text-sm mb-3 mb-sm-0">Details</small></div> <div class="col-sm-8"> <p class="mb-0"> <strong>' + item.EMPWD_Details + '</strong> </p> </div> </div> </li> <li class="list-group-item"><div class="col-sm-12 text-sm-right"><a href="#" onclick="return OpenEditPopUp(\'' + item.EPWD_Id + '\',\'' + item.EPWD_EmployeeId + '\',\'' + item.EPWD_CompanyName + '\',\'' + item.EMPWD_Designation + '\',\'' + item.EPWD_DOJ + '\',\'' + item.EPWD_RealiseDate + '\',\'' + item.EMPWD_Details + '\')" class="btn btn-sm btn-primary rounded-pill mt-3 mt-sm-0" data-toggle="modal">Edit</a></div></li><li style="border-style: outset"></li>');

                });
            }

        },
        error: function (data) {

        }
    });
    return false;

}

function OpenAddPopUp() {
    $("#EPWD_Id").val('0');
    $("#txtCompanyName").val('');
    $("#txtDesignation").val('');
    $("#txtDOJ").val('');
    $("#txtDOR").val('');
    $("#txtDetails").val('');
    $("#modal").modal('show');
}

function OpenEditPopUp(EPWD_Id, EPWD_EmployeeId, EPWD_CompanyName, EMPWD_Designation, EPWD_DOJ, EPWD_RealiseDate, EMPWD_Details) {
    $("#EPWD_Id").val(EPWD_Id);
    $("#txtCompanyName").val(EPWD_CompanyName);
    $("#txtDesignation").val(EMPWD_Designation);
    $("#txtDOJ").val(EPWD_DOJ);
    $("#txtDOR").val(EPWD_RealiseDate);
    $("#txtDetails").val(EMPWD_Details);
    $("#modal").modal('show');
}

var pathFl, pathStringFl;
function AddItemIndividual() {

    if (EmployeePrevEmplyomentValidate() == false) {
        return false;
    }

    var table = document.getElementById("tblemplyoment");
    var RNo;
    var row = table.insertRow(RNo);
    var Cell1 = row.insertCell(0);
    var Cell2 = row.insertCell(1);
    var Cell3 = row.insertCell(2);
    var Cell4 = row.insertCell(3);
    var Cell5 = row.insertCell(4);

    Cell1.innerHTML = $('#txtCompanyName').val();
    Cell2.innerHTML = $('#txtDesignation').val();
    Cell3.innerHTML = $('#txtDOJ').val();
    Cell4.innerHTML = $('#txtDOR').val();

    Swal.fire({
        title: "Good job!",
        text: "Record added successfully",
        type: "success",
        confirmButtonClass: 'btn btn-primary',
        buttonsStyling: false,
    });
    AllClear();
    Cell5.innerHTML = "<a title='Delete...' onclick='deleteconfirmBoxClick(this)' style='cursor:pointer'><img src='../../Content/images/delete.png' /></a>";

}

function AllClear() {
    $('#txtCompanyName').val('');
    $('#txtDesignation').val('');
    $('#txtDOJ').val('');
    $('#txtDOR').val('');
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
            Swal.fire({
                title: "Good job!",
                text: "Record upload successfully",
                type: "success",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });
        },
        error: function (error) {
            Swal.fire({
                title: "Error!",
                text: "",
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });

        }
    });
}

//function deleteconfirmBoxClick(rowNo) {
//    //    $(rowNo).closest('tr').remove();
//    //}
//    var ret;
//    $.confirm({
//        title: "Delete Contents..",
//        content: "Are you sure you want to delete?",
//        theme: 'material',
//        type: 'red',
//        buttons: {
//            confirm: function () {
//                // DeleteItem(rowNo);
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

$(document).off('click', '#add-row').on('click', '#add-row', function (e) {
    if (EmployeePrevEmplyomentValidate() == false) {
        return false;
    }
    $('.singledate').daterangepicker({
        singleDatePicker: true,
        autoUpdateInput: false,
        showDropdowns: true,
        autoApply: true,

    }, function (chosen_date) {
        $(this.element[0]).val(chosen_date.format('MM/DD/YYYY'));
    });
   

    let totalRowCount = $("#tblemplyoment tr").length;
    //var ddlAccounting = $("#txtCompanyName").val();
    let RowCount = parseInt(totalRowCount) + 1;
    let txtCompanyName = $("#txtCompanyName").val();
    let txtDesignation = $("#txtDesignation").val();
    let txtDOJ = $("#txtDOJ").val();
    let txtDOR = $("#txtDOR").val();
    var markup = '<tr><td class="width-350" style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm thtxt txtCompanyName" value="' + txtCompanyName + '"  name="txtCompanyName" id="txtCompanyName_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  thtxt frm rate txtDesignation" value="' + txtDesignation + '"   name="txtDesignation" id="txtDesignation_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  singledate thtxt txtDOJ" value="' + txtDOJ + '" name="txtDOJ" placeholder="mm/dd/yyyy" id="txtDOJ_' + RowCount + '">' +
                '</div>' +
                '</div>' +
                '</td>' +
                '<td class="width-350" style="padding:0px !important;">' +
                '<div class="card-body" style="padding:4px !important;">' +
                '<div class="form-group tblxs">' +
        '<input type="text" class="form-control input-sm  singledate thtxt txtDOR" value="' + txtDOR + '" name="txtDOR" placeholder="mm/dd/yyyy"  id="txtDOR_' + RowCount + '">' +
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



