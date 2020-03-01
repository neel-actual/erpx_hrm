$(document).ready(function(){
    

    $("#verify").click(function(){

        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                'doctype': 'Expense Claim',
                'name':location.search.split("=")[1],
                'fieldname': 'approval_status',
                'value':'Verified'
            },
            callback: function(r) {
                if (!r.exc) { 
                    console.log(r.message)
                    location.reload()
                }
            }
        });   

    });

    $("#approve").click(function(){
        
        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                'doctype': 'Expense Claim',
                'name':location.search.split("=")[1],
                'fieldname': 'approval_status',
                'value':'Approved'
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.call({
                        method: 'frappe.client.submit',
                        args: {
                            'doc':r.message
                        },
                        callback: function(r) {
                            if (!r.exc) {
                                console.log(r.message)
                                location.reload()
                            }
                        }
                    }); 
                    console.log(r.message)
                    
                }
            }
        });   

    });
    $("#decline").click(function(){
        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                'doctype': 'Expense Claim',
                'name':location.search.split("=")[1],
                'fieldname': 'approval_status',
                'value':'Rejected'
            },
            callback: function(r) {
                if (!r.exc) {
                    frappe.call({
                        method: 'frappe.client.submit',
                        args: {
                            'doc':r.message
                        },
                        callback: function(r) {
                            if (!r.exc) {
                                console.log(r.message)
                                location.reload()
                            }
                        }
                    }); 
                    console.log(r.message)
                    
                }
            }
        }); 
      });




      $("#assign_appeover").click(function(){
          console.log(location.search.split("=")[1])
          console.log($("#assigned_approver").val())
        hrm.update("Expense Claim",{'name':location.search.split("=")[1],'expense_approver':$("#assigned_approver").val()}).then(function(res){

            M.toast({
                    html: 'Approver Assigned Successfully!'
                })

            frappe.call({
                method: 'frappe.client.set_value',
                args: {
                    'doctype': 'Expense Claim',
                    'name':location.search.split("=")[1],
                    'fieldname': 'approval_status',
                    'value':'Verified'
                },
                callback: function(r) {
                    if (!r.exc) { 
                        console.log(r.message)
                        location.reload()
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

        newWin.document.close();
    
        
    })


  });


