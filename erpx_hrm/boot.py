from __future__ import unicode_literals
import frappe

def update_website_context(context):
	show_menu = {
		"top-hr" : 0,
		"top-claims" : 0,
		"top-payroll" : 0,
		"top-benefits" : 0,

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
		"news": 0,
		"people-dir": 0,
		"people-org-chart": 0,
		"payslip": 0,
		"calendar": 0,
		"hr-reports": 0,		
		"company-settings": 0,
		"org-settings": 0,
		"grp-settings": 0,
		"benefits": 0,
		"payroll-all": 0,
		"payroll-people": 0,
		"pay-run-payroll": 0,
		"pay-run-approval": 0,
		"pay-run-payslip": 0,
		"pay-run-history": 0,
		"payroll-reports-total": 0,
		"payroll-reports-form-ea": 0,
		"payroll-reports-e-form": 0,
		"payroll-comp-details": 0,
		"payroll-settings": 0,
		"payroll-items-sett": 0	
	}

	valid_roles = ['Employee']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["top-hr"] = 1
		show_menu["top-claims"] = 1

		show_menu["leave-request"] = 1
		show_menu["my-claims"] = 1
		show_menu["claims-all"] = 1
		show_menu["claims-reimbusement"] = 1
	
	valid_roles = ['Leave Approver']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["top-hr"] = 1

		show_menu["leave-approval"] = 1
		show_menu["leave-request"] = 1
		show_menu["my-claims"] = 1
	
	valid_roles = ['HR Manager']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["top-hr"] = 1
		show_menu["top-claims"] = 1
		show_menu["top-payroll"] = 1
		show_menu["top-benefits"] = 1

		show_menu["leave-approval"] = 1
		show_menu["leave-request"] = 1
		show_menu["leave-balance"] = 1
		show_menu["leave-settings"] = 1
		show_menu["my-claims"] = 1
		show_menu["claims-all"] = 1
		show_menu["claims-reports"] = 1
		show_menu["claims-reimbusement"] = 1
		show_menu["claims-setting"] = 1
		show_menu["news"] = 1
		show_menu["people-dir"] = 1
		show_menu["people-org-chart"] = 1
		show_menu["payslip"] = 1
		show_menu["calendar"] = 1
		show_menu["hr-reports"] = 1
		show_menu["company-settings"] = 1
		show_menu["org-settings"] = 1
		show_menu["grp-settings"] = 1		
		show_menu["benefits"] = 1	
		show_menu["payroll-all"] = 1
		show_menu["payroll-people"] = 1
		show_menu["pay-run-payroll"] = 1
		show_menu["pay-run-approval"] = 1
		show_menu["pay-run-payslip"] = 1
		show_menu["pay-run-history"] = 1
		show_menu["payroll-reports-total"] = 1
		show_menu["payroll-reports-form-ea"] = 1
		show_menu["payroll-reports-e-form"] = 1
		show_menu["payroll-comp-details"] = 1
		show_menu["payroll-settings"] = 1
		show_menu["payroll-items-sett"] = 1
	
	valid_roles = ['Expense Approver']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["top-hr"] = 1
		show_menu["top-claims"] = 1

		show_menu["my-claims"] = 1
		show_menu["approval-claims"] = 1
		show_menu["claims-all"] = 1
	
	valid_roles = ['Expense Verified']
	if frappe.utils.is_subset(valid_roles, frappe.get_roles()):
		show_menu["top-hr"] = 1
		show_menu["top-claims"] = 1

		show_menu["my-claims"] = 1
		show_menu["approval-claims"] = 1
		show_menu["claims-all"] = 1

		
	context.show_menu = show_menu