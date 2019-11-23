import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    context.expense = frappe.get_all("Expense Claim", fields=['name','approval_status','status','employee','employee_name','total_claimed_amount','posting_date'])

    return context