var personal_field_list = ["name","first_name","middle_name","last_name","employee_name","department","company_email","cell_number","date_of_joining","reports_to","date_of_birth","gender","employment_type","passport_number","marital_status","permanent_address","designation","image","nationality","country","state","city","postal_code","number_of_children","is_disabled","nric_no","residence_status","residence_type","spouse_working","spouse_disable"]

var bank_info = ["name","salary_basis","salary_amount","epf_contribution","epf_no","employee_epf_rate","additional_epf","employer_epf","additional_employer_epf","pcb_no","sosco_contribution","sosco_catagory","eis_contribution","zakat_no","zakat_amount","salary_mode","total_eis_rate","total_socso_rate","employee_socso_rate","employer_socso_rate","employee_eis_rate","employer_eis_rate"]
function profile(employee){
    // console.log(employee)
    
    hrm.list({
      doctype:"Employee",
      filters:[{"name":employee}],
      fields:personal_field_list,
      limit_page_length: 100000
    }).then(function(res){
      obj = res.message[0];
      $.each( obj, function( key, value ) {
        // console.log( key + ": " + value );
        if($("#over_{0}".format(key)).length){
            $("#over_{0}".format(key)).text(value)
        }    
    });  
    $('#modal_email').val(obj.company_email)
    $('#sum_name').text("Here’s quick profile of " + obj.employee_name)
    hrm.list({
    doctype:"Employee",
    filters:[{"name":obj.reports_to}],
    fields:["employee_name","image"],
    limit_page_length: 100000
    }).then(function(res){
    obj = res.message[0];
    $('#a_report').text(obj.employee_name)
    if(obj.image){
    $('#reportto_pic').attr('src', obj.image);}
    })
    
    

    $.each( obj, function( key, value ) {
    // console.log( key + ": " + value );
    obj = res.message[0];
    if($("form#formID :input[name={0}]".format(key)).length){
        $("form#formID :input[name={0}]".format(key)).val(value) 
        if($("form#formID :input[name={0}]".format(key)).is("select")){
            $("form#formID :input[name={0}]".format(key)).formSelect()
        }
    }    
    });   
    })

    hrm.list({
        doctype:"Employee",
        filters:[{"name":employee}],
        fields:bank_info
      }).then(function(res){
        console.log(res.message)
        obj = res.message[0];
        $.each( obj, function( key, value ) {
            // console.log( key + ": " + value );
            if($("form#bank_form :input[name={0}]".format(key)).length){
                $("form#bank_form :input[name={0}]".format(key)).val(value) 
                if($("form#bank_form :input[name={0}]".format(key)).is("select")){
                    $("form#bank_form :input[name={0}]".format(key)).formSelect()
                }
            }    
            });

        set_epf_property($("form#bank_form :input[name=epf_contribution]").val(),["employee_epf_rate","additional_epf","employer_epf","additional_employer_epf"])
        set_epf_property($("form#bank_form :input[name=socso_contribution]").val(),["sosco_amount"])
        set_epf_property($("form#bank_form :input[name=eis_contribution]").val(),["eis_amount"])
        set_eis_contribution()
        set_socso_contribution()
        calculate_total($("form#bank_form :input[name=employee_epf_rate]").val(),$("form#bank_form :input[name=additional_epf]").val(),"total_employee_rate") 
        calculate_total($("form#bank_form :input[name=employer_epf]").val(),$("form#bank_form :input[name=additional_employer_epf]").val(),"total_employer_rate") 


      })
    
    var people_list = document.getElementById('peoplelist');
    var profile = document.getElementById('profile');
    people_list.style.display = "none";
    profile.style.display = "block";
  }

