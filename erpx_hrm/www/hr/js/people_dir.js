$(function () {
    "use strict";

    var FIELDS = {
            'first_name': 'First name',
            'middle_name': 'Middle name',
            'last_name': 'Last name',
            'department': 'Department',
            'branch': 'Branch',
            'company_email': 'Email',
            'cell_number': 'Mobile',
            'status': 'Status'
        },
        user_table = $('#user-table').DataTable({
            paging: true,
            searching: true,
            info: true,
            lengthChange: true,
            ordering: true,
            buttons: true,
            select: 'single'
        }),
        emps,
        $update_modal = $('#update-user\\.modal');


    //list down employees
    hrm.list({
        doctype: 'Employee',
        fields: ['name'].concat(Object.keys(FIELDS))
    }).then(function(res){
        if (res && res.message) {
            emps = res.message || [];
            emps.forEach(function (emp) {
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
    });

    //user select table
    user_table.on('select', function (e, dt, type, index) {
        var emp;


        console.log(e);
        //if no employees data, return
        if (emps === undefined) { return; }

        emp = emps[index];
        dt.deselect();
        $update_modal.modal('open').find('.modal-content > h5').text(emp.name);
        //clear previous
        $update_modal.find('form').empty();

        Object.keys(FIELDS).forEach(function (key) {
            var label = FIELDS[key],
                $input = $('<div class="row"><div class="input-field col s12">' +
                    '<input class="autocomplete" autocomplete="off" type="text" data-id="' + key + '"' +
                        'id="user-update-' + key + '" value="' + (emp[key] || '') + '">' +
                    '<label for="user-update-' + key + '" class="' + (emp[key] ? 'active' :'') + '">' + label + '</label>' +
                '</div></div>');

            //add autocomplete
            if (key === 'status') {
                setTimeout(function () {
                    $input.find('#user-update-' + key).autocomplete({
                        data: {
                            'Active': null,
                            'Left': null
                        }
                    });
                });
            }
            else if(key === 'branch' || key === 'department'){
                hrm.list({
                    'doctype': FIELDS[key]
                }).then(function(res){
                    var data = {};

                    if (res && res.message) {
                        res.message.forEach(function (branch) {
                            data[branch.name] = null;
                        });
                        $input.find('#user-update-' + key).autocomplete({
                            data: data
                        });
                    }
                })
            }

            $update_modal.find('form').append($input);
        });


        //update functionality
        $update_modal.find('.modal-footer .accept-btn').on('click', function (e) {
            //obtain data
            Object.keys(emp).forEach(function (key) {
                if (key === 'name') { return; }

                emp[key] = $update_modal.find('[data-id="' + key + '"]').val();
            });

            //close modal
            $update_modal.modal('close');

            //update frappe
            hrm.update('Employee', emp).then(function () {

                //update table
                emps[index] = emp;
                user_table.row(index).data([
                    [emp.first_name || '', emp.middle_name || '', emp.last_name || ''].join(' '),
                    emp.department || '',
                    emp.branch || '',
                    emp.company_email || '',
                    emp.cell_number || '',
                    emp.status || ''
                ]).draw();

                //notify
                M.toast({
                    html: 'Update successful!'
                })
            });
        });
    });
});