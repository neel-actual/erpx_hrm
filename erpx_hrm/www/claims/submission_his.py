import frappe
import json
from frappe import _

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect
    
    valid_roles = ['Employee','HR Manager']
    if not ("Employee" in frappe.get_roles() or "HR Manager" in frappe.get_roles()):
        frappe.throw(_('Only users with {0} role can access').format(', '.join(valid_roles)),
			frappe.PermissionError)

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.expense = frappe.get_all("Expense Claim",filters={"reimbursement_type":"Submission via Payroll","status":"Paid"},fields=['name','status','employee','employee_name','total_claimed_amount','posting_date'])


    return context