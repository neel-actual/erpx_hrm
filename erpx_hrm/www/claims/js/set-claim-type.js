$(document).ready(function(){
    $("#add_claim").click(function(){
        $('#exedit').hide();
        $('#extype').show();
    })
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

    $(".edit_claim_type").click(function(){
        $('#exedit').show();
        $('#extype').hide();
        $("form#expense_type :input[name=ex_title]").attr('readonly', true);
        
        $("form#expense_type :input[name=ex_title]").val($(this.closest('tr')).find('td.claim_title').text())

        $("form#expense_type :input[name=ex_account]").val($(this.closest('tr')).find('td.claim_account').text())
        $("form#expense_type :input[name=ex_account]").formSelect() 

        $("form#expense_type :input[name=ex_desc]").val($(this.closest('tr')).find('td.claim_desc').text())
        
        $("form#expense_type :input[name=ex_claim_limit]").val($(this.closest('tr')).find('td.claim_limit').text())  
        
    })

    $('#exedit').click(function(){
        data_dict = {}
        data_dict["name"] = $("form#expense_type :input[name=ex_title]").val()
        // data_dict["default_account"] = $("form#expense_type :input[name=ex_account]").val()
        data_dict["description"] = $("form#expense_type :input[name=ex_desc]").val()
        data_dict["claim_limit"] = $("form#expense_type :input[name=ex_claim_limit]").val()
        hrm.update("Expense Claim Type",data_dict).then(function () {
            hrm.update_child_item   ({
                child_doctype : "Expense Claim Account",
                child_doc_field : "accounts",
                parent_doctype : "Expense Claim Type",
                parent_doc_name : data_dict['name'],
                check_filters : {},
                check_field : "",
                new_obj : {"company":"BAYO PAY (M) SDN BHD (1191346-P)","default_account":$("form#expense_type :input[name=ex_account]").val()}
            }).then(function(res){
                M.toast({
                    html: 'Claim Type {0} Updated Successfully'.format(data_dict['name'])
                    })
                location.reload(true);
            })
        });
        
        // console.log(data_dict)
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