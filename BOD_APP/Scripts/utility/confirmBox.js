
function deleteconfirmBoxClick(id,type) {
    var ret;
    $.confirm({
        title: "Delete Contents..",
        content: "Are you sure you want to delete?",
        theme: 'material',
        type: 'red',
        buttons: {
            confirm: function () {
                var retMsg = DeleteTransactionRecord(id,type);
                $.alert(retMsg);
                window.location.reload();
            },
            cancel: function () {
                btnClass: 'btn-red',
                $.alert("Cancel..");

            }


        }
    });


}
function DeleteTransactionRecord(id,type) {
    var retVal;

    var _data = JSON.stringify({
        del: {
            DelId: parseInt(id),
            TransactionType: type,


        }
    }); $.ajax({
        type: "POST",
        url: "/ScriptJson/GlobalDeleteTransaction",
        data: _data,
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async:false,
        success: function (data) {
            if (data != null && data != undefined && data.IsSuccess == true) {
                
                retVal = data.Message;
            }
            else {
                retVal = data.Message;
            }
        },
        error: function (data) {
            retVal = "Process Fails....";
        }
    });
    return retVal;
}