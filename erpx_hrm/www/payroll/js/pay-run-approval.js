$(document).ready(function () {
    $(".review").click(function(){
        // $.session.set('approval', 'done');
        // console.log($(this.closest('tr')).find('td.pay_name').text())
        var pay_name = $(this.closest('tr')).find('td.pay_name').text();
        var pay_month = $(this.closest('tr')).find('td.pay_month').text();
        var pay_year = $(this.closest('tr')).find('td.pay_year').text();
        var status = $(this.closest('tr')).find('td.status').text();
        sessionStorage.pay_name = pay_name;
        sessionStorage.pay_month = pay_month;
        sessionStorage.pay_year = pay_year;
        sessionStorage.status = status;
        window.location.replace("/payroll/pay-run-payroll.html")
        // console.log(window.location)
    })
})