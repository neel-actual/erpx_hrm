$(document).ready(function(){
    var old_name = $('#old_name').val();     
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
        var old_name = $('#old_name').val();
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