$(document).ready(function () {

	let user_image = frappe.get_cookie("user_image");

	if(user_image) {
		$(".img-acc-settings").css("background-image",`url(${user_image})`);
	}

	$("#file-acc").on('change', function() {
		var file = this.files[0];
		var reader = new FileReader();
		reader.onload = function(){
			var srcBase64 = reader.result;
			frappe.ajax({
				type: "POST",
				url: `/api/method/erpx_hrm.utils.user.upload_user_image`,
				no_stringify: 1,
				args: {
					filename : file.name,
					filedata : srcBase64
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


	// Update password
	$("#update").click(function() {
		var args = {
			old_password: $("#old_password").val(),
			new_password: $("#new_password").val(),
			confirm_password: $("#confirm_password").val()
		}

		if(!args.old_password) {
			frappe.msgprint("{{ _("Current Password Required.") }}");
			return;
		}
		if(!args.new_password) {
			frappe.msgprint("{{ _("New Password Required.") }}");
			return;
		}
		if(!args.confirm_password) {
			frappe.msgprint("{{ _("Confirm Password	Required.") }}");
			return;
		}
		if(args.new_password != args.confirm_password) {
			frappe.msgprint("{{ _("Your password does not match. Please retype it to confirm.") }}");
			return;
		}
		frappe.call({
			type: "POST",
			method: "frappe.core.doctype.user.user.update_password",
			btn: $("#update"),
			args: args,
			statusCode: {
				401: function() {
					frappe.msgprint("{{ _("The current password you have entered is incorrect.") }}");
				},
				200: function(r) {
					$("#old_password").val("");
					$("#new_password").val("");
					$("#confirm_password").val("");
					if(r.message) {
						frappe.msgprint("{{ _("Password Updated") }}");
					}
				}
			}
		});

		return false;
	});	

	// Update password
	$("#btn_birthday_reminder").click(function() {
		let stop_birthday_reminders = 1;
		if($(this).is(':checked')){
			stop_birthday_reminders = 0;
		}
		
		frappe.ajax({
			type: "POST",
			url: `/api/method/frappe.client.set_value`,
			no_stringify: 1,
			args: {
				'doctype': 'HR Settings',
				'name': '',
				'fieldname': 'stop_birthday_reminders',
				'value': stop_birthday_reminders
			},
			callback: function (r) {
				M.toast({
					html: "Updated Successfully!"
				})
			}
		});
	})
});
