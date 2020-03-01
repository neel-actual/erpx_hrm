
var fields_list = ["name1","category","unit_calculation","epf","pcb","socso","eis","default_amount","ea_form_field"]

$(function () {
    $("#multi_assign").change(function(event){
        if ($("#multi_assign").prop("checked")) {
            console.log("here")
            event.preventDefault();
            $('#select_multi').prop("disabled", false);
            $('#select_multi').formSelect()
        
            }else{
            event.preventDefault();
            $('#select_multi').prop("disabled", true);
            $('#select_multi').formSelect()
            }
    })


$("#assign").click(function(){
    var select_val= $("#select_multi").val()
    var additional = get_dict_value("edit")
    var child_doc_field = $("#edit_child_field").val()
    console.log(child_doc_field)
    console.log(additional)
    if ($("#multi_assign").prop("checked")) {
        select_val.forEach(element => {
            if(additional.name1 && additional.default_amount){
                hrm.add_child_item({
                    child_doctype : "Additionals",
                    child_doc_field : child_doc_field,
                    parent_doctype : "Employee",
                    parent_doc_name : element,
                    check_filters : {parent : element,parenttype:"Employee",parentfield:child_doc_field,name1:additional.name1,category:additional.category},
                    check_field : "name1",
                    new_obj : additional
                }).then(function(res){
                    M.toast({
                            html: res.message
                        })
                    location.reload(true);
                })
    
            }        
        });
    }
    if ($("#all_assign").prop("checked")) {
        hrm.list({
            "doctype":"Employee","fields":['name']
        }).then(function(res){
            console.log(res)
            res.message.forEach(element => {
                if(additional.name1 && additional.default_amount){
                    hrm.add_child_item({
                        child_doctype : "Additionals",
                        child_doc_field : child_doc_field,
                        parent_doctype : "Employee",
                        parent_doc_name : element.name,
                        check_filters : {parent : element.name,parenttype:"Employee",parentfield:child_doc_field,name1:additional.name1,category:additional.category},
                        check_field : "name1",
                        new_obj : additional
                    }).then(function(res){
                        M.toast({
                                html: res.message
                            })
                        location.reload(true);
                    })
        
                }  
            });
        })

    }
    
    console.log(select_val)
    
})

$("#addition").click(function(){
    $("#child_field").val("addition_items")
})
$("#deduction").click(function(){
    $("#child_field").val("deduction_item")
})
$("#overtime").click(function(){
    $("#child_field").val("overtime_item")
})
$("#save_add").click(function(){
    console.log("here")
    var child_doc_field = $("#child_field").val()
    var additional = get_dict_value("addition")
        
        if(additional.name1 && additional.default_amount){
            hrm.add_child_item({
                child_doctype : "Additionals",
                child_doc_field : child_doc_field,
                parent_doctype : "Payroll Setting",
                parent_doc_name : null,
                check_filters : {parent : null,parenttype:"Payroll Setting",parentfield:child_doc_field,name1:additional.name1,category:additional.category},
                check_field : "name1",
                new_obj : additional
            }).then(function(res){
                M.toast({
                        html: res.message
                    })
                location.reload(true);
            })

        }
})
$("#save_edit").click(function(){
    var additional = get_dict_value("edit")
    var child_doc_field = $("#edit_child_field").val()
        console.log(additional)

        hrm.update_child_item   ({
            child_doctype : "Additionals",
            child_doc_field : child_doc_field,
            parent_doctype : "Payroll Setting",
            parent_doc_name : null,
            check_filters : {parent : null,parenttype:"Payroll Setting",parentfield:child_doc_field,name1:additional.name1,category:additional.category},
            check_field : "name1",
            new_obj : additional
        }).then(function(res){
            // console.log(res)
            M.toast({
                    html: res.message
                })
            location.reload(true);
        })

})
$(".edit").click(function(){
    $("#edit_child_field").val("addition_items")
    fill_form_from_table($(this),"edit")
})
$(".edit-deduction").click(function(){
    $("#edit_child_field").val("deduction_item")
    fill_form_from_table($(this),"edit")
})
$(".edit-overtime").click(function(){
    $("#edit_child_field").val("overtime_item")
    fill_form_from_table($(this),"edit")
})

function fill_form_from_table(thisobj,form_id){
    check_box = ["epf","pcb","socso","eis","unit_calculation"]   
    check_box.forEach(element => {
        if(thisobj.closest('tr').find('td.{0}'.format(element))[0].childNodes[0].childNodes[0].checked){
            $("form#{0} :input[name={1}]".format(form_id,element)).prop( "checked", true );
        }        
    });
    $("form#{0} :input[name=name1]".format(form_id)).val(thisobj.closest('tr').find('td.name1').text())
    $("form#{0} :input[name=category]".format(form_id)).val(thisobj.closest('tr').find('td.category').text())
    $("form#{0} :input[name=category]".format(form_id)).formSelect()
    $("form#{0} :input[name=default_amount]".format(form_id)).val(thisobj.closest('tr').find('td.default_amount').text().split(" ")[1])
    $("form#{0} :input[name=ea_form_field]".format(form_id)).val(thisobj.closest('tr').find('td.ea_form_field').text())
    $("form#{0} :input[name=ea_form_field]".format(form_id)).formSelect()

}

function get_dict_value(form_id){
    var data_dict = {}
    fields_list.forEach(element => {
        
        if($("form#{0} :input[name={1}]".format(form_id,element)).val()){
            if($("form#{0} :input[name={1}]".format(form_id,element)).is(':checkbox')){
                console.log("here")
                if($("form#{0} :input[name={1}]".format(form_id,element)).is(':checked')){
                    data_dict[element] = 1
                }else{
                    data_dict[element] = 0
                }
            }else{
                data_dict[element] = $("form#{0} :input[name={1}]".format(form_id,element)).val()
            }
            
            console.log($("form#{0} :input[name={1}]".format(form_id,element)).val())
        }     
    });
    return data_dict;
}

})