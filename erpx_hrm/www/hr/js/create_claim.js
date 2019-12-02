


$(document).ready(function(){

$("#claim_requester").change(function(){
    $("#employee_id").val($(this).val());
    frappe.call({
        method: 'frappe.client.get_value',
    args: {
        'doctype': 'Employee',
        'filters': {'name': $(this).val()},
        'fieldname': [
            'department'
        ]
    },
    callback: function(r) {
        if (!r.exc) {
            // code snippet
            console.log(r.message)
            $("#department").val(r.message['department']);
            frappe.call({
            method: 'erpx_hrm.api.get_approvers',
            args: {
            'employee': $("#employee_id").val(),
            'doctype': "Expense Claim"
            },
            callback: function(r) {
                if (!r.exc) {
                    // code snippet
                    console.log(r.message) 
                    $("#sel_approver").val(r.message[0])
                    // $('#sel_approver').material_select();
                    // var opt = ""
                    // for (let i = 0; i < r.message.length; i++) {
                    //     const element = r.message[i];
                    //     opt=opt+"<option value='"+element[0]+"'>"+element[0]+"</option>";
                        
                    // }
                    // $('#sel_approver').empty();
                    // $('#sel_approver').append(opt);
                    // $("#sel_approver").material_select()

                }
            }
        });
        }
    }
});
})

$("#add_claim").click(function(){
    var dt = $('#claim_table').DataTable()
    var index = 0
    var claim_type = ($('#sel_claim_type').val())
    var claim_date =($('#sel_date').val())
    var claim_merchant =($('#sel_merchant').val())
    var claim_amount =($('#sel_amount').val())
    var claim_desc =$('#sel_desc').val()
    var claim_attach =($('#file').val())
    
    console.log($('#claim_table').DataTable().rows().count());
    // if(claim_type && claim_date && claim_merchant && claim_amount && claim_desc && claim_attach){
        if(dt.row(':last').data() == null){
            index = 1
        }else{
            index = parseInt(dt.row(':last').data()[0]) + 1 
        }
        dt.row.add([
            index, $('#sel_date').val(), $('#sel_claim_type').val(),$('#sel_merchant').val(),$('#sel_desc').val(),$('#sel_amount').val(),$('#file').val()
          ]).draw();
          var data = dt.rows().data();
          var total = 0
          data.each(function (value, index) {
              total = total + parseFloat(value[5])
          });
          $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
          $('#total_amount').text(parseFloat(total).toFixed(2))
          M.toast({
            html: 'Expense Added Successfuly!'
        })
        $('#claim_form').trigger("reset");
    // }else{
    //     M.toast({
    //         html: 'Please Enter All Field!'
    //     })
    // }
    
    
    //   console.log($('#claim_table').DataTable().row(':last').data());
});
$("#save_claim").click(function(){
    var dt = $('#claim_table').DataTable()
    var exp_list = []
    // console.log($("#employee_id").val())
    // console.log($("#sel_approver").val())
    // console.log($("#sel_payment").val())
    // console.log(dt.rows().data())
    console.log(dt.column(0).data().length)
    for (let i = 0; i < dt.column().data().length; i++) {
        const element = dt.rows(i).data()[0];
        exp_list.push({
            "expense_date":element[1],
            "expense_type":element[2].toString(),
            "merchant":element[3].toString(),
            "description":element[4].toString(),
            "amount":parseFloat(element[5]),
            "sanctioned_amount":parseFloat(element[5])
        })
        
        
    }
    console.log(exp_list)
   
    frappe.call({
        method: 'erpx_hrm.api.create_claim',
        args: {
            'expense_approver':$("#sel_approver").val(),
            'requester':$("#employee_id").val(),
            'claim_type':$("#sel_payment").val(),
            'expenses':exp_list
        },
        callback: function(r) {
            if (!r.exc) {
                console.log(r.message)
                M.toast({
                    html: 'Approver Deleted Successfully!'
                })
            }
        }
    });

});
});

$("#upload_file").click(function(){

    frappe.call({
        method: 'erpx_hrm.api.upload_file',
        args: {
            'expense_approver':$("#sel_approver").val(),
            'requester':$("#employee_id").val(),
            'claim_type':$("#sel_payment").val(),
            'expenses':exp_list
        },
        callback: function(r) {
            if (!r.exc) {
                console.log(r.message)
                M.toast({
                    html: 'Approver Deleted Successfully!'
                })
            }
        }
    });

})
