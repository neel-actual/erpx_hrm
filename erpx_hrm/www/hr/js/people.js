$("#btn-save-employee").click(function () {
    var args = {};
    var fields = [
        "naming_series",
        "alternate_staff_id",
        "first_name",
        "last_name",
        "preferred_name",
        "designation",
        "personal_email",
        "cell_number",
        "reports_to",
        "department",
        "employment_type",
        "gender",
        "branch",
        "date_of_joining",
        "date_of_birth"
    ]
    $.each(fields, function (key, element) {			        
        args[element] = $(`#divBasicInfo [data-fieldname="${element}"]`).val();   						
    });    

    var url = '/api/resource/Employee';    
    var type = 'POST';
    var old_name = $('#divBasicInfo #old_name').val();
    if(old_name != ''){
        url += '/' + old_name;
        type = 'PUT';
    }
    frappe.ajax({
        type: type,
        url: url,
        args: args,
        callback: function (r) {
            if (!r.exc_type) {                
                location.reload();
            }
        }
    });
});

$("#btn-save-about-me").click(function () {
    var args = {};
    var fields = [
        "bio",
        "favorites"        
    ]
    $.each(fields, function (key, element) {			        
        args[element] = $(`#divAboutMe [data-fieldname="${element}"]`).val();   						
    });    

    var url = '/api/resource/Employee';    
    var type = 'POST';
    var old_name = $('#divBasicInfo #old_name').val();
    if(old_name != ''){
        url += '/' + old_name;
        type = 'PUT';
    }
    frappe.ajax({
        type: type,
        url: url,
        args: args,
        callback: function (r) {
            if (!r.exc_type) {                
                location.reload();
            }
        }
    });
});