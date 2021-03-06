var app = angular.module('livewriting-app', []);
var logginedEmail = null;
var resetlink = localServerLink;
var aboutlink = resetlink + "?aid=aboutechobin";
var posted_id = null;

var ValidateEmail = function(mail, alertFlag)
{
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail))
  {
    return true;
  }
  if(alertFlag)alert("You have entered an invalid email address!")
  return false;
}

app.controller('posting-dialog',[ '$scope', '$http', function($scope, $http) {
  $scope.isLoggedIn = function(){
    return ValidateEmail(logginedEmail);
  };
  $(".post-button").button();

  $scope.openSignin = function(){
    $("#post-complete-message").bPopup().close();
    $("#reset").show();
    $("#slider").slideReveal("show");
    $(".authform").addClass("lw_hidden");
    $(".signin").removeClass("lw_hidden");
  };

  $scope.openSignup = function(){
    $("#post-complete-message").bPopup().close();
    $("#reset").show();
    $("#slider").slideReveal("show");
    $(".authform").addClass("lw_hidden");
    $(".signup").removeClass("lw_hidden");
  };


}]);

app.controller('my-livewriting-list',[ '$scope', '$http', function($scope, $http) {
  $scope.list = [];
  $scope.totallist = [];
  $scope.offset = 0;
  $scope.maxOffset = 0;
  $scope.numArticlePerPage =10;
  $scope.error= false;
  $scope.link = resetlink + "?aid=";
  $scope.next = false;
  $scope.getList = function(){
    if(!ValidateEmail(logginedEmail))
      return;
    $http.post('/getlist', {offset:$scope.offset, num:$scope.numArticlePerPage+1}, {})
    .then(function(response){
      if(response.data.length>0){
        $scope.next = false;
        if(response.data.length>$scope.numArticlePerPage)
          $scope.next = true;
        $scope.list = response.data.splice(0,$scope.numArticlePerPage);
        $scope.totallist = $scope.totallist.concat($scope.list);
      }
      $scope.error = false;
    }, function(response){
      $scope.error = true;
    });
  };

  $scope.nextList = function(){
    $scope.offset += $scope.numArticlePerPage;
    if($scope.offset>$scope.maxOffset){
      $scope.maxOffset = $scope.offset;
      $scope.getList();
    }else{
      $scope.list = $scope.totallist.slice().splice($scope.offset, $scope.numArticlePerPage);
    }
  }

  $scope.prevList = function(){
    $scope.offset -= $scope.numArticlePerPage;
    $scope.list = $scope.totallist.slice().splice($scope.offset, $scope.numArticlePerPage);
    $scope.next = true;
  }

  var dateoptions = {
    year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
  };

  $scope.timeToDate = function(time, time2){
    if(typeof time == "number"){
      return (new Date(time)).toLocaleDateString("en-us", dateoptions);
    }
    else if(typeof time2 == "string"){
      return (new Date(Number(time2))).toLocaleDateString("en-us", dateoptions);
    }
    else{
      alert(time, time2);
    }
  };
}]);

