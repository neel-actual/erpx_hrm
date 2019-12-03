function profile(employee){
    console.log(employee)
    hrm.list({
      doctype:"Employee",
      filters:[{"name":employee}],
      fields:["employee_name","department","company_email","cell_number","date_of_joining","reports_to","date_of_birth","gender","employment_type","passport_number","marital_status","permanent_address","designation","image"],
      limit_page_length: 100000
    }).then(function(res){
      obj = res.message[0];
      
      $('#sum_name').text("Here’s quick profile of " + obj.employee_name)
      $('#p_emp_name').text(obj.employee_name)
      $("#i_full_name").val(obj.employee_name)
      $("#i_pass").val(obj.passport_number)
      $("#i_date").val(obj.date_of_birth)
      $("#i_gend").val(obj.gender)
      $("#i_emp_type").val(obj.employment_type)
      $("#i_emp_type").formSelect()
      $("#i_join_date").val(obj.date_of_joining)
      $('#s_desi').text(obj.designation)
      $('#s_email').text(obj.company_email)
      $('#s_mob').text(obj.cell_number)
      $('#p_dep').text(obj.department)
      $('#p_join').text(obj.date_of_joining)
      $('#a_report').text(obj.reports_to)
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
      if(obj.image){
        $('#pro_pic').attr('src', obj.image);
      }  
      



    })
    
    var people_list = document.getElementById('peoplelist');
    var profile = document.getElementById('profile');
    people_list.style.display = "none";
    profile.style.display = "block";
  }

$(function () {
    user_table = $('#user-table').DataTable({
        paging: true,
        searching: true,
        info: true,
        lengthChange: true,
        ordering: true,
        buttons: true
    })
    $('#search_i').keyup(function(){
        console.log("onup")
        user_table.search($(this).val()).draw() ;
        });
    
      $('#sel_department').change(function(){
        
            var filter_status = $("#sel_department").val();
            console.log(user_table)
            user_table.column(1).search(filter_status, true, false, false).draw();
        });
        $('#sel_branch').change(function(){
        
        var filter_status = $("#sel_branch").val();
        console.log(user_table)
        user_table.column(2).search(filter_status, true, false, false).draw();
        });
    
        $('#empt_sel').change(function(){
        
        var filter_status = $("#empt_sel").val();
        console.log(user_table)
        user_table.column(3).search(filter_status, true, false, false).draw();
        });
    
        $('#sal_mode').change(function(){
        
        var filter_status = $("#sal_mode").val();
        console.log(user_table)
        user_table.column(4).search(filter_status, true, false, false).draw();
        });
    
        $('#clear_filter').click(function(){
          console.log("here")
          location.reload(true);
        });


        
    // var newRow = "<tr><td>row 3, cell 1</td><td>row 3, cell 2</td></tr>";
    // user_table.row.add($(newRow )).draw();
    // hrm.list({
    //     doctype: 'Employee',
    //     fields: ['name','employee_name','department','branch','employment_type','salary_mode','designation','image'],
    //     limit_page_length: 100000
    // }).then(function(res){
    //     if (res && res.message) {
    //         emps = res.message || [];
    //         emps.forEach(function (emp) {
    //             var $card,
    //                 name = [emp.first_name || '', emp.middle_name || '', emp.last_name || ''].join(' ');

    //             //populate table
    //             user_table.row.add([
    //                 emp.employee_name,
    //                 emp.department || '',
    //                 emp.branch || '',
    //                 emp.employment_type || '',
    //                 emp.salary_mode || ''
    //             ]);

    //             //populate cards
    //             // $card = $profile_card_main.clone().removeClass('hide profile-card-main');
    //             // if (emp.image) {
    //             //     $card.find('.card-image img').attr('src', emp.image);
    //             // }
    //             // $card.find('.card-title h6').text(name);
    //             // $card.find('.card-title p').text(emp.designation);
    //             // $card.find('.card-content div').eq(0).find('span').text(emp.department);
    //             // $card.find('.card-content div').eq(1).find('span').text(emp.branch);
    //             // $card.find('.card-content div').eq(2).find('span').text(emp.cell_number);
    //             // $profile_cards.append($card);
    //         });
    //         user_table.draw();
    //     }
    // });
})