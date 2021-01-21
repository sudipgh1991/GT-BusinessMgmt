
    $(document).ready(function() {

        /******************************************
        *       js of HTML5 export buttons        *
        ******************************************/

        $('.dataex-html5-export').DataTable( {
            dom: 'Bfrtip',
            buttons: [
                'copyHtml5',
                'excelHtml5',
                'csvHtml5',
                'pdfHtml5'
            ]
        });
    });

