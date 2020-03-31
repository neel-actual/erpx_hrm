from __future__ import unicode_literals
import frappe

def update_website_context(context):
	show_menu = {
		"leave-request" : 0,
		"leave-approval" : 0,
		"leave-balance" : 0,
		"leave-settings" : 0,
		"my-claims" : 0,
		"approval-claims" : 0,
		"claims-all": 0,
		"claims-reports": 0,
		"claims-reimbusement": 0,
		"claims-setting": 0,
	}

	valid_roles = ['Employee']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-request"] = 1
		show_menu["my-claims"] = 1
		show_menu["claims-all"] = 1
		show_menu["claims-reimbusement"] = 1
	
	valid_roles = ['Leave Approver']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-approval"] = 1
	
	valid_roles = ['HR Manager']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-balance"] = 1
		show_menu["leave-settings"] = 1
		show_menu["my-claims"] = 1
		show_menu["claims-all"] = 1
		show_menu["claims-reports"] = 1
		show_menu["claims-reimbusement"] = 1
		show_menu["claims-setting"] = 1
	
	valid_roles = ['Expense Approver']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["my-claims"] = 1
		show_menu["approval-claims"] = 1
		show_menu["claims-all"] = 1
	
	valid_roles = ['Expense Verified']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["my-claims"] = 1
		show_menu["approval-claims"] = 1
		show_menu["claims-all"] = 1

		
	context.show_menu = show_menu