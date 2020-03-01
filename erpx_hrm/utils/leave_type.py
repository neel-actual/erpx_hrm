from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import date_diff, add_months, today, getdate, add_days, flt, get_last_day
from erpx_hrm.utils.department_approver import get_approvers

@frappe.whitelist()
def show_detail(name):
	doc = frappe.get_doc("Leave Type", name)
	context = {
		"doc": doc
	}
	return frappe.render_template("templates/includes/hr/leave_type.html",
			context)
