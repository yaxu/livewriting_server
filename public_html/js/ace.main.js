

$(document).ready(function () {
   var resetlink = localServerLink + "/index_ace.html";
   var aboutlink = resetlink + "/index_ace.html?aid=aboutechobin";

   
   //var editor = $("#livetext");
   var editor = ace.edit("editor");
   editor.setTheme("ace/theme/monokai");
   editor.getSession().setMode("ace/mode/javascript");

   var writeModeFunc = function(){
        $('#initial-message').bPopup({
           modalClose: false,
           opacity: 0.7,
           positionStyle: 'absolute',
           escClose :false
       });
       $("#post").show(); // show the button if write mode
   };

   var readModeFunc = function(){
       $("#post").hide(); // hide the button if read mode
   //    $("#reset").text("New");
   };

   editor.livewritingMessage = $.fn.livewritingMessage;
   editor.livewritingMessage("create", "ace", {name: "Sang's first run in Ace Editor",   writeMode:writeModeFunc, readMode:readModeFunc});

   $("#postdata").button().css({ width: '150px', margin:'5px'}).click(function(){
        $('#post-message').bPopup({
           modalClose: false,
           opacity: 0.7,
           positionStyle: 'absolute',
           escClose :false
       });

       var useroptions = {};

       $.get("/whattime",  function(response) {
           // Live Writing server should return article id (aid)

           var serverTime = new Date(Number(response));
          // var localTime = new Date();

           useroptions["servertime"] = response;
           editor.livewritingMessage("post","/post", useroptions, function(success, aid){
             $('#post-message').bPopup().close();

             if (!success){
                return;
             }
             articlelink = resetlink+"?aid="+aid;
             $('#post-complete-message').bPopup({
             modalClose: false,
             opacity: 0.7,
             positionStyle: 'absolute',
             escClose :false
             });
             $("#post-link").text(articlelink);
             ZeroClipboard.setData( "text/plain", articlelink);
           });
       })
       .fail(function(response) {
           console.log("time request failed");
       });
   });
   $("#reset").button().css({ width: '150px', margin:'5px'}).click(function(){
       window.open(resetlink, '_self');
   });

   $("#start").button().css({ width: '150px', margin:'5px'}).click(function(){
       $('#initial-message').bPopup().close();
       editor.livewritingMessage("reset");
       editor.focus();
       $("#reset").show(); // hide the button if read mode
   });

   $(".about").button().css({ width: '150px', margin:'5px'}).click(function(){
       var windowObjectReference = window.open(aboutlink,"win1");
   });
    $("#play").button().css({ width: '150px', margin:'5px'}).click(function(){
       var windowObjectReference = window.open(articlelink,"win2");
   });
   $("#close").button().css({ width: '150px', margin:'5px'}).click(function(){
       $('#post-complete-message').bPopup().close();
   });
   var client = new ZeroClipboard($("#copytoclipboard"));
   client.on( "aftercopy", function( event ) {
       alert("Copied text to clipboard: " + event.data["text/plain"] );
   } );

   $("#copytoclipboard").button().css({width:'250px', margine:'5px'});

   var slider = $("#slider").slideReveal({
       width: 250,
       push: false,
       position: "right",
       speed: 600,
       trigger: $("#trigger"),
       autoEscape: true,
       show: function(obj){
       //console.log(obj);
       },
       shown: function(obj){
         //  console.log(obj);
           $("#trigger").html('&gt;');
           obj.toggleClass(".left-shadow-overlay");
           obj.css({opacity:'0.9'});
       },
       hide: function(obj){
         //  console.log(obj);
       },
       hidden: function(obj){
           //console.log(obj);
           $("#trigger").html('&lt;');
           obj.toggleClass(".left-shadow-overlay");
           editor.focus();
           obj.css({opacity:'0.5'});
       }
   });

   editor.on("click",function(){
       slider.slideReveal("hide");
   });

   var client = new ZeroClipboard($("#copytoclipboard"));
   client.on( "aftercopy", function( event ) {
       alert("Copied text to clipboard: " + event.data["text/plain"] );
   } );

   $("#copytoclipboard").button().css({width:'250px', margine:'5px'});

   $("#play").button().css({ width: '150px', margin:'5px'}).click(function(){
       var windowObjectReference = window.open(articlelink,"win2");
   });
   $("#close").button().css({ width: '150px', margin:'5px'}).click(function(){
       $('#post-complete-message').bPopup().close();
   });



});
