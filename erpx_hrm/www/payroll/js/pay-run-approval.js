$(document).ready(function () {
    $("#review").click(function(){
        // $.session.set('approval', 'done');
        sessionStorage.param1 = "Hello";
        window.location.replace("/payroll/pay-run-payroll.html")
        console.log(window.location)
    })
})