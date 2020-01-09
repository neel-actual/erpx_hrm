import frappe
import json
from erpnext import get_company_currency, get_default_company

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    company = get_default_company()

    context.company_logo = frappe.db.get_value('Company', company, 'company_logo') or None

    return context