$(document).ready(function(){
    $("#approve").click(function(){
        // console.log(location.search.split("=")[1])
        
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


      $("#reimburse").click(function(){
        frappe.call({
            method: 'erpx_hrm.api.make_salary',
            args: {"expense_claim":location.search.split("=")[1]},
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                }
            }
        }); 
      });
  });


// Reimbursement Via Direct Payment

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