//$(window).load(function () {
//    setTimeout(function () {
//        $('#loading').fadeOut(400, "linear");
//    }, 300);

//});
$(function () {
    "use strict";
    $('.bootstrap-datepicker').bsdatepicker({
        format: 'dd/mm/yyyy',
        autoclose: true
    });
});
$(function () {
    "use strict";
    $('.timepicker-example').timepicker();
});

$.validator.addMethod("dateGreaterThan",
    function (value, element, params) {
        if ($(params).val() === "")
            return true;

        if (!/Invalid|NaN/.test(parseDMY(value))) {
            return parseDMY(value) > parseDMY($(params).val());
        }

        return isNaN(value) && isNaN($(params).val())
         || (Number(value) > Number($(params).val()));
    }, function (params, element) {
        return 'Must be greater than ' + $(params).val();
    });

$.validator.addMethod("dateLessThan",
    function (value, element, params) {
        if ($(params).val() === "")
            return true;

        if (!/Invalid|NaN/.test(parseDMY(value))) {
            return parseDMY(value) < parseDMY($(params).val());
        }

        return isNaN(value) && isNaN($(params).val())
         || (Number(value) < Number($(params).val()));
    }, function (params, element) {
        return 'Must be less than ' + $(params).val();
    });

function parseDMY(value) {
    var date = value.split("/");
    var d = parseInt(date[0], 10),
        m = parseInt(date[1], 10),
        y = parseInt(date[2], 10);
    return new Date(y, m - 1, d);
}

/**
 * Return true, if the value is a valid date, also making this formal check dd/mm/yyyy.
 *
 * example $.validator.methods.date("01/01/1900")
 * result true
 *
 * example $.validator.methods.date("01/13/1990")
 * result false
 *
 * example $.validator.methods.date("01.01.1900")
 * result false
 *
 * example <input name="pippo" class="{dateITA:true}" />
 * desc Declares an optional input element whose value must be a valid date.
 *
 * name $.validator.methods.dateITA
 * type Boolean
 * cat Plugins/Validate/Methods
 */
$.validator.addMethod("dateITA", function (value, element) {
    var check = false,
        re = /^\d{1,2}\/\d{1,2}\/\d{4}$/,
        adata, gg, mm, aaaa, xdata;
    if (re.test(value)) {
        adata = value.split("/");
        gg = parseInt(adata[0], 10);
        mm = parseInt(adata[1], 10);
        aaaa = parseInt(adata[2], 10);
        xdata = new Date(Date.UTC(aaaa, mm - 1, gg, 12, 0, 0, 0));
        if ((xdata.getUTCFullYear() === aaaa) && (xdata.getUTCMonth() === mm - 1) && (xdata.getUTCDate() === gg)) {
            check = true;
        } else {
            check = false;
        }
    } else {
        check = false;
    }
    return this.optional(element) || check;
}, $.validator.messages.date);


/*
 * Lets you say "at least X inputs that match selector Y must be filled."
 *
 * The end result is that neither of these inputs:
 *
 *	<input class="productinfo" name="partnumber">
 *	<input class="productinfo" name="description">
 *
 *	...will validate unless at least one of them is filled.
 *
 * partnumber:	{require_from_group: [1,".productinfo"]},
 * description: {require_from_group: [1,".productinfo"]}
 *
 * options[0]: number of fields that must be filled in the group
 * options[1]: CSS selector that defines the group of conditionally required fields
 */
$.validator.addMethod("require_from_group", function (value, element, options) {
    var $fields = $(options[1], element.form),
        $fieldsFirst = $fields.eq(0),
        validator = $fieldsFirst.data("valid_req_grp") ? $fieldsFirst.data("valid_req_grp") : $.extend({}, this),
        isValid = $fields.filter(function () {
            return validator.elementValue(this);
        }).length >= options[0];

    // Store the cloned validator for future validation
    $fieldsFirst.data("valid_req_grp", validator);

    // If element isn't being validated, run each require_from_group field's validation rules
    if (!$(element).data("being_validated")) {
        $fields.data("being_validated", true);
        $fields.each(function () {
            validator.element(this);
        });
        $fields.data("being_validated", false);
    }
    return isValid;
}, $.validator.format("Please fill at least {0} of these fields."));

$("#alrtmainDiv .alert-close-btn").click(function () {
    //alert("Test,,,,");
    $("#alrtmainDiv").hide("slow");
});

//--------------------Alert-----------------------------------//

function SuccessAlert(message) {
    CommonAlert(message, "success");
}

function DangerAlert(message) {
    CommonAlert(message, "danger");
}

function WarningAlert(message) {
    CommonAlert(message, "warning");
}

function InfoAlert(message) {
    CommonAlert(message, "info");
}

function CommonAlert(message, type) {
    var alertClass = "";
    var iconClass = "";
    if (type == "success") {
        alertClass = "success";
        iconClass = "green";
    }
    else if (type == "info") {
        alertClass = "info";
        iconClass = "blue";
    }
    else if (type == "warning") {
        alertClass = "warning";
        iconClass = "warning";
    }
    else if (type == "danger") {
        alertClass = "danger";
        iconClass = "red";
    }
    $("#alrtmainDiv").addClass("alert alert-" + alertClass);
    $("#alrtSub").addClass("bg-" + iconClass + " alert-icon");
    $("#alrtI").addClass(" glyph-icon icon-check");
    $("#alrtmainDiv").show();
    $("#alrtP").html(message);
}