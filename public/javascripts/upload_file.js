/**
 * Created by Iman on 25/07/2017.
 */


// $('#submit_btn').click(function() {
    // setInterval(function() {
$(function() {


    // $("#uploading").html("Hi");
    // $.ajax({
    //     type: 'POST',
    //     data: {},
    //     url: "/uploading_file/ajax_call/101/bitch",
    //     dataType: 'JSON',
    //     success: function (result) {
    //         $("#uploading").html("GOT IT");
    //         console.log("GOTTEN NUMBER");
    //         console.log(result);
    //     }
    // });
    $('#uploading').hide();

    $('#submit_btn').click(function() {
        setInterval(function () {
            $.get("http://localhost:3001/uploading_file/ajax_call/101/bitch", function (data, status) {
                // alert("Data: " + data + "\nStatus: " + status);
                $('#uploading').show();
                $("#uploading").html("Uploaded: " + data + "%");
            });
        }, 1500);
    });

    // $.ajax({url: "demo_test.txt", success: function(result){
    //     $("#uploading").html(result);
    // }});
});
    // }, 100);
// });

// $.ajax({
//     type: 'POST',
//     data: obj,
//     url: '/',
//     dataType: 'JSON',
//     success: function() {
//         console.log("this is the part that doesn't work"); // As stated, for some reason even though the file is being successfully written to via this post function, nothing works here.
//     }
// });