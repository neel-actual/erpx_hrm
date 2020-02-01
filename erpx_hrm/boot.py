from __future__ import unicode_literals
import frappe

def update_website_context(context):
	show_menu = {
		"leave-request" : 0,
		"leave-approval" : 0,
		"leave-balance" : 0,
		"leave-settings" : 0,
	}

	valid_roles = ['Employee']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-request"] = 1
	
	valid_roles = ['Leave Approver']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-approval"] = 1
	
	valid_roles = ['HR Manager']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["leave-balance"] = 1
		show_menu["leave-settings"] = 1

		
	context.show_menu = show_menu