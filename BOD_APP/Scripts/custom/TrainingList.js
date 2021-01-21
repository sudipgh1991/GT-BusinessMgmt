var addedEmployee = [];
var EmployeewithTraining = [];
var addDocument = [];
$(document).ready(function () {
   
    BindTrainingList();
});

function allok() {
    alert('');
}

function BindTrainingList() {
    $('.loader').show();

    $.ajax({
        type: "POST",
        url: "/ScriptJson/TrainingList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var dynamicid = 1;
            $.each(data, function (index, value) {
                var disable = 'No';
                var smallIcon = '';
                var _data = JSON.stringify({
                    global: {
                        param1Value: value.TE_ID
                    }
                });

                $.ajax({
                    type: "POST",
                    url: "/ScriptJson/TrainingWiseImageList",
                    data: _data,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    async: false,
                    success: function (data) {
                        if (data.length == 0) {
                            smallIcon = '<a href="#" class="avatar rounded-circle avatar-sm"> <img alt="No Pic" src="/Content/app-assets/images/icons/error.png" class=""> </a>';
                        }
                        $.each(data, function (index, value1) {
                            smallIcon = smallIcon + '<a href="#" class="avatar rounded-circle avatar-sm"> <img alt="" src=' + value1.EM_ProfilePic +' class=""> </a>';
                            if ($('#Role').val() == "E") {                                
                                EmployeewithTraining.push({
                                    TWE_EmpId: value1.EM_EmpId,
                                    TE_ID: value.TE_ID
                                });  
                                var UM_MainID = $('#UM_MainID').val();
                                console.log(UM_MainID);
                                console.log(value1.EM_EmpId);

                                if (value1.EM_EmpId == UM_MainID) {   
                                    console.log('ok'); 
                                    disable = 'Yes';
                                }

                            }
                        });                        

                        $('.loader').hide();
                        
                    }
                   
                });
                var image = value.TE_Pic;
                if (value.TE_Pic == '') {
                    image = "../Content/app-assets/images/icons/notraning.jpg";
                }                                
                //$('#trainingListData').append('<div class="col-xl-3 col-lg-4 col-sm-6"> <div class="card hover-shadow-lg"> <div class="card-header border-0 pb-0"> <div class="d-flex justify-content-between align-items-center"> <div> <h6 class="mb-0"></h6> </div> <div class="text-right"> <div class="actions"> <a href="#" class="action-item"><i class="fa fa-sync"></i></a> <div class="dropdown action-item" data-toggle="dropdown"> <a href="#" class="action-item"><i class="fa fa-ellipsis-h"></i></a> <div class="dropdown-menu dropdown-menu-right"> <a href="#" class="dropdown-item">Refresh</a> <a href="#" class="dropdown-item">Manage Widgets</a> <a href="#" class="dropdown-item">Settings</a> </div> </div> </div> </div> </div> </div> <div class="card-body text-center"> <a href="#" class="avatar rounded-circle avatar-lg hover-translate-y-n3"> <img alt="Image placeholder" src="' + image + '" class=""> </a> <h5 class="h6 my-4"><a href="/Home/AddTraining?id=' + value.TE_ID + '">' + value.TE_Name + '</a></h5> <div class="avatar-group hover-avatar-ungroup mb-3"> ' + smallIcon + ' </div> <span class="clearfix"></span> <span class="badge badge-pill ' + value.TE_Color + '">' + value.TE_Status + '</span> </div> <div class="card-footer"> <div class="actions d-flex justify-content-between px-4">  <a href="#" onclick="ModalBind(' + value.TE_ID + ')"  id="addEmployee_' + dynamicid + '" class="action-item  text-info"><i class="fa fa-user-plus"></i></a> <a href="/home/UploadFiles/?id=' + value.TE_ID + '" class="action-item text-success"> <i class="far fa-file"></i> </a> <a href="/home/TrainingPhase/?id=' + value.TE_ID + '&name=' + value.TE_Name+' " class="action-item text-warning"> <i class="far fa-calendar"></i> </a></div> </div> </div> </div>');
                $('#trainingListData').append('<div class="col-xl-3 col-lg-4 col-sm-6"> <div class="card hover-shadow-lg"> <div class="card-header border-0 pb-0"> <div class="d-flex justify-content-between align-items-center"> <div> <h6 class="mb-0"></h6> </div> <div class="text-right"> <div class="actions"> <a href="#" class="action-item"><i class="fa fa-sync"></i></a> <div class="dropdown action-item" data-toggle="dropdown"> <a href="#" class="action-item"><i class="fa fa-ellipsis-h"></i></a> <div class="dropdown-menu dropdown-menu-right"> <a href="#" class="dropdown-item">Refresh</a> <a href="#" class="dropdown-item">Manage Widgets</a> <a href="#" class="dropdown-item">Settings</a> </div> </div> </div> </div> </div> </div> <div class="card-body text-center"> <a href="#" class="avatar rounded-circle avatar-lg hover-translate-y-n3"> <img alt="Image placeholder" src="' + image + '" class=""> </a> <h5 class="h6 my-4"><a href="/Home/AddTraining?id=' + value.TE_ID + '">' + value.TE_Name + '</a></h5> <div class="avatar-group hover-avatar-ungroup mb-3"> ' + smallIcon + ' </div> <span class="clearfix"></span> <span class="badge badge-pill ' + value.TE_Color + '">' + value.TE_Status + '</span> </div> <div class="card-footer"> <div class="actions d-flex justify-content-between px-4">  <a href="#" onclick="ModalBind(' + value.TE_ID + ')"  id="addEmployee_' + dynamicid + '" class="action-item  text-info"><i class="fa fa-user-plus"></i></a> <a href="javascript:void(0)" class="action-item text-success" onclick="UploadfilesModalbind(' + value.TE_ID + ')"> <i class="far fa-file"></i> </a> <a href="/home/TrainingPhase/?id=' + value.TE_ID + '&name=' + value.TE_Name + ' " class="action-item text-warning"> <i class="far fa-calendar"></i> </a></div> </div> </div> </div>');

                if (disable == 'Yes') {
                    $('#addEmployee_' + value.TE_ID).find("span").css("color", "gray");
                    $('#addEmployee_' + value.TE_ID).prop("onclick", null);
                }
                $("#totalPro").html(dynamicid);
                dynamicid = parseInt(dynamicid) + 1;
            });
                 
            $('.loader').hide();
                    
           

        }
    });

}


