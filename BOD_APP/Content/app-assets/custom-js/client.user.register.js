function OnBegin() {
    BtnDisabled();
}

function OnSuccess(data) {
    if (data.IsUserIDExist) {
        $(".err-msg").fadeIn(500);
        $(".err-msg").fadeOut(1500);
        BtnEnabled();
    }
    else if (data.IsEmailExist) {
        $(".err-msg2").fadeIn(500);
        $(".err-msg2").fadeOut(1500);
        BtnEnabled();
    }
    else if (data.CMId == 0) {
        $(".alert-msg").fadeIn(500);
        $(".alert-msg").fadeOut(1500);
        BtnEnabled();
    }
    else {
        window.location.href = "/Account/RegisterClientUserNextStep";
    }
}


function OnFailure(data) {
    var form = this;
    var errorResponse = data.responseJSON;
    $.each(errorResponse, function (index, value) {
        var element = $(form).find("[name$='" + value.key + "'");
        element = element[0];        
        var validationMessageElement = $('span[data-valmsg-for="' + value.key + '"]');
        validationMessageElement.removeClass('field-validation-valid');
        validationMessageElement.addClass('field-validation-error');
        validationMessageElement.text(value.errors[0]);
    });
    BtnEnabled();
}

function BtnDisabled(){
    $(".register").prop('disabled', true);
    $(".btn-user-logo").fadeOut(500);
    $(".btn-spinner-logo").fadeIn(500);
}

function BtnEnabled() {
    $(".btn-user-logo").fadeIn(500);
    $(".btn-spinner-logo").fadeOut(500);
    $(".register").prop('disabled', false);
}
function encodeImgtoBase64(element, id) {
   // alert(id);
    var img = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function () {
        $('input[name="' + id + '"]').val(reader.result);
    }
    reader.readAsDataURL(img);
}


$(document).off('change', '.sameAdd').on('change', '.sameAdd', function (e) {
    if ($(this).is(":checked")) {
       
        $("#CC_PostalAddress").val($("#CC_Address").val());
    }
    else {
        $("#CC_PostalAddress").val("");
    }
});