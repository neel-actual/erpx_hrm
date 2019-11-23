$("#download").click(function(){
    console.log("here")
    frappe.call({
        method: 'erpx_hrm.api.download_expense_claim_report',
        args: {
            
        },
        callback: function(r) {
            if (!r.exc) {
                console.log(r.message)
                
            }
        }
    });
})