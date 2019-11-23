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
                }
            }
        });

    })

    // approver_val = frappe.db.get_value("Department Approver",{"parent":dep_name,"parentfield":"expense_approvers","approver":approver},"approver")

    $("#depval").change(function(){
        console.log($("#depval").val())
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
                }
            }
        });

    })







})