$(document).ready(function(){
    console.log(frappe)
    console.log(frappe.roles)
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


  });


