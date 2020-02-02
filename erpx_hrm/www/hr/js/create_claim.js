


$(document).ready(function(){

dt = $('#claim_table').DataTable()

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
    // var dt = $('#claim_table').DataTable()
    var index = 0
    // var claim_type = ($('#sel_claim_type').val())
    // var claim_date =($('#sel_date').val())
    // var claim_merchant =($('#sel_merchant').val())
    // var claim_amount =($('#sel_amount').val())
    // var claim_desc =$('#sel_desc').val()
    // var claim_attach =($('#file').val())
    
    // console.log($('#claim_table').DataTable().rows().count());
    // if(claim_type && claim_date && claim_merchant && claim_amount && claim_desc && claim_attach){
        if(dt.row(':last').data() == null){
            index = 1
        }else{
            index = parseInt(dt.row(':last').data()[0]) + 1 
        }



        var row = $('<tr><td>'+index+'</td><td>'+$('#sel_date').val()+'</td><td class="claimtype">'+$('#sel_claim_type').val()+'</td><td class="merchant">'+$('#sel_merchant').val()+'</td><td>'+$('#sel_desc').val()+'</td><td class="claimamount">'+$('#sel_amount').val()+'</td><td><input class="fileinput" type="file"/></td></tr>')
        dt.row.add(row).draw();
        // dt.row.add([
        //     index, $('#sel_date').val(), $('#sel_claim_type').val(),$('#sel_merchant').val(),$('#sel_desc').val(),$('#sel_amount').val(),$('#file').val()
        //   ]).draw();
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

// $('#claim_table tbody').on( 'click', 'tr', function () {
//     $(this).toggleClass('selected');
//     // $(this).toggleClass('ideal')
//   } );

$("#remove_claim").click(function(){
    
    // dt.rows().nodes().to$()
    // array.forEach(element => {
        
    // });
    
//   dt.rows('.selected').remove().draw(false);
})

$("#save_claim").click(function(){
    // var dt = $('#claim_table').DataTable()
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
    // console.log(exp_list)
   
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
                var data = this.nodes().to$();
                var file = $(data.find('.fileinput'))[0].files[0]
                var docname = ''
                $('#claim_table').DataTable().rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                    r.message.expenses.forEach(element => {
                        if(element['expense_type']== $(data.find('.claimtype')).text() && element['merchant'] == $(data.find('.merchant')).text() || element['amount'] ==  parseInt($(data.find('.claimamount')).text())){
                            docname =  element['name']
                        }
                });  
                if(file){
                    var reader = new FileReader();
                    reader.onload = function(){
                    var srcBase64 = reader.result;
                    frappe.ajax({
                        type: "POST",
                        url: `/api/method/erpx_hrm.utils.frappe.upload_file`,
                        no_stringify: 1,
                        args: {
                            name : "file",
                            filename : file.name,
                            filedata : srcBase64,
                            doctype: "Expense Claim",
                            docname: r.message.name,
                            folder: "Home/Attachments",
                            is_private: 1,
                            from_form : 1
                        },
                        callback: function (r) {
                            if (!r.exc_type) {
                                console.log(r)
                                frappe.call({
                                    method: 'frappe.client.set_value',
                                    args: {
                                        doctype: "Expense Claim Detail",
                                        name: docname,
                                        fieldname: "attach_document",
                                        value:r.message.file_url
                                    },
                                    callback: function(res){
                                        console.log(res)
                                    }
                                });
                                M.toast({
                                    html: "Added Successfully!"
                                })
                                // location.reload();
                            }
                        }
                    });
                    }
                    reader.readAsDataURL(file);
                }

                });
                M.toast({
                    html: 'Claim Created Successfully!'
                })
            }
        }
    });

});
});

$("#upload_file").click(function(){

    console.log($("#file")[0].files[0])
    var file = $("#file")[0].files[0];
    
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function(){
        var srcBase64 = reader.result;
        frappe.call({
            method:'frappe.client.attach_file',
            args: {
                filename:$("#file")[0].files[0].name,
                filedata:srcBase64,
                doctype:"Expense Claim",
                docname:"New Expense Claim 1"

            },
            callback: function(res){
                console.log(res)
            }
        });
    }

    
        
            
        


})

var upload_attachment = function(){
    var reader = new FileReader();
                    reader.onload = function(){
                    var srcBase64 = reader.result;
                    frappe.ajax({
                        type: "POST",
                        url: `/api/method/erpx_hrm.utils.frappe.upload_file`,
                        no_stringify: 1,
                        args: {
                            name : "file",
                            filename : file.name,
                            filedata : srcBase64,
                            doctype: "Expense Claim",
                            docname: r.message.name,
                            folder: "Home/Attachments",
                            is_private: 1,
                            from_form : 1
                        },
                        callback: function (r) {
                            if (!r.exc_type) {
                                console.log(r)
                                frappe.call({
                                    method: 'frappe.client.set_value',
                                    args: {
                                        doctype: "Expense Claim Detail",
                                        name: docname,
                                        fieldname: "attach_document",
                                        value:r.message.file_url
                                    },
                                    callback: function(res){
                                        console.log(res)
                                    }
                                });
                                M.toast({
                                    html: "Added Successfully!"
                                })
                                // location.reload();
                            }
                        }
                    });
                    }
                    reader.readAsDataURL(file);
}
