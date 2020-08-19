import frappe
import json
from erpnext.shopping_cart.cart import get_party
from six import string_types, iteritems
from frappe.desk.query_report import run, get_columns_dict


@frappe.whitelist()
def export_query():
	"""export from query reports"""
	data = frappe._dict(frappe.local.form_dict)

	del data["cmd"]
	if "csrf_token" in data:
		del data["csrf_token"]

	if isinstance(data.get("filters"), string_types):
		filters = json.loads(data["filters"])
	if isinstance(data.get("report_name"), string_types):
		report_name = data["report_name"]
		frappe.permissions.can_export(
			frappe.get_cached_value('Report', report_name, 'ref_doctype'),
			raise_exception=True
		)
	if isinstance(data.get("file_format_type"), string_types):
		file_format_type = data["file_format_type"]
	
	if isinstance(data.get("visible_idx"), string_types):
		visible_idx = json.loads(data.get("visible_idx"))
	else:
		visible_idx = None
	
	# add filter this customer
	party = get_party()
	filters["customer"] = party.name or ""

	if file_format_type == "Excel":
		data = run(report_name, filters)
		data = frappe._dict(data)
		columns = get_columns_dict(data.columns)

		from frappe.utils.xlsxutils import make_xlsx
		xlsx_data = build_xlsx_data(columns, data)
		
		xlsx_file = make_xlsx(xlsx_data, "Query Report")

		frappe.response['filename'] = report_name + '.xlsx'
		frappe.response['filecontent'] = xlsx_file.getvalue()
		frappe.response['type'] = 'binary'

def build_xlsx_data(columns, data):
	result = [[]]

	# add column headings
	for idx in range(len(data.columns)):
		result[0].append(columns[idx]["label"])

	# build table from result
	for i, row in enumerate(data.result):
		# only pick up rows that are visible in the report
		row_data = []

		if isinstance(row, dict) and row:
			for idx in range(len(data.columns)):
				label = columns[idx]["label"]
				fieldname = columns[idx]["fieldname"]
				cell_value = row.get(fieldname, row.get(label, ""))
				row_data.append(cell_value)
		else:
			row_data = row

		result.append(row_data)
			

	return result