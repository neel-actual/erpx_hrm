frappe.ui.form.on('Branch', {
	before_load: function(frm) {
		var update_tz_select = function() {
			frm.set_df_property("time_zone", "options", [""].concat(frappe.all_timezones));
		};

		if(!frappe.all_timezones) {
			frappe.call({
				method: "frappe.core.doctype.user.user.get_timezones",
				callback: function(r) {
					frappe.all_timezones = r.message.timezones;
					update_tz_select();
				}
			});
		} else {
			update_tz_select();
		}

    }
});