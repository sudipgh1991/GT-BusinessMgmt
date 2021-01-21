var Employee = [];
$(document).ready(function () {

    BindProjectList();


});





function BindProjectList() {
    $('.loader').show();

    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetProjectCardList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var dynamicid = 1;
            var id = 1;

            if (data['PE_Image'] != "") {
                $('#user_image').attr('src', '');
                $('#user_image').attr('src', data['PE_Image']);
                pathString = data['PE_Image'];
                user_image = data['PE_Image'];
            }

            if (data.length > 0) {
                $.each(data, function (index, value) {

                    $('#dvProject').append('<div class="col-xl-3 col-lg-4 col-sm-6"><div class="card hover-shadow-lg"><div class="card-header border-0 pb-0"><div class="d-flex justify-content-between align-items-center"><div><h6 class="mb-0">' + value.PE_CardStartDate + '</h6></div><div class="text-right"><div class="actions"> <a href="/Project/ProjectWiseEmployee?Id=' + value.PE_Id + '" class="action-item"><i class="fa fa-user" data-toggle="tooltip" title="Manage Employee"></i></a><div class="dropdown action-item" data-toggle="dropdown"> <a href="#" class="action-item"><i class="fa fa-ellipsis-h"></i></a><div class="dropdown-menu dropdown-menu-right"> <a href="Project?Id=' + value.PE_Id + '" class="dropdown-item">Edit Project</a> <a href="AddSMME?Id=' + value.PE_Id + '" class="dropdown-item">Manage SMME</a> <a href="ProjectWiseTask?Id=' + value.PE_Id + '" class="dropdown-item">Manage Activity</a></div></div></div></div></div></div><div class="card-body text-center"> <a href="#" class="avatar rounded-circle avatar-lg hover-translate-y-n3"> <img alt="Image placeholder" class="pic" src="' + value.PE_Image + '" id="user_image"> </a><h5 class="h6 my-4"><a href="#">' + value.PE_ProjectName + '</a></h5><div class="avatar-group hover-avatar-ungroup mb-3" Id="dvSMME_' + id + '"> </div> <span class="clearfix"></span> <span class="badge badge-pill badge-' + value.Color + '">' + value.PE_Status + '</span></div><div class="card-footer"><div class="actions d-flex justify-content-between px-4"> <a href="/Project/income?id=' + value.PE_Id + ' " class="action-item  text-info"> <i class="fa fa-file" data-toggle="tooltip" title="Manage Project Assesment"></i> </a> <a href="#" onclick="mdlForIcomeMenu(' + value.PE_Id + ',\'' + value.PE_StartDate + '\',\'' + value.PE_EndDate + '\')" class="action-item text-success" > <i class="fa fa-plus" data-toggle="tooltip" title="Manage Income"></i> </a> <a href="#" onclick="mdlForExpensesMenu(' + value.PE_Id + ',\'' + value.PE_StartDate + '\',\'' + value.PE_EndDate + '\')" class="action-item text-warning"> <i class="fa fa-minus-circle" data-toggle="tooltip" title="Manage Expense"></i> </a></div></div></div></div>');
                    BindSMMEList(value.PE_Id, id)
                    id++;
                });
            }
            else {
                $('#dvProject').append('<div class="col-xl-12 col-lg-12 col-sm-12"><div class="card hover-shadow-lg"><div class="card-body text-center">No Data Found</div><div></div>');

            }

            $('.loader').hide();



        }
    });

}

function mdlForIcomeMenu(ProjectId, startDate, endDate) {
    $('#dvIMnu').html('');
    $('#modalincomeMenu').modal('show');

    $('#dvIMnu').append('<a href="Income?Id=' + ProjectId + '&start=' + startDate + '&end=' + endDate + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/budget.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Income Budget</h6><p class="text-sm mb-0"> Click to enter Income Budget</p></div></div></a><center>Actual Income</center></div><a href="ProjectWiseJobsFundGrant?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title="Income Budget"><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/grant.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Grant Funding</h6><p class="text-sm mb-0"> Click to Enter all grant fundings</p></div></div> </a> <a href="MatchedFunding?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/matched.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Matched Funding</h6><p class="text-sm mb-0">Click to enter all matched fundings</p></div></div> </a> <a href="OtherContributions?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/other.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Other Contributions</h6><p class="text-sm mb-0"> Income from Other Contributions</p></div></div> </a> <a href="LoanFinancing?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/loan.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">LoanFinancing</h6><p class="text-sm mb-0">Income From loans.</p></div></div> </a> <a href="InKindContributions?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/inkind.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">In Kind Contributions</h6><p class="text-sm mb-0">Income From In-kind Contribution</p></div></div> </a> <a href="InterestIncome?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/interest.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Interest Income</h6><p class="text-sm mb-0">Income from Interest Component</p></div></div> </a> <a href="OtherEarnings?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/earning.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Other Earnings</h6><p class="text-sm mb-0">Income From Other Earning</p></div></div> </a>');
}


function mdlForExpensesMenu(ProjectId, startDate, endDate) {
    $('#dvEMnu').html('');
    $('#modalExpenMenu').modal('show');

    $('#dvEMnu').append('<a href="Budget?Id=' + ProjectId + '&start=' + startDate + '&end=' + endDate + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/budget.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Expenses Budget</h6><p class="text-sm mb-0"> Click to enter Expense Budget</p></div></div></a><center>Actual Expense</center><a href="ProjectWiseExpenses?Id=' + ProjectId + '" class="list-group-item list-group-item-action"><div class="d-flex align-items-center" data-toggle="tooltip" data-placement="right" data-title=""><div><div class="avatar-parent-child"> <img alt="Image placeholder" src="../assets/img/Interest.png" class="avatar rounded-circle"> <span class="avatar-child avatar-badge bg-warning"></span></div></div><div class="flex-fill ml-3"><h6 class="text-sm mb-0">Actual Exepenses</h6><p class="text-sm mb-0"> Section to manage all project expenses</p></div></div> </a>');
}

function BindSMMEList(Projectid, id) {


    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetProjectWiseSMMEList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var count = 1;
            var dvId = '#dvSMME_' + id + '';
            if (data.length > 0) {
                $.each(data, function (index, value) {
                    if (value.PWS_ProjectId == Projectid) {

                        if (count <= 3) {
                            $(dvId).append('<a href="/Project/AddSMME?Id=' + Projectid + '" data-toggle="tooltip" title="'+value.SM_CorporateName+'" class="avatar rounded-circle avatar-sm"><img alt="' + value.SM_CorporateName + '" src="' + value.SM_Image + '" class="">  </a>');
                       }
                        count++;
                    }

                });
                if(count<=1)
                {
                    //$(dvId).append('<span><a href="/Project/AddSMME?Id=' + Projectid + '"></a> No SMME </span>');
                    $(dvId).append('<a href="/Project/AddSMME?Id=' + Projectid + '"><span> Assign SMME </span></a>');

                }
            }
            else {
                //$('#dvProject').append('<div class="col-xl-12 col-lg-12 col-sm-12"><div class="card hover-shadow-lg"><div class="card-body text-center">No Data Found</div><div></div>');

            }



        }
    });

}