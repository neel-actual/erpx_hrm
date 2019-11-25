


$(document).ready(function(){
$('select').material_select();
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
                    for (let i = 0; i < r.message.length; i++) {
                        const element = r.message[i];
                        console.log(element)
                        
                    }                  
                    
                         
                    //     var Options="";
                    //     $.each(data, function(val){ 
                    //       Options=Options+"<option value='"+val.id+"'>"+val.name+"</option>";
                    //   });
                    //   $('#select_2').empty();
                    //   $('#select_2').append(Options);
                    //   $("#select_2").material_select()

                }
            }
        });
        }
    }
});
})
});