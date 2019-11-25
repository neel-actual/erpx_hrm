


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
                    // $('#sel_approver').material_select();
                    var opt = ""
                    for (let i = 0; i < r.message.length; i++) {
                        const element = r.message[i];
                        opt=opt+"<option value='"+element[0]+"'>"+element[0]+"</option>";
                        
                    }
                    $('#sel_approver').empty();
                    $('#sel_approver').append(opt);
                    $("#sel_approver").material_select()

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
    if(claim_type && claim_date && claim_merchant && claim_amount && claim_desc && claim_attach){
        if(dt.row(':last').data() == null){
            index = 1
        }else{
            index = parseInt(dt.row(':last').data()[0]) + 1 
        }
        dt.row.add([
            index, $('#sel_date').val(), $('#sel_claim_type').val(),$('#sel_merchant').val(),$('#sel_desc').val(),$('#sel_amount').val(),$('#file').val()
          ]).draw();
          var data = dt.rows().data();
          data.each(function (value, index) {
              console.log(`For index ${index}, data value is ${value}`);
          });
        // $('#claim_form').reset()
    }else{
        M.toast({
            html: 'Please Enter All Field!'
        })
    }
    
    
    //   console.log($('#claim_table').DataTable().row(':last').data());
});
});