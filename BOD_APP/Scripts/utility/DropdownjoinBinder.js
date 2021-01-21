var DropdownjoinBinder = {
  DDLData: {},
  DDLElem: {},
  DDLLebel: {},
  Execute: function () {
    var _data = JSON.stringify({
      data: this.DDLData
    });

    var resp = {};
    var respData = {};

    $.ajax({
      type: "POST",
      url: "/ScriptJson/DropDownJoinPopulation",
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
      BindDDL(this.DDLElem, respData, this.DDLLebel.Lbl);
    } else {
      //showMessage("Unable to process the request...", 0);
    }
  }

}
function BindDDL(ddl, dataCollection, lbl) {
  //$(ddl).get(0).length = 0;
  $(ddl).html('');
  $(ddl).append(new Option(lbl, ""));
  for (var i = 0; i < dataCollection.length; i++) {
    $(ddl).append(new Option(dataCollection[i].Text, dataCollection[i].Value));
  }
}