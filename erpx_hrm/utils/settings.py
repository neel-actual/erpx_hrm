import frappe
import datetime
from frappe.utils import cstr

@frappe.whitelist()
def get_department_tree():
	all_departments = frappe.get_all('Department',
		fields = ["name", "department_name", "parent_department", "is_group"],
		order_by="lft, rgt")
	
	department_tree = []

	for department in all_departments:
		if department.is_group==1:
			department_tree.append({
				"parent": department.name or "All Departments",
				"data": [d for d in all_departments if cstr(d.parent_department) == department.name]
			})

	return department_tree