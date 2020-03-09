from __future__ import unicode_literals
import frappe, json
from frappe import _
from frappe.utils import now, cint

@frappe.whitelist()
def update():
	data = frappe._dict(frappe.local.form_dict)
	return frappe.db.sql("""update `tabLeave Policy Detail` 
		set leave_type=%(leave_type)s, annual_allocation=%(annual_allocation)s where name = %(name)s """,{
			"name": data.name,
			"leave_type": data.leave_type,
			"annual_allocation": data.annual_allocation,
	})

@frappe.whitelist()
def delete(name):
	frappe.db.sql("""delete from `tabLeave Policy Detail` where name=%s""", name)

@frappe.whitelist()
def add():
	data = frappe._dict(frappe.local.form_dict)
	if not frappe.db.exists("Leave Policy Detail", {"parent": data.parent, "leave_type": data.leave_type}):
		name = frappe.generate_hash(txt="", length=10)
		user = frappe.session.user
		idx = cint(frappe.db.get_value("Leave Policy Detail", {"parent":data.parent}, "MAX(idx)") or 0) + 1

		frappe.db.sql("""insert into `tabLeave Policy Detail` (name, creation, modified, modified_by, owner, docstatus, parent, parentfield, parenttype, idx, leave_type, annual_allocation)
						values (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)"""
			, (name, now(), now(), user, user, 1, data.parent, "leave_policy_details", "Leave Policy", idx, data.leave_type, data.annual_allocation))
	else:
		frappe.throw(_("This Leave Type already exist"))

	return frappe.db.get_value("Leave Policy Detail", {"parent":data.parent, "leave_type": data.leave_type}, ["name","leave_type","annual_allocation"])