
$(document).ready(function () {
  var Id = getParameterByName('Id')
  if (Id != '') {
    
      retriveGlobalData(Id);

    }

});




function retriveGlobalData(id) {
  
    var _data = JSON.stringify({
        global: {
            TransactionType: 'SelectExpenses',
            param1: 'PWE_ProjectId',
            param1Value: parseInt(id),
            StoreProcedure: 'ProjectWiseExpenses_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/GetProjectWiseExpenses',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data['PE_Image'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['PE_Image']);
                pathString = data['PE_Image'];
                user_image = data['PE_Image'];
            }

            //$('#projectName').text('Project : ' + data["PE_ProjectName"])
            $('#projectName').text($.trim(data["PE_ProjectName"]));
            $('#client').text(data["CC_CorporateName"]);
            $('#startdate').text(data["PE_StartDate"]);
            $('#enddate').text(data["PE_EndDate"]);
            $('#hdnProject').val(data["PE_Id"]);
            $('#pDesc').text(data["PE_Description"]);
            
            $('#Income').data('to', data["TotalIncome"]);
            $('#Expense').data('to', data["TotalExpenses"]);

            $('#Activity').text(data["PE_TotalActivity"]);
            $('#Task').text( data["PE_TotalTask"]);
        },
        error: function (data) {

        }
    });
    return false;

}


function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
           results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
