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
    context.employee = frappe.get_all("Employee",fields=['name','employee_name','department','branch','employment_type','salary_mode','designation','image'])
    context.department = frappe.get_all("Department",fields=['name','department_name'])
    context.branch = frappe.get_all("Branch",fields=['name'])
    context.employment_type = frappe.get_all("Employment Type",fields=['name'])
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    

    return context