$(document).ready(async function () {  
    
  var param = sessionStorage.getItem("pay_name");
  var pay_month = sessionStorage.getItem("pay_month");
  var pay_year = sessionStorage.getItem("pay_year");
  var status = sessionStorage.getItem("status");
  // console.log(status)

  
  if(param && pay_month && pay_year && status){
    $('#send_for_approval').hide();
    $('#approve_pay').show();
    $('#step1').attr('class', '').addClass("step done");
    $('#step2').attr('class', '').addClass("step active");
    $("#step1_content").css("display","none")
    $("#step2_content").css("display","block")
    $('#sel_month').val(pay_month)
    $('#sel_month').formSelect()
    $('#sel_year').val(pay_year)
    $('#sel_year').formSelect()
    if(status == "Approved"){
      $('#continue').show();
      $('#approve_pay').hide();
      $('#reject_pay').hide();
    }else if(status == "Pending"){
      $('#approve_pay').show();
      $('#continue').hide();
      $('#reject_pay').show();
    }else{
      $('#approve_pay').hide();
      $('#continue').hide();
      $('#reject_pay').hide();
    }
    
    let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
    
    hrm.get_child_item({
      doctype:"Pay Detail",
      filters:{parent:param},
      fields:["employee_id","employee_name","employee_image","employee_designation","basic_salary","additions","gross_pay","deductions","net_pay","employer_epf","employer_socso"]
    }).then(function(res){
      console.log(res)
      res.message.forEach(async(element) => {
      var row = $('<tr class="ideal"><td class = "emp_id">'+element.employee_id+'</td><td class = "emp_name"><img class = "emp_img" src='+(element.employee_image ? element.employee_image : '/images/profile_icon.png')+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a class = "emp_name" style="display: block; color:#00AEEF;">'+element.employee_name+'</a></span><span class = "emp_desi">'+element.employee_designation+'</span></p></td><td class = "emp_salary">'+currency + parseFloat(element.basic_salary).toFixed(2)+'</td><td class = "emp_addition">'+currency +parseFloat(element.additions).toFixed(2)+'</td><td class = "emp_gross">'+currency +parseFloat(element.gross_pay).toFixed(2)+'</td><td class = "emp_deduction">'+currency +parseFloat(element.deductions).toFixed(2)+'</td><td class = "emp_net">'+currency +parseFloat(element.net_pay).toFixed(2)+'</td><td class = "emp_epf">'+currency +parseFloat(element.employer_epf).toFixed(2)+'</td><td class = "emp_socso">'+currency +parseFloat(element.employer_socso).toFixed(2)+'</td></tr>')
      selected_emp.row.add(row).draw();
      });
    })
  }else{
    $('#approve_pay').hide();
    $('#reject_pay').hide();
    $('#continue').hide();
  }
  $('#approve_pay').click(function(){
    var param = sessionStorage.getItem("pay_name");
    if(param){
      hrm.update('HRM Payroll Entry', {
        "name":param,
        "status":"Approved"
      }).then(function(res){
        console.log(res)
        M.toast({
                html: 'Update successful!'
            })
        location.reload(true);
    })
    }else{
    M.toast({
            html: 'Please Select Correct Payroll From Payroll Approval'
        })
    }
    
  })
  $('#reject_pay').click(function(){
    var param = sessionStorage.getItem("pay_name");
    if(param){
      hrm.update('HRM Payroll Entry', {
        "name":param,
        "status":"Rejected"
      }).then(function(res){
        console.log(res)
        M.toast({
                html: 'Update successful!'
            })
        location.reload(true);
    })
    }else{
    M.toast({
            html: 'Please Select Correct Payroll From Payroll Approval'
        })
    }
    
  })
  $('#send_for_approval').click( function () {
    // var data = selected_emp.rows().data();
    // console.log(data)
    if($('#sel_month').val() && $('#sel_year').val() && $('#pay_type').val()){
      pay_details = []
      selected_emp.rows().every( function ( rowIdx, tableLoop, rowLoop ) {
        // console.log(this.data())
        pay_details.push({
          employee_id:this.data()[0],
          employee_image:$(this.node()).find('img.emp_img').attr("src"),
          employee_name:$(this.node()).find('a.emp_name').text(),
          employee_designation:$(this.node()).find('span.emp_desi').text(),
          basic_salary:this.data()[2].split(" ")[1],
          additions:this.data()[3].split(" ")[1],
          gross_pay:this.data()[4].split(" ")[1],
          deductions:this.data()[5].split(" ")[1],
          net_pay:this.data()[6].split(" ")[1],
          employer_epf:this.data()[7].split(" ")[1],
          employer_socso:this.data()[8].split(" ")[1]
        })
        frappe.call({
          method: 'erpx_hrm.api.create_payroll_entry',
          args: {
            'month':$('#sel_month').val(),
            'year':$('#sel_year').val(),
            'type':$('#pay_type').val(),
            'user':"Raj",
            'pay_details':pay_details
          },
          callback: function(r) {
              if (!r.exc) {
                  console.log(r.message)
                  M.toast({
                      html: 'Payroll Entry Created Successfully!'
                  })
              }
          }
      });
        // var img = $(this.node()).find('img.emp_img').attr("src");
        // console.log(img)
        // var emp_name = $(this.node()).find('a.emp_name').text();
        // console.log(emp_name)
        // var emp_desi = $(this.node()).find('span.emp_desi').text();
        // console.log(emp_desi)
        // var salary = this.data()[2];
        // console.log(salary)
        // var addition = this.data()[3];
        // console.log(addition)
        // var gross = this.data()[4];
        // console.log(gross)
        // var ded = this.data()[5];
        // console.log(ded)
        // var net = this.data()[6];
        // console.log(net)
        // var emp_epf = this.data()[7];
        // console.log(emp_epf)
        // var emp_socso = this.data()[8];
        // console.log(emp_socso)
        // ... do something with data(), or this.node(), etc
    } );
    // console.log(pay_details)
    }else{
      M.toast({
        html: 'Enter All Payroll Information!'
    })
    }
    
  })
// User Table defination
  var user_table = $('#select_emp').DataTable({
    "columnDefs": [
      {   "targets": [ 0 ],
          "visible": false,
          "searchable": false,          
      },
      {targets: 1,width: "25%"},
      {targets: 2,width: "11%"},
      {targets: 3,width: "10%"},
      {targets: 4,width: "12%"},
      {targets: 5,width: "10%"},
      {targets: 6,width: "12%"},
      {targets: 6,width: "10%"},
      {targets: 6,width: "10%"}],
      autoWidth: false,
      paging: false,
      searching: false,
      info: false,
      lengthChange: false,
      ordering: false,
      buttons: false
    });    
// Selected Table Defination
    var selected_emp = $('#selected_emp').DataTable({
      "columnDefs": [
        {
            "targets": [ 0 ],
            "visible": false,
            "searchable": false,
            
        },
        {targets: 1,width: "25%"},
        {targets: 2,width: "11%"},
        {targets: 3,width: "10%"},
        {targets: 4,width: "12%"},
        {targets: 5,width: "10%"},
        {targets: 6,width: "12%"},
        {targets: 6,width: "10%"},
        {targets: 6,width: "10%"}],
        autoWidth: false,
        paging: false,
        searching: false,
        info: false,
        lengthChange: false,
        ordering: false,
        buttons: false
      });
// get payroll_info
      $('#sel_month').change(async function () {
        // let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
        let emp_info = await get_pay_info(user_table);               
      })
// Transfer Selected row to next table 
      $('#continue_select_emp').click(async function () {
        // var selected_emp = []
        selected_emp.clear().draw();
        user_table.rows('.selected').every( function () {
          var d = this.data();
          selected_emp.row.add(d).draw();
        });        
      });

      $('#select_emp tbody').on( 'click', 'tr',async function () {
        $(this).toggleClass('selected');
        $(this).toggleClass('ideal');
      });

      $('#selected_emp tbody').on( 'click', 'tr',async function () {
        // $(this).toggleClass('selected');
        // $(this).toggleClass('ideal');

        let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
        var tr = $(this).closest('tr');
        var row = selected_emp.row( tr );
        var employee_id = selected_emp.row(this).data()[0]; 
        let emp_pay_info = await hrm.get_payroll({employee:employee_id})
        var emp_epf = (((parseFloat(emp_pay_info.message[0].employee_epf_rate)+parseFloat(emp_pay_info.message[0].additional_epf)) * parseFloat(emp_pay_info.message[0].salary_amount))/100).toFixed(2);


        let pcb = await calculate_pcb(emp_pay_info.message[0].accumulated_salary,emp_pay_info.message[0].accumulated_epf,emp_pay_info.message[0].salary_amount,emp_epf,parseFloat(emp_pay_info.message[0].employee_eis_rate).toFixed(2),emp_pay_info.message[0].employee_socso_rate,emp_pay_info.message[0].addition_amount,emp_pay_info.message[0].deduction_amount,emp_pay_info.message[0].residence_status,emp_pay_info.message[0].is_disabled,emp_pay_info.message[0].marital_status,emp_pay_info.message[0].number_of_children,emp_pay_info.message[0].spouse_working,emp_pay_info.message[0].spouse_disable,emp_pay_info.message[0].past_deduction,emp_pay_info.message[0].accumulated_socso,emp_pay_info.message[0].accumulated_mtd,emp_pay_info.message[0].accumulated_zakat,emp_pay_info.message[0].zakat_amount,emp_pay_info.message[0].accumulated_eis);
        salary_details = {
        salary : emp_pay_info.message[0].salary_amount,
        additional : emp_pay_info.message[0].addition_amount,
        employee_epf : emp_epf,
        pcb : pcb,
        eis : parseFloat(emp_pay_info.message[0].employee_eis_rate).toFixed(2),
        socso : emp_pay_info.message[0].employee_socso_rate,
        zakat : emp_pay_info.message[0].zakat_amount
        }
        
        if ( row.child.isShown() ) {
              // This row is already open - close it
              row.child.hide();
              tr.removeClass('shown');
          }
          else {
              // Open this row
              row.child( format(salary_details,currency) ).show();
              tr.addClass('shown');
            }   
           
    } );  

})
  function format ( d,currency ) {
    // let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
    // `d` is the original data object for the row
    return `<div>  
    <table>
    <tr>
      <th colspan="3">Earnings</th>
    </tr>
    <tr>
      <td>Basic Salary :</td>
      <td colspan="2">`+currency + parseFloat(d.salary).toFixed(2)+`</td>
    </tr>
    <tr>
      <td>Additional :</td>
      <td colspan="2">`+currency + parseFloat(d.additional).toFixed(2)+`</td>
    </tr>
    </table>
    </div>
    <div >
    <table>
    <tr>
      <th colspan="3">Deduction</th>
    </tr>
    <tr>
      <td>EPF :</td>
      <td colspan="2">`+currency + parseFloat(d.employee_epf).toFixed(2)+`</td>
    </tr>
    <tr>
      <td>PCB :</td>
      <td colspan="2">`+currency + parseFloat(d.pcb).toFixed(2)+`</td>
    </tr>
    <tr>
      <td>EIS :</td>
      <td colspan="2">`+currency + parseFloat(d.eis).toFixed(2)+`</td>
    </tr>
    <tr>
      <td>SOCSO :</td>
      <td colspan="2">`+currency + parseFloat(d.socso).toFixed(2)+`</td>
    </tr>
    <tr>
      <td>Zakat Amont :</td>
      <td colspan="2">`+currency + parseFloat(d.zakat).toFixed(2)+`</td>
    </tr>
  </table>
  </div>
  `;
}

async function get_pay_info(user_table){
  let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
  let pay_info = await hrm.get_payroll()
  var employee_pay_directory = new Array();
  // console.log(pay_info)

  pay_info.message.forEach(async(element) => {
    // console.log(element)
    var gross_pay = parseFloat(parseFloat(element.salary_amount)+parseFloat(element.addition_amount)).toFixed(2)
    var employee_epf = (((parseFloat(element.employee_epf_rate)+parseFloat(element.additional_epf)) * parseFloat(element.salary_amount))/100).toFixed(2)
    var employee_eis = parseFloat(element.employee_eis_rate).toFixed(2)
    var employer_eis = parseFloat(((element.employer_eis_rate) * element.salary_amount)/100).toFixed(2)    
    var employer_epf = parseFloat(((element.employer_epf+element.additional_employer_epf) * element.salary_amount)/100).toFixed(2)
    let pcb = await calculate_pcb(element.accumulated_salary,element.accumulated_epf,element.salary_amount,employee_epf,employee_eis,element.employee_socso_rate,element.addition_amount,element.deduction_amount,element.residence_status,element.is_disabled,element.marital_status,element.number_of_children,element.spouse_working,element.spouse_disable,element.past_deduction,element.accumulated_socso,element.accumulated_mtd,element.accumulated_zakat,element.zakat_amount,element.accumulated_eis);
    var deduction = (parseFloat(element.deduction_amount) + parseFloat(employee_epf)+parseFloat(element.employee_socso_rate)+parseFloat(pcb)+parseFloat(employee_eis)+parseFloat(element.zakat_amount)).toFixed(2);
    var net_pay = parseFloat((gross_pay - deduction).toFixed(2)).toFixed(2)    

    employee_pay_directory.push({
    "id":element.name,
    "name":element.employee_name,
    "designation":element.designation,
    "image":element.image,
    "salary":parseFloat(element.salary_amount).toFixed(2),
    "additions":parseFloat(element.addition_amount).toFixed(2),
    "gross_pay":parseFloat(gross_pay).toFixed(2),
    "deduction":parseFloat(deduction).toFixed(2),
    "net_pay":parseFloat(net_pay).toFixed(2),
    "employer_epf":parseFloat(employer_epf).toFixed(2),
    "employer_socso": parseFloat(element.employer_socso_rate).toFixed(2),
    "employee_epf": parseFloat(employee_epf).toFixed(2),
    "pcb":parseFloat(pcb).toFixed(2),
    "eis":parseFloat(employer_eis).toFixed(2),
    "employee_socso":parseFloat(element.employee_socso_rate).toFixed(2),
    "zakat":parseFloat(element.zakat_amount).toFixed(2)
    })
    // employee_pay_directory.forEach(element => {
    //   console.log(element)
    // });
    
    // console.log(employer_eis)
    var row = $('<tr class="ideal"><td class = "emp_id">'+element.name+'</td><td class = "emp_name"><img class = "emp_img" src='+(element.image ? element.image : '/images/profile_icon.png')+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a class = "emp_name" style="display: block; color:#00AEEF;">'+element.employee_name+'</a></span><span class = "emp_desi">'+element.designation+'</span></p></td><td class = "emp_salary">'+currency + parseFloat(element.salary_amount).toFixed(2)+'</td><td class = "emp_addition">'+currency +parseFloat(element.addition_amount).toFixed(2)+'</td><td class = "emp_gross">'+currency +gross_pay+'</td><td class = "emp_deduction">'+currency +deduction+'</td><td class = "emp_net">'+currency +net_pay+'</td><td class = "emp_epf">'+currency +employer_epf+'</td><td class = "emp_socso">'+currency +parseFloat(element.employer_socso_rate).toFixed(2)+'</td></tr>')
    
    user_table.row.add(row).draw();
    // console.log(pcb)
    });

    return employee_pay_directory;
}

async function calculate_pcb(accumulated_salary,accumulated_epf,current_salary,current_epf,current_eis,current_socso,additions,additional_deduction,residence_status,disable_status,marital_status,number_of_children,spouse_working,spouse_disable,past_deduction,accumulated_socso,accumulated_mtd,accumulated_zakat,zakat_amount,accumulated_eis){
  // console.log(parseFloat(current_eis))
  var tax_amount = 0;
  
  if(residence_status == "Resident"){

  // console.log("accumulated_salry : " + accumulated_salary)
  // console.log("accumulated_epf : " + accumulated_epf)
  // console.log("current_salary : " + current_salary)
  // console.log("current_epf : " + current_epf)
  // console.log("current_socso : " + current_socso)
  // console.log("additional_deduction : " + additional_deduction)
  // console.log("residence_status : " + residence_status)
  // console.log("disable_status : " + disable_status)
  // console.log("marital_status : " + marital_status)
  // console.log("number_of_children : " + number_of_children)
  // console.log("spouse_working : " + spouse_working)
  // console.log("spouse_disable : " + spouse_disable)
  // console.log("current month: "+$('#sel_month').val())
  // console.log("past_deduction :"+past_deduction)
  // console.log("accumulated_socso :"+accumulated_socso)
    let relief = await hrm.get_child_item({
      doctype:"Employee Allowance",
      filters:{"parent":null,"parentfield":"employee_relief"},
      fields:["relief","amount"]
    }).then(function(res){
      return res
    })
    var d = 0;
    var s = 0;
    var c=0;
    var i_d = 0;
    var s_d = 0;
    
    relief.message.forEach(element => {
      if(element.relief == "Individual"){
        d = element.amount
      }
      if(element.relief == "Child"){
        c = element.amount
      }
      if(element.relief == "Husband/Wife"){
        s = element.amount
      }
      if(element.relief == "Disable Individual"){
        i_d = element.amount
      }
      if(element.relief == "Disable Spouce"){
        s_d = element.amount
      }
    });
    
    var current_month = $('#sel_month').val()
    var n = 12 - current_month
    var individual_relief = 0
    var spouce_relief = 0
    var children_relief = 0
    var catagory = 0;

    if(marital_status == "Single"){
      catagory = 1
      individual_relief = d
      if(disable_status == "Yes"){
        individual_relief = individual_relief + i_d
      }
    }else if(marital_status = "Married" && spouse_working == "Not Working"){
      catagory = 2
      individual_relief = d
      spouce_relief = s
      if(number_of_children){
        children_relief = c * number_of_children
      }
      if(disable_status == "Yes"){
        individual_relief = individual_relief + i_d
      }
      if(spouse_disable == "Yes"){
        spouce_relief = s + s_d
      }
      
    }else if(marital_status = "Married" && spouse_working == "Working" || marital_status == "Divorced" || marital_status == "Widowed"){
      catagory = 3
      individual_relief = d
      if(disable_status == "Yes"){
        individual_relief = individual_relief + i_d
      }
      if(number_of_children){
        children_relief = c * number_of_children
      }
    }
    var m = 0
    var r = 0
    var b = 0
    let result = await hrm.get_child_item({
      doctype:"Tax Table",
      filters:{"parent":null,"parentfield":"tax_table"},
      fields:["p_min","p_max","m","b1","b2","r"]
    }).then(function(res){
      return res
    })
    // console.log("individual_relief :"+individual_relief)
    // console.log("spouce_relief :"+spouce_relief)
    // console.log("children_relief :"+children_relief)
    var future_epf = (4000 - accumulated_epf - current_epf)/n 
    // console.log("future epf: "+future_epf)

    var taxable_salary = ((accumulated_salary - accumulated_epf) + (current_salary - current_epf) + ((current_salary - future_epf)*n)) - (individual_relief + children_relief + spouce_relief +  accumulated_socso + accumulated_eis + current_socso + additional_deduction + past_deduction + parseFloat(current_eis))

    // console.log("taxable salary: "+taxable_salary)

    
    // console.log(result)
    result.message.forEach(element => {
      if(taxable_salary > element.p_min && taxable_salary <= element.p_max){
        if (catagory == 1 || catagory == 3){
          m = element.m
          r = element.r
          b = element.b1
        }else if(catagory == 2){
          m = element.m
          r = element.r
          b = element.b2
        }
              
      }
    });
    
    
    tax_amount = parseFloat(((taxable_salary - m)*(r*0.01) + b - (accumulated_zakat + accumulated_mtd))/(n+1)) - parseFloat(zakat_amount)
    
    // if (tax_amount < 0){
    //   tax_amount = 0
    // }
    // console.log(m)
    // console.log(b)
    // console.log(r)
    // console.log("Yearly tax withot addition: "+yearly_tax)
    var addition_tax = 0
    if(additions){
      yearly_taxble_with_addition = ((accumulated_salary - accumulated_epf) + (current_salary - current_epf) + ((current_salary - future_epf)*n) + (additions - 0)) - (individual_relief + children_relief + spouce_relief +  accumulated_socso  + accumulated_eis +current_socso + additional_deduction + past_deduction +parseFloat(current_eis))
      // console.log("taxable salary :"+taxable_salary)
      // console.log("yearly taxable salary with addition:"+yearly_taxble_with_addition)
      var a_m = 0
      var a_r = 0
      var a_b = 0
      result.message.forEach(element => {
        if(yearly_taxble_with_addition > element.p_min && yearly_taxble_with_addition <= element.p_max){
          if (catagory == 1 || catagory == 3){
            a_m = element.m
            a_r = element.r
            a_b = element.b1
          }else if(catagory == 2){
            a_m = element.m
            a_r = element.r
            a_b = element.b2
          }
                
        }
      });
      yearly_tax = parseFloat(accumulated_mtd) +(accumulated_zakat + (tax_amount + parseFloat(zakat_amount))*(n+1))
      // console.log("tax_amount :"+tax_amount)
      tax_amount_with_addition = ((yearly_taxble_with_addition - a_m)*(a_r*0.01) + a_b )
      // console.log("tax_amount_with_addition :"+tax_amount_with_addition)
      console.log("Yearly tax withot addition: "+yearly_tax)
      console.log("tax amount with addition: "+tax_amount_with_addition)
      addition_tax = tax_amount_with_addition - yearly_tax
      // console.log("additional tax :"+addition_tax)
      tax_amount = addition_tax + tax_amount
    }
    
  }
  // console.log(tax_amount)
  return tax_amount


  
}

  
  