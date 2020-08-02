$(document).ready(async function(){
let currency = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
var param = sessionStorage.getItem("claim_name");
if(param){
    frappe.call({
        method:"frappe.client.get",
        args:{
            "doctype":"Expense Claim",
            "name":param
        },
        callback:function(res){
            console.log(res)
            res.message.expenses.forEach(element => {
                
                var row = $('<tr><td class="index">'+element['idx']+'</td><td class = "date">'+element['expense_date']+'</td><td class="claimtype">'+element['expense_type']+'</td><td class="merchant">'+element['merchant']+'</td><td class = "desc" style=" max-width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+element['description']+'</td><td class="claimamount">'+currency+parseFloat(element['amount']).toFixed(2)+'</td><td><input class="fileinput custom-file-input" value='+element['attach_document']+' id="file_upload" type="file"/></td><td><a class="modal-trigger edit" href="#add_claim_modal">Edit</a></td></tr>')
                dt.row.add(row).draw();
                
                
            });
            var data = dt.rows().data();
            var total = 0
            data.each(function (value, index) {
                total = total + parseFloat(value[5].split(" ")[1])
                // console.log(parseFloat(value[5].split(" ")[1]))
            });
            $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
            $('#total_amount').text(parseFloat(total).toFixed(2))
            sessionStorage.clear()
            localStorage.clear()
        }

    })

}

var today = moment().format('YYYY-MM-DD');
document.getElementById("sel_date").value = today;
// let currency = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})

var dt = $('#claim_table').DataTable({
    bFilter: false,
    "order": [[ 0, "asc" ]],
    columnDefs: [ {
        targets: 0,
        width: "5%"
      },
      {targets: 1,render: $.fn.dataTable.render.moment('DD-MM-YYYY')},
      {targets: 2},
      {targets: 3},
      {targets: 4},
      {targets: 5},
      {targets: 6},
      {targets: 7},
      {targets: 8,visible: false},
      {targets: 9,visible: false}
    ]
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
    console.log()
    if(!$('#index').val()){
        if($("#claim_form").valid()){   // test for validity
            var index = 0
            if(dt.row(':last').data() == null){
                index = 1
            }else{
                index = parseInt(dt.row(':last').data()[0]) + 1 
            }
            var row = $('<tr><td class="index">'+index+'</td><td class = "date">'+$('#sel_date').val()+'</td><td class="claimtype">'+$('#sel_claim_type').val()+'</td><td class="merchant">'+$('#sel_merchant').val()+'</td><td class = "desc" style=" max-width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+$('#sel_desc').val()+'</td><td class="claimamount">'+currency+parseFloat($('#sel_amount').val()).toFixed(2)+'</td><td><input class="fileinput custom-file-input" id="file_upload" type="file"/></td><td><a class="modal-trigger edit" href="#add_claim_modal">Edit</a></td><td>'+parseFloat($('#sel_distance').val() || 0).toFixed(2)+'</td><td>'+parseFloat($('#sel_distance_rate').val() || 0).toFixed(2)+'</td></tr>')
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
            document.getElementById("sel_date").value = today;     
        } else {
            // do stuff if form is not valid
            alert("Please Fill Form Data Properly")
        }

    }else{
       
        data = dt.row(parseInt($('#index').val())-1).data()
        
        console.log(data)
        data[1]=$('#sel_date').val()
        data[2]=$('#sel_claim_type').val()
        data[3]=$('#sel_merchant').val()
        data[4]=$('#sel_desc').val()
        data[5]=currency+parseFloat($('#sel_amount').val()).toFixed(2)
        dt.row(parseInt($('#index').val())-1).data(data).draw();
        var table_data = dt.rows().data();
        var total = 0
        table_data.each(function (value, index) {
            total = total + parseFloat(value[5].split(" ")[1])
            // console.log(parseFloat(value[5].split(" ")[1]))
        });
        $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
        $('#total_amount').text(parseFloat(total).toFixed(2))
        M.toast({
        html: 'Expense Updated Successfuly!'
        })
        $('#add_claim_modal').modal('close')
        console.log("update")
    }
    
   
});

$('#claim_table tbody').on( 'click', 'td.index', function () {
    console.log($(this).parent())
    $(this).parent().toggleClass('selected');
    // $(this).toggleClass('ideal')
  } );


$('#claim_table tbody').on( 'click', 'a.edit', function () {
    $('#add_claim').css("dispaly","none");
    $('#update_claim').css("dispaly","block");
    console.log("here")
    fill_form_from_table($(this),"claim_form")
    
})


function fill_form_from_table(thisobj,form_id){
     
    
    $("form#{0} :input[name=claim_type]".format(form_id)).val(thisobj.closest('tr').find('td.claimtype').text())
    $("form#{0} :input[name=claim_type]".format(form_id)).formSelect()
    $("form#{0} :input[name=merchant]".format(form_id)).val(thisobj.closest('tr').find('td.merchant').text())
    $("form#{0} :input[name=index]".format(form_id)).val(thisobj.closest('tr').find('td.index').text())
    console.log(thisobj.closest('tr').find('td.claimamount').text())
    $("form#{0} :input[name=claim_amount]".format(form_id)).val(thisobj.closest('tr').find('td.claimamount').text().split(" ")[1])
    $("form#{0} :input[name=desc]".format(form_id)).val(thisobj.closest('tr').find('td.desc').text())
    // $("form#{0} :input[name=ea_form_field]".format(form_id)).formSelect()

}

$("#remove_claim").click(function(){
    
    // dt.rows().nodes().to$()
    // array.forEach(element => {
        
    // });
    
  dt.rows('.selected').remove().draw(false);
  var table_data = dt.rows().data();
    var total = 0
    table_data.each(function (value, index) {
        total = total + parseFloat(value[5].split(" ")[1])
        // console.log(parseFloat(value[5].split(" ")[1]))
    });
    $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
    $('#total_amount').text(parseFloat(total).toFixed(2))
})

// $("#file_upload").change(function(){
//     console.log("here")
// })
$('#claim_table tbody').on( 'change', '#file_upload', function () {
    if($(this).val()){
        $(this).removeClass('custom-file-input').addClass('custom-file-input-after');
    }
  } );

var glb_approval_status = "Pending";

$("#draft_claim").click(function(){
    glb_approval_status = "Draft";
    saveClaim();
})

$("#save_claim").click(function(){
    glb_approval_status = "Pending";
    saveClaim();
})

var saveClaim = async function(){
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
            "sanctioned_amount":parseFloat(element[5].split(" ")[1]),
            "distance":parseFloat(element[8]),
            "distance_rate":parseFloat(element[9]),
        })
    }
    
    let cutoff = await get_cutoff()
    console.log(cutoff.getFullYear() + "-" + appendLeadingZeroes(cutoff.getMonth() + 1) + "-" + appendLeadingZeroes(cutoff.getDate()))
    frappe.call({
        method: 'erpx_hrm.api.create_claim',
        args: {
            'expense_approver':$("#sel_approver").val(),
            'expense_verifier':$("#sel_verifier").val(),
            'requester':$("#employee_id").val(),
            'claim_type':$("#sel_payment").val(),
            'cutoff_date':(cutoff.getFullYear() + "-" + appendLeadingZeroes(cutoff.getMonth() + 1) + "-" + appendLeadingZeroes(cutoff.getDate())).toString(),
            'expenses':exp_list,
            'approval_status': glb_approval_status
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
                    console.log(file)
                    // File Upload and link with Child table Item If File is Exist
                    if(file){

                        var reader = new FileReader();
                        reader.onload = function(){
                            var srcBase64 = reader.result;
                            frappe.call({
                                method:"frappe.client.attach_file",
                                args:{
                                    filename:file.name,
                                    filedata:srcBase64,
                                    doctype:"Expense Claim",
                                    docname:doc.name,
                                    folder: "Home/Attachments",
                                    is_private:1
                                },
                                
                                callback: function (r) {
                                    if (!r.exc_type) {
                                        console.log(r)
                                        console.log(doc.file_url)
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
                setTimeout(function() {
                    window.location.replace("/hr/my-claims");
                }, 3000);
                
            }
            
        }
    });
    // window.location.replace("/hr/my-claims")

};

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
    },
    errorPlacement: function(error, element) {
        if (element.attr("name") == "claim_type" )
            error.insertAfter(".claim_type_error");
        else if  (element.attr("name") == "claim_amount" )
            error.insertAfter(".claim_amount_error");
        else
            error.insertAfter(element);
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

var get_cutoff = async function(){
    let cutoff_day = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.cutoff_day})
    
    var d = new Date();
    var cd = new Date(d.getFullYear(),d.getMonth(),cutoff_day)
    if(cd <= d){
        cd = new Date(d.getFullYear(),d.getMonth()+1,cutoff_day)
    }
    return cd
}
function appendLeadingZeroes(n){
    if(n <= 9){
      return "0" + n;
    }
    return n
  }


$(document).ready(function () {
    $('#sel_claim_type').change(function(){ 
		toggle_div_distance();
    });
    $('#sel_distance').change(function(){ 
        count_amount_by_distance();
    });
    $('#sel_distance_rate').change(function(){ 
		count_amount_by_distance();
	});
});

function toggle_div_distance(){
	
	if($("#sel_claim_type").val() == "Mileage Charges"){
		$(".div_distance").show();
	}else{
        $(".div_distance").hide();
    }	
}

function count_amount_by_distance(frm, cdt, cdn){
    let distance = $('#sel_distance').val() || 0;
    let distance_rate = $('#sel_distance_rate').val() || 0;
    let amount = flt(distance) * flt(distance_rate);
    $('#sel_amount').val(amount);
}
