$(document).ready(function () {
    InitUI();

    if (ViewBag.Messege!=null) {
        alert(ViewBag.Messege);
        return false;
    }
});


function InitUI() {

    DropdownBinder.DDLData = {
        tableName: "FinancialYearMaster_FM",
        Text: 'FM_Name',
        Value: 'FM_Id'
    };

    DropdownBinder.DDLElem = $("#ddlSession");

    DropdownBinder.Execute();
}
