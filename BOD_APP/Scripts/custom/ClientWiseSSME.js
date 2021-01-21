$(document).ready(function () {
    InitUI();
    retrive();
    var clientid = getParameterByName('clientid');
    $('#ddlClient').val(clientid);
});

function InitUI() {
    DropdownBinder.DDLData = {
        tableName: "CorporateClient_CC",
        Text: 'CC_CorporateName',
        Value: 'CC_Id'
    };
    DropdownBinder.DDLElem = $("#ddlClient");
    DropdownBinder.Execute();
}

function RefreshTable()
{
    retrive();

}
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function SaveRecords() {
    var smme = [];


    $('#multiple-list-group-b li').each(function () {
        smme.push({
            CWS_SMMEId: parseInt(this.id)
        });
    });





    var _data = JSON.stringify({
        project: {
            PE_Id: $('#ddlClient').val(),
            ClientWiseSMME: smme

        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/InsertUpdateClienttWiseSMME",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        success: function (data) {
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
}

function retrive() {

    var _data = JSON.stringify({
        global: {
            TransactionType: 'Select',
            param1: 'CWS_ClientId',
            param1Value: parseInt($('#ddlClient').val()),
            StoreProcedure: 'ClientWiseSMME_USP',
        }
    });

    $.ajax({
        type: "POST",
        url: '/ScriptJson/ClientWiseSMME',
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
           
            if (data.SmmeList.length > 0) {
                console.log(data.SmmeList)
                var nonselectedli = '';
                var selectedli = '';
                $("#multiple-list-group-a").html('');
                $("#multiple-list-group-b").html('');
                for (var i = 0; i < data.SmmeList.length; i++) {
                   // alert(data.SmmeList[i].CWS_SMMEId)
                    if (data.SmmeList[i].CWS_SMMEId == 0)
                    {
                        nonselectedli = nonselectedli + '<li class="list-group-item list" id="' + data.SmmeList[i].SM_Id +'"><div class="media">'
                           
                        nonselectedli = nonselectedli + '<img src=" ' + data.SmmeList[i].SM_Image +'" class="rounded-circle mr-2" alt="img-placeholder" height="50" width="50"><div class="media-body">'
                                   
                        nonselectedli = nonselectedli + '<h5 class="mt-0 name">' + data.SmmeList[i].SM_CorporateName +'</h5>'
                        nonselectedli = nonselectedli + '<p class="name"> ' + data.SmmeList[i].SM_PostalAddress +'</p></div> </div> </li>'
                    }
                   

                    
                }
                for (var i = 0; i < data.SmmeList.length; i++) {
                    // alert(data.SmmeList[i].CWS_SMMEId)
                    if (data.SmmeList[i].CWS_SMMEId !=0) {
                        selectedli = selectedli + '<li class="list-group-item list" id="' + data.SmmeList[i].SM_Id + '"><div class="media">'

                        selectedli = selectedli + '<img src=" ' + data.SmmeList[i].SM_Image + '" class="rounded-circle mr-2" alt="img-placeholder" height="50" width="50"><div class="media-body">'

                        selectedli = selectedli + '<h5 class="mt-0 name">' + data.SmmeList[i].SM_CorporateName + '</h5>'
                        selectedli = selectedli + '<p class="name"> ' + data.SmmeList[i].SM_PostalAddress + '</p></div> </div> </li>'
                    }
                  


                }
                $("#multiple-list-group-b").append(selectedli);
                $("#multiple-list-group-a").append(nonselectedli);
             


            }

        },
        error: function (data) {

        }
    });
    return false;

}