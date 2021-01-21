
$(document).ready(function () {
  var Id = getParameterByName('Id')
  if (Id != '') {
    
        retrive(Id);

    }

});




function retrive(id) {
  
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

           
            $('#projectName').text($.trim(data["PE_ProjectName"]));
          
            $('#startdate').text(data["PE_StartDate"]);
          $('#enddate').text(data["PE_EndDate"]);
            $('#hdnProject').val(data["PE_Id"]);
            $('#pDesc').text(data["PE_Description"]);
            

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
