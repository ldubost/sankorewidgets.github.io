var sankoreLang = {
    display: "Display",
    edit: "Edit",
    instruct_text1: "Instruction example. Write the text corresponding to the definition.",
    instruct_text2: "Instruction example. Write the text corresponding to the image.",
    instruct_text3: "Instruction example. Write the french word corresponding to the sound.",
    input_text: "Write your answer here.",
    hint_text: "Hint box. This hint will be displayed... or not.",
    ref_text1: "crocodile",
    ref_text2: "one",
    ref_text3: "bateau",
    text1: "Large aquatic reptile having thick armorlike skin and long tapering jaws.",
    hint_text1: "This animal is native to tropical and can be several meters long.",
    hint_text2: "This number has only three letters.",
    hint_text3: "Be carreful, for this French word, do not use letter 'o' when you hear the sound 'o'.",
    new_ref_text: "Reference text",
    new_txt: "New text box",
    new_inst_txt: "This is a new slide. New instructions.",
    new_inst_txt: "New instructions.",
    new_hint_txt: "This is a new hint box.",
    new_slide: "This is new slide.",
    wgt_name: "Writing",
    slate: "slate",
    pad: "tablet",
    none: "none",
    help: "Help",
    help_content:
"<p><h2>Writing</h2></p>" +
"<p><h3>Booklet pages with text checker.</h3></p>" +
"<p>'Writing' is a booklet with pages allowing to write text (input text) on each page and to compare this text with a predifined text (reference text)." +
" This booklet can be enriched with text, images, sound and videos.</p>" +
"<p>Enter the 'Edit' mode to :</p>" +
"<ul><li>choose the theme of interactivity : pad, slate or none (none by default),</li>" +
"<li>edit the pages of the booklet.</li></ul>" +
"<p>On each page, you can :</p>" +
"<ul><li>write the reference text in the green background text block on the left (to modify this text box, click inside the text and write).</li>" +
" This text will not appear on the page when you are in 'Display' mode,</li>" +
"<li>insert text boxes to give instructions (or title) with the yellow “+T” on the left (to modify these text boxes, click inside the text and write)." +
" This text will be yellow.</li>"+
"<li>insert text boxes with the grey “+T” on the left (to modify these text boxes, click inside the text and write)." +
"< This text will be black with a white background.</li>"+
"<li>insert hint text box (help box) with the “+ yellow light bulb“ button on the left (to modify these text boxes, click inside the text and write)." +
"< This text will have background and side yellow. It will be associated to a new yellow light bulb created on its right."+
" In 'display' mode, a clic on this yellow light bulb toggles on and off the hint text box.</li>"+
"<li>insert pictures, sounds and videos dragging and dropping files from the library,</li>" +
"<li>move texts, pictures, sounds and videos inside the page by clicking and dragging the multidirectional arrows located on the frame,</li>" +
"<li>enlarge the size of an element with the double arrow at the bottom right of the frame,</li>" +
"<li>delete an item with the “X”.</li></ul>" +
"<p>To add a page, click on the “+” green arrow at the bottom.</p>" +
"<p>To delete a page, click on the red cross.</p>" +
"<p>“Display” button comes back to the activity.</p>" +
"<ul><li> In 'Display' mode, you can write the expected text in the text box (text block appears with black side when you are in 'Edit' mode). This text box located in the middle right on the frame " +
" (to modify this text box, click inside the text and write).</li>" +
"<li>A click on the 'Check' button, located at right of the expected text box, will compare the expected text with the reference text.</li>" +
"<li>When the expected text matches the reference text, background of expected text box change to green.</li>"+
"<li>If a yellow light bulb exists on your slide, a clic on this light bulb will show on or off the hint text box (text box with yellow background and side).</li></ul>",
    theme: "Theme"
};

//some flags
var mouse_state = false;

//object for resize
var resize_obj = {
    object: null,
    top: 0,
    left: 0,
    clicked: false,
    k: 0
}

