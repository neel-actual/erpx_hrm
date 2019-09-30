import frappe
import json

def get_context(context):
    if frappe.session.user != 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    return context