$(document).ready(function () {

    $('#update_emp').click(function(){
        var emp_dict = {}
        personal_field_list.forEach(element => {
            if($("form#formID :input[name={0}]".format(element)).val()){
                emp_dict[element] = $("form#formID :input[name={0}]".format(element)).val()
            }     
        });
        hrm.update('Employee', emp_dict).then(function(res){
            console.log(res)
            M.toast({
                    html: 'Update successful!'
                })
            location.reload(true);
        })
    });

    $('#update_bank_info').click(function(){
        var emp_dict = {}
        bank_info.forEach(element => {
            if($("form#bank_form :input[name={0}]".format(element)).val()){
                emp_dict[element] = $("form#bank_form :input[name={0}]".format(element)).val()
            }     
        });
        hrm.update('Employee', emp_dict).then(function(res){
            console.log(res)
            M.toast({
                    html: 'Update successful!'
                })
            location.reload(true);
        })
    });

    user_table = $('#user-table').DataTable({
        columnDefs: [ 
            {
                targets: 0,
                
                width: "25%"
              },
              {
                targets: 1,
                
                width: "19%"
              },
              {
                targets: 2,
                
                width: "6%"
              },
              {
                targets: 3,
                
                width: "10%"
              },
              {
                targets: 4,
                
                width: "6%"
              }
        ],

        paging: true,
        searching: true,
        info: true,
        lengthChange: true,
        ordering: true,
        buttons: true
    })
    $('#search_i').keyup(function(){
        // console.log("onup")
        user_table.search($(this).val()).draw() ;
        });
    
      $('#sel_department').change(function(){
        
        var filter_status = $("#sel_department").val();
        // console.log(user_table)
        user_table.column(1).search(filter_status, true, false, false).draw();
    });
    $('#sel_branch').change(function(){
    
    var filter_status = $("#sel_branch").val();
    // console.log(user_table)
    user_table.column(2).search(filter_status, true, false, false).draw();
    });

    $('#empt_sel').change(function(){
    
    var filter_status = $("#empt_sel").val();
    // console.log(user_table)
    user_table.column(3).search(filter_status, true, false, false).draw();
    });

    $('#sal_mode').change(function(){
    
    var filter_status = $("#sal_mode").val();
    // console.log(user_table)
    user_table.column(4).search(filter_status, true, false, false).draw();
    });

    $('#clear_filter').click(function(){
        // console.log("here")
        location.reload(true);
    });

    $("form#bank_form :input[name=epf_contribution]").change(function(){
        set_epf_property($("form#bank_form :input[name=epf_contribution]").val(),["employee_epf_rate","additional_epf","employer_epf","additional_employer_epf"]) 
    })

    $("form#bank_form :input[name=socso_contribution]").change(function(){
        set_socso_contribution()     
         
    })
    $("form#bank_form :input[name=socso_catagory]").change(function(){
        set_socso_contribution()     
         
    })

    $("form#bank_form :input[name=eis_contribution]").change(function(){
        set_eis_contribution()
    })

    

    $(".epf_values").change(function(){
        calculate_total($("form#bank_form :input[name=employee_epf_rate]").val(),$("form#bank_form :input[name=additional_epf]").val(),"total_employee_rate") 
        calculate_total($("form#bank_form :input[name=employer_epf]").val(),$("form#bank_form :input[name=additional_employer_epf]").val(),"total_employer_rate") 
    })



})


function set_epf_property(field_value,field_name){
    if(field_value == "No"){
        field_name.forEach(element => {
            $("form#bank_form :input[name={0}]".format(element)).prop( "disabled", true );
        });
        // $("form#bank_form :input[name=employee_epf_rate]").prop( "disabled", true );
        // $("form#bank_form :input[name=additional_epf]").prop( "disabled", true );
        // $("form#bank_form :input[name=employer_epf]").prop( "disabled", true );
        // $("form#bank_form :input[name=additional_employer_epf]").prop( "disabled", true );
    }else{
        field_name.forEach(element => {
            $("form#bank_form :input[name={0}]".format(element)).prop( "disabled", false );
        });
        // $("form#bank_form :input[name=employee_epf_rate]").prop( "disabled", false );
        // $("form#bank_form :input[name=additional_epf]").prop( "disabled", false );
        // $("form#bank_form :input[name=employer_epf]").prop( "disabled", false );
        // $("form#bank_form :input[name=additional_employer_epf]").prop( "disabled", false );
    }
}

