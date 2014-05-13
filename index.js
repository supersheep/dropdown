
var $ = require("jquery");
var Class = require("class");

var CLICK = "click";
var HOVER = "hover";
var MOUSE_ENTER = "mouseenter";
var MOUSE_LEAVE = "mouseleave";
var OPEN_EVENT = "openEvent";
var CLOSE_EVENT = "closeEvent";

var Dropdown = Class({
    Implements:"attrs events",
    initialize:function(elem,opt){
        var self = this;
        elem = $(elem);
        opt = opt || {};
        this.set(OPEN_EVENT,opt.triggerType);
        this.set(CLOSE_EVENT,opt.triggerType);
        this.set("elem",elem);

        var openEvent = this.get(OPEN_EVENT);
        var closeEvent = this.get(CLOSE_EVENT);

        var menu = elem.find(".dropdown-menu");
        var toggle = elem.find(".dropdown-toggle");
        var items = menu.find("li"); 
        /**
         * 不同于bootstrap，
         * 这里dropmenu的应用场景大多时候并非导航菜单，而是功能性的选择控件
         * 并且也无需把键盘可访问性放在考虑的前列，所以不采用a标签
         */

        this.set("toggle",toggle);
        this.set("menu",menu);

        this.resetWidth();

        if(openEvent === CLICK){
            toggle.on(openEvent,function(e){
                e.stopPropagation();
                if(!self.opened){
                    self.open();  
                }else{
                    self.close();
                }
            });
        }else{
            toggle.on(openEvent,function(){
                self.open();
            }).on(closeEvent,function(){
                self.close();
            });
        }

        menu.find("li").on(CLICK,function(){
            self.select($(this));
        });
        if(openEvent === CLICK){
            $(window).on(CLICK,function(){
                self.close();
            });
        }

        this.close()
    },
    open:function(e){
        if(!this.opened){
            this.opened = true;
            this.get("elem").find(".dropdown-menu").show();
        }
    },
    close:function(){
        if(this.opened || this.opened == undefined){
            this.opened = false; 
            this.get("elem").find(".dropdown-menu").hide();
        }
    },
    select:function(li){
        var value = li.attr("data-value") || li.text();
        this.val(value);
        this.emit("select",value);
        this.close();
    },
    resetWidth:function(){
        var borderWidth = 2;
        this.get("menu").css("width",this.get("toggle").outerWidth() - borderWidth);
    },
    val:function(){
        if(arguments.length === 0){
            return this.get("value");
        }else{
            this.set("value",arguments[0]);
        }
    }
},{
    openEvent:{
        setter:function(triggerType){
            return triggerType === HOVER ? MOUSE_ENTER : CLICK;
        }
    },
    closeEvent:{
        setter:function(triggerType){
            return triggerType === HOVER ? MOUSE_LEAVE : CLICK;
        }  
    },
    elem:{},
    menu:{},
    toggle:{},
    value:{
        setter:function(val){
            this.get("toggle").find(".dropdown-text").text(val);
            this.resetWidth();
        }
    }
});


module.exports = function(elem,opt){
    return new Dropdown(elem,opt);
};