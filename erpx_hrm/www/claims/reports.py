import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect
    
    valid_roles = ['HR Manager']
    if not ("HR Manager" in frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    context.employee = frappe.get_all("Employee",fields=["name","employee_name"])
    context.expense = frappe.get_all("Expense Claim", fields=['name','approval_status','status','employee','employee_name','total_claimed_amount','posting_date'])

    return context