$(function () {
    "use strict";

    var user_table = $('#user-table').DataTable({

    });

    $('#people-submodule').addClass('active open').find('> div').show();

    hrm.list({
        doctype: 'Employee',
        fields: ['name', 'first_name', 'middle_name', 'last_name', 'branch', 'department', 'company_email', 'cell_number', 'status']
    }).then(function(res){
        if (res && res.message) {
            (res.message || []).forEach(function (emp) {
                user_table.row.add([
                    [emp.first_name || '', emp.middle_name || '', emp.last_name || ''].join(' '),
                    emp.department || '',
                    emp.branch || '',
                    emp.company_email || '',
                    emp.cell_number || '',
                    emp.status || ''
                ]);
            });
            user_table.draw();
        }
    })
});