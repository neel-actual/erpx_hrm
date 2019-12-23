import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.employee = frappe.get_all("Employee",fields=['name','employee_name','department','branch','employment_type','salary_mode','designation','image'])
    context.department = frappe.get_all("Department",fields=['name','department_name'])
    context.branch = frappe.get_all("Branch",fields=['name'])
    context.employment_type = frappe.get_all("Employment Type",fields=['name'])
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    

    return context