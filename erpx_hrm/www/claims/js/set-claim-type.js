$(document).ready(function(){
    $("#extype").click(function(){
        if($("#title").val() && $("#account-code").val() && $("#description").val() && $("#claim_limit").val()){

            frappe.call({
                method: 'erpx_hrm.api.add_expense_type',
                args: {
                    "title":$("#title").val(),
                    "account":$("#account-code").val(),
                    "desc":$("#description").val(),
                    "claim_limit":$("#claim_limit").val()
                },
                callback: function(r) {
                    if (!r.exc) {
                        console.log(r.message)
                        $('#create-news\\.modal').modal('close')
                        M.toast({
                            html: 'Expense Claim Type Added Successfully!'
                        })
                        $( "#typetab" ).load( "set-claim-type.html #typetab" );
                    }
                }
            }); 

        }else{
            M.toast({
                html: 'Please add all Fields'
            })
        }
        

    })

    $(".delete_but").click(function() {
        
        var $row = $(this).closest("tr"); 
        // console.log($row)
        // Find the row
        var $text = $row.find(".claim_title").text(); // Find the text
        frappe.call({
            method: 'erpx_hrm.api.delete_expense_type',
            args: {
                "doctype":"Expense Claim Type",
                "name":$text
            },
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    M.toast({
                        html: 'Expense Claim Type Deleted Successfully!'
                    })
                    $( "#typetab" ).load( "set-claim-type.html #typetab" );
                }
            }
        });
        
    });
})