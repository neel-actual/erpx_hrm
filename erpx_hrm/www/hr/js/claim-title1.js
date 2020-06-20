$(document).ready(function(){
    // console.log(frappe)
    // console.log(frappe.roles)
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
          {targets: 1,width: "10%",render: $.fn.dataTable.render.moment('DD-MM-YYYY')},
          {targets: 2,width: "10%"},
          {targets: 3,width: "10%"},
          {targets: 4,width: "15%"},
          {targets: 5,width: "15%"},
          {targets: 6,width: "10%"},
          {targets: 7,width: "5%"}]
    })

    dt.order( [ 0, 'asc' ] )
    .draw();
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
        sessionStorage.claim_name = location.search.split("=")[1];
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
                                        html: 'Claim Rejected'
                                    })
                                    window.location.replace("/hr/approval-claims");
                                }
                            }
                        }); 
                        console.log(r.message)
                        
                    }
                }
            });

          
          
      })


         
        
      });

      $('#claim_table tbody').on( 'click', 'a.edit', function () {
        $('#add_claim').css("dispaly","none");
        $('#update_claim').css("dispaly","block");
        console.log("here")
        fill_form_from_table($(this),"claim_form")
        
    })
    
    
    function fill_form_from_table(thisobj,form_id){
         
        
        $("form#claim_form :input[name=claim_type]").val(thisobj.closest('tr').find('td.index').text())
        $("form#claim_form :input[name=index]").val(thisobj.closest('tr').find('td.claimtype').text())
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
        
                if(Object.keys(obj).length === 0){
                    M.toast({
                        html: "File Removed Successfully!"
                    })
                }
            }
        })
        
    })
    $("#upload_attach").click(function(){
        console.log()
        var file = $("#new_attach")[0].files[0]
        var doc = get_child(location.search.split("=")[1],$("#index").val())
        console.log(doc)
        var docname = ''
        
        console.log(file)
        // File Upload and link with Child table Item If File is Exist
        // if(file){

        //     var reader = new FileReader();
        //     reader.onload = function(){
        //         var srcBase64 = reader.result;
        //         frappe.call({
        //             method:"frappe.client.attach_file",
        //             args:{
        //                 filename:file.name,
        //                 filedata:srcBase64,
        //                 doctype:"Expense Claim",
        //                 docname: location.search.split("=")[1],
        //                 folder: "Home/Attachments",
        //                 is_private:1
        //             },
                    
        //             callback: function (r) {
        //                 if (!r.exc_type) {
        //                     console.log(r)
        //                     // console.log(doc.file_url)
        //                     // frappe.call({
        //                     //     method: 'frappe.client.set_value',
        //                     //     args: {
        //                     //         doctype: "Expense Claim Detail",
        //                     //         name: docname,
        //                     //         fieldname: "attach_document",
        //                     //         value:r.message.file_url
        //                     //     },
        //                     //     callback: function(res){
        //                     //         console.log(res)
        //                     //     }
        //                     // });
        //                     // M.toast({
        //                     //     html: "File Attached Successfully!"
        //                     // })
                            
        //                 }
        //             }
        //         });
        //     }
        //     reader.readAsDataURL(file);
        // }

    });


  });

var get_child = function (parent,idx) {
    return new Promise(function (resolve, reject) {
        try {
            frappe.call({
                method: 'erpx_hrm.api.get_child',
                args: {
                    doctype:"Expense Claim Details",
                    filters:{"parent":parent,"idx":idx},
                    fields:["name"]
                },
                callback: resolve
            });
        } catch (e) { reject(e); }
    });
}
