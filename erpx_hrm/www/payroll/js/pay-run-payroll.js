$(document).ready(async function () {  
  
  var param = sessionStorage.getItem("param1");
  if(param){
    // console.log(param);
    $('#step1').attr('class', '').addClass("step done");
    $('#step2').attr('class', '').addClass("step active");
    $("#step1_content").css("display","none")
    $("#step2_content").css("display","block")
  }
  
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
      $('#sel_month').change( function () {
        get_pay_info(user_table) 
        
      })
// Transfer Selected row to next table 
      $('#select_emp').click( function () {
        selected_emp.clear().draw();
        user_table.rows('.selected').every( function () {
          var d = this.data();
          selected_emp.row.add(d).draw();
      } );
      } );

      $('#select_emp tbody').on( 'click', 'tr',async function () {
        $(this).toggleClass('selected');
        $(this).toggleClass('ideal');});

      $('#selected_emp tbody').on( 'click', 'tr',async function () {
        // $(this).toggleClass('selected');
        // $(this).toggleClass('ideal');

        let currency = await hrm.get({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
        var tr = $(this).closest('tr');
        var row = selected_emp.row( tr );
        var employee_id = selected_emp.row(this).data()[0]; 
        let emp_pay_info = await hrm.get_payroll({employee:employee_id})
        var emp_epf = (((parseFloat(emp_pay_info.message[0].employee_epf_rate)+parseFloat(emp_pay_info.message[0].additional_epf)) * parseFloat(emp_pay_info.message[0].salary_amount))/100).toFixed(2);


        let pcb = await calculate_pcb(emp_pay_info.message[0].accumulated_salary,emp_pay_info.message[0].accumulated_epf,emp_pay_info.message[0].salary_amount,emp_epf,parseFloat(emp_pay_info.message[0].employee_eis_rate).toFixed(2),emp_pay_info.message[0].employee_socso_rate,emp_pay_info.message[0].addition_amount,emp_pay_info.message[0].deduction_amount,emp_pay_info.message[0].residence_status,emp_pay_info.message[0].is_disabled,emp_pay_info.message[0].marital_status,emp_pay_info.message[0].number_of_children,emp_pay_info.message[0].spouse_working,emp_pay_info.message[0].spouse_disable,emp_pay_info.message[0].past_deduction,emp_pay_info.message[0].accumulated_socso,emp_pay_info.message[0].accumulated_mtd,emp_pay_info.message[0].accumulated_zakat);
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
  // console.log(pay_info)

  pay_info.message.forEach(async(element) => {
    
    var gross_pay = parseFloat(parseFloat(element.salary_amount)+parseFloat(element.addition_amount)).toFixed(2)
    var employee_epf = (((parseFloat(element.employee_epf_rate)+parseFloat(element.additional_epf)) * parseFloat(element.salary_amount))/100).toFixed(2)
    var employee_eis = parseFloat(element.employee_eis_rate).toFixed(2)
    var employer_eis = parseFloat(((element.employer_eis_rate) * element.salary_amount)/100).toFixed(2)
    
    var employer_epf = parseFloat(((element.employer_epf+element.additional_employer_epf) * element.salary_amount)/100).toFixed(2)
    


    let pcb = await calculate_pcb(element.accumulated_salary,element.accumulated_epf,element.salary_amount,employee_epf,employee_eis,element.employee_socso_rate,element.addition_amount,element.deduction_amount,element.residence_status,element.is_disabled,element.marital_status,element.number_of_children,element.spouse_working,element.spouse_disable,element.past_deduction,element.accumulated_socso,element.accumulated_mtd,element.accumulated_zakat);
    

    var deduction = (parseFloat(element.deduction_amount) + parseFloat(employee_epf)+parseFloat(element.employee_socso_rate)+parseFloat(pcb)+parseFloat(employee_eis)+parseFloat(element.zakat_amount)).toFixed(2);
    var net_pay = parseFloat((gross_pay - deduction).toFixed(2)).toFixed(2)
    
    
    
    
    // console.log(employer_eis)
    var row = $('<tr class="ideal"><td>'+element.name+'</td><td><img src='+(element.image ? element.image : '/images/profile_icon.png')+' width="50" height="50" style="float: left;margin-right: 5px;border-radius: 50%" /><p style="margin-top: 5px;display: block"><span><a style="display: block; color:#00AEEF;">'+element.employee_name+'</a></span><span>'+element.designation+'</span></p></td><td>'+currency + parseFloat(element.salary_amount).toFixed(2)+'</td><td>'+currency +parseFloat(element.addition_amount).toFixed(2)+'</td><td>'+currency +gross_pay+'</td><td>'+currency +deduction+'</td><td>'+currency +net_pay+'</td><td>'+currency +employer_epf+'</td><td>'+currency +parseFloat(element.employer_socso_rate).toFixed(2)+'</td></tr>')
    
    user_table.row.add(row).draw();
    // console.log(pcb)
      
    });
}

async function calculate_pcb(accumulated_salary,accumulated_epf,current_salary,current_epf,current_eis,current_socso,additions,additional_deduction,residence_status,disable_status,marital_status,number_of_children,spouse_working,spouse_disable,past_deduction,accumulated_socso,accumulated_mtd,accumulated_zakat){
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

    var taxable_salary = ((accumulated_salary - accumulated_epf) + (current_salary - current_epf) + ((current_salary - future_epf)*n)) - (individual_relief + children_relief + spouce_relief +  accumulated_socso + current_socso + additional_deduction + past_deduction)

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
    
    
    tax_amount = ((taxable_salary - m)*(r*0.01) + b)/(n+1)
    
    // if (tax_amount < 0){
    //   tax_amount = 0
    // }
    // console.log(m)
    // console.log(b)
    // console.log(r)
    // console.log("Yearly tax withot addition: "+yearly_tax)
    var addition_tax = 0
    if(additions){
      yearly_taxble_with_addition = ((accumulated_salary - accumulated_epf) + (current_salary - current_epf) + ((current_salary - future_epf)*n) + (additions - 0)) - (individual_relief + children_relief + spouce_relief +  accumulated_socso + current_socso + additional_deduction + past_deduction)
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
      yearly_tax = (accumulated_zakat + tax_amount*(n+1))
      tax_amount_with_addition = ((yearly_taxble_with_addition - a_m)*(a_r*0.01) + a_b)
      // console.log("Yearly tax withot addition: "+yearly_tax)
      // console.log("tax amount with addition: "+tax_amount_with_addition)
      addition_tax = tax_amount_with_addition - yearly_tax
      tax_amount = addition_tax + tax_amount
    }
    
  }
  // console.log(tax_amount)
  return tax_amount


  
}

  
  