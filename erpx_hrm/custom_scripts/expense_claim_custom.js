frappe.ui.form.on('Expense Claim Detail', {
	distance: function(frm, cdt, cdn) {
        count_amount_by_distance(frm, cdt, cdn);
    },
    distance_rate: function(frm, cdt, cdn) {
        count_amount_by_distance(frm, cdt, cdn);
    }
});

function count_amount_by_distance(frm, cdt, cdn){
    let doc = locals[cdt][cdn];
    let distance = doc.distance || 0;
    let distance_rate = doc.distance_rate || 0;
    let amount = flt(distance) * flt(distance_rate);
    frappe.model.set_value(cdt, cdn, "amount", amount);
}