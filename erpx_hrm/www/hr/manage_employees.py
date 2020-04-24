import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()
    
    context.roleList = ["HR Manager", "Expense Approver", "Expense Verified", "Leave Approver", "Employee"]
    employees = frappe.db.sql("""
        select e.name, e.first_name, e.designation, e.department, e.reports_to, e.branch, e.status, group_concat(' ', r.role) as 'role' from `tabEmployee` e
        left join `tabUser` u ON  e.user_id = u.name and u.name not in ('Administrator', 'Guest')
        left join `tabHas Role` r ON  r.parent = u.name
        where r.role is null or r.role in ('Employee', 'Expense Verified', 'Expense Approver', 'HR Manager', 'Leave Approver')                
        group by e.name
        """, as_dict=True, debug=1)      
    employeeList = []    
    for emp in employees:
        emp.role = getHighestRole(emp.role)
        employeeList.append(emp)    
    context.employeeList = employeeList

    return context   

def getHighestRole(roles):
    if not roles:
        return ""

    if roles.find("HR Manager") > -1:
        return "HR Manager"
    elif roles.find("Expense Approver") > -1:
        return "Expense Approver"        
    elif roles.find("Expense Verified") > -1:
        return "Expense Verified"        
    elif roles.find("Leave Approver") > -1:
        return "Leave Approver"        
    elif roles.find("Employee") > -1:
        return "Employee"        