function btnbind(id, Empid) {
    var empId = Empid;

    id1 = $('#addbtnemployee' + id.toString());
    id2 = $('#btnsideicon' + id.toString());
    if ($(id1).hasClass("addbtn")) {
        $(id1).addClass("removebtn");
        $(id1).removeClass("addbtn");
        $(id2).addClass("ti-check");
        $(id2).removeClass("ti-plus");
        BindEmployeeArray(empId);
    }
    else {
        $(id1).addClass("addbtn");
        $(id1).removeClass("removebtn");
        $(id2).addClass("ti-plus");
        $(id2).removeClass("ti-check");
        RemoveFromEmployeeArray(empId);
        
    }
    
}




function ModalBind(TrainingId) {
    $('#trainingId').val(TrainingId);    
    var Role = $('#Role').val(); 
    var UM_MainID = $('#UM_MainID').val();
    if (Role == "E") {
        addedEmployee = [];
        var data_filter = EmployeewithTraining.filter(element => element.TE_ID == TrainingId && element.TWE_EmpId != UM_MainID);        
        BindEmployeeArray(UM_MainID);
        data_filter.forEach(function (item) {
            BindEmployeeArray(item.TWE_EmpId);
        })
        addedEmployee = DistinctRecords(addedEmployee, "TWE_EmpId");
        SaveRecords();
    }
    else {
        var _data = JSON.stringify({
            global: {

                param1: 'TWE_TE_Id',
                param1Value: parseInt(TrainingId),

            }
        });
        $.ajax({
            type: "POST",
            url: "/ScriptJson/GetEmployeeForTraningList",
            contentType: "application/json; charset=utf-8",
            data: _data,
            dataType: "json",
            async: false,
            success: function (data) {
                $('#simple-user-cards-employee').html('');
                var dynamicid = 1;

                $.each(data, function (index, value) {

                    var pic = value.EM_ProfilePic;
                    $('#simple-user-cards-employee').append(' <div class="col-xl-3 col-md-3 col-12"> <div class="card"> <div class="text-center"> <div class="card-body"> <div class="img-container-emp"> <img src="' + pic + '" class="rounded-circle" alt="Card image"> </div></div><h4 class="card-title">' + value.EM_EmpName + '</h4> <h5 class="card-title" style="font-size:12px;">' + value.EM_EmpCode + '</h5><button class="addbtn" id="addbtnemployee' + dynamicid + '" onclick="btnbind(' + dynamicid + ', ' + value.EM_EmpId + ')"><i class="ti-plus" id="btnsideicon' + dynamicid + '"></i></button> </div></div></div>');

                    if (value.EM_Status == "YES") {

                        id1 = $('#addbtnemployee' + dynamicid.toString());
                        id2 = $('#btnsideicon' + dynamicid.toString());
                        $(id1).addClass("removebtn");
                        $(id1).removeClass("addbtn");
                        $(id2).addClass("ti-check");
                        $(id2).removeClass("ti-plus");
                        empid = parseInt(value.EM_EmpId)
                        BindEmployeeArray(empid);
                    }
                    dynamicid = parseInt(dynamicid) + 1;
                });

            }
        });
        $('#assignEmployee').modal('show');
    }
}

