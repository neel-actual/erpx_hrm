var payroll_field = ['name','employee_name','department','branch','employment_type','salary_mode','designation','image',"salary_amount","employee_epf_rate","total_socso_rate","total_eis_rate","zakat_amount","employee_socso_rate","employer_socso_rate","employer_epf"]
var table_row =
'<tr class="ideal"><td>'+'{0}'+'</td><td><img src='+"{1}"+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a style="display: block; color:#00AEEF;">'+'{2}'+'</a></span><span>'+'{3}'+'</span></p></td><td>'+'{4}'+'</td><td>'+'{5}'+'</td><td>'+'{6}'+'</td><td>'+'{7}'+'</td><td>'+'{8}'+'</td><td>'+'{9}'+'</td><td>'+'{10}'+'</td></tr>'
$(document).ready(function () {
  // hrm.list({
  //   doctype:"Employee",
  //   filters:{"Status":"Active"},
  //   fields:payroll_field,
  //   limit_page_length: 100000
  // }).then(function(res){
    
    
  //   res.message.forEach(element => {
      
  //     // var row = $('<tr class="ideal"><td>'+element.name+'</td><td><img src='+element.image+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a style="display: block; color:#00AEEF;">'+element.employee_name+'</a></span><span>'+element.designation+'</span></p></td><td>'+parseFloat(element.salary_amount)+'</td><td>'+addition+'</td><td>'+(parseFloat(element.salary_amount)+parseFloat(addition))+'</td><td>'+parseFloat(add_deduction)+'</td><td>'+element.salary_amount+'</td><td>'+element.salary_amount+'</td><td>'+element.salary_amount+'</td></tr>')
      
  //     // user_table.row.add(row).draw();
      
  //   });
  // })
  frappe.call({
    method: "erpx_hrm.api.get_employee_payroll_info",
    args: {},
    callback: function(res){
      console.log(res)
      res.message.forEach(element => {
      var gross_pay = parseFloat(parseFloat(element.salary_amount)+parseFloat(element.addition_amount)).toFixed(2)
      var employee_epf = (((parseFloat(element.employee_epf_rate)+parseFloat(element.additional_epf)) * parseFloat(element.salary_amount))/100).toFixed(2)
      console.log(employee_epf)
      var deduction = parseFloat(parseFloat(element.deduction_amount) + parseFloat(employee_epf)+ + parseFloat(element.employee_socso_rate)).toFixed(2) ;
      var net_pay = parseFloat((gross_pay - deduction).toFixed(2)).toFixed(2)
      var employer_epf = ((parseFloat(element.employer_epf).toFixed(2) * parseFloat(element.salary_amount).toFixed(2))/100).toFixed(2)
      var row = $('<tr class="ideal"><td>'+element.name+'</td><td><img src='+(element.image ? element.image : '/images/profile_icon.png')+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a style="display: block; color:#00AEEF;">'+element.employee_name+'</a></span><span>'+element.designation+'</span></p></td><td>'+parseFloat(element.salary_amount).toFixed(2)+'</td><td>'+parseFloat(element.addition_amount).toFixed(2)+'</td><td>'+gross_pay+'</td><td>'+deduction+'</td><td>'+net_pay+'</td><td>'+employer_epf+'</td><td>'+parseFloat(element.employer_socso_rate).toFixed(2)+'</td></tr>')
      
      user_table.row.add(row).draw();
        
      });
    }
  });
  var param = sessionStorage.getItem("param1");

  
  if(param){
    console.log(param);
    $('#step1').attr('class', '').addClass("step done");
    $('#step2').attr('class', '').addClass("step active");
    $("#step1_content").css("display","none")
    $("#step2_content").css("display","block")
  }
  $('#select_emp tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
    $(this).toggleClass('ideal')
  } );

  var user_table = $('#select_emp').DataTable({
    "columnDefs": [
      {
          "targets": [ 0 ],
          "visible": false,
          "searchable": false,
          
      },
      {
        targets: 1,width: "25%"
      },
      {
        targets: 2,width: "11%"
      },
      {
        targets: 3,width: "10%"
      },
      {
        targets: 4,width: "12%"
      },
      {
        targets: 5,width: "10%"
      },
      {
        targets: 6,width: "12%"
      },
      {
        targets: 6,width: "10%"
      },
      {
        targets: 6,width: "10%"
      }],
      autoWidth: false,
      paging: false,
      searching: false,
      info: false,
      lengthChange: false,
      ordering: false,
      buttons: false
    });

    

    var selected_emp = $('#selected_emp').DataTable({
      "columnDefs": [
        {
            "targets": [ 0 ],
            "visible": false,
            "searchable": false,
            
        },
        {
          targets: 1,width: "25%"
        },
        {
          targets: 2,width: "11%"
        },
        {
          targets: 3,width: "10%"
        },
        {
          targets: 4,width: "12%"
        },
        {
          targets: 5,width: "10%"
        },
        {
          targets: 6,width: "12%"
        },
        {
          targets: 6,width: "10%"
        },
        {
          targets: 6,width: "10%"
        }],
        autoWidth: false,
        paging: false,
        searching: false,
        info: false,
        lengthChange: false,
        ordering: false,
        buttons: false
      });

      $('#selected_emp tbody').on( 'click', 'tr', function () {
        console.log("here")
        var tr = $(this).closest('tr');
        var row = selected_emp.row( tr );
        var employee_id = selected_emp.row(this).data()[0]; 
        console.log(employee_id)
    
            hrm.list({
              doctype:"Employee",
              filters:{"name":employee_id},
              fields:["salary_amount","employee_epf_rate","additional_epf","employee_socso_rate","employee_eis_rate","zakat_amount"]
    
            }).then(function(res){
              console.log(res.message)
              var element = res.message[0]
              var data = {
                "Basic Salary":element.salary_amount,
                "epf":((parseFloat(element.employee_epf_rate) + parseFloat(element.additional_epf)) * element.salary_amount)/100,
                "socso":(parseFloat(element.employee_socso_rate) * element.salary_amount)/100,
                "eis":(parseFloat(element.employee_eis_rate) * element.salary_amount)/100,
                "zakat":element.zakat_amount
              }
              console.log(data)
              if ( row.child.isShown() ) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
            }
            else {
                // Open this row
                row.child( format(data) ).show();
                tr.addClass('shown');
            }
    
            })
     
           
    } );
    
      $('#select_emp').click( function () {
        console.log("here")
        selected_emp.clear().draw();
        user_table.rows('.selected').every( function () {
          var d = this.data();
          selected_emp.row.add(d).draw();
          console.log(d)
      } );
      } );

})
  function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Earnings:</td>'+
            '<td>'+'raj'+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extension number:</td>'+
            '<td>'+'12345'+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Extra info:</td>'+
            '<td>And any further details here (images etc)...</td>'+
        '</tr>'+
    '</table>';
}
  