$(document).ready(function () {
    function cursorAct(cm){
        console.log("cursorAct : " + cm.getSelection());
    }
    var getUrlVars =  function(){
        var vars = [], hash;
        var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        for(var i = 0; i < hashes.length; i++)
        {
            hash = hashes[i].split('=');
            vars.push(hash[0]);
            vars[hash[0]] = hash[1];
        }
        return vars;
    }
    //var editor = $("#livetext");

    var options = {
        lineNumbers: false,
        styleActiveLine: true,
        scrollbarStyle: "simple",
        matchBrackets: false,
        smartIndent : false,
        indentUnit:0,
        lineWrapping:true,
        mode:"Plain Text",
        height:"100%"
    };

    var parameters = getUrlVars();

    if (parameters.syntax != "undefined"){
      options.mode = parameters.syntax;
    }


    var editor = CodeMirror.fromTextArea(document.getElementById("livetext"),options);

    editor.setSize("96%", "98%");

    var writeModeFunc = function(){
         $('#initial-message').bPopup({
            modalClose: false,
            opacity: 0.7,
            positionStyle: 'absolute',
            escClose :false
        });
        $("#postdata").show(); // show the button if write mode
    };

    var readModeFunc = function(){
        $("#postdata").hide(); // hide the button if read mode
    //    $("#reset").text("New");

    };

    editor.livewritingMessage = livewriting;
    editor.livewritingMessage("create", "codemirror", {name: "Sang's first run in CodeMirror",   writeMode:writeModeFunc, readMode:readModeFunc});

    // beginning of login

    $(".navigate").button();
    $("#signin").button().click(function(){
      $(".authform").addClass("lw_hidden");
      $(".signin").removeClass("lw_hidden");
    });

    $("#signup").button().click(function(){
      $(".authform").addClass("lw_hidden");
      $(".signup").removeClass("lw_hidden");
    });

    $("#signup2").button().click(function(){
      $(".authform").addClass("lw_hidden");
      $(".signup").removeClass("lw_hidden");
    });

    $("#signin2").button().click(function(){
      $(".authform").addClass("lw_hidden");
      $(".signin").removeClass("lw_hidden");
    });

    $("#signin3").button().css({ width: '150px', margin:'5px'}).click(function(){
      $('#initial-message').bPopup().close();
        $("#reset").show();
      slider.slideReveal("show");
      $(".authform").addClass("lw_hidden");
      $(".signin").removeClass("lw_hidden");
    });

    $("#signup3").button().css({ width: '150px', margin:'5px'}).click(function(){
      $('#initial-message').bPopup().close();
        $("#reset").show();
      slider.slideReveal("show");
      $(".authform").addClass("lw_hidden");
      $(".signup").removeClass("lw_hidden");
    });



    $("#signout").button().click(function(){
      $.ajax({
        url:"/logout",
        type:"get",
        success:function(data, textStatus, jqXHR){
          $(".authform").addClass("lw_hidden");
          $(".signin").removeClass("lw_hidden");
        },
        error:function( jqXHR, textStatus, errorThrown ){
          console.log(" error ",jqXHR, textStatus, errorThrown);
        }
      });
    });

    var updateEmailforArticle = function (id, email){
      if(email != logginedEmail){
        alert("logged in email does not match.(",email,",",logginedEmail,")")
        return;
      }

      $.ajax({
        url:"/updateemail",
        data:{
          id:id,
          email:email
        },
        type:"post",
        success:function(data, textStatus, jqXHR){
          console.log("posted_id email logged:(",posted_id,",",data,")");
          var scope = angular.element($("#list-livewriting")).scope();
          scope.$apply(function () {
            scope.getList();
          });
        },
        error:function(data){
          console.error(data);
        }
      });
    }

    var signupHandler = function(){
      var email = $("#signup-email").val();
      if(ValidateEmail(email, true)){
        var password1 = $("#signup-pass1").val();
        var password2 = $("#signup-pass2").val();
        if (password1 == password2){
          $("#signup-pass1").val("");
          $("#signup-pass2").val("");

          $.ajax({
            url:"/signup",
            data:{
              email:email,
              password:password1
            },
            type:"post",
            success:function(data, textStatus, jqXHR){
              if(data == "signup-failed"){
                $("#signup-failed-message").text("The email address already exists.")
              }
              else if (ValidateEmail(data)){
                $(".authform").addClass("lw_hidden");
                $(".loggedin").removeClass("lw_hidden");
                $(".signed-email").text(data);
                if(posted_id != null){
                  updateEmailforArticle(posted_id, data);
                }
              }
              else{
                alert(textStatus);
              }
            },
            error:function( jqXHR, textStatus, errorThrown ){
              console.log(" error ",jqXHR, textStatus, errorThrown);
            }
          });
        }
        else{
          alert("Password do not match.");
        }
      }
    };

    var signinHandler = function(){
      var email = $("#signin-email").val();
      if(ValidateEmail(email)){
        var password = $("#signin-pass").val();
        $("#signin-pass").val("");
        $.ajax({
          url:"/login",
          data:{
            email:email,
            password: password
          },
          type:"post",
          complete: function(){
            console.log(" complete ");
          },
          success:function(data, textStatus, jqXHR){
            console.log(" success",data, textStatus, jqXHR);
            if(ValidateEmail(data)){
              $(".authform").addClass("lw_hidden");
              $(".loggedin").removeClass("lw_hidden");
              $(".signed-email").text(data);
              logginedEmail = data;
              var scope = angular.element($("#list-livewriting")).scope();
              scope.$apply(function () {
                scope.getList();
              });

              if(posted_id != null){
                updateEmailforArticle(posted_id, data);
              }
            }
            else if (data == "login-failed"){
              $("#login-failed-message").text("Login Failed.")
            }
            else{
              alert(textStatus);
            }


          },
          error:function( jqXHR, textStatus, errorThrown ){
            console.log(" error ",jqXHR, textStatus, errorThrown);
          }
        });
      }

    };

    $("#submit-signin").click(signinHandler);
    $("#submit-signup").click(signupHandler);

    $("#signin-pass").keyup(function(ev){
      if (ev.which == 13){
        signinHandler();
      }
    });

    $("#signup-pass2").keyup(function(ev){
      if (ev.which == 13){
        signupHandler();
      }
    });

    $.ajax({
      url:"/profile",
      type:"get",
      success:function(data, textStatus, jqXHR){
        console.log("profile:",data);
        if(ValidateEmail(data)){
          $(".authform").addClass("lw_hidden");
          $(".not-loggedin").addClass("lw_hidden");
          $(".loggedin").removeClass("lw_hidden");
          $(".signed-email").text(data);
          logginedEmail = data;
          var scope = angular.element($("#list-livewriting")).scope();
          scope.$apply(function () {
            scope.getList();
          });
        }
      },
      error:function( jqXHR, textStatus, errorThrown ){
        console.log("profile error ",jqXHR, textStatus, errorThrown);
      }
    });

    $(".yourwriting").button().click(function(){
      $('#list-livewriting').bPopup({
        modalClose: false,
        opacity: 0.7,
        positionStyle: 'absolute',
        escClose :false
      });
    });

    $(".list-livewriting-close").button().click(function(){
      $('#list-livewriting').bPopup().close();
    })
    // end of login

    $("#postdata").button().css({ width: '150px', margin:'5px'}).click(function(){
         $('#post-message').bPopup({
            modalClose: false,
            opacity: 0.7,
            positionStyle: 'absolute',
            escClose :false
        });

        var useroptions = {};

        useroptions["livewriting_consent"] = $("#livewriting_consent").prop("checked");
        useroptions["url"] = localServerLink;

        if(logginedEmail)useroptions["email"] = logginedEmail;
        editor.livewritingMessage("post","/post", useroptions, function(state, aid){
          $('#post-message').bPopup().close();
          articlelink = resetlink+"?aid="+aid;
          $('#post-complete-message').bPopup({
            modalClose: false,
            opacity: 0.7,
            positionStyle: 'absolute',
            escClose :false
          });
          $("#post-link").text(articlelink);
          ZeroClipboard.setData( "text/plain", articlelink);
          posted_id = aid;
          if(logginedEmail){
            var scope = angular.element($("#list-livewriting")).scope();
            scope.$apply(function () {
              scope.getList();
            });
          }
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
