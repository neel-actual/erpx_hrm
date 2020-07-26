$(document).ready(function () {

	$("#file-acc").on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			var srcBase64 = reader.result;
			frappe.ajax({
				type: "POST",
				url: `/api/method/erpx_hrm.utils.employee.upload_employee_image`,
				no_stringify: 1,
				args: {
					filename : file.name,
                    filedata : srcBase64,
                    docname : glb_employee_name,
				},
				callback: function (r) {
					if (!r.exc_type) {
						M.toast({
							html: "Updated Successfully!"
						})
						location.reload();
					}
				}
			});
		};
		reader.readAsDataURL(file);
    });
});

function list() {
    var list = document.getElementById('list');
    var card = document.getElementById('card');
    var btn_list = document.getElementById('btn_list');
    var btn_card = document.getElementById('btn_card');
    list.style.display = "block";
    card.style.display = "none";
    btn_list.classList.add('active');
    btn_card.classList.remove('active');
}

function card() {
    var list = document.getElementById('list');
    var card = document.getElementById('card');
    var btn_list = document.getElementById('btn_list');
    var btn_card = document.getElementById('btn_card');
    list.style.display = "none";
    card.style.display = "block";
    btn_list.classList.remove('active');
    btn_card.classList.add('active');
}

function profile() {
    var people_list = document.getElementById('peoplelist');
    var profile = document.getElementById('profile');
    people_list.style.display = "none";
    profile.style.display = "block";
}

function removeDefault() {
    var default_indicator = document.getElementsByClassName('default-indicator')[0];
    var indicator = document.getElementsByClassName('indicator')[0];
    default_indicator.style.display = "none";
    indicator.style.display = "block";
}

function employee_edit() {
    var emp_edit = document.getElementById('employee_btn');
    var bank_edit = document.getElementById('bank_btn');
    emp_edit.style.display = "block";
    bank_edit.style.display = "none";

}

function bank_edit() {
    var emp_edit = document.getElementById('employee_btn');
    var bank_edit = document.getElementById('bank_btn');
    emp_edit.style.display = "none";
    bank_edit.style.display = "block";
}
document.addEventListener('DOMContentLoaded', function () {
    var elems = document.querySelectorAll('.dropdown-trigger');
});
$('.dropdown-trigger').dropdown();