//main function
function start(){

    $("#wgt_display").text(sankoreLang.display);
    $("#wgt_edit").text(sankoreLang.edit);
    $("#wgt_name").text(sankoreLang.wgt_name);
    $("#wgt_help").text(sankoreLang.help);
    $("#help").html(sankoreLang.help_content);
    $("#style_select option[value='1']").text(sankoreLang.slate);
    $("#style_select option[value='2']").text(sankoreLang.pad);
    $("#style_select option[value='3']").text(sankoreLang.none);
    var tmpl = $("div.inline label").html();
    $("div.inline label").html(sankoreLang.theme + tmpl)

    if(window.sankore){
        if(sankore.preference("ecrire","")){
            var data = jQuery.parseJSON(sankore.preference("ecrire",""));
            importData(data);
        }
        else
            showExample();
        if(sankore.preference("ecrire_style","")){
            changeStyle(sankore.preference("ecrire_style",""));
            $("#style_select").val(sankore.preference("ecrire_style",""));
        } else
            changeStyle("3")
    }
    else
        showExample();

    //events
    if (window.widget) {
        window.widget.onleave = function(){
            if(!$("#wgt_help").hasClass("open")){
                exportData();
                sankore.setPreference("ecrire_style", $("#style_select").find("option:selected").val());
                sankore.setPreference("ecrire_cur_page", $("#slider").getPage());
                sankore.setPreference("ecrire_left_nav", $("#prevBtn a").css("display"));
                sankore.setPreference("ecrire_right_nav", $("#nextBtn a").css("display"));
            }
        }
    }

    $("#style_select").change(function (event){
        changeStyle($(this).find("option:selected").val());
    })

    $("#wgt_help").click(function(){
        var tmp = $(this);
        if($(this).hasClass("open")){
            $(this).removeClass("help_pad").removeClass("help_wood")
            $("#help").hide();
            tmp.removeClass("open");
            $("#slider").show();
        } else {
            ($("#style_select").val() == 1)?$(this).removeClass("help_pad").addClass("help_wood"):$(this).removeClass("help_wood").addClass("help_pad");
            exportData();
            sankore.setPreference("ecrire_style", $("#style_select").find("option:selected").val());
            sankore.setPreference("ecrire_cur_page", $("#slider").getPage());
            sankore.setPreference("ecrire_left_nav", $("#prevBtn a").css("display"));
            sankore.setPreference("ecrire_right_nav", $("#nextBtn a").css("display"));
            $("#slider").hide();
            $("#help").show();
            tmp.addClass("open");
        }
    });

    $("#wgt_display, #wgt_edit").click(function(event){
        if(this.id == "wgt_display"){
            if(!$(this).hasClass("selected")){
                if(window.sankore)
                    sankore.enableDropOnWidget(false);
                $(this).addClass("selected");
                $("#wgt_edit").removeClass("selected");
                $("#parameters").css("display","none");
                var tmpwh = $(window).height();
                var tmpww = $(window).width();
                window.resizeTo(tmpww, tmpwh - 44)

                $("#slider li>div").each(function(){
                    var container = $(this);
                    container.removeAttr("ondragenter")
                    .removeAttr("ondragleave")
                    .removeAttr("ondragover")
                    .removeAttr("ondrop");

                    container.find(".ref_text_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).find(".close_img").remove();
                        $(this).find(".size_up").remove();
                        $(this).find(".size_down").remove();
                        $(this).find(".resize_block").remove();
                        $(this).find(".real_text").removeAttr("contenteditable");
                        $(this).find(".real_text").css("opacity", "0");
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                        $(this).css("opacity", "0");
                    });

                    container.find(".submit").each(function(){
                    $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".show_hint").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".input_text_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).find(".close_img").remove();
                        $(this).find(".size_up").remove();
                        $(this).find(".size_down").remove();
                        $(this).find(".resize_block").remove();
                        $(this).css("background-color", "white");
                        $(this).find(".real_text").attr("contenteditable", "true");
                        $(this).css("border", "none");
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".instruct_text_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).find(".close_img").remove();
                        $(this).find(".size_up").remove();
                        $(this).find(".size_down").remove();
                        $(this).find(".resize_block").remove();
                        $(this).find(".instruct_text").attr("contenteditable", "false");
                        $(this).find(".instruct_text").removeAttr("contenteditable");
                        $(this).css("border", "none");
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".hint_text_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).find(".close_hint_img").remove();
                        $(this).find(".size_up").remove();
                        $(this).find(".size_down").remove();
                        $(this).find(".resize_block").remove();
                        $(this).find(".real_text").attr("contenteditable", "false");
                        $(this).find(".real_text").removeAttr("contenteditable");
                        $(this).find(".real_text").css("opacity", "0");
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                        $(this).css("opacity", "0");
                        $(this).attr("show", "off");
                    });

                    container.find(".text_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".move_block").remove();
                        $(this).find(".close_img").remove();
                        $(this).find(".size_up").remove();
                        $(this).find(".size_down").remove();
                        $(this).find(".resize_block").remove();
                        $(this).find(".real_text").attr("contenteditable", "false");
                        $(this).find(".real_text").removeAttr("contenteditable");
                        $(this).css("border", "none");
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".img_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".close_img").remove();
                        $(this).find(".move_block").remove();
                        $(this).find(".resize_block").remove();
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".audio_block").each(function(){
                        $(this).draggable("destroy");
                        $(this).find(".close_img").remove();
                        $(this).find(".move_block").remove();
                        $(this).find(".resize_block").remove();
                        $(this).removeClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".add_left").remove();
                    container.find(".add_right").remove();
                    container.find(".close_slide").remove();
                    container.find(".add_text").remove();
                    container.find(".add_instruct_text").remove();
                    container.find(".add_hint").remove();
                });
                $(this).css("display", "none");
                $("#wgt_edit").css("display", "block");
            }
        } else {
            if(!$(this).hasClass("selected")){
                if(window.sankore)
                    sankore.enableDropOnWidget(true);
                $(this).addClass("selected");
                $("#wgt_display").removeClass("selected");
                $("#parameters").css("display","block");
                tmpwh = $(window).height();
                tmpww = $(window).width();
                window.resizeTo(tmpww, tmpwh + 44)

                $("#slider li>div").each(function(){
                    var container = $(this);
                    container.attr("ondragenter", "return false;")
                    .attr("ondragleave", "$(this).css(\"background\",\"none\"); return false;")
                    .attr("ondragover", "$(this).css(\"background-color\",\"#ccc\"); return false;")
                    .attr("ondrop", "$(this).css(\"background\",\"none\"); return onDropTarget(this,event);");

                    container.find(".ref_text_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img'>").remove();
                        $("<div class='size_up' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_down' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).css("background-color", "#cfb");
                        $(this).find(".real_text").attr("contenteditable", "true");
                        $(this).find(".real_text").css("opacity", "1");
                        $(this).addClass("block_border");
                        $(this).css("border", "8px solid green");
                        $(this).css("border-radius", "10px");
                        $(this).css("position","absolute");
                        $(this).css("opacity", "1");
                    });

                    container.find(".submit").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $(this).addClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".show_hint").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $(this).addClass("block_border");
                        $(this).css("position","absolute");
                    });

                    container.find(".input_text_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img'>").remove();
                        $("<div class='size_up' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_down' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).find(".real_text").attr("contenteditable", "true");
                        $(this).addClass("block_border");
                        $(this).css("border", "5px solid black");
                        $(this).css("border-radius", "10px");
                        $(this).css("position","absolute");
                    });

                    container.find(".instruct_text_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_up' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_down' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).find(".instruct_text").attr("contenteditable", "true");
                        $(this).addClass("block_border");
                        $(this).css("border", "1px solid grey");
                        $(this).css("border-radius", "10px");
                        $(this).css("position","absolute");
                    });

                    container.find(".hint_text_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_hint_img'contenteditable='false'>").appendTo($(this));
                        $("<div class='size_up' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_down' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).css("background-color", "#f0f0bb");
                        $(this).find(".real_text").attr("contenteditable", "true");
                        $(this).find(".real_text").css("opacity", "1");
                        $(this).addClass("block_border");
                        $(this).css("border", "2px solid yellow");
                        $(this).css("border-radius", "10px");
                        $(this).css("position","absolute");
                        $(this).css("opacity", "1");
                        $(this).attr("show", "on");
                    });

                    container.find(".text_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_up' contenteditable='false'>").appendTo($(this));
                        $("<div class='size_down' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).find(".real_text").attr("contenteditable", "true");
                        $(this).addClass("block_border");
                        /* needed to better align text box and input box */
                        $(this).css("border", "5px solid #F4F2F2");
                        $(this).css("border-radius", "10px");
                        $(this).css("position","absolute");
                    });

                    container.find(".img_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).addClass("block_border");
                    });

                    container.find(".audio_block").each(function(){
                        $(this).draggable("destroy");
                        $("<div class='move_block' contenteditable='false'>").appendTo($(this));
                        $("<div class='close_img' contenteditable='false'>").appendTo($(this));
                        $("<div class='resize_block' contenteditable='false'>").appendTo($(this));
                        $(this).addClass("block_border");
                    });

                    $("<div class='add_left'>").appendTo(container);
                    $("<div class='add_right'>").appendTo(container);
                    $("<div class='close_slide'>").appendTo(container);
                    $("<div class='add_text'>").appendTo(container);
                    $("<div class='add_instruct_text'>").appendTo(container);
                    $("<div class='add_hint'>").appendTo(container);
                    $(window).trigger("resize")
                });
                $(this).css("display", "none");
                $("#wgt_display").css("display", "block");
            }
        }

        $("audio").each(function(){
            this.pause();
            $(this).parent().find(":first-child").removeClass("stop").addClass("play");
        });

    });

    //check input text is equal to reference text
    $(".submit").live("click", function(){
        var reference = $(this).parent().parent().find(".ref_text_block").text().trim();
        var input_text = $(this).parent().parent().find(".input_text_block").text().trim();

        if(input_text == reference) {
            $(this).parent().parent().find(".input_text_block").each(function(){
                $(this).css("background-color","#cfb");
            });
        } else {
            $(this).parent().parent().find(".input_text_block").each(function(){
                $(this).css("background-color","white");
            });
        }
    });

    //show hint text
    $(".show_hint").live("click", function(){
        if ($(this).parent().parent().find(".hint_text_block").attr("show") == "on") {
            $(this).parent().parent().find(".hint_text_block").each(function(){
                $(this).css("opacity","0");
                $(this).find(".real_text").css("opacity", "0");
                $(this).addClass("block_border");
                $(this).css("border", "2px solid yellow");
                $(this).css("border-radius", "10px");
                $(this).css("opacity", "0");
                $(this).attr("show", "off");
            });
        } else {
            $(this).parent().parent().find(".hint_text_block").each(function(){
                $(this).css("opacity","1");
                $(this).css("background-color", "#f0f0bb");
                $(this).find(".real_text").attr("contenteditable", "false");
                $(this).find(".real_text").css("opacity", "1");
                $(this).addClass("block_border");
                $(this).css("border", "2px solid yellow");
                $(this).css("border-radius", "10px");
                $(this).attr("show", "on");
            });
        }
    });

    //deleting the hint img block and associated show_hint img
    $(".close_hint_img").live("click", function(){
        $(this).parent().parent().find(".show_hint").remove();
        $(this).parent().remove();
        exist_hint = false;
    });

    //deleting the img block
    $(".close_img").live("click", function(){
        $(this).parent().remove();
    });

    //increase a size of text
    $(".size_up").live("click", function(){
        $(this).parent().height("");
        var fz = parseInt($(this).parent().css("font-size").replace("px", ""));
        $(this).parent().css("font-size", fz+1 + "px");
    });

    //decrease a size of text
    $(".size_down").live("click", function(){
        var fz = parseInt($(this).parent().css("font-size").replace("px", ""));
        fz = ((fz - 1) < 8)?8:fz-1;
        $(this).parent().css("font-size", fz + "px");
    });

    //play/pause event
    $(".play, .stop").live("click", function(){
        var tmp_audio = $(this);
        var audio = tmp_audio.parent().find("audio").get(0);
        if($(this).hasClass("play")){
            if(tmp_audio.parent().find("source").attr("src")){
                tmp_audio.removeClass("play").addClass("stop");
                var id = setInterval(function(){
                    if(audio.currentTime == audio.duration){
                        clearInterval(id);
                        tmp_audio.removeClass("stop").addClass("play");
                    }
                }, 10);
                tmp_audio.parent().find("input").val(id);
                audio.play();
            }
        } else {
            $(this).removeClass("stop").addClass("play");
            clearInterval( tmp_audio.parent().find("input").val())
            audio.pause();
        }
    });

    $(".replay").live("click", function(){
        var tmp_audio = $(this).prev();
        var audio = $(this).parent().find("audio").get(0);
        if(tmp_audio.parent().find("source").attr("src")){
            $(this).prev().removeClass("play").addClass("stop");
            clearInterval($(this).parent().find("input").val());
            var id = setInterval(function(){
                if(audio.currentTime == audio.duration){
                    clearInterval(id);
                    tmp_audio.removeClass("stop").addClass("play");
                }
            }, 10);
            tmp_audio.parent().find("input").val(id);
            audio.currentTime = 0;
            audio.play();
        }
    });

    //moving objects
    $(".move_block").live("mouseover",function(){
        $(this).parent().draggable();
    });

    $(".move_block").live("mouseleave",function(){
        if(!mouse_state)
            $(this).parent().draggable("destroy");
    });

    $(".move_block").live("mousedown",function(){
        mouse_state = true;
    });

    $(".move_block").live("mouseup",function(){
        mouse_state = false;
    });

    //resize block
    $(".resize_block").live("mousedown", function(){
        resize_obj.object = $(this);
        resize_obj.top = event.clientY;
        resize_obj.left = event.clientX;
        resize_obj.clicked = true;
        if($(this).parent().hasClass("img_block"))
            resize_obj.k = $(this).parent().find("img").width() / $(this).parent().find("img").height();
    })

    $("li>div").live("mouseup", function(){
        resize_obj.object = null;
        resize_obj.top = 0;
        resize_obj.left = 0;
        resize_obj.clicked = false;
    })

    $("li>div").live("mousemove", function(){
        if(resize_obj.clicked){
            if(resize_obj.object.parent().hasClass("ref_text_block")){
                var width = resize_obj.object.parent().width() - resize_obj.left + event.clientX;
                var height = resize_obj.object.parent().height() - resize_obj.top + event.clientY;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().width(width).height(height);
            } else if(resize_obj.object.parent().hasClass("input_text_block")){
                var width = resize_obj.object.parent().width() - resize_obj.left + event.clientX;
                var height = resize_obj.object.parent().height() - resize_obj.top + event.clientY;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().width(width).height(height);
            } else if(resize_obj.object.parent().hasClass("text_block")){
                var width = resize_obj.object.parent().width() - resize_obj.left + event.clientX;
                var height = resize_obj.object.parent().height() - resize_obj.top + event.clientY;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().width(width).height(height);
            } else if(resize_obj.object.parent().hasClass("instruct_text_block")){
                var width = resize_obj.object.parent().width() - resize_obj.left + event.clientX;
                var height = resize_obj.object.parent().height() - resize_obj.top + event.clientY;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().width(width).height(height);
            } else if(resize_obj.object.parent().hasClass("hint_text_block")){
                var width = resize_obj.object.parent().width() - resize_obj.left + event.clientX;
                var height = resize_obj.object.parent().height() - resize_obj.top + event.clientY;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().width(width).height(height);
            } else {
                var img_width = resize_obj.object.parent().find("img").width() - resize_obj.left + event.clientX;
                var img_height = img_width / resize_obj.k;
                resize_obj.left = event.clientX;
                resize_obj.top = event.clientY;
                resize_obj.object.parent().find("img").width(img_width).height(img_height);
            }
        }
    });

    //closing a slide
    $(".close_slide").live("click", function(){
        $(this).parent().parent().remove();
        $("#slider").removeSlide();
    });

    //adding new slides
    $(".add_left").live("click", function(){
        var cur_li = $(this).parent().parent();
        var new_li = $("<li>");
        new_li.width(cur_li.width()).height(cur_li.height()).css("float","left");
        var new_div = $("<div>").appendTo(new_li);
        new_div.attr("ondragenter", "return false;")
        .attr("ondragleave", "$(this).css(\"background-color\",\"\"); return false;")
        .attr("ondragover", "$(this).css(\"background-color\",\"#ccc\"); return false;")
        .attr("ondrop", "$(this).css(\"background-color\",\"\"); return onDropTarget(this,event);");

        var ref_example = $("<div class='ref_text_block' style='position: absolute;'>").addClass("block_border");
        $("<div class='real_text' contenteditable='true'>" + sankoreLang.new_ref_text + "</div>").appendTo(ref_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(ref_example);
        $("<div class='close_img' contenteditable='false'>").remove();
        $("<div class='size_up' contenteditable='false'>").appendTo(ref_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(ref_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(ref_example);
        ref_example.css("position","absolute");
        ref_example.css("opacity", "1");
        ref_example.css("background-color", "#cfb");
        ref_example.css("top","20px").css("left","20px");
        ref_example.css("border", "8px solid green");
        ref_example.css("border-radius", "10px");
        ref_example.css("opacity", "1")
        new_div.append(ref_example);

        var submit_example = $("<div class='submit' style='position: absolute;'>").addClass("block_border");
        $("<div class='move_block' contenteditable='false'>").appendTo(submit_example);
        submit_example.draggable("destroy");
        submit_example.css("position","absolute");
        new_div.append(submit_example);

        var input_example = $("<div class='input_text_block' style='position: absolute;'>").addClass("block_border");
        $("<div class='real_text' contenteditable='true'>" + sankoreLang.input_text + "</div>").appendTo(input_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(input_example);
        $("<div class='close_img' contenteditable='false'>").remove();
        $("<div class='size_up' contenteditable='false'>").appendTo(input_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(input_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(input_example);
        input_example.css("top","140px").css("left","400px");
        input_example.css("border", "5px solid black");
        input_example.css("border-radius", "10px");
        new_div.append(input_example);

        var instruct_example = $("<div class='instruct_text_block' style='position:absolute; font-size: 22px;'>").addClass("block_border");
        $("<div class='instruct_text' contenteditable='true'>" + sankoreLang.new_inst_txt + "</div>").appendTo(instruct_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='close_img' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='size_up' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(instruct_example);
        instruct_example.css("top","75px").css("left","60px");
        instruct_example.css("border", "1px solid grey");
        instruct_example.css("border-radius", "10px");
        new_div.append(instruct_example);

        var show_hint_example = $("<div class='show_hint' active='on'></div>");
        $("<div class='move_block' contenteditable='false'>").addClass("block_border").appendTo(show_hint_example);
        show_hint_example.css("position","absolute");
        new_div.append(show_hint_example);

        var hint_text_example = $("<div class='hint_text_block' show='on'></div>").addClass("block_border");
        $("<div class='real_text' style='opacity:1'>" + sankoreLang.new_hint_txt + "</div>").appendTo(hint_text_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='close_hint_img'contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='size_up' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(hint_text_example);
        hint_text_example.css("background-color", "#f0f0bb");
        hint_text_example.find(".real_text").attr("contenteditable", "true");
        hint_text_example.find(".real_text").css("opacity", "1");
        hint_text_example.addClass("block_border");
        hint_text_example.css("border", "2px solid yellow");
        hint_text_example.css("border-radius", "10px");
        hint_text_example.css("opacity", "1");
        hint_text_example.attr("show", "on");
        new_div.append(hint_text_example);

        $("<div class='add_left'>").appendTo(new_div);
        $("<div class='add_right'>").appendTo(new_div);
        $("<div class='close_slide'>").appendTo(new_div);
        $("<div class='add_text'>").appendTo(new_div);
        $("<div class='add_instruct_text'>").appendTo(new_div);
        $("<div class='add_hint'>").appendTo(new_div);
        new_li.insertBefore(cur_li);
        $("#slider").addSlide("before");
    });

    $(".add_right").live("click", function(){
        var cur_li = $(this).parent().parent();
        var new_li = $("<li>");
        new_li.width(cur_li.width()).height(cur_li.height()).css("float","left");
        var new_div = $("<div>").appendTo(new_li);
        new_div.attr("ondragenter", "return false;")
        .attr("ondragleave", "$(this).css(\"background-color\",\"\"); return false;")
        .attr("ondragover", "$(this).css(\"background-color\",\"#ccc\"); return false;")
        .attr("ondrop", "$(this).css(\"background-color\",\"\"); return onDropTarget(this,event);");

        var ref_example = $("<div class='ref_text_block' style='position: absolute;'>").addClass("block_border");
        $("<div class='real_text' contenteditable='true'>" + sankoreLang.new_ref_text + "</div>").appendTo(ref_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(ref_example);
        $("<div class='close_img' contenteditable='false'>").remove();
        $("<div class='size_up' contenteditable='false'>").appendTo(ref_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(ref_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(ref_example);
        ref_example.css("position","absolute");
        ref_example.css("opacity", "1");
        ref_example.css("background-color", "#cfb");
        ref_example.css("top","20px").css("left","20px");
        ref_example.css("border", "8px solid green");
        ref_example.css("border-radius", "10px");
        ref_example.css("opacity", "1")
        new_div.append(ref_example);

        var submit_example = $("<div class='submit' style='position: absolute;'>").addClass("block_border");
        $("<div class='move_block' contenteditable='false'>").appendTo(submit_example);
        submit_example.draggable("destroy");
        submit_example.css("position","absolute");
        new_div.append(submit_example);

        var input_example = $("<div class='input_text_block' style='position: absolute;'>").addClass("block_border");
        $("<div class='real_text' contenteditable='true'>" + sankoreLang.input_text + "</div>").appendTo(input_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(input_example);
        $("<div class='close_img' contenteditable='false'>").remove();
        $("<div class='size_up' contenteditable='false'>").appendTo(input_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(input_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(input_example);
        input_example.css("top","140px").css("left","400px");
        input_example.css("border", "5px solid black");
        input_example.css("border-radius", "10px");
        new_div.append(input_example);

        var instruct_example = $("<div class='instruct_text_block' style='position: absolute;font-size: 22px;'>").addClass("block_border");
        $("<div class='instruct_text' contenteditable='true'>" + sankoreLang.new_inst_txt + "</div>").appendTo(instruct_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='close_img' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='size_up' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(instruct_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(instruct_example);
        instruct_example.css("top","75px").css("left","60px");
        instruct_example.css("border", "1px solid grey");
        instruct_example.css("border-radius", "10px");
        new_div.append(instruct_example);

        var show_hint_example = $("<div class='show_hint' active='on'></div>");
        $("<div class='move_block' contenteditable='false'>").addClass("block_border").appendTo(show_hint_example);
        show_hint_example.css("position","absolute");
        new_div.append(show_hint_example);

        var hint_text_example = $("<div class='hint_text_block' show='on'></div>").addClass("block_border");
        $("<div class='real_text' style='opacity:1'>" + sankoreLang.new_hint_txt + "</div>").appendTo(hint_text_example);
        $("<div class='move_block' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='close_hint_img'contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='size_up' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='size_down' contenteditable='false'>").appendTo(hint_text_example);
        $("<div class='resize_block' contenteditable='false'>").appendTo(hint_text_example);
        hint_text_example.css("background-color", "#f0f0bb");
        hint_text_example.find(".real_text").attr("contenteditable", "true");
        hint_text_example.find(".real_text").css("opacity", "1");
        hint_text_example.addClass("block_border");
        hint_text_example.css("border", "2px solid yellow");
        hint_text_example.css("border-radius", "10px");
        hint_text_example.css("opacity", "1");
        hint_text_example.attr("show", "on");
        new_div.append(hint_text_example);

        $("<div class='add_left'>").appendTo(new_div);
        $("<div class='add_right'>").appendTo(new_div);
        $("<div class='close_slide'>").appendTo(new_div);
        $("<div class='add_text'>").appendTo(new_div);
        $("<div class='add_instruct_text'>").appendTo(new_div);
        $("<div class='add_hint'>").appendTo(new_div);
        new_li.insertAfter(cur_li);
        $("#slider").addSlide("after");
    });

    $(".add_text").live("click", function(){
        var container = $(this).parent();
        var text_block = $("<div class='text_block'><div class='real_text' contenteditable='true'>" + sankoreLang.new_txt + "</div></div>").appendTo(container);
        $("<div class='move_block' contenteditable='false'>").appendTo(text_block);
        $("<div class='close_img' contenteditable='false'>").appendTo(text_block);
        $("<div class='size_up' contenteditable='false'>").appendTo(text_block);
        $("<div class='size_down' contenteditable='false'>").appendTo(text_block);
        $("<div class='resize_block' contenteditable='false'>").appendTo(text_block);
        text_block.addClass("block_border");
        /* needed to better align text box and input box */
        text_block.css("border", "5px solid #F4F2F2");
        text_block.css("border-radius", "10px");
        text_block.css("position","absolute");
    });

    $(".add_hint").live("click", function(){
        var container = $(this).parent();
        if ($(this).parent().parent().find(".show_hint").attr("active") != "on") {
            var hint_text_block = $("<div class='hint_text_block'><div class='real_text' contenteditable='true'>" + sankoreLang.new_hint_txt + "</div></div>").appendTo(container);
            $("<div class='move_block' contenteditable='false'>").appendTo(hint_text_block);
            $("<div class='close_hint_img' contenteditable='false'>").appendTo(hint_text_block);
            $("<div class='size_up' contenteditable='false'>").appendTo(hint_text_block);
            $("<div class='size_down' contenteditable='false'>").appendTo(hint_text_block);
            $("<div class='resize_block' contenteditable='false'>").appendTo(hint_text_block);
            hint_text_block.css("background-color", "#f0f0bb");
            hint_text_block.css("position","absolute");
            hint_text_block.addClass("block_border");
            hint_text_block.css("border", "2px solid yellow");
            hint_text_block.css("border-radius", "10px");
            hint_text_block.css("opacity", "1");
            hint_text_block.attr("show", "on");

            var hint_show = $("<div class='show_hint'></div>").appendTo(container);
            $("<div class='move_block' contenteditable='false'>").appendTo(hint_show);
            hint_show.addClass("block_border");
            hint_show.css("position","absolute");
            hint_show.attr("active", "on");
        }
    });

    $(".add_instruct_text").live("click", function(){
        var container = $(this).parent();
        var instruct_text_block = $("<div class='instruct_text_block'><div class='instruct_text' contenteditable='true'>" + sankoreLang.new_inst_txt1 + "</div></div>").appendTo(container);
        $("<div class='move_block' contenteditable='false'>").appendTo(instruct_text_block);
        $("<div class='close_img' contenteditable='false'>").appendTo(instruct_text_block);
        $("<div class='size_up' contenteditable='false'>").appendTo(instruct_text_block);
        $("<div class='size_down' contenteditable='false'>").appendTo(instruct_text_block);
        $("<div class='resize_block' contenteditable='false'>").appendTo(instruct_text_block);
        instruct_text_block.css("color", "#FFF000");
        instruct_text_block.css("font-size", "22px");
        instruct_text_block.css("position","absolute");
        instruct_text_block.addClass("block_border");
        instruct_text_block.css("border", "1px solid grey");
        instruct_text_block.css("border-radius", "10px");
    });
}

//export
function exportData(){
    var array_to_export = [];
    $("#slider li>div").each(function(){
        var cont_obj = new Object();
        cont_obj.w = $(this).parent().width();
        cont_obj.h = $(this).parent().height();
        cont_obj.sub = [];
        $(this).find(".submit").each(function(){
            var submit_img = new Object();
            submit_img.h = $(this).find(".submit").height();
            submit_img.w = $(this).find(".submit").width();
            submit_img.top = $(this).position().top;
            submit_img.left = $(this).position().left;
            cont_obj.sub.push(submit_img);
        });
        cont_obj.ref_text = [];
        var ref_text = $(this).parent().parent().find(".ref_text_block").text();
        $(this).find(".ref_text_block").each(function(){
            var ref_txt_block = new Object();
            ref_txt_block.top = $(this).position().top;
            ref_txt_block.left = $(this).position().left;
            ref_txt_block.w = $(this).width();
            ref_txt_block.fz = $(this).css("font-size");
            ref_txt_block.val = $(this).find(".real_text").html();
            cont_obj.ref_text.push(ref_txt_block);
        });
        cont_obj.input_text = [];
        var input_text = $(this).parent().parent().find(".input_text_block").text();
        $(this).find(".input_text_block").each(function(){
            var input_txt_block = new Object();
            input_txt_block.top = $(this).position().top;
            input_txt_block.left = $(this).position().left;
            input_txt_block.w = $(this).width();
            input_txt_block.fz = $(this).css("font-size");
            input_txt_block.bg = $(this).css("background");
            input_txt_block.val = $(this).find(".real_text").html();
            cont_obj.input_text.push(input_txt_block);
        });
        cont_obj.instruct_text = [];
        $(this).find(".instruct_text_block").each(function(){
            var inst_txt_block = new Object();
            inst_txt_block.top = $(this).position().top;
            inst_txt_block.left = $(this).position().left;
            inst_txt_block.w = $(this).width();
            inst_txt_block.fz = $(this).css("font-size");
            inst_txt_block.val = $(this).find(".instruct_text").html();
            cont_obj.instruct_text.push(inst_txt_block);
        });
        cont_obj.hint_text = [];
        $(this).find(".hint_text_block").each(function(){
            var hint_txt_block = new Object();
            hint_txt_block.top = $(this).position().top;
            hint_txt_block.left = $(this).position().left;
            hint_txt_block.w = $(this).width();
            hint_txt_block.fz = $(this).css("font-size");
            hint_txt_block.bg = $(this).css("background-color");
            hint_txt_block.val = $(this).find(".real_text").html();
            cont_obj.hint_text.push(hint_txt_block);
        });
        cont_obj.show_hint = [];
        $(this).find(".show_hint").each(function(){
            var show_hint_img = new Object();
            show_hint_img.h = $(this).find(".show_hint").height();
            show_hint_img.w = $(this).find(".show_hint").width();
            show_hint_img.top = $(this).position().top;
            show_hint_img.left = $(this).position().left;
            show_hint_img.active = $(this).attr("active");
            cont_obj.show_hint.push(show_hint_img);
        });
        cont_obj.text = [];
        $(this).find(".text_block").each(function(){
            var txt_block = new Object();
            txt_block.top = $(this).position().top;
            txt_block.left = $(this).position().left;
            txt_block.w = $(this).width();
            txt_block.fz = $(this).css("font-size");
            txt_block.val = $(this).find(".real_text").html();
            cont_obj.text.push(txt_block);
        });
        cont_obj.imgs = [];
        $(this).find(".img_block").each(function(){
            var img_obj = new Object();
            img_obj.link = $(this).find("img").attr("src");
            img_obj.h = $(this).find("img").height();
            img_obj.w = $(this).find("img").width();
            img_obj.top = $(this).position().top;
            img_obj.left = $(this).position().left;
            cont_obj.imgs.push(img_obj);
        });
        cont_obj.audio = [];
        $(this).find(".audio_block").each(function(){
            var audio_block = new Object();
            audio_block.top = $(this).position().top;
            audio_block.left = $(this).position().left;
            audio_block.val = $(this).find("source").attr("src");
            cont_obj.audio.push(audio_block);
        });
        array_to_export.push(cont_obj);
    });
    sankore.setPreference("ecrire", JSON.stringify(array_to_export));
}

//import
function importData(data){

    var width = 0;
    var height = 0;

    for(var i in data){

        width = data[i].w;
        height = data[i].h;
        var li = $("<li style='float: left; width: " + data[i].w + "; height: " + data[i].h + ";'>");
        var div = $("<div>").appendTo(li);

        for(var j in data[i].sub){
            var submit_div = $("<div class='submit'></div>");
            submit_div.draggable("destroy").css("position","absolute")
            .width(data[i].sub[j].w)
            .height(data[i].sub[j].h)
            .css("top", data[i].sub[j].top)
            .css("left", data[i].sub[j].left)
            .appendTo(div);
        }

        for(var j in data[i].ref_text){
            var ref_text_div = $("<div class='ref_text_block'><div class='real_text' style='opacity:0' contenteditable='true'>" + data[i].ref_text[j].val + "</div></div>");
            ref_text_div.draggable("destroy").css("position","absolute")
            .width(data[i].ref_text[j].w)
            .css("top", data[i].ref_text[j].top)
            .css("left", data[i].ref_text[j].left)
            .css("font-size", data[i].ref_text[j].fz)
            .css("border", "none")
            .appendTo(div);
        }

        for(var j in data[i].input_text){
            var input_text_div = $("<div class='input_text_block'><div class='real_text' contenteditable='true'>" + data[i].input_text[j].val + "</div></div>");
            input_text_div.draggable("destroy").css("position","absolute")
            .width(data[i].input_text[j].w)
            .css("top", data[i].input_text[j].top)
            .css("left", data[i].input_text[j].left)
            .css("font-size", data[i].input_text[j].fz)
            .css("background", data[i].input_text[j].bg)
            .appendTo(div);
        }

        for(var j in data[i].instruct_text){
            var instruct_text_div = $("<div class='instruct_text_block'><div class='instruct_text'>" + data[i].instruct_text[j].val + "</div></div>");
            instruct_text_div.draggable().css("position","absolute")
            .width(data[i].instruct_text[j].w)
            .css("top", data[i].instruct_text[j].top)
            .css("left", data[i].instruct_text[j].left)
            .css("font-size", data[i].instruct_text[j].fz)
            .appendTo(div);
        }

        for(var j in data[i].hint_text){
            var hint_text_div = $("<div class='hint_text_block' show='off' style='opacity:0'><div class='real_text' style='opacity:0'>" + data[i].hint_text[j].val + "</div></div>");
            hint_text_div.draggable().css("position","absolute")
            .width(data[i].hint_text[j].w)
            .css("top", data[i].hint_text[j].top)
            .css("left", data[i].hint_text[j].left)
            .css("font-size", data[i].hint_text[j].fz)
            .css("background-color", data[i].hint_text[j].bg)
            .appendTo(div);
        }

        for(var j in data[i].show_hint){
            var show_hint_div = $("<div class='show_hint' active='off'></div>");
            show_hint_div.draggable("destroy").css("position","absolute")
            .width(data[i].show_hint[j].w)
            .height(data[i].show_hint[j].h)
            .css("top", data[i].show_hint[j].top)
            .css("left", data[i].show_hint[j].left)
            .attr("active", data[i].show_hint[j].active)
            .appendTo(div);
        }

        for(var j in data[i].text){
            var text_div = $("<div class='text_block'><div class='real_text'>" + data[i].text[j].val + "</div></div>");
            text_div.draggable().css("position","absolute")
            .width(data[i].text[j].w)
            .css("top", data[i].text[j].top)
            .css("left", data[i].text[j].left)
            .css("font-size", data[i].text[j].fz)
            .appendTo(div);
        }

        for(j in data[i].imgs){
            var img_div = $("<div class='img_block' style='text-align: center;'>");
            img_div.draggable("destroy").css("position","absolute")
            .css("top", data[i].imgs[j].top)
            .css("left", data[i].imgs[j].left)
            .appendTo(div);
            $("<img src='" + data[i].imgs[j].link + "' style='display: inline;' width='" + data[i].imgs[j].w + "' height='" + data[i].imgs[j].h + "'/>").appendTo(img_div);
        }

        for(j in data[i].audio){
            var audio_div = $("<div class='audio_block'>");
            $("<div class='play'>").appendTo(audio_div);
            $("<div class='replay'>").appendTo(audio_div);
            var tmp_audio = $("<audio>").appendTo(audio_div);
            $("<source src='" + data[i].audio[j].val + "' />").appendTo(tmp_audio);
            audio_div.draggable("destroy").css("position","absolute")
            .css("top", data[i].audio[j].top)
            .css("left", data[i].audio[j].left)
            .appendTo(div);
        }

        $("#slider ul").append(li);
    }

    $(window).trigger("resize")
    $("#slider").width(width).height(height).easySlider({
        prevText: '',
        nextText: '',
        controlsShow: false
    });
    $("#slider").goToSlide(sankore.preference("ecrire_cur_page",""));
    $("#prevBtn a").css("display", sankore.preference("ecrire_left_nav",""));
    $("#nextBtn a").css("display", sankore.preference("ecrire_right_nav",""));
}

//example
function showExample(){

    var li1 = $("<li>");
    var div1 = $("<div>").appendTo(li1);

    $("<div class='input_text_block'><div class='real_text' contenteditable='true'>" + sankoreLang.input_text + "</div></div>").appendTo(div1)
    $("<div class='instruct_text_block' style='position: absolute; font-size: 22px;'><div class='instruct_text'>" + sankoreLang.instruct_text1 + "</div></div>").appendTo(div1)
    $("<div class='submit'></div>").appendTo(div1)
    $("<div class='text_block'><div class='real_text'>" + sankoreLang.text1 + "</div></div>").appendTo(div1)
    $("<div class='ref_text_block' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.ref_text1 + "</div></div>").appendTo(div1)
    $("<div class='hint_text_block' show='off' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.hint_text1 + "</div></div>").appendTo(div1)
    $("<div class='show_hint' active='on'></div>").appendTo(div1)

    li1.width($("#slider").width()).height($("#slider").height());
    $("#slider ul").append(li1);

    var li2 = $("<li>");
    var div2 = $("<div>").appendTo(li2);

    $("<div class='input_text_block'><div class='real_text' contenteditable='true'>" + sankoreLang.input_text + "</div></div>").appendTo(div2)
    $("<div class='instruct_text_block' style='position: absolute; font-size: 22px;'><div class='instruct_text'>" + sankoreLang.instruct_text2 + "</div></div>").appendTo(div2)
    $("<div class='submit'></div>").appendTo(div2)
    $("<div class='ref_text_block' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.ref_text2 + "</div></div>").appendTo(div2)
    $("<div class='hint_text_block' show='off' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.hint_text2 + "</div></div>").appendTo(div2)
    $("<div class='show_hint' active='on'></div>").appendTo(div2)

    var img = $("<div class='img_block' style='text-align: center;'></div>").appendTo(div2);
    $("<img src=\"objects/1.gif\" style=\"display: inline;\" height=\"120\"/>").appendTo(img);
    li2.width($("#slider").width()).height($("#slider").height());
    $("#slider ul").append(li2);

    var li3 = $("<li>");
    var div3 = $("<div>").appendTo(li3);

    $("<div class='input_text_block'><div class='real_text' contenteditable='true'>" + sankoreLang.input_text + "</div></div>").appendTo(div3)
    $("<div class='instruct_text_block' style='position: absolute; font-size: 22px;'><div class='instruct_text'>" + sankoreLang.instruct_text3 + "</div></div>").appendTo(div3)
    $("<div class='submit'></div>").appendTo(div3)
    $("<div class='ref_text_block' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.ref_text3 + "</div></div>").appendTo(div3)
    $("<div class='hint_text_block' show='off' style='border: none;'><div class='real_text' style='opacity:0'>" + sankoreLang.hint_text3 + "</div></div>").appendTo(div3)
    $("<div class='show_hint' active='on'></div>").appendTo(div3)

    var audio_block = $("<div class='audio_block'>").draggable("destroy").appendTo(div3);
    $("<div class='play'>").appendTo(audio_block);
    $("<div class='replay'>").appendTo(audio_block);
    var source = $("<source/>").attr("src", "objects/bateaux.mp3");
    var audio = $("<audio>").appendTo(audio_block);
    audio.append(source);
    li3.width($("#slider").width()).height($("#slider").height());
    $("#slider ul").append(li3);

    $("#slider").easySlider({
        prevText: '',
        nextText: '',
        controlsShow: false
    });
}

//string into xml-format
function stringToXML(text){
    if (window.ActiveXObject){
        var doc=new ActiveXObject('Microsoft.XMLDOM');
        doc.async='false';
        doc.loadXML(text);
    } else {
        var parser=new DOMParser();
        doc=parser.parseFromString(text,'text/xml');
    }
    return doc;
}

//changing the style
function changeStyle(val){
    switch(val){
        case "1":
            $(".b_top_left").removeClass("btl_pad").removeClass("without_back");
            $(".b_top_center").removeClass("btc_pad").removeClass("without_back");
            $(".b_top_right").removeClass("btr_pad").removeClass("without_back");
            $(".b_center_left").removeClass("bcl_pad").removeClass("without_back");
            $(".b_center_right").removeClass("bcr_pad").removeClass("without_back");
            $(".b_bottom_right").removeClass("bbr_pad").removeClass("without_back");
            $(".b_bottom_left").removeClass("bbl_pad").removeClass("without_back");
            $(".b_bottom_center").removeClass("bbc_pad").removeClass("without_back");
            $("#wgt_help").removeClass("pad_color").removeClass("pad_help");
            $("#wgt_edit").removeClass("pad_color").removeClass("pad_edit");
            $("#wgt_name").removeClass("pad_color");
            $("#wgt_display").addClass("display_wood");
            $("#style_select").val(val);
            $("body, html").removeClass("without_radius").addClass("radius_ft");
            break;
        case "2":
            $(".b_top_left").addClass("btl_pad").removeClass("without_back");
            $(".b_top_center").addClass("btc_pad").removeClass("without_back");
            $(".b_top_right").addClass("btr_pad").removeClass("without_back");
            $(".b_center_left").addClass("bcl_pad").removeClass("without_back");
            $(".b_center_right").addClass("bcr_pad").removeClass("without_back");
            $(".b_bottom_right").addClass("bbr_pad").removeClass("without_back");
            $(".b_bottom_left").addClass("bbl_pad").removeClass("without_back");
            $(".b_bottom_center").addClass("bbc_pad").removeClass("without_back");
            $("#wgt_help").addClass("pad_color").addClass("pad_help");
            $("#wgt_edit").addClass("pad_color").addClass("pad_edit");
            $("#wgt_name").addClass("pad_color");
            $("#wgt_display").removeClass("display_wood");
            $("#style_select").val(val);
            $("body, html").removeClass("without_radius").removeClass("radius_ft");
            break;
        case "3":
            $(".b_top_left").addClass("without_back").removeClass("btl_pad");
            $(".b_top_center").addClass("without_back").removeClass("btc_pad");
            $(".b_top_right").addClass("without_back").removeClass("btr_pad");
            $(".b_center_left").addClass("without_back").removeClass("bcl_pad");
            $(".b_center_right").addClass("without_back").removeClass("bcr_pad");
            $(".b_bottom_right").addClass("without_back").removeClass("bbr_pad");
            $(".b_bottom_left").addClass("without_back").removeClass("bbl_pad");
            $(".b_bottom_center").addClass("without_back").removeClass("bbc_pad");
            $("#wgt_help").addClass("pad_color").addClass("pad_help");
            $("#wgt_edit").addClass("pad_color").addClass("pad_edit");
            $("#wgt_name").addClass("pad_color");
            $("#wgt_display").removeClass("display_wood");
            $("#style_select").val(val);
            $("body, html").addClass("without_radius").removeClass("radius_ft");
            break;
    }
}

//drop handler
function onDropTarget(obj, event) {
    if (event.dataTransfer) {
        var format = "text/plain";
        var textData = event.dataTransfer.getData(format);
        if (!textData) {
            alert(":(");
        }
        textData = stringToXML(textData);
        var tmp = textData.getElementsByTagName("path")[0].firstChild.textContent;
        var tmp_type = textData.getElementsByTagName("type")[0].firstChild.textContent;
        if(tmp_type.substr(0, 5) == "audio"){
            var audio_block = $("<div class='audio_block'>").draggable().appendTo($(obj));
            audio_block.css("position","absolute").css("top",event.clientY - 54).css("left",event.clientX - 54);
            $("<div class='close_img' contenteditable='false'>").appendTo(audio_block);
            audio_block.addClass("block_border");
            $("<div class='play'>").appendTo(audio_block);
            $("<div class='replay'>").appendTo(audio_block);
            var source = $("<source/>").attr("src", tmp);
            var audio = $("<audio>").appendTo(audio_block);
            audio.append(source);
        } else {
            var img_block = $("<div class='img_block' style='text-align: center;'></div>").appendTo($(obj));
            img_block.css("top",event.clientY - 54).css("left",event.clientX - 54);
            $("<div class='move_block' contenteditable='false'>").appendTo(img_block);
            $("<div class='close_img' contenteditable='false'>").appendTo(img_block);
            $("<div class='resize_block' contenteditable='false'>").appendTo(img_block);
            img_block.addClass("block_border");
            var tmp_img = $("<img src=\"" + tmp + "\" style=\"display: inline;\"/>").appendTo(img_block);
            setTimeout(function(){
                if(tmp_img.height() >= tmp_img.width())
                    tmp_img.attr("height", "120");
                else{
                    tmp_img.attr("width","120");
                    tmp_img.css("margin",(120 - tmp_img.height())/2 + "px 0");
                }
            }, 6)
        }
    }
    else {
        alert ("Your browser does not support the dataTransfer object.");
    }

    if (event.stopPropagation) {
        event.stopPropagation ();
    }
    else {
        event.cancelBubble = true;
    }
    return false;
}

if (window.widget) {
    window.widget.onremove = function(){
        $("audio").each(function(){
            this.pause();
            $(this).parent().find(":first-child").removeClass("stop").addClass("play");
        });
    }
}

$(window).resize(function(){
    var slider = $("#slider");
    slider.width($(this).width() - 108).height($(this).height() - 108);
    $("#slider li").each(function(){
        $(this).width(slider.width()).height(slider.height());
    });
    slider.setSize(slider.width(), slider.height());
})
