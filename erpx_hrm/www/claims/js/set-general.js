$(document).ready(function(){
    $("#cutoff").click(function(){
        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                'doctype': 'HRM Setting',
                'name':null,
                'fieldname': 'cutoff_day',
                'value':$("#cutday").val()
            },
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    M.toast({
                        html: 'Cutoff Date Saved Successfully!'
                    })
                    location.reload(true);
                }
            }
        });


    })

    $("#curr").click(function(){

        frappe.call({
            method: 'frappe.client.set_value',
            args: {
                'doctype': 'HRM Setting',
                'name':null,
                'fieldname': 'currency',
                'value':$("#currval").val()
            },
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    M.toast({
                        html: 'Currency Saved Successfully!'
                    })
                    location.reload(true);
                }
            }
        });

    })

    $("#app").click(function(){

        frappe.call({
            method: 'erpx_hrm.api.set_department_approver',
            args: {
                'department': $("#depval").val(),
                'approver': $("#appval").val()
            },
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    M.toast({
                        html: 'Approver Saved Successfully!'
                    })
                    location.reload(true);
                }
            }
        });

    })

    // approver_val = frappe.db.get_value("Department Approver",{"parent":dep_name,"parentfield":"expense_approvers","approver":approver},"approver")

    $("#depval").change(async function(){        
        frappe.call({
            method: 'erpx_hrm.api.get_department_approver',
            args: {
                'department': $("#depval").val()
            },
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    var table = document.getElementById("apptable");
                    table.innerHTML = "";
                    for (let i = 0; i < r.message.length; i++) {
                        const element = r.message[i];
                        
                        // Create an empty <tr> element and add it to the 1st position of the table:
                        var row = table.insertRow(0);
                        // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
                        var cell1 = row.insertCell(0);

                        // Add some text to the new cells:
                        cell1.innerHTML = element;
                    }
                }
            }
        });
        let verifier =await hrm.get_value("Department",fieldname=['expense_verifier'],filters={'name':$("#depval").val()})
        console.log(verifier.message.expense_verifier)
        if(verifier.message.expense_verifier){
            $("#verval").val(verifier.message.expense_verifier)
            $("#verval").formSelect()
        }else{
            $("#verval").val("")
            $("#verval").formSelect()
        }
    })
    $("#verifier_update").click(function(){
        if($("#depval").val() && $("#verval").val()){
            hrm.update("Department",{"name":$("#depval").val(),"expense_verifier":$("#verval").val()}).then(function(){
                M.toast({
                    html: 'Verifier Updated Successfully!'
                })  
                location.reload(true);
            })
        }else{
            M.toast({
                html: 'Please Select Appropriate Department and Verify!'
            })
        }
        
    })
    $("#delapp").click(function(){

        frappe.call({
            method: 'erpx_hrm.api.delete_department_approver',
            args: {
                'department': $("#depval").val(),
                'approver': $("#appval").val()
            },
            
            callback: function(r) {
                if (!r.exc) {
                    console.log(r.message)
                    M.toast({
                        html: 'Approver Deleted Successfully!'
                    })
                    location.reload(true);
                }
            }
        });

    })







})