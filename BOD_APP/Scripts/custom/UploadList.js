var addDocument = [];
var trainingId;
var pathStringDoc = "";
function BindDocumentArray(docPath, docName) {
    addDocument.push({
        TWD_Documents: docPath,
        TWD_DocName: docName
    });
}



$(document).ready(function () {
    trainingId = getParameterByName('id');
    BindTrainingWiseDocumentsList();

});
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
        $("#file-1").next().find('span').text("Choose a file...");
    }

    // $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"> <span> ' + files[0].name + '  </span> <span class="rounded" style="display: none"> ' + $("#file").val() + '  </span></div> </div> </td> <td style="width:20%"> <a href="#" onclick="#" class="dropdown-item btnX" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');
}


$(document).on('click', '.btnX', function () {
    var a = this;
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
    }).then(
  function (isConfirm) {
      if (isConfirm.value) {
          $(a).closest('tr').remove();
      }
  });

});

$("#addUploadbtn").on("click", function () {
    //$(".rounded").each(function () {
    //    BindDocumentArray( $(this).text() );
    //});
    $("#uploadtable tr").each(function () {
        if ($(this).index() != 0)
            BindDocumentArray($(this).find('.spndoc').text(), $(this).find('.hdndoc').val());

    });
    SaveRecords();
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
    $('#btnSubmit').prop('disabled', true);
    $("#btnSubmit").html('Please Wait...');
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
                    title: "Good job!",
                    text: data.Message,
                    type: "success",
                    confirmButtonClass: 'btn btn-primary',
                    buttonsStyling: false,
                });
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
            }
            $('#btnSubmit').prop('disabled', false);
            $("#btnSubmit").html('Submit');
        },
        error: function (request, status, error) {
            addDocument = [];
            alert(request.responseText);
        }

    });

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
