jQuery(document).ready(function() {
  // user_table.buttons().container()
  //       .appendTo( '.waves-effect .waves-light .right' );

    // $("#download").click(function(){
    //     console.log("here")
    //     frappe.call({
    //         method: 'erpx_hrm.api.download_expense_claim_report',
    //         args: {
                
    //         },
    //         callback: function(r) {
    //             if (!r.exc) {
    //                 console.log(r.message)
                    
    //             }
    //         }
    //     });
    // })
    
    // $('#export-btn').on('click', function(e){
    //     e.preventDefault();
    //     ResultsToTable();
    // });
    
    // function ResultsToTable(){    
    //     $("#table_id").table2excel({
    //         name: "Results",
    //         filename:"Expense_Report",
    //         fileext:".xls"

    //     });
    // }
});
  var user_table = $('#table_id').DataTable({
    dom: 'Bfrtip',
    buttons: [
    {
      extend: 'print',
      text: 'Print',
      filename: 'Expense Claim Summary',
      exportOptions: { modifier: { page: 'all'} }
    },
    {
      extend: 'pdf',
      text: 'PDF',
      filename: 'Expense Claim Summary',
      exportOptions: { modifier: { page: 'all'} }
    },
    {
      extend: 'excel',
      text: 'Excel',
      filename: 'Expense Claim Summary',
      exportOptions: { modifier: { page: 'all'} }
    }
    
  ],
    columnDefs: [ 
      {
      targets: 1,
      render: $.fn.dataTable.render.moment('DD-MM-YYYY'),
      width: "10%"
    },
    {
      targets: 4,
      render: $.fn.dataTable.render.moment('DD-MM-YYYY'),
      width: "10%"
    } ,
    {
      targets: 2,
      
      width: "10%"
    },
    {
      targets: 3,
      
      width: "25%"
    }],
    paging: false,
    searching: true,
    info: true,
    lengthChange: true,
    ordering: true,
    // buttons: true
  });
  



  $.fn.dataTable.ext.search.push(
  function(settings, data, dataIndex) {
    var min = new Date(adjust_date_time(moment($('#from_date').val()).format('DD-MM-YYYY')));
    var max = new Date(adjust_date_time(moment($('#to_date').val()).format('DD-MM-YYYY')));
    
    var createdAt = new Date(adjust_date_time(data[1])); // Our date column in the table
    console.log("created "+createdAt)
    console.log("min "+min)
    console.log("max "+max)

    if ((min == "Invalid Date" || max == "Invalid Date") || (moment(createdAt).isSameOrAfter(min) && moment(createdAt).isSameOrBefore(max))) {
      return true;
    }
    return false;
  }
);

// Re-draw the table when the a date range filter changes
$('.date-range-filter').change(function() {
  user_table.draw();
});
$('#emp_filter').change(function(){
    
    var filter_status = $("#emp_filter").val();
    console.log(user_table)
    user_table.column(3).search(filter_status, true, false, false).draw();
});
function adjust_date_time(date){
      var date_list = date.split("-");
      return date_list[1]+"-"+date_list[0]+"-"+date_list[2]
    }
