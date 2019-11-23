$(document).ready(function(){
    $("#sel_month").change(function(){
        $('.month_sel').val($(this).val());

    })

    $("#sel_year").change(function(){
        $('.year_sel').val($(this).val());

    })

    $("#pay_type").change(function(){
        $('.sel_pay_type').val($(this).val());

    })

    $(".sel_expense").change(function() {
        if ($(this).is(":checked")){
        var row = $(this).closest("tr"); 
        var $title = row.find(".title").text();
        var $image = row.find(".image img").attr('src');
        var $date = row.find(".date").text();
        var $amount = row.find(".amount").text();
        
        $('#final_table tr:last').after(
            '<tr><td>'+$title+'</td>'+'<td><img style="color: white;height: 40px;width: 40px;background-color: #bbb;border-radius: 50%;display: inline-block;text-align: center;"  src='+$image+'></td>'+'<td>'+$date+'</td>'+'<td>'+$amount+'</td></tr>'
        );
        console.log("checked")
        }
        
        
        
    });





})