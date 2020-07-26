from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import date_diff, add_months, today, getdate, add_days, flt, get_last_day, to_timedelta, now, nowdate
from erpx_hrm.utils.department_approver import get_approvers
#from erpnext.hr.doctype.leave_application.leave_application import get_leave_allocation_records


@frappe.whitelist()
def on_update(doc, method):
	validate_leave_type(doc)
	if doc.status == "Open" and doc.docstatus < 1:
		notify_leave_approver(doc)

def validate_leave_type(doc):
	if (doc.leave_type == "Annual Leave") and not doc.emergency:
		days_before = add_days(today(), 5)
		if doc.status == "Open" and doc.docstatus < 1 and getdate(doc.from_date) < getdate(days_before):
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

@frappe.whitelist()
def get_leave_allocation(employee, leave_type, date=None):
	if not date:
		date = today()
	return get_leave_allocation_for_period(employee, leave_type, date, date)

@frappe.whitelist()
def update_leave_allocation(employee, leave_allocation_name, new_balance, total_balance, formData):	
	if leave_allocation_name and new_balance and employee and total_balance:
		#Update leave Ledger Entry  		
		leave_ledger_entry = frappe.get_doc("Leave Ledger Entry", {"transaction_name": leave_allocation_name})		
		if leave_ledger_entry:
			new_balance = flt(new_balance)
			total_balance = flt(total_balance)
			new_leaves = (new_balance - total_balance) + leave_ledger_entry.leaves

			frappe.db.sql("""update `tabLeave Ledger Entry` 
				set leaves=%(leaves)s where name = %(name)s """,{
					"name": leave_ledger_entry.name,
					"leaves": new_leaves				
			})

			#Update leave allocation	
			frappe.db.set_value("Leave Allocation", leave_allocation_name, "total_leaves_allocated", new_balance)

			#Insert history
			data = json.loads(formData)
			update_leave_balance_doc = frappe.new_doc('Update Leave Balance')
			update_leave_balance_doc.update(data)		
			update_leave_balance_doc.insert(ignore_permissions=True)
		
	return update_leave_balance_doc or None			

def get_leave_allocation_for_period(employee, leave_type, from_date, to_date):
	leave_allocated = 0
	leave_allocations = frappe.db.sql("""
		select name, from_date, to_date, total_leaves_allocated
		from `tabLeave Allocation`
		where employee=%(employee)s and leave_type=%(leave_type)s
			and docstatus=1
			and (from_date between %(from_date)s and %(to_date)s
				or to_date between %(from_date)s and %(to_date)s
				or (from_date < %(from_date)s and to_date > %(to_date)s))
	""", {
		"from_date": from_date,
		"to_date": to_date,
		"employee": employee,
		"leave_type": leave_type
	}, as_dict=1)
	if not leave_allocations:
		return None
	return leave_allocations[0]

@frappe.whitelist()
def import_update_leave_balance(data):		
	data = json.loads(data)
	for _data in data:		
		update_leave_balance_doc = frappe.new_doc('Update Leave Balance')
		update_leave_balance_doc.update(_data)		
		update_leave_balance_doc.insert(ignore_permissions=True)
	return True

@frappe.whitelist()
def get_balance_history(employee):	
    list_update_leave_balance = ""
    if employee:
        list_update_leave_balance = frappe.db.get_all("Update Leave Balance", filters={"employee": employee}, fields=['leave_type','posting_date','current_cycle','new_balance','reason'])
    return list_update_leave_balance or None