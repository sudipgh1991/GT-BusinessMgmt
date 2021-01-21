
$(document).ready(function () {

    BindCorporateCardList();
});

function BindCorporateCardList() {
  //  $('.loader').show();

    $.ajax({
        type: "POST",
        url: "/ScriptJson/GetCorporateCardList",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (data) {
            var dynamicid = 0;
            $.each(data, function (index, value) {
                alert(value.CC_Email);
                $('#dvClient').append('<div class="col-lg-3 col-sm-6"><div class="card hover-shadow-lg"><div class="card-body text-center"><div class="avatar-parent-child"> <img alt="Image placeholder" src="' + value.CC_Logo + '" class="avatar rounded-circle avatar-lg"> <span class="avatar-child avatar-badge bg-success"></span></div><h5 class="h6 mt-4 mb-0">"' + value.CC_Logo + '"</h5> <a href="#" class="d-block text-sm text-muted mb-3">' + value.CC_Email + '</a><div class="actions d-flex justify-content-between px-4"> <a href="/Home/CorpProfile?id="' + value.CC_Id + '" class="action-item"> <i class="fa fa-user-edit"></i> </a> <a href="#" class="action-item"> <i class="fa fa-bell"></i> </a> <a href="#" class="action-item"> <i class="fa fa-trash-alt"></i> </a></div></div><div class="card-body border-top"><div class="row justify-content-between align-items-center"><div class="col-6"><div style="max-width: 120px; position: relative;"></div></div><div class="col-auto text-center"> <span class="d-block h4 mb-0">"' + value.CC_TotalProjects + '"</span> <span class="d-block text-sm text-muted">Open Projects</span></div></div></div><div class="card-footer"><div class="actions d-flex justify-content-between"> <a href="#" class="action-item"> <span class="btn-inner--icon">Projects</span> </a> <a href="#" class="action-item"> <span class="btn-inner--icon">See profile</span> </a></div></div></div></div>')
                dynamicid++;
            });
            $('#count').text(dynamicid);
           // $('.loader').hide();



        }
    });

}

