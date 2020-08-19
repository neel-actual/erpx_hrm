# Copyright (c) 2013, vincent nguyen and contributors
# For license information, please see license.txt


from __future__ import unicode_literals
import frappe
from frappe.utils import flt
from frappe import msgprint, _
from frappe.utils import get_first_day, get_last_day, add_to_date, nowdate, getdate, add_days, add_months

def execute(filters=None):
	if not filters: filters = {}	

	columns = get_columns()
	data = get_data(filters)
	return columns, data
	
def get_columns():
	return [
		"ID:Link/Leave Application:100",
		"Employee:Link/Employee:100",
		"Employee Name::150",
		"Department::150",
		"Leave Type::150",
		"From Date:Date:100",
		"To Date:Date:100",
		"Total Leave Days:Float:100",
		"Leave Approver:Link/User:150",
		"Reason:Data:200"
	]

def get_data(filters):
	conditions = get_conditions(filters)

	query = """SELECT	
			la.name,
			la.employee,
			la.employee_name,
			la.department,
			la.leave_type,
			la.from_date,
			la.to_date,
			la.total_leave_days,
			la.leave_approver,
			la.description
		FROM
			`tabLeave Application` as la

		WHERE %s AND la.status = "Approved"

		ORDER BY la.employee_name asc

	""" %(conditions)

	data = frappe.db.sql(query, debug=1)

	return data
	

def get_conditions(filters):
	conditions = "1"

	if filters.get("from_date"):
		conditions += " and la.from_date >= '%s'" % (filters["from_date"])

	if filters.get("to_date"):
		conditions += " and la.to_date <= '%s'" % (filters["to_date"])
	
	if filters.get("employee"):
		conditions += " and la.employee = '%s'" % filters["employee"]
	
	return conditions
