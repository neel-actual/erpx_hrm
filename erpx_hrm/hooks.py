# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from . import __version__ as app_version

app_name = "erpx_hrm"
app_title = "ERPX Human Resource Module"
app_publisher = "Neel Singh"
app_description = "Human Resource Modules for ERPX"
app_icon = "octicon octicon-organization"
app_color = "#ffca28"
app_email = "neel2292@gmail.com"
app_license = "MIT"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_css = "/assets/erpx_hrm/css/erpx_hrm.css"
# app_include_js = "/assets/erpx_hrm/js/erpx_hrm.js"

# include js, css files in header of web template
# web_include_css = "/assets/erpx_hrm/css/erpx_hrm.css"
# web_include_js = "/assets/erpx_hrm/js/erpx_hrm.js"

# include js in page
# page_js = {"page" : "public/js/file.js"}

# include js in doctype views
# doctype_js = {"doctype" : "public/js/doctype.js"}
# doctype_list_js = {"doctype" : "public/js/doctype_list.js"}
# doctype_tree_js = {"doctype" : "public/js/doctype_tree.js"}
# doctype_calendar_js = {"doctype" : "public/js/doctype_calendar.js"}

# Home Pages
# ----------

# application home page (will override Website Settings)
home_page = "index"

# website user home page (by Role)
# role_home_page = {
#	"Role": "home_page"
# }

# Website user home page (by function)
# get_website_user_home_page = "erpx_hrm.utils.get_home_page"

# Generators
# ----------

# automatically create page for each record of this doctype
# website_generators = ["Web Page"]

# Installation
# ------------

# before_install = "erpx_hrm.install.before_install"
# after_install = "erpx_hrm.install.after_install"

# Desk Notifications
# ------------------
# See frappe.core.notifications.get_notification_config

# notification_config = "erpx_hrm.notifications.get_notification_config"

# Permissions
# -----------
# Permissions evaluated in scripted ways

# permission_query_conditions = {
# 	"Event": "frappe.desk.doctype.event.event.get_permission_query_conditions",
# }
#
# has_permission = {
# 	"Event": "frappe.desk.doctype.event.event.has_permission",
# }

# Document Events
# ---------------
# Hook on document methods and events

# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
#	}
# }

# Scheduled Tasks
# ---------------

# scheduler_events = {
# 	"all": [
# 		"erpx_hrm.tasks.all"
# 	],
# 	"daily": [
# 		"erpx_hrm.tasks.daily"
# 	],
# 	"hourly": [
# 		"erpx_hrm.tasks.hourly"
# 	],
# 	"weekly": [
# 		"erpx_hrm.tasks.weekly"
# 	]
# 	"monthly": [
# 		"erpx_hrm.tasks.monthly"
# 	]
# }

# Testing
# -------

# before_tests = "erpx_hrm.install.before_tests"

# Overriding Whitelisted Methods
# ------------------------------
#
# override_whitelisted_methods = {
# 	"frappe.desk.doctype.event.event.get_events": "erpx_hrm.event.get_events"
# }

