import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.expense = frappe.get_all("Expense Claim",filters={"reimbursement_type":"Submission via Payroll","status":"Paid"},fields=['name','status','employee','employee_name','total_claimed_amount','posting_date'])


    return context