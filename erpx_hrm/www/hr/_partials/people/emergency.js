$(document).ready(function(){
    var old_name = $('#divBasicInfo #old_name').val();     
    $("#btn-save-emergency").click(function () {
        var args = {};
        var fields = [
            "person_to_be_contacted",
            "relation",
            "emergency_phone_number"
        ]
        $.each(fields, function (key, element) {			        
            args[element] = $(`#divEmergency [data-fieldname="${element}"]`).val();   						
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