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

    #Get user's role
    user_role_list = frappe.db.sql_list("""
							select r.role from `tabUser` u
                            left join `tabHas Role` r ON  r.parent = u.name
                            where u.name = %(user_name)s""", {"user_name": frappe.session.user})  

    #Get beep's role for user
    isHRManagerRole = False        
    for i_user_role in user_role_list:        
        if i_user_role == "HR Manager":
          isHRManagerRole = True
          break
    context.isHRManagerRole = isHRManagerRole

    return context