function DistinctRecords(MYJSON, prop) {
    return MYJSON.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
})
}

function BindEmployeeArray(empid) {
    addedEmployee.push({
        TWE_EmpId: empid

    });  
 
   

}

function RemoveFromEmployeeArray(empid) {
    
    var index = addedEmployee.findIndex(x => x.TWE_EmpId === empid);
 
    if (index !== -1) {
        addedEmployee.splice(index, 1);
    }
   

    
}

$("#closebtn").on("click", function () {
    $("#closemodalalert").show();
});

$("#gotit").on("click", function () {
    $("#closemodalalert").fadeOut();
});

$(".closemodalalert-container").on("click", function () {
    $("#closemodalalert").fadeOut();
});

$("#addemployeebtn").on("click", function () {


    if (addedEmployee.length>0) {
        SaveRecords();
    }
    else {
       
        $("#noemployeeaddedmodalalert").show();
        
    }
});

$("#deleteall").on("click", function () {

    SaveRecords();

});


$("#cancelnoemployeeadded").on("click", function () {
    $("#noemployeeaddedmodalalert").fadeOut();
});

$(".noemployeeaddedmodalalert-container").on("click", function () {
    $("#noemployeeaddedmodalalert").fadeOut();
});

function SaveRecords() {


    var _data = JSON.stringify({
        tratinaloocation: {
            TWE_TE_Id: $('#trainingId').val(),
            TrainingWiseEmployee: addedEmployee

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateTrainingWiseEmployee",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            addedEmployee = [];
            
            if (data != null && data != undefined && data.IsSuccess == true) {
                Swal.fire({
                    title: "Good job!",
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
    $('#assignEmployee').modal('hide');
}

//Modal bind for upload files

function UploadfilesModalbind(Id) {
    $('#uploadfile-modal-body').html('');
    var html = '<div class="form-group">'             
                     + '<table id="uploadtable" style="width:100%">'
                         + '<tbody><tr>'
                             + '<td style="width:90%">'
                                 + '<div class="media-body mt-75">'
                                     + '<div class="form-group">'
                                         + '<input type="file" name="file" id="file" accept=".doc,.pdf,.png,.jpg,.gif,.jpeg,.bmp" class="custom-input-file" onchange="encodeImgtoBase64(this)">'
                                         + '<label for="file">'
                                             + '<i class="fa fa-upload"></i>'
                                             + '<span>Choose a file…</span>'
                                         + '</label>'

                                     + '</div>'
                                 + '</div>'
                             + '</td>'
                             + '<td style="width:10%;padding-left:7px;text-align:center;padding-bottom:10px;">'
                                 + '<a href="javascript:void(0);" class="btn btn-sm btn-icon-only rounded-circle bg-primary-light text-white" onclick="return saveFile()">'
                                     + '<span class="btn-inner--icon"><i class="fa fa-plus" data-toggle="tooltip" title="" data-original-title="Add new Document"></i></span>'
                                 + '</a>'

                             + '</td>'
                         + '</tr>'
                     + '</tbody></table>'
                 + '</div>'
                 + '</div>'
                 + ' <div class="modal-footer" style="border-top:1px solid #E4E4E4;">'
                     + '<a href="#" class="btn btn-link text-sm text-muted font-weight-bold">Cancel</a>'
                     + '<button type="button" class="btn btn-sm btn-primary rounded-pill" id="addUploadbtn" onclick="saveTrainingDoc()">Submit</button>'
                 + '</div>';
    var route = '@Url.Action("UploadFiles","Home")';
    $('#uploadfile-modal-body').append(html);
    trainingId = Id;
    BindTrainingWiseDocumentsList();
    $('#uploadfileModal').modal('show');
}

var pathStringDoc = "";
function BindDocumentArray(docPath, docName) {
    addDocument.push({
        TWD_Documents: docPath,
        TWD_DocName: docName
    });
}

function BindTrainingWiseDocumentsList() {
    $('.loader').show();

    var _data = JSON.stringify({
        global: {
            param1Value: trainingId
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/TrainingWiseDocumentsList",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var i = 1;
            $.each(data, function (index, value) {
                //BindDocumentArray(value.TWD_Documents);
                var extension = value.TWD_Documents.split(';')[0].split('/')[1];

                var filename = i + '.' + value.TWD_Documents.split(';')[0].split('/')[1];
                var n = value.TWD_Documents.length;
                var last2 = value.TWD_Documents.slice(-2);
                var y = 1;
                if (last2 == '==') {
                    y = 2;
                }
                var x = (n * (3 / 4)) - y;
                x = x / 1000;
                //$('#ulAppened').append('<li class="list-group-item px-0 dz-processing dz-image-preview"> <div class="row align-items-center"> <div class="col-auto"> <div class="avatar"> <a href="' + value.TWD_Documents.replace(/^data:image\/[^;]+/, 'data:application/octet-stream') + '" download="download.' + extension + '"> <img class="not-rounded" src=' + value.TWD_Documents+' alt="' + filename + '" data-dz-thumbnail=""></a> </div> </div> <div class="col"> <h6 class="text-sm mb-1" data-dz-name="">' + filename + '</h6> <p class="small text-muted mb-0" data-dz-size=""><strong>' + x +'</strong> KB</p> </div> <div class="col-auto">  </div> </div> </li>');
                $('#uploadtable').append('<tr> <td style="width:90%"> <div class="media-body mt-75"> <div class="form-group"><input type="file" onchange="rowwiseencodeImgtoBase64(this)" name="file_' + i + '[]" id="file_' + i + '" class="custom-input-file" data-multiple-caption="{count} files selected" multiple /><label for="file_' + i + '"><i class="fa fa-upload"></i><span>' + value.TWD_DocName + '</span><input type="hidden" class="hdndoc" value="' + value.TWD_DocName + '"></label> <span class="spndoc" style="display: none"> ' + value.TWD_Documents + '  </span></div> </div> </td> <td style="width:10%"> <a href="javascript:void(0)" onclick="removedoc(this)" class="dropdown-item btnX text-danger" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');

                i = i + 1;
            });
            $('.loader').hide();



        }
    });


}


function saveFile() {
    var fileUpload = $("#file").get(0);
    var files = fileUpload.files;
    if (files.length == 0) {
        Swal.fire({
            title: "Error!",
            text: 'Please Select a file to add',
            type: "error",
            confirmButtonClass: 'btn btn-primary',
            buttonsStyling: false,
        });
    }
    else {
        $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"><input type="file" id="file_1" name="file"  accept=".doc,.pdf,.png,.jpg,.gif,.jpeg,.bmp"  onchange="convertbase64(this)" class="custom-input-file"><label for="file"><i class="fa fa-upload"></i><span>' + files[0].name + '</span><input type="hidden" class="hdndoc" value="' + files[0].name + '"></label> <span class="spndoc" style="display: none"> ' + pathStringDoc + '  </span></div> </div> </td> <td style="width:20%"> <a href="javascript:void(0)" onclick="removedoc(this)" class="dropdown-item btnX text-danger" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');
        $("#file").next().find('span').text("Choose a file...");
    }

    // $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"> <span> ' + files[0].name + '  </span> <span class="rounded" style="display: none"> ' + $("#file").val() + '  </span></div> </div> </td> <td style="width:20%"> <a href="#" onclick="#" class="dropdown-item btnX" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');
}


function removedoc(a) {
    Swal({
        title: "Are you sure?",
        text: 'You will not be able to recover this file!',
        type: "warning",
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        cancelButtonClass: 'btn btn-light',
        confirmButtonClass: 'btn btn-primary',
        buttonsStyling: false,
    }).then(function (isConfirm) {
        debugger;
        if (isConfirm.value) {
            $(a).closest('tr').remove();
        }
    });

};

function saveTrainingDoc() {
    //$(".rounded").each(function () {
    //    BindDocumentArray( $(this).text() );
    //});
    $("#uploadtable tr").each(function () {
        if ($(this).index() != 0)
            BindDocumentArray($(this).find('.spndoc').text(), $(this).find('.hdndoc').val());

    });
    SaveRecords();
};

$("#deleteall").on("click", function () {

    SaveRecords();

});


$("#cancelnoemployeeadded").on("click", function () {
    $("#noemployeeaddedmodalalert").fadeOut();
});

$(".noemployeeaddedmodalalert-container").on("click", function () {
    $("#noemployeeaddedmodalalert").fadeOut();
});



function SaveRecords() {
    $('#addUploadbtn').prop('disabled', true);
    $("#addUploadbtn").html('Please Wait...');
    var _data = JSON.stringify({
        doc: {
            TWD_TE_Id: trainingId,
            TrainingWiseDocumentsList: addDocument
        }
    });



    $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateTrainingWiseDocuments",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            addDocument = [];
            if (data != null && data != undefined && data.IsSuccess == true) {
                Swal.fire({
                    title: "Files Uploaded Successfully!",
                    text: data.Message,
                    type: "success",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });
                $('#uploadfileModal').modal('hide');
            }
            else {
                addDocument = [];
                Swal.fire({
                    title: "Error!",
                    text: data.Message,
                    type: "error",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });
                $('#uploadfileModal').modal('hide');
            }
           
        },
        error: function (request, status, error) {
            addDocument = [];
            alert(request.responseText);
            $('#uploadfileModal').modal('hide');
        }


    });
    $('#addUploadbtn').prop('disabled', false);
    $("#addUploadbtn").html('Submit');
   
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function convertbase64(file) {
    var path;
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
        alert(reader.result);
        path = reader.result;
    };
    reader.onerror = function (error) {
        console.log('Error: ', error);
    };
    return path;
}
function encodeImgtoBase64(element) {
    pathStringDoc = "";
    var img = element.files[0];
    $(element).next().find('span').text(img.name);
    var reader = new FileReader();
    reader.onloadend = function () {
        pathStringDoc = reader.result;
    }
    reader.readAsDataURL(img);
}
function rowwiseencodeImgtoBase64(element) {
    pathStringDoc = "";
    var img = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        pathStringDoc = reader.result;
        $(element).closest('tr').find('.hdndoc').val(img.name);
        $(element).next().find('span').text(img.name);
        $(element).closest('tr').find('.spndoc').text(pathStringDoc);
    }
    reader.readAsDataURL(img)


}
