 function Print(projectId) {
        var final = {}; var master = []; var detail = [];

        master.push({
            ReportName: "ProjectDetails.rpt",
            FileName: "Project_Details"
        });

        detail.push({
            ProjectID: projectId,
        });

        final = {
            Master: master,
            Detail: detail
        }

        var left = ($(window).width() / 2) - (950 / 2),
            top = ($(window).height() / 2) - (650 / 2),
            popup = window.open("/OpenReport/OpenReport.aspx?ReportName=" + JSON.stringify(final), "popup", "width=950, height=650, top=" + top + ", left=" + left);
        popup.focus();
    }