var addDocument = [];
var trainingId;
var count = 1;
var pathStringDoc = "";
function BindDocumentArray(docPath, docName) {
    addDocument.push({
        CD_Document: docPath,
        CD_DocName: docName
    });
}


var formElem = $("#frmClient");
var path;
var pathString;
$(document).ready(function () {
    InitUI();

    var Id = getParameterByName('Id')
    var Mode = getParameterByName('mode')
    if (Id != '') {

        retrive(Id);

    }
    if (Mode == "v") {
        $('.form-control').attr("disabled", "disabled");
    }

});

var pathString = "";
var user_image = "";


function InitUI() {

    DropdownBinder.DDLData = {
        tableName: "ProjectIndustryMaster_PIM",
        Text: 'PIM_Name',
        Value: 'PIM_Id'
    };

    DropdownBinder.DDLElem = $("#IndustryId");

    DropdownBinder.Execute();
}

function CorporateClientValidate() {
    $(".error").remove();
    var CorporateName = $("#CorporateName").val();
    var TradingName = $("#TradingName").val();
    var RegistrationNo = $("#CIPC_RegistrationNo").val();
    var VatNo = $("#SARS_VATNo").val();
    var Address = $("#Address").val();
    var ContactPersonName = $("#ContactPersonName").val();
    var ContactPersonEmail = $("#ContactPersonEmail").val();
    var Zipcode = $("#Zipcode").val();
    var PostalAddress = $("#PostalAddress").val();
    var PhoneNo = $("#PhoneNo").val();
    var Email = $("#Email").val();
    var IndustryId = $("#IndustryId").val();
    var ContactPersonPhNo = $("#ContactPersonPhNo").val();

    var MailVal = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (CorporateName == "") {
        $("#CorporateName").after('<span class="error">Please enter Corporate Name.</span>');
        return false;
    }
        //else if (TradingName == "") {
        //    $("#TradingName").after('<span class="error">Please enter Trading Name.</span>');
        //    return false;
        //}
    else if (RegistrationNo == "") {
        $("#CIPC_RegistrationNo").after('<span class="error">Please enter Registration No.</span>');
        return false;
    }
        //else if (VatNo == "") {
        //    $("#SARS_VATNo").after('<span class="error">Please enter Vat No.</span>');
        //    return false;
        //}
    else if (Address == "") {
        $("#Address").after('<span class="error">Please enter Address.</span>');
        return false;
    }
        //else if (ContactPersonName == "") {
        //    $("#ContactPersonName").after('<span class="error">Please enter Contact Person Name.</span>');
        //    return false;
        //}
        //else if (ContactPersonName == "") {
        //    $("#ContactPersonName").after('<span class="error">Please enter Contact Person Name.</span>');
        //    return false;
        //}
        //else if (ContactPersonEmail == "") {
        //    $("#ContactPersonEmail").after('<span class="error">Please enter Contact Person Email.</span>');
        //    return false;
        //}
        //else if (MailVal.test(ContactPersonEmail) == false) {
        //    $("#ContactPersonEmail").after('<span class="error">Please enter Proper Email.</span>');
        //    return false;
        //}
    else if (Zipcode == "") {
        $("#Zipcode").after('<span class="error">Please enter Zipcode.</span>');
        return false;
    }
    else if (PostalAddress == "") {
        $("#PostalAddress").after('<span class="error">Please enter PostalAddress.</span>');
        return false;
    }
    else if (PhoneNo == "") {
        $("#PhoneNo").after('<span class="error">Please enter Phone No.</span>');
        return false;
    }
    else if (Email == "") {
        $("#Email").after('<span class="error">Please enter Email.</span>');
        return false;
    }
    else if (MailVal.test(Email) == false) {
        $("#Email").after('<span class="error">Please enter Proper Email.</span>');
        return false;
    }
    else if (IndustryId == "") {
        $("#IndustryId").after('<span class="error">Please enter Industry Id.</span>');
        return false;
    }
    //else if (ContactPersonPhNo == "") {
    //    $("#ContactPersonPhNo").after('<span class="error">Please enter Contact Person PhNo.</span>');
    //    return false;
    //}
    return true;
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
function saveFile() {

    var fileUpload = $("#file-1").get(0);
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
        //alert($("#file").val().substring(12));
        $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"><input type="file" id="file_1" name="file"  accept=".doc,.pdf,.png,.jpg,.gif,.jpeg,.bmp"  onchange="convertbase64(this)" class="custom-input-file"><label for="file"><i class="fa fa-upload"></i><span>' + files[0].name + '</span><input type="hidden" class="hdndoc" value="' + files[0].name + '"></label> <span class="spndoc" style="display: none"> ' + pathStringDoc + '  </span></div> </div> </td> <td style="width:20%"> <a href="javascript:void(0)" onclick="removedoc(this)" class="dropdown-item btnX text-danger" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');
        $("#file-1").next().find('span').text("Choose a file...");
    }
}


