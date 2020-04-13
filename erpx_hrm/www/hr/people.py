import frappe
import json
from frappe import _

def get_context(context):    
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    # get employee        
    name = frappe.form_dict.name
    if name:
        employee = frappe.get_doc("Employee", name)
        if not employee:
            frappe.throw(_('{0} not exist').format(', '.join(name)))
    else:    
        employee = frappe.new_doc("Employee")    
    context.employee = employee or None
    context.series = ["BAYO-BOD-.###", "BAYO-DIR-.###", "BAYO-CON-.###", "BAYO-.YY.MM.-.###"]    

    return context
