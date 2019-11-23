import frappe
import json


no_cache = True

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context['custom'] = 'hello world'
    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    return context
