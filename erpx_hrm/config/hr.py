from __future__ import unicode_literals
from frappe import _

def get_data():
	return [
		{
			"label": _("Leaves"),
			"items": [
				{
					"type": "doctype",
					"name": "Update Leave Balance"
				}
			]
		}
	]
