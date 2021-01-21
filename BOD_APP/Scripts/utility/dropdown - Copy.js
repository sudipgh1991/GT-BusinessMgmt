var DropdownBinder = {
    DDLData: {},
    DDLElem: {},
    Execute: function () {
        var _data = JSON.stringify({
            data: this.DDLData
        });

        var resp = {};
        var respData = {};

        $.ajax({
            type: "POST",
            url: "/ScriptJson/DropDownPopulation",
            data: _data,
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            async: false,
            success: function (data, status) {
                //if (status == "success") {
                //    BindDropDownList(this.DDLElem, data);
                //} else {
                //    showMessage("Unable to process the request...", 0);
                //}
                resp = status;
                respData = data;
            }
        });

        if (resp == "success") {
            BindDDL(this.DDLElem, respData);
        } else {
            //showMessage("Unable to process the request...", 0);
        }
    }

}
function BindDDL(ddl, dataCollection) {
    //$(ddl).get(0).length = 0;
    $(ddl).append(new Option("Select", ""));
    for (var i = 0; i < dataCollection.length; i++) {
        $(ddl).append(new Option(dataCollection[i].Text, dataCollection[i].Value));
    }
}
function AjaxPostForDDL() {
    var _data = JSON.stringify({
        data: {
            tableName: "CompanyMaster_CM",
            Text: 'CM_Name',
            Value: 'CM_Id'
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/DropDownPopulation",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data, status) {
            if (status == "success") {
                BindDropDownList($('#ddldemo'), data);
            } else {
                showMessage("Unable to process the request...", 0);
            }
        }
    });
}