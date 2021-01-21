$(document).ready(function () {

    InitUI();
   

});
function InitUI() {
   
    BindGridForAgent();
}
function BindGridForAgent() {
    var _data = JSON.stringify({
        global: {
            TransactionType: globalData.TransactionType,
            Param: globalData.Param,
            //paramValue: parseInt(id),
            StoreProcedure: globalData.StoreProcedure
        }
    });

    $.ajax({
        type: "POST",
        url: URLList.GetList,
        contentType: "application/json; charset=utf-8",
        data: _data,
        dataType: "json",
        success: function (data, status) {
            //data = JSON.parse(data);
            var oTable = $('#page-length-option').DataTable({

                "oLanguage": {
                    "sSearch": "Search all columns:"
                },
                "aaData": data,

                //"aoColumns": [{ "mDataProp": "Id" },
                //{ "mDataProp": "Name" },
                //{ "mDataProp": "MobileNo" },
                //{ "mDataProp": "DOJ" },
                //{
                //    "mDataProp": "Edit",
                //    "render": function (data, type, row) {
                //        return ' <a href="' + URLList.RedirectList + '?Id=' + row.Id + '" class="btn btn-azure btn-xs" ><i class="glyph-icon icon-pencil"></i> Edit </a>';
                //    }

                //}],

                "aoColumns": columnData,
                "aoColumnDefs": [
                     {
                         "targets": [0],
                         "visible": false,
                         "searchable": false
                        
                     }],
                'iDisplayLength': 10,
                'bRetrive ': true,
                'sPaginationType': "full_numbers",
                'aaSorting': [] // Prevents initial sorting

            });
        },
        error: function (xhr, textStatus, errorThrown) {
            alert('request failed');
        }
    });
}

 