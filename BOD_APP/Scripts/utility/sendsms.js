

function SendSMS() {
    var _data = JSON.stringify({
        data: {

            TransactionType: 'SelectForSMS',
            param1: 'ST_SMSCategoryId',
            param1Value: parseInt(DataList.SMSCategory),
            paramString:DataList.ContactNo,
            StoreProcedure: 'SMSTemplate_USP',
            paramString3: DataList.Name,
            paramString2: DataList.Amount,
        }
    });

    $.ajax({
        type: "POST",
        url: "/ScriptJson/SendSMSGlobal",
        contentType: "application/json; charset=utf-8",
    data: _data,
    dataType: "json",
    async: false,
    success: function (data) {
       

    },
    error: function (data) {
       
    }
});
return false;

}
