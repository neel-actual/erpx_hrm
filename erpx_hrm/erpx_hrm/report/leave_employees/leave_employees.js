// Copyright (c) 2016, vincentnguyen.t090@gmail.com and contributors
// For license information, please see license.txt
/* eslint-disable */

frappe.query_reports["Leave Employees"] = {
	"filters": [
        {
			"fieldname":"employee",
			"label": __("Employee"),
            "fieldtype": "Link",
			"options": "Employee"
		},
		{
			"fieldname":"from_date",
			"label": __("From Date"),
			"fieldtype": "Date",
		},
		{
			"fieldname":"to_date",
			"label": __("To Date"),
			"fieldtype": "Date",
		}
	]
}