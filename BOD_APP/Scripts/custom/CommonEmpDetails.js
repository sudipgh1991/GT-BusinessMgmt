$(document).ready(function () {

    var Id = getParameterByName('Id')
    var SMId = getParameterByName('SMId')
    var Mode = getParameterByName('Mode')


    if (Mode == "O") {

        $('#hdnUserId').val(SMId);
    }
    if (Id != '') {

        {
          
            retriveEmployeeDetails(Id);
        }
    }

});

function retriveEmployeeDetails(id) {
  
    var _data = JSON.stringify({
        emp: {
            EM_EmpId: parseInt(id)
        }
    });
    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetEmployeeMaster",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {

            if (data['EM_ProfilePic'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['EM_ProfilePic']);
                pathString = data['EM_ProfilePic'];
                user_image = data['EM_ProfilePic'];
            }
           
          
            $('#ParName').text(data["EM_EmpName"]);
            $('#ParEmp').text(data["EM_EmpCode"]);

            $('#ParDoj').text(data["EM_EmpDOJ"]);
            $('#ParDob').text(data["EM_DOB"]);
            $('#ParMail').text(data["EM_Email"]);
            $('#ParCn').text(data["EM_EmpContactNo"]);
            $('#ParDesig').text(data["EM_Designation"]);
            $('#ParNin').text(data["EM_NIDNo"]);
            $('#ParHq').text(data["EM_Degree"]);


            

           $('#hdnId').val(data["EM_EmpId"]);
            //var divHTML = '';

            //divHTML = "<h4  class='media-heading'><span class=users-view-name'>" + data["EM_EmpName"] + "</span></h4><span>Emp Code: </span><span class='users-view-id'>" + data["EM_EmpCode"] + "</span>";
            //$('#divEmpnameCode').append(divHTML)

            //var trHTML = '';

            //trHTML = "<tr><td>Date of Joining:</td><td>" + data["EM_EmpDOJ"] + "</td></tr><tr><td>D.O.B:</td><td>" + data["EM_DOB"] + "</td></tr> <tr><td>Email:</td><td>" + data["EM_Email"] + "</td></tr><tr><td>Contact Number:</td><td>" + data["EM_EmpContactNo"] + "</td></tr>";
            //$('#tblempdetails').append(trHTML)

            //var trHTML1 = '';

            //trHTML1 = "<tr><tr><td>Designation:</td><td>" + data["EM_Designation"] + "</td></tr><tr><td>National ID Number:</td><td>" + data["EM_NIDNo"] + "</td></tr><tr><td>Highest Qualification:</td><td>" + data["EM_Degree"] + "</td></tr>";
            //$('#tbledetails').append(trHTML1)


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
