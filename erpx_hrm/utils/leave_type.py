from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import date_diff, add_months, today, getdate, add_days, flt, get_last_day
from erpx_hrm.utils.department_approver import get_approvers

@frappe.whitelist()
def show_detail(name=None):
	if name:
		doc = frappe.get_doc("Leave Type", name)
	else:
		doc = frappe.new_doc("Leave Type")
		doc.max_leaves_allowed = 0

	list_earned_leave_frequency = ["Monthly", "Quarterly","Half-Yearly","Yearly"]
	list_rounding = ["0.5","1.0"]

	context = {
		"doc": doc,
		"list_earned_leave_frequency": list_earned_leave_frequency,
		"list_rounding": list_rounding
	}

	return frappe.render_template("templates/includes/hr/leave_type.html",
			context)
