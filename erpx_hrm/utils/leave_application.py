from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import date_diff, add_months, today, getdate, add_days, flt, get_last_day

@frappe.whitelist()
def on_update(doc, method):
	validate_leave_type(doc)

def validate_leave_type(doc):
	if (doc.leave_type == "Annual Leave") and not doc.emergency:
		days_before = add_days(today(), 5)
		if doc.from_date < days_before:
			frappe.throw(_("The start date has to be 5 days earlier from the date request"))