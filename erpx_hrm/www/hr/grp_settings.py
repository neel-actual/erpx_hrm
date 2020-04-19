import frappe
import json

def get_context(context):
    if frappe.session.user == 'Guest':
        frappe.local.flags.redirect_location = '/'
        raise frappe.Redirect

    context.user = frappe.session.user
    context.csrf_token = frappe.sessions.get_csrf_token()

    #Role list
    role_arr = ["Employee", "Expense Verified", "Expense Approver", "HR Manager", "Leave Approver"]
    role_list = []    
    for i_role in role_arr:                        
        user_list = frappe.db.sql_list("""
							select u.name from `tabUser` u
                            left join `tabHas Role` r ON  r.parent = u.name and u.name not in ('Administrator', 'Guest')
                            where r.role = %(role_name)s""", {"role_name": i_role})                  
        role_list.append({
            "name": i_role,
            "total_user": len(user_list) or 0,
            "user_list": user_list
        })            
    context.role_list = role_list

    #User list
    context.all_user = frappe.db.sql_list("""
							select name from `tabUser` where name not in ('Administrator', 'Guest')                            
                            """)  

    #Permission list
    context.permission_list = ["No Permission", "All Employees view only", "All Employees view and edit", "My view only", "My view and edit"]
    context.permission_section_list = [
        "Basic Information", "All About Me", "Certificate and License", "Compensation and Bank Information", "Compensation History",
        "Disciplinary Action", "Emergency Contact", "Family Information", "Personal Information", "Qualifications"
    ]
    return context