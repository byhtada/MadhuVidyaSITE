$(document).ready(function() {
    if (!navigator.cookieEnabled) {
        alert( 'Включите cookie для комфортной игры' );
    }

    function ifLogin() {
        $("#reg_0").hide();
        $("#play_0").hide();

        var token_web = $.base64.encode(getAllUrlParams().viewer_id + ":" + getAllUrlParams().auth_key);
        console.log(token_web);

        $.ajaxSetup({
            error: function (data, textStatus, jqXHR) {
                console.log(data);
                if (data.status == 401) {
                    console.log("401");
                    $("#download").hide();
                    $("#reg_0").show();
                    $("#play_0").hide();

                    cats = data.responseJSON.cats;
                    dogs = data.responseJSON.dogs;

                    if (cats < dogs)
                        $("#cats_bonus").show();
                    else
                        $("#dogs_bonus").show();

                    $("#cats_side").text(cats);
                    $("#dogs_side").text(dogs);

                } else {
                    alert('Uncaught Esrror.\n' + jqXHR.responseText + " " + textStatus);
                }

            }
        });
        try {
            $.ajax({
                type: "GET",
                url: "https://cvd-api.herokuapp.com/token",
                headers: {
                    'Authorization' : 'Basic ' + token_web,
                    'Content-Type'  : 'application/x-www-form-urlencoded'
                },
                success: function (data) {
                    if (data.token.length == 32) {
                        setCookie("vk_auth_token", data.token, {expires: 36000000000000});
                        setCookie("vk_cvd_id", data.vk_cvd_id, {expires: 36000000000000});
                        console.log(getCookie("vk_cvd_id"));
                        startGame();
                    } else {
                        $("#download").hide();
                        $("#reg_0").show();
                        $("#play_0").hide();
                    }
                },
                failure: function (errMsg) {
                    $("#download").hide();
                    $("#reg_0").show();
                    $("#play_0").hide();
                    console.log(errMsg.toString());
                }
            });
        }
        catch (err) {
            console.log(err);
        }
    }



    $('#btn_reg').click(function() {
        $('#dialog_reg').dialog({modal:true,height:500,width:800});
    });

    $('#btn_reg_now').click(function() {
        name = $('#reg_name').val();
        email = $('#reg_email').val();
        pass = $('#reg_pass').val();
        var mitra = {name: name, password: pass,  email: email};

        $.ajax({
            type: "POST",
            url: "https://madhu-vidya-api.herokuapp.com/mitras",
            data: JSON.stringify(mitra),
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function(data){
                console.log(data);
                $('#dialog_reg').dialog('close');
                alert('Baba Nam Kevalam');
            },
            failure: function(errMsg) {
                alert(errMsg);
            }
        });
    });


    function getAllUrlParams(url) {
        var queryString = url ? url.split('?')[1] : window.location.search.slice(1);
        var obj = {};
        if (queryString) {
            queryString = queryString.split('#')[0];
            var arr = queryString.split('&');

            for (var i = 0; i < arr.length; i++) {
                var a = arr[i].split('=');
                var paramNum = undefined;
                var paramName = a[0].replace(/\[\d*\]/, function (v) {
                    paramNum = v.slice(1, -1);
                    return '';
                });

                var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];
                paramName = paramName.toLowerCase();
                paramValue = paramValue.toLowerCase();

                if (obj[paramName]) {

                    if (typeof obj[paramName] === 'string') {
                        obj[paramName] = [obj[paramName]];
                    }

                    if (typeof paramNum === 'undefined') {
                        obj[paramName].push(paramValue);
                    }

                    else {
                        obj[paramName][paramNum] = paramValue;
                    }
                }
                else {
                    obj[paramName] = paramValue;
                }
            }
        }
        return obj;
    }

    function setCookie(name, value, options) {
        options = options || {};
        var expires = options.expires;

        if (typeof expires == "number" && expires) {
            var d = new Date();
            d.setTime(d.getTime() + expires * 1000);
            expires = options.expires = d;
        }
        if (expires && expires.toUTCString) {
            options.expires = expires.toUTCString();
        }

        value = encodeURIComponent(value);
        var updatedCookie = name + "=" + value;
        for (var propName in options) {
            updatedCookie += "; " + propName;
            var propValue = options[propName];
            if (propValue !== true) {
                updatedCookie += "=" + propValue;
            }
        }
        document.cookie = updatedCookie;
    }

    function getCookie(name) {
        var matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
        ));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }

    function float2int(value) {
        return value | 0;
    }
});
