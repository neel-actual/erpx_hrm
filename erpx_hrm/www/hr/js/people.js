$(function () {
    $('#create_emp').on('submit', function(){
        event.preventDefault();
        var form = $(this);

        var obj = {};
        var fields = form.serializeArray();
        jQuery.each( fields, function( i, field ) {
            obj[field.name] = field.value;
        });

        $.ajax({
            url: '/api/resource/Employee',
            data: JSON.stringify(obj),
            type: form.attr("method"),
            dataType: 'json',
            headers: {'X-Frappe-CSRF-Token':frappe.csrf_token},
            success: function (data) {
                if (data.form_is_valid) {
                    console.log(data);
                    alert("successfully create employee");
                    window.location.reload();
                }
                else {
                    console.log(data);
                    alert("Some Data Missing...");
                }
            }
        });
        return false;
    });
});
