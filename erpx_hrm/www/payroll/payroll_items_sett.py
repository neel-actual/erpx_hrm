import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    context.employee = frappe.get_all("Employee",fields=["name","employee_name"])
    context.currency = frappe.db.get_value("HRM Setting",None,"currency")
    context.addition_item = frappe.get_all("Additionals",filters=[["parenttype", "=", "Payroll Setting"],["parent", "=", None],["parentfield","=","addition_items"]],fields=["name1","category","unit_calculation","epf","pcb","socso","eis","default_amount","ea_form_field"] )
    context.deduction_item = frappe.get_all("Additionals",filters=[["parenttype", "=", "Payroll Setting"],["parent", "=", None],["parentfield","=","deduction_item"]],fields=["name1","category","unit_calculation","epf","pcb","socso","eis","default_amount","ea_form_field"] )
    context.overtime_item = frappe.get_all("Additionals",filters=[["parenttype", "=", "Payroll Setting"],["parent", "=", None],["parentfield","=","overtime_item"]],fields=["name1","category","unit_calculation","epf","pcb","socso","eis","default_amount","ea_form_field"] )

    return context