$("#check_group1").change(function () {
    if (document.getElementById('check_group1').checked == true) {
        var CC_AddressTemp = $.trim($("#Address").val());
        $('#PostalAddress').val(CC_AddressTemp);
    }
    else {
        $('#PostalAddress').val('');
    }
});


function SaveRecord(type) {
    //if (!formElem.valid()) {
    //    return false;
    //}

    //Validation   



    if (CorporateClientValidate() == false) {
        return false;
    }

    $('#btnSubmit').prop('disabled', true);
    $('#btnSubmit').html('Please wait...');

    $("#uploadtable tr").each(function () {
        if ($(this).index() != 0)
            BindDocumentArray($(this).find('.spndoc').text(), $(this).find('.hdndoc').val());

    });

    var _data = JSON.stringify({
        client: {
            CC_Id: parseInt($("#Id").val()),
            CC_CorporateName: $.trim($("#CorporateName").val()),
            CC_TradingName: $.trim($("#TradingName").val()),
            CC_CIPC_RegistrationNo: $.trim($("#CIPC_RegistrationNo").val()),
            CC_SARS_VATNo: $.trim($("#SARS_VATNo").val()),
            CC_Address: $.trim($("#Address").val()),
            CC_Zipcode: $.trim($("#Zipcode").val()),
            CC_PostalAddress: $.trim($("#PostalAddress").val()),
            CC_PhoneNo: $.trim($("#PhoneNo").val()),
            CC_Email: $.trim($("#Email").val()),
            CC_ContactPersonName: $.trim($("#ContactPersonName").val()),
            CC_Logo: $.trim(pathString),
            CC_PIM_Id: $("#IndustryId").val(),
            UM_AssesmentGiven: false,
            CC_ContactPersonEmail: $.trim($("#ContactPersonEmail").val()),
            CC_ContactPersonPhNo: $.trim($("#ContactPersonPhNo").val()),
            CorporateClientDocumentList: addDocument
        }

    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/InsertUpdateCorporateClient',
        data: _data,
        async: false,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                if (data.Id > 0) {
                    Swal.fire({
                        title: "Good job!",
                        text: data.Message,
                        type: "success",
                        confirmButtonClass: 'btn btn-primary',
                        buttonsStyling: false,
                    });
                    addDocument = [];
                    window.location.href = "/Home/CorporateClientCardList"
                    $('.form-control').val('');
                    if (type == "P") {
                        window.location.href = "/Home/CorporateClientCardList"

                    }
                }
                else if (data.Id == -2) {
                    Swal.fire({
                        title: "Warning!",
                        text: " Email Already Exists..",
                        type: "warning",
                        confirmButtonClass: "btn btn-primary",
                        buttonsStyling: !1
                    });
                }
            }
                //else {
                //    window.location.reload();
                //}
                //}
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

    $('#btnSubmit').prop('disabled', false);
    $('#btnSubmit').html('Submit');
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
function retrive(id) {
    var _data = JSON.stringify({
        global: {
            TransactionType: globalData.TransactionType,
            param1: globalData.param1,
            param1Value: parseInt(id),
            StoreProcedure: globalData.StoreProcedure
        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetSelectCorporateClient",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {


            if (data['CC_Logo'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['CC_Logo']);
                pathString = data['CC_Logo'];
                user_image = data['CC_Logo'];
            }
            $('#Id').val(data["CC_Id"]);
            $('#CorporateName').val(data["CC_CorporateName"]);
            $('#TradingName').val(data["CC_TradingName"]);
            $('#CIPC_RegistrationNo').val(data["CC_CIPC_RegistrationNo"]);
            $('#SARS_VATNo').val(data["CC_SARS_VATNo"]);
            $('#Address').val(data["CC_Address"]);
            $('#Zipcode').val(data["CC_Zipcode"]);

            $('#PostalAddress').val(data["CC_PostalAddress"]);
            $('#PhoneNo').val(data["CC_PhoneNo"]);
            $('#Email').val(data["CC_Email"]);
            $("#ContactPersonName").val(data["CC_ContactPersonName"]);
            $("#IndustryId").val(data["CC_PIM_Id"]);
            $("#ContactPersonEmail").val(data["CC_ContactPersonEmail"]);
            $("#ContactPersonPhNo").val(data["CC_ContactPersonPhNo"]);
            var i = 1;
            $.each(data.CorporateClientDocumentList, function (index, value) {
                //BindDocumentArray(value.TWD_Documents);
                debugger;
                var extension = value.CD_Document.split(';')[0].split('/')[1];

                var filename = i + '.' + value.CD_Document.split(';')[0].split('/')[1];
                var n = value.CD_Document.length;
                var last2 = value.CD_Document.slice(-2);
                var y = 1;
                if (last2 == '==') {
                    y = 2;
                }
                var x = (n * (3 / 4)) - y;
                x = x / 1000;
                // $('#ulAppened').append('<li class="list-group-item px-0 dz-processing dz-image-preview"> <div class="row align-items-center"> <div class="col-auto"> <div class="avatar"> <a href="' + value.CD_Document.replace(/^data:image\/[^;]+/, 'data:application/octet-stream') + '" download="download.' + extension + '"> <img class="not-rounded" src=' + value.CD_Document + ' alt="' + filename + '" data-dz-thumbnail=""></a> </div> </div> <div class="col"> <h6 class="text-sm mb-1" data-dz-name="">' + filename + '</h6> <p class="small text-muted mb-0" data-dz-size=""><strong>' + x + '</strong> KB</p> </div> <div class="col-auto">  </div> </div> </li>');
                //  $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"><input type="file" id="file_1" name="file"  accept=".doc,.pdf,.png,.jpg,.gif,.jpeg,.bmp"  onchange="convertbase64(this)" class="custom-input-file"><label for="file"><i class="fa fa-upload"></i><span>' + value.CD_DocName + '</span><input type="hidden" class="hdndoc" value="' + value.CD_DocName + '"></label> <span class="spndoc" style="display: none"> ' + value.CD_Document.replace(/^data:image\/[^;]+/, 'data:application/octet-stream') + '  </span></div> </div> </td> <td style="width:20%"> <a href="javascript:void(0)" onclick="removedoc(this)" class="dropdown-item btnX text-danger" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');
                $('#uploadtable').append('<tr> <td style="width:80%"> <div class="media-body mt-75"> <div class="form-group"><input type="file" onchange="rowwiseencodeImgtoBase64(this)" name="file_' + i + '[]" id="file_' + i + '" class="custom-input-file" data-multiple-caption="{count} files selected" multiple /><label for="file_' + i + '"><i class="fa fa-upload"></i><span>' + value.CD_DocName + '</span><input type="hidden" class="hdndoc" value="' + value.CD_DocName + '"></label> <span class="spndoc" style="display: none"> ' + value.CD_Document + '  </span></div> </div> </td> <td style="width:20%"> <a href="javascript:void(0)" onclick="removedoc(this)" class="dropdown-item btnX text-danger" data-dz-remove> <i class="fa fa-trash-alt"></i> </a> </td> </tr>');

                i = i + 1;
            });
        },
        error: function (data) {

        }
    });
    return false;

}

$("#account-upload").change(function () {
    if (typeof (FileReader) != "undefined") {
        var dvPreview = $(".pic");
        dvPreview.html("");
        var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.jpg|.jpeg|.gif|.png|.bmp)$/;

        var fileSize = this.files[0].size / 1024;

        if (fileSize >= 1 && fileSize <= 100) {

            $($(this)[0].files).each(function () {
                var file = $(this);
                if (regex.test(file[0].name.toLowerCase())) {
                    var reader = new FileReader();
                    reader.onload = function (e) {
                        var img = $("<img />");
                        img.css({ "height": "70px", "width": "80px", "cursor": "pointer" });
                        img.attr("src", e.target.result);
                        dvPreview.html(img);
                        pathString = e.target.result;

                    }
                    reader.readAsDataURL(file[0]);
                }
                else {

                    dvPreview.html("");
                    return false;
                }
            });
        }
        else {

            Swal.fire({
                title: "Error!",
                text: 'Please check file size.50 KB To 100 Kb',
                type: "error",
                confirmButtonClass: 'btn btn-primary',
                buttonsStyling: false,
            });

            dvPreview.html("");
            return false;
        }
    }
    else {

    }
});

function clearImgs() {
    $('#profile_pic').val(null).change().clone(true);

    if (user_image != "") {
        $('.media').html('<img id="user_image" src="' + user_image + '" alt="profile image" height="100" width="100" style="border-radius: 50%" />');
    }
    else {
        $('.media').html('<img id="user_image" src="../Content/WebContent/assets/icons/myavatar.png" alt="profile image" height="100" width="100" style="border-radius: 50%" />');
    }
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
    }).then(
    function (isConfirm) {
        if (isConfirm.value) {
            $(a).closest('tr').remove();
        }
    });
}



