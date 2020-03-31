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
    context.claim_details = frappe.db.sql("""select ec.name,ec.claim_limit,ec.description,ac.default_account from `tabExpense Claim Type` as ec inner join `tabExpense Claim Account` as ac on ec.name = ac.parent""",as_dict=1)
    context.account_list = frappe.get_all("Account",{"is_group":0,"root_type":"Expense","company":str(frappe.db.get_value("Global Defaults",None,"default_company"))},"name")
    return context