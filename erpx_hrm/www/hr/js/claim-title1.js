$(document).ready(async function(){
    // console.log(frappe)
    // console.log(frappe.roles)
    let currency = await get_value({doctype: "HRM Setting"}).then(function(res){return res.message.currency+" "})
    var dt = $('#claim_table').DataTable({
        bFilter: false,
        "paging":   false,
        "ordering": false,
        "info":     false,
        "order":[0,'asc'],
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
          {targets: 7}]
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
    
        // dt.rows().nodes().to$()
        // array.forEach(element => {
            
        // });
        
    $('#claim_table').DataTable().rows('.selected').remove().draw(false);
      var table_data = $('#claim_table').DataTable().rows().data();
      console.log(table_data)
        var total = 0
        table_data.each(function (value, index) {
            total = total + parseFloat(value[5].split(" ")[1])
            console.log(parseFloat(value[5].split(" ")[1]))
        });
        console.log(total)
        // $('#tabtotal_amount').val(parseFloat(total).toFixed(2))
        $('#p_total_claim_amount').text(currency +" "+ parseFloat(total).toFixed(2))
    })

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
        window.location.replace("/hr/create-claim");
        // frappe.call({
        //     method: 'erpx_hrm.api.set_value_custom',
        //     args: {
        //         'doctype': 'Expense Claim',
        //         'name':location.search.split("=")[1],
        //         'fieldname': 'approval_status',
        //         'value':'Verified'
        //     },
        //     callback: function(r) {
        //         if (!r.exc) { 
        //             console.log(r.message)
        //             window.location.replace("/hr/approval-claims");
        //             // location.reload()
        //         }
        //     }
        // });   

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
    $("#decline").click(function(){
        if($("#decline_remark").val() == NaN || $("#decline_remark").val() == ""){
            alert("Please Add Remark first!")
            return 0 
        }
        console.log(location.search.split("=")[1])
        console.log($("#decline_remark").val())
      hrm.custom_update("Expense Claim",{'name':location.search.split("=")[1],'remark':"Rejected at Approval.<br>Remark: "+$("#decline_remark").val()}).then(function(res){

          


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
                        
                    }
                }
            });

          
          
      })


         
        
      });

      $('#claim_table tbody').on( 'click', 'a.edit', function () {
        $('#add_claim').css("dispaly","none");
        $('#update').css("dispaly","block");
        console.log("here")
        fill_form_from_table($(this),"claim_form")
        
    })
    
    
    function fill_form_from_table(thisobj,form_id){
         
        
        // $("form#claim_form :input[name=claim_type]").val(thisobj.closest('tr').find('td.index').text())
        
        $("form#claim_form :input[name=claim_type]").val(thisobj.closest('tr').find('td.claimtype').text())
        $("form#claim_form :input[name=claim_type]").formSelect()
        $("form#claim_form :input[name=merchant]").val(thisobj.closest('tr').find('td.merchant').text())
        $("form#claim_form :input[name=index]").val(thisobj.closest('tr').find('td.index').text())
        console.log(thisobj.closest('tr').find('td.claimamount').text())
        $("form#claim_form :input[name=claim_amount]").val(thisobj.closest('tr').find('td.claimamount').text().split(" ")[1])
        $("form#claim_form :input[name=desc]").val(thisobj.closest('tr').find('td.desc').text())
        
        // console.log(thisobj.closest('tr').find('a.atc').attr("file"))
        parts = thisobj.closest('tr').find('td.date').text().split('-')
        $("form#claim_form :input[name=attachment]").val(thisobj.closest('tr').find('a.atc').attr("file"))
        $("form#claim_form :input[name=claim_date]").val(parts[2]+"-"+parts[1]+"-"+parts[0])
        
        // $("form#{0} :input[name=ea_form_field]".format(form_id)).formSelect()
    
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
        console.log(location.search.split("=")[1])
        console.log($("#reject_remark").val())
      hrm.custom_update("Expense Claim",{'name':location.search.split("=")[1],'remark':"Rejected at Verification.<br>Remark: "+$("#reject_remark").val()}).then(function(res){

          

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
                      console.log(r.message)
                      // location.reload()
                      frappe.call({
                        method: 'erpx_hrm.api.custom_submit',
                        args: {
                            'doc':r.message
                        },
                        callback: function(r) {
                            if (!r.exc) {
                                console.log(r.message)
                                // location.reload()
                                M.toast({
                                    html: 'Verification Rejected'
                                })
                                window.location.replace("/hr/approval-claims");
                            }
                        }
                    }); 
                    //   window.location.replace("/hr/approval-claims");
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
    $("#print_page").click(function(){
        

        var divToPrint=document.getElementById('DivIdToPrint');

        var newWin=window.open('','Print-Window');
    
        newWin.document.open();
    
        newWin.document.write(`<html><body onload="window.print()">
        <link rel="stylesheet" type="text/css" href="/app-assets/vendors/vendors.min.css">
        <link rel="stylesheet" type="text/css" href="/css/materialize.css">
        <link rel="stylesheet" type="text/css" href="/css/style.css" >
        <link rel="stylesheet" type="text/css" href="/css/animate.css">
        <link rel="stylesheet" type="text/css" href="/css/master.css">`+divToPrint.innerHTML+`</body></html>`)
        // window.close();
        newWin.document.close();
        
    
        
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
                var row = $('<tr><td class="index">'+index+'</td><td class = "date">'+$('#sel_date').val()+'</td><td class="claimtype">'+$('#sel_claim_type').val()+'</td><td class="merchant">'+$('#sel_merchant').val()+'</td><td class = "desc" style=" max-width: 100px;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;">'+$('#sel_desc').val()+'</td><td class="claimamount">'+currency+parseFloat($('#sel_amount').val()).toFixed(2)+'</td><td><input class="fileinput custom-file-input" id="file_upload" type="file"/></td><td><a class="modal-trigger edit" href="#add_claim_modal">Edit</a></td></tr>')
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
            if ($("#attachment").val() == ""){
                data[6]="No Attachment"
            }else{
                data[6]="<a href="+frappe.site_url+$("#attachment").val()+" target='_blank' class = 'atc' file = "+$("#attachment").val()+"><i class='material-icons-outlined'>attach_file</i></a>"
            }
            dt.row(parseInt($('#index').val())-1).data(data).draw();
            
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
