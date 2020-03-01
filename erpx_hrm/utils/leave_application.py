from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import date_diff, add_months, today, getdate, add_days, flt, get_last_day
from erpx_hrm.utils.department_approver import get_approvers

@frappe.whitelist()
def on_update(doc, method):
	validate_leave_type(doc)
	if doc.status == "Open" and doc.docstatus < 1:
		notify_leave_approver(doc)

def validate_leave_type(doc):
	if (doc.leave_type == "Annual Leave") and not doc.emergency:
		days_before = add_days(today(), 5)
		if doc.from_date < days_before:
			frappe.throw(_("The start date has to be 5 days earlier from the date request"))

@frappe.whitelist()
def notify_leave_approver(doc):

	leave_approvers = get_approvers(filters={ "doctype": "Leave Application", "employee": doc.employee})

	for leave_approver in leave_approvers:
		leave_approver_email = leave_approver[0]

		if leave_approver_email!=doc.leave_approver:
			parent_doc = frappe.get_doc('Leave Application', doc.name)
			args = parent_doc.as_dict()

			template = frappe.db.get_single_value('HR Settings', 'leave_approval_notification_template')
			if not template:
				frappe.msgprint(_("Please set default template for Leave Approval Notification in HR Settings."))
				return
			email_template = frappe.get_doc("Email Template", template)
			message = frappe.render_template(email_template.response, args)

			doc.notify({
				# for post in messages
				"message": message,
				"message_to": leave_approver_email,
				# for email
				"subject": email_template.subject
			})