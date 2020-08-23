$(document).ready(function(){
    console.log(frappe)
    console.log(frappe.roles)
    var dt = $('#claim_table').DataTable({
        bFilter: false,
        columnDefs: [ {
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
                                // location.reload()reject_veri
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
                        window.location.replace("/hr/approval-claims");
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
                        // console.log(r.message)
                        
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
         
        
        $("form#{0} :input[name=claim_type]".format(form_id)).val(thisobj.closest('tr').find('td.claimtype').text())
        $("form#{0} :input[name=claim_type]".format(form_id)).formSelect()
        $("form#{0} :input[name=merchant]".format(form_id)).val(thisobj.closest('tr').find('td.merchant').text())
        $("form#{0} :input[name=index]".format(form_id)).val(thisobj.closest('tr').find('td.index').text())
        console.log(thisobj.closest('tr').find('td.claimamount').text())
        $("form#{0} :input[name=claim_amount]".format(form_id)).val(thisobj.closest('tr').find('td.claimamount').text().split(" ")[1])
        $("form#{0} :input[name=desc]".format(form_id)).val(thisobj.closest('tr').find('td.desc').text())
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

      $("#reject_verification2").click(function(){ 
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
                      console.log(r.message)
                      // location.reload()
                    //   frappe.call({
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
                    // window.location.replace("/hr/approval-claims");
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

  });


