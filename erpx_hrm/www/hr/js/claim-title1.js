var glb_row_id = 0;

$(document).ready(async function(){
    var today = moment().format('YYYY-MM-DD');
    document.getElementById("sel_date").value = today;
    
    let currency = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
    var dt = $('#claim_table').DataTable({
        bFilter: false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        // "order":[0,'asc'],
        columnDefs: [{
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
    /* Role permission Setup*/

    // if(frappe.roles.includes("Expense Verified")){
        
    //     $("#add_approver").show()
    // }

    // if(frappe.roles.includes("Expense Approver")){
    //     console.log("here")
    //     $("#approve").removeProp("display")
    //     $("#decline").show()
    // }
    /* Role permission Setup*/
    
    $('#edit_claim_btn').on('click', function(){
        $('#claim_table').find('.hide').removeClass('hide');
        
        $('#claim_table').dataTable().fnDraw();
         
        return false  
    })

    $('#new_attach').change(function(e){
        var fileName = e.target.files[0].name;
        $('#file_attach_name i').text('');
        $('#file_attach_name i').text(fileName);
    });

    $('#claim_table tbody').on( 'click', 'td.index', function () {
        // console.log($(this).parent())
        $(this).parent().toggleClass('selected');
        // $(this).toggleClass('ideal')
      } );

    $("#remove_claim").click(function(){
        
        $('#claim_table').DataTable().rows('.selected').remove().draw(false);
        var table_data = $('#claim_table').DataTable().rows().data();
        var total = 0
        table_data.each(function (value, index) {
            total = total + parseFloat(value[5].split(" ")[1])
        });
        $('#p_total_claim_amount').text(currency +" "+ parseFloat(total).toFixed(2))
    });

    $("#btn_add_claim_modal").click(function(){
        $("#claim_form :input[name=index]").val("");
        $("#claim_form :input[name=claim_type]").val("");
        $("#claim_form :input[name=claim_type]").formSelect();
        $("#claim_form :input[name=merchant]").val("");    
        $("#claim_form :input[name=claim_amount]").val("");
        $("#claim_form :input[name=desc]").val("");
        $("#claim_form :input[name=distance]").val("");
        $("#claim_form :input[name=distance_rate]").val("");
        toggle_div_distance();
        $('#add_claim_modal').modal('open');
    
    })

    $("#submit_claim_btn").click(function(){
        frappe.call({
            method: 'erpx_hrm.api.set_value_custom',
            args: {
                'doctype': 'Expense Claim',
                'name': glb_expense_voucher,
                'fieldname': 'approval_status',
                'value':'Pending'
            },
            callback: function(r) {
                if (!r.exc) { 
                    window.location.replace("/hr/my-claims");
                }
            }
        });   

    });

    $("#verify").click(function(){

        frappe.call({
            method: 'erpx_hrm.api.set_value_custom',
            args: {
                'doctype': 'Expense Claim',
                'name':location.search.split("=")[1],
                'fieldname': 'approval_status',
                'value':'Verified'
            },
            callback: function(r) {
                if (!r.exc) { 
                    console.log(r.message)
                    window.location.replace("/hr/approval-claims");
                    // location.reload()
                }
            }
        });   

    });
    $("#update").click(function(){
        var exp_list = []
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
        
        frappe.call({
            method: 'erpx_hrm.api.udpate_claim',
            args: {
                'name' : glb_expense_voucher,
                'expenses':exp_list
            },
            callback: function(r) {
                M.toast({
                    html: 'Claim '+glb_expense_voucher+' Updated Successfully!'
                })
                setTimeout(function() {
                    window.location.reload();
                }, 3000);
            }
        });
    });

    $("#approve").click(function(){
        
        frappe.call({
            method: 'erpx_hrm.api.set_value_custom',
            args: {
                'doctype': 'Expense Claim',
                'name':location.search.split("=")[1],
                'fieldname': 'approval_status',
                'value':'Approved'
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.call({
                        method: 'erpx_hrm.api.custom_submit',
                        args: {
                            'doc':r.message
                        },
                        callback: function(r) {
                            if (!r.exc) {
                                console.log(r.message)
                                // location.reload()
                                window.location.replace("/hr/approval-claims");
                            }
                        }
                    }); 
                    console.log(r.message)
                    
                }
            }
        });   

    });
    
    $("#resubmit_claim_btn").click(function(){
        let name = location.search.split("=")[1];
        hrm.custom_update("Expense Claim",{
            'name':name,
            'remark':""}
        ).then(function(res){
            frappe.call({
                method: 'erpx_hrm.api.set_value_custom',
                args: {
                    'doctype': 'Expense Claim',
                    'name':name,
                    'fieldname': 'approval_status',
                    'value':'Draft'
                },
                callback: function(r) {
                    if (!r.exc) {
                        window.location.replace("/hr/claim-title1.html/?expense_claim="+name);                        
                    }
                }
            });
      })
    });

    $("#decline").click(function(){
        if($("#decline_remark").val() == NaN || $("#decline_remark").val() == ""){
            alert("Please Add Remark first!")
            return 0 
        }
        hrm.custom_update("Expense Claim",{
            'name':location.search.split("=")[1],
            'remark':"Rejected at Approval.<br>Remark: "+$("#decline_remark").val()}
        ).then(function(res){
              frappe.call({
                method: 'erpx_hrm.api.set_value_custom',
                args: {
                    'doctype': 'Expense Claim',
                    'name':location.search.split("=")[1],
                    'fieldname': 'approval_status',
                    'value':'Rejected'
                },
                callback: function(r) {
                    if (!r.exc) {
                        // frappe.call({
                        //     method: 'erpx_hrm.api.custom_submit',
                        //     args: {
                        //         'doc':r.message
                        //     },
                        //     callback: function(r) {
                        //         if (!r.exc) {
                        //             console.log(r.message)
                        //             // location.reload()
                        //             M.toast({
                        //                 html: 'Claim Rejected'
                        //             })
                        //             window.location.replace("/hr/approval-claims");
                        //         }
                        //     }
                        // }); 
                        console.log(r.message)
                        window.location.replace("/hr/approval-claims");
                        
                    }
                }
            });

          
          
      })


         
        
      });

    $('#claim_table tbody').on( 'click', 'a.edit', function () {
        $('#add_claim').css("dispaly","none");
        $('#update').css("dispaly","block");
        var data = dt.row( $(this).parents('tr') ).data();
        glb_row_id = dt.row($(this).parents('tr')).index();
        fill_form_from_table(data);      
    })
    
    
    function fill_form_from_table(data){
        
        let claim_type = data[2].replace("&amp;", "&");
        $("#claim_form :input[name=claim_type]").val(claim_type);
        $("#claim_form :input[name=claim_type]").formSelect();
        $("#claim_form :input[name=merchant]").val(data[3]);
        $("#claim_form :input[name=index]").val(data[0]);
        $("#claim_form :input[name=claim_amount]").val(data[5].split(" ")[1]);
        $("#claim_form :input[name=desc]").val(data[4]);
        $("#claim_form :input[name=distance]").val(data[8]);
        $("#claim_form :input[name=distance_rate]").val(data[9]);

        toggle_div_distance();
    
    }


      $("#assign_appeover").click(function(){
          if($("#assigned_approver").val() == NaN || $("#assigned_approver").val() == ""){
              alert("Please Select Approver first!")
              return 0 
          }
          console.log(location.search.split("=")[1])
          console.log($("#assigned_approver").val())
        hrm.custom_update("Expense Claim",{'name':location.search.split("=")[1],'expense_approver':$("#assigned_approver").val()}).then(function(res){

            M.toast({
                    html: 'Approver Assigned Successfully!'
                })

            frappe.call({
                method: 'erpx_hrm.api.set_value_custom',
                args: {
                    'doctype': 'Expense Claim',
                    'name':location.search.split("=")[1],
                    'fieldname': 'approval_status',
                    'value':'Verified'
                },
                callback: function(r) {
                    if (!r.exc) { 
                        console.log(r.message)
                        // location.reload()
                        window.location.replace("/hr/approval-claims");
                    }
                }
            });
            
        })
      });

      $("#reject_verification").click(function(){
        if($("#reject_remark").val() == NaN || $("#reject_remark").val() == ""){
            alert("Please Add Remark first!")
            return 0 
        }
        hrm.custom_update("Expense Claim",{
            'name':location.search.split("=")[1],
            'remark':"Rejected at Verification.<br>Remark: "+$("#reject_remark").val()}
        ).then(function(res){
          frappe.call({
              method: 'erpx_hrm.api.set_value_custom',
              args: {
                  'doctype': 'Expense Claim',
                  'name':location.search.split("=")[1],
                  'fieldname': 'approval_status',
                  'value':'Rejected'
              },
              callback: function(r) {
                  if (!r.exc) { 
                        // console.log(r.message)
                        // // location.reload()
                        // frappe.call({
                        //     method: 'erpx_hrm.api.custom_submit',
                        //     args: {
                        //         'doc':r.message
                        //     },
                        //     callback: function(r) {
                        //         if (!r.exc) {
                        //             console.log(r.message)
                        //             // location.reload()
                        //             M.toast({
                        //                 html: 'Verification Rejected'
                        //             })
                        //             window.location.replace("/hr/approval-claims");
                        //         }
                        //     }
                        // });
                    M.toast({
                        html: 'Verification Rejected'
                    })
                    window.location.replace("/hr/approval-claims");
                  }
              }
          });          
      })
    });

      $("#d_reimburse").click(function(){
        frappe.call({
            method: 'erpx_hrm.api.create_payment',
            args: {"expense_voucher":location.search.split("=")[1]},
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    location.reload()
                }
            }
        }); 
    
    })
    $("#get_attach").click(function(){
        var data = dt.rows().data();
        data.each(function (value, index) {
            
            if (value[6] != "No Attachment" ){
                // console.log($(value[6]).attr("href"));
                window.open($(value[6]).attr("href"),"_blank");
            }
        });
    })
    
    $("#clear_attach").click(function(){
        $("#attachment").val("")
        $('#new_attach').css("dispaly","block");
        frappe.call({
            method: 'erpx_hrm.api.remove_claim',
            args:{
                parent: location.search.split("=")[1],
                index:$("#index").val()
                
            },
            callback: function(res){
        
                if(Object.keys(res).length === 0){
                    M.toast({
                        html: "File Removed Successfully!"
                    })
                }
            }
        })
        
    })
    $("#upload_attach").click(async function(){
        console.log()
        var file = $("#new_attach")[0].files[0]
        var doc = await get_child(location.search.split("=")[1],$("#index").val())
        
        var docname = doc.message[0]["name"]
        
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
                        docname: location.search.split("=")[1],
                        folder: "Home/Attachments",
                        is_private:0
                    },
                    
                    callback: function (r) {
                        if (!r.exc_type) {
                            console.log(r.message)
                            $("#attachment").val(r.message.file_url)

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
                            
                        }else{
                            M.toast({
                                html: "File Not Attached!"
                            })

                        }
                    }
                });
            }
            reader.readAsDataURL(file);
        }else{
            M.toast({
                html: "Please Attach File FIrst!"
            })

        }

    });

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
                var row = $('<tr><td class="index">'+index+'</td><td class = "date">'+$('#sel_date').val()+'</td><td class="claimtype">'+$('#sel_claim_type').val()+'</td><td class="merchant">'+$('#sel_merchant').val()+'</td><td class = "desc" style=" max-width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+$('#sel_desc').val()+'</td><td class="claimamount">'+currency+parseFloat($('#sel_amount').val()).toFixed(2)+'</td><td><input class="fileinput custom-file-input" id="file_upload" type="file"/></td><td><a class="modal-trigger edit" href="#add_claim_modal">Edit</a></td><td class="distance">'+parseFloat($('#sel_distance').val() || 0).toFixed(2)+'</td><td class="distance_rate">'+parseFloat($('#sel_distance_rate').val() || 0).toFixed(2)+'</td></tr>')
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

            data = dt.row(glb_row_id).data();
            
            data[1]=$('#sel_date').val();
            data[2]=$('#sel_claim_type').val();
            data[3]=$('#sel_merchant').val();
            data[4]=$('#sel_desc').val()
            data[5]=currency+parseFloat($('#sel_amount').val()).toFixed(2)
            data[8]=parseFloat($('#sel_distance').val()).toFixed(2);
            data[9]=parseFloat($('#sel_distance_rate').val()).toFixed(2);
            if ($("#attachment").val() == ""){
                data[6]="No Attachment"
            }else{
                data[6]="<a href="+frappe.site_url+$("#attachment").val()+" target='_blank' class = 'atc' file = "+$("#attachment").val()+"><i class='material-icons-outlined'>attach_file</i></a>"
            }
            dt.row(glb_row_id).data(data).draw();
            
            var table_data = dt.rows().data();
            // var total = 0
            // table_data.each(function (value, index) {
            //     total = total + parseFloat(value[5].split(" ")[1])
            //     // console.log(parseFloat(value[5].split(" ")[1]))
            // });
            // $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
            // $('#total_amount').text(parseFloat(total).toFixed(2))
            M.toast({
            html: 'Expense Updated Successfuly!'
            })
            $('#add_claim_modal').modal('close')
            // console.log("update")

        }
           
            
        
        
       
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

var get_child = function (parent,idx) {
    return new Promise(function (resolve, reject) {
        try {
            frappe.call({
                method: 'erpx_hrm.api.get_child',
                args: {
                    doctype:"Expense Claim Detail",
                    filters:{"parent":parent,"idx":idx},
                    fields:["name"]
                },
                callback: resolve
            });
        } catch (e) { reject(e); }
    });
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
    $('#sel_amount').val(parseFloat(amount).toFixed(2));
}