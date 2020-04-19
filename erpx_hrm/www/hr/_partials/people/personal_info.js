$(document).ready(function(){
    var old_name = $('#divBasicInfo #old_name').val();     
    $("#btn-save-personal-info").click(function () {
        var args = {};
        var fields = [
            "nric_no",
            "passport_number",
            "current_address",
            "postal_code",
            "state",
            "nationality",
            "religion",
            "marital_status",
            "number_of_children",
            "spouse_working"       
        ]
        $.each(fields, function (key, element) {			        
            args[element] = $(`#divPersonalInfo [data-fieldname="${element}"]`).val();   						
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
});