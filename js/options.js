/**
 * 设置页面保存与回复设置相关的js
 *@user Joseph
 */
// Saves options to localStorage.
function save_options() {
    var options = {};
    $(":checked,input:checked,input[type=range]").each(function(){
    	options[$(this).attr("name")] = $(this).val();
    });
    //options["web_key"] = $('textarea[name=web_key]').val().trim().split('\n');


    localStorage.setItem("options", JSON.stringify(options));
    // Update status to let user know options were saved.
    $("#status").text("保存成功").fadeIn();
    setTimeout(function () {
        $("#status").fadeOut();
    }, 2000);
    chrome.extension.sendRequest({method: "setLocalStorage", data: options});

}

// Restores select box state to saved value from localStorage.
function restore_options() {
    var options = JSON.parse(localStorage.getItem("options"));
    if (options){
        for (var key in options) {
            console.log(key, options[key]);
            if (options[key]){
                $(":checkbox[name="+key+"][value="+options[key]+"]").attr("checked", true);
                $(":input[name="+key+"]").val(options[key]);
            }
        }
    }

    //$("input[name=etym][value=" + localStorage["etym"] + "]").attr("checked", true);
    //$("input[name=click2s][value=" + localStorage["click2s"] + "]").attr("checked", true);
    //$("input[name=root2note][value=" + localStorage["root2note"] + "]").attr("checked", true);
    //$("input[name=afx2note][value=" + localStorage["afx2note"] + "]").attr("checked", true);
    //$("input[name=hide_cn][value=" + localStorage["hide_cn"] + "]").attr("checked", true);
    //$("input[name=web_en][value=" + localStorage["web_en"] + "]").attr("checked", true);
    //$("input[name=not_pop][value=" + localStorage["not_pop"] + "]").attr("checked", true);
    //$("input[name=ctx_menu][value=" + localStorage["ctx_menu"] + "]").attr("checked", true);
    //$("input[name=tts_type][value=" + localStorage["tts_type"] + "]").attr("checked", true);
    //$("input[name=dict][value=" + localStorage["dict"] + "]").attr("checked", true);
    //$("input[name=skip_easy][value=" + localStorage["skip_easy"] + "]").attr("checked", true);
    //$("input[name=show_syllabe][value=" + localStorage["show_syllabe"] + "]").attr("checked", true);

    //$('textarea[name=web_key]').val(options["web_key"])

//    var hider = localStorage["hider"];
//    if (undefined == hider) hider = [];
//    else hider = hider.split(',');
//    $("input[name=hider]:checkbox").val(hider);
//    var keys = localStorage["web_key"];
//    if (undefined == keys) keys = '';
//    else keys = keys.replace(/,/g, '\n');
//    $("textarea[name=web_key]").val(keys)
}

function test_keys() {
    save_options();
    var $textarea = $('textarea[name=web_key]');
    var keys = $textarea.val().trim();
    if (keys.length > 0)
        keys.split('\n').forEach(function (e) {
            var term = 'conduct';
            var url = 'http://www.dictionaryapi.com/api/v1/references/collegiate/xml/' + term + '?key=' + e;
            getOnlineWebster(term, url, function (data) {
                if (0 < data.length) {
                    $textarea.val(($textarea.val() + '\n' + e).trim());
                    save_options();
                }
            })
        });
    $textarea.val('')
}

function mail_me() {
    window.open("mailto:jinntrance@gmail.com?subject=Webster Keys&body=" + $('textarea[name=web_key]').val().split('\n').join(','))
}

var getTTSOption = function(){
    //Google speed 1 = Baidu speed 5
};

document.addEventListener('DOMContentLoaded', function(){
	restore_options();
	document.querySelector('#test').addEventListener('click', test_keys);
	document.querySelector('#mail_me').addEventListener('click', mail_me);

    $("#tts_speed").on('change', function(){
        var speed = $(this).val();
        var txt = "x{{rate}} ~ 约{{num}}词/分钟";
        $("#tts_speed_exp").text(formatString(txt, {
            rate: speed/5,
            num: 200*(speed/5)
        }));
    }).change();
    $("#tts-test").click(function(){
        var txt = "Christmas waves a magic wand over this world, and behold, everything is softer and more beautiful.";
        chrome.extension.sendRequest({
            method: "tts",
            text: txt
        });
    });
    $("input").change(save_options);

    $("#navigation a").click(function(e){
    	$("#navigation li").removeClass('active');
        $(".tab").hide();
        var target = $(this).attr("href");
        $(target).fadeIn();
        $(this).parent().addClass("active");
        e.preventDefault()
    });
});
