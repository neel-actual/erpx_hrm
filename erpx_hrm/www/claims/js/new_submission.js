

$(document).ready(function(){

  $("form[name='pay_select']").validate({
    // Specify validation rules
    rules: {
      // The key name on the left side is the name attribute
      // of an input field. Validation rules are defined
      // on the right side
      pay_month: "required",
      pay_year: "required",
      pay_type:"required"
    },
    // Specify validation error messages
    messages: {
      pay_month: "Please select your Pay Month",
      pay_year: "Please select your Pay Year",
      pay_type:"Please select your Pay Type"
    },
    
    submitHandler: function(form) {
      form.submit();
    }
  });
  var table1 = $('#not_selected_table').DataTable({
    paging: false,
    searching: false,
    info: false,
    lengthChange: false,
    ordering: false,
    buttons: false
  });

  var table2 = $('#final_table').DataTable({
    paging: false,
    searching: false,
    info: false,
    lengthChange: false,
    ordering: false,
    buttons: false
  });

  var user_table = $('#table_id').DataTable({
    paging: false,
    searching: false,
    info: false,
    lengthChange: false,
    ordering: false,
    buttons: false
  });

  $('#table_id tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
    $(this).toggleClass('ideal')
  } );

  $('#to_step3').click( function () {
    table1.clear().draw();
    table2.clear().draw();
    user_table.rows('.selected').every( function () {
      var d = this.data();
      table2.row.add(d).draw();
      console.log(d)
  } );
  user_table.rows('.ideal').every( function () {
    var d = this.data();
    table1.row.add(d).draw();
    console.log(d)
} );
  } );

    $('#submit_pay').click( function (){
      table2.rows().every( function () {
        var d = this.data();
        console.log(d[0])
        console.log()
        frappe.call({
          method: 'erpx_hrm.api.make_salary',
          args: {
              'expense_claim': d[0],
              'submit_month': $("#pay_mon").val(),
              'submit_year':$("#pay_year").val()
          },
          callback: function(r) {
              if (!r.exc) {
                  console.log(r.message)
                  M.toast({
                      html: 'Submission Successfull!!'
                  })
              }
          }
      });
    } );
    });

  
    $("#sel_month").change(function(){
        $('.month_sel').val($(this).val());

    })

    $("#sel_year").change(function(){
        $('.year_sel').val($(this).val());

    })

    $("#pay_type").change(function(){
        $('.sel_pay_type').val($(this).val());

    })

    

    // $(".sel_expense").change(function() {
    //     if ($(this).is(":checked")){
    //     var data = user_table.rows();
    //     console.log(data)
    //     // user_table.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
    //     //     var data = this.data();
    //     //     console.log(data[0])
    //     //     // ... do something with data(), or this.node(), etc
    //     // } );
    //     // var row = $(this).closest("tr"); 
    //     // var $title = row.find(".title").text();
    //     // var $image = row.find(".image img").attr('src');
    //     // var $date = row.find(".date").text();
    //     // var $amount = row.find(".amount").text();
        
    //     // $('#final_table tr:last').after(
    //     //     '<tr><td>'+$title+'</td>'+'<td><img style="color: white;height: 40px;width: 40px;background-color: #bbb;border-radius: 50%;display: inline-block;text-align: center;"  src='+$image+'></td>'+'<td>'+$date+'</td>'+'<td>'+$amount+'</td></tr>'
    //     // );
        
    //     }
        
        
        
    // });





})