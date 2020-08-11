import frappe
import json
from erpx_hrm.utils.user import get_users_by_role
from six.moves.urllib.parse import quote, urlencode, urlparse

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect
    
    user = frappe.session.user
    employee = frappe.db.get_value("Employee",{"user_id":user},"name")
    roles = frappe.get_roles(user)

    context.employee = employee
    context.user = user
    context.roles = roles
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.currency = frappe.db.get_value("Global Defaults",None,"default_currency")   
    context.site_url = frappe.utils.get_url()

    context.user_approvers = get_users_by_role("Expense Verified")  

    request_url = urlparse(frappe.request.url)
    expense_voucher = request_url.query.split("=")[1]

    expense_claim_doc = frappe.get_doc("Expense Claim", expense_voucher)
    context.claim_details = frappe.get_all("Expense Claim Detail",
        filters={'parent': expense_voucher},
        fields=["expense_type","expense_date","merchant","amount","description","attach_document","idx", "distance", "distance_rate"],
        order_by = "idx asc"
    )

    edit_mode = 0

    if employee == expense_claim_doc.employee and expense_claim_doc.approval_status=="Draft":
        edit_mode = 1
    
    if ('Expense Verified' in roles) and expense_claim_doc.approval_status=="Pending":
        edit_mode = 1
    
    if ('Expense Approver' in roles) and expense_claim_doc.approval_status=="Verified":
        edit_mode = 1


    context.expense_voucher = expense_voucher
    context.expense_claim_doc = expense_claim_doc
    context.edit_mode = edit_mode

    return context