$(document).ready(async function(){
console.log(frappe.session)

var today = moment().format('YYYY-MM-DD');
document.getElementById("sel_date").value = today;



let currency = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
dt = $('#claim_table').DataTable({
    columnDefs: [ {
        targets: 0,
        width: "5%"
      },
      {targets: 1,width: "10%",render: $.fn.dataTable.render.moment('DD-MM-YYYY')},
      {targets: 2,width: "10%"},
      {targets: 3,width: "10%"},
      {targets: 4,width: "15%"},
      {targets: 5,width: "15%"},
      {targets: 6,width: "15%"}]
})

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
    if($("#claim_form").valid()){   // test for validity
        var index = 0
        if(dt.row(':last').data() == null){
            index = 1
        }else{
            index = parseInt(dt.row(':last').data()[0]) + 1 
        }
        var row = $('<tr><td>'+index+'</td><td>'+$('#sel_date').val()+'</td><td class="claimtype">'+$('#sel_claim_type').val()+'</td><td class="merchant">'+$('#sel_merchant').val()+'</td><td>'+$('#sel_desc').val()+'</td><td class="claimamount">'+currency+parseFloat($('#sel_amount').val()).toFixed(2)+'</td><td><input class="fileinput custom-file-input" type="file"/></td></tr>')
        dt.row.add(row).draw();
        var data = dt.rows().data();
        var total = 0
        data.each(function (value, index) {
            total = total + parseFloat(value[5].split(" ")[1])
            // console.log(parseFloat(value[5].split(" ")[1]))
        });
        $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
        $('#total_amount').text(parseFloat(total).toFixed(2))
        M.toast({
        html: 'Expense Added Successfuly!'
        })
        $('#claim_form').trigger("reset");        
    } else {
        // do stuff if form is not valid
        alert("Please Fill Form Data Properly")
    }
   
});

$('#claim_table tbody').on( 'click', 'tr', function () {
    $(this).toggleClass('selected');
    // $(this).toggleClass('ideal')
  } );

$("#remove_claim").click(function(){
    
    // dt.rows().nodes().to$()
    // array.forEach(element => {
        
    // });
    
  dt.rows('.selected').remove().draw(false);
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
            "amount":parseFloat(element[5].split(" ")[1]),
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
                var doc = r.message
                // Loop On every table row to find attachment and childtable name to attach it
                $('#claim_table').DataTable().rows().every( function ( rowIdx, tableLoop, rowLoop ) {
                    var data = this.nodes().to$();
                    var file = $(data.find('.fileinput'))[0].files[0]
                    var docname = ''
                    doc.expenses.forEach(element => {
                        if(element['expense_type']== $(data.find('.claimtype')).text() && element['merchant'] == $(data.find('.merchant')).text() || element['amount'] ==  parseInt($(data.find('.claimamount')).text())){
                            docname =  element['name']
                        }
                    });  
                    // File Upload and link with Child table Item If File is Exist
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
                                    docname: doc.name,
                                    folder: "Home/Attachments",
                                    is_private: 1,
                                    from_form : 1
                                },
                                callback: function (r) {
                                    if (!r.exc_type) {
                                        // console.log(r.message)
                                        // console.log(doc.file_url)
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
                                            html: "File Attached Successfully!"
                                        })
                                        location.reload();
                                    }
                                }
                            });
                        }
                        reader.readAsDataURL(file);
                    }

                });
                M.toast({
                    html: 'Claim '+doc.name+' Created Successfully!'
                })
            }
        }
    });

});

$("#claim_form").validate({
    rules: {
        claim_type: {
        required: true
      },
      claim_date: {
        required: true
      },
      claim_amount: {
        required: true,
        number: true
      }
    },
    messages: {
    claim_type: {
        required: "Please Select Claim Type"
      },
      claim_date: {
        required: "Please Enter Claim Date"
      },
      claim_amount: {
        required: "Please Enter Claim Amount",
        number: "Claim Amount Should be number only"
      }
    }
  });





});





// $("#upload_file").click(function(){

//     console.log($("#file")[0].files[0])
//     var file = $("#file")[0].files[0];
    
//     var reader = new FileReader();
//     reader.readAsDataURL(file);
//     reader.onload = function(){
//         var srcBase64 = reader.result;
//         frappe.call({
//             method:'frappe.client.attach_file',
//             args: {
//                 filename:$("#file")[0].files[0].name,
//                 filedata:srcBase64,
//                 doctype:"Expense Claim",
//                 docname:"New Expense Claim 1"

//             },
//             callback: function(res){
//                 console.log(res)
//             }
//         });
//     }

// })

var get_value = function (opts) {
    return new Promise(function (resolve, reject) {
        try {
            frappe.call({
                method: 'frappe.client.get',
                args: {
                    doctype: opts.doctype,
                    name: opts.name,
                    filters: opts.filters,
                    parent: opts.parent
                },
                callback: resolve
            });
        } catch (e) { reject(e); }
    });
}