function calculate_total(epf,additional,field_name){
    var total = parseFloat(epf) + parseFloat(additional);
    $("form#bank_form :input[name={0}]".format(field_name)).val(total)  
}

function set_socso_contribution(){
    hrm.get_single_child("SOCSO Details",["min_monthly_wages","max_monthly_wages","employers_contribution","employees_contribution","employer_contribution_second"]).then(function(res){
        var salary = $("form#bank_form :input[name=salary_amount]").val()
        if ($("form#bank_form :input[name=socso_contribution]").val() == "Yes"){
            set_epf_property($("form#bank_form :input[name=socso_contribution]").val(),["sosco_amount"])
            if ($("form#bank_form :input[name=socso_catagory]").val() == "First"){
                res.message.forEach(element => {
                    console.log(element)
                    if(salary > element.min_monthly_wages && salary <= element.max_monthly_wages){
                        $("form#bank_form :input[name=employee_socso_rate]").val(element.employees_contribution)
                        $("form#bank_form :input[name=employer_socso_rate]").val(element.employers_contribution)
                        calculate_total(element.employees_contribution,element.employers_contribution,"total_socso_rate")
    
                    }
                });

            }else{
                res.message.forEach(element => {
                    console.log(element)
                    if(salary > element.min_monthly_wages && salary <= element.max_monthly_wages){
                        $("form#bank_form :input[name=employee_socso_rate]").val(0.00)
                        $("form#bank_form :input[name=employer_socso_rate]").val(element.employer_contribution_second)
                        calculate_total(0.00,element.employer_contribution_second,"total_socso_rate")
    
                    }
                });

            }

            
            // res.message.forEach(element => {
            //     console.log(element)
            //     if(salary > element.min_monthly_wages && salary <= element.max_monthly_wages){
            //         $("form#bank_form :input[name=employee_socso_rate]").val(element.employees_contribution)
            //         $("form#bank_form :input[name=employer_socso_rate]").val(element.employers_contribution)
            //         calculate_total(element.employees_contribution,element.employers_contribution,"total_socso_rate")

            //     }
            // });

        }else{
            set_epf_property($("form#bank_form :input[name=socso_contribution]").val(),["sosco_amount"])
            $("form#bank_form :input[name=employee_socso_rate]").val(0.00)
            $("form#bank_form :input[name=employer_socso_rate]").val(0.00)
            $("form#bank_form :input[name=total_socso_rate]").val(0.00)
        }
        
    })
}

function set_eis_contribution(){

    hrm.get_single_child("EIS Deatails",["min_monthly_wages","max_monthly_wages","employers_contribution","employees_contribution"]).then(function(res){
        var salary = $("form#bank_form :input[name=salary_amount]").val()
        if ($("form#bank_form :input[name=eis_contribution]").val() == "Yes"){
            set_epf_property($("form#bank_form :input[name=eis_contribution]").val(),["sosco_amount"])
            res.message.forEach(element => {
                console.log(element)
                if(salary > element.min_monthly_wages && salary <= element.max_monthly_wages){
                    $("form#bank_form :input[name=employee_eis_rate]").val(element.employees_contribution)
                    $("form#bank_form :input[name=employer_eis_rate]").val(element.employers_contribution)
                    calculate_total(element.employees_contribution,element.employers_contribution,"total_eis_rate")

                }
            });

        }else{
            set_epf_property($("form#bank_form :input[name=eis_contribution]").val(),["sosco_amount"])
            $("form#bank_form :input[name=employee_eis_rate]").val(0.00)
            $("form#bank_form :input[name=employer_eis_rate]").val(0.00)
            $("form#bank_form :input[name=total_eis_rate]").val(0.00)
        }
    })
    set_epf_property($("form#bank_form :input[name=eis_contribution]").val(),["eis_amount"])

}