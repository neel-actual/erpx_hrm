$(function () { 
    "use strict";
    $("#save_pay_setting").click(function(){
        console.log("here")
        hrm.update("Payroll Setting",{"name":null,"pay_day":$("#payday").val()}).then(function () {

            M.toast({
                html: 'Update successful!'
            })
        })
    })
})
