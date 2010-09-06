var chow_logged_in=(document.cookie.indexOf("cs_sig")!=-1)?true:false;
function $(id){
return document.getElementById(id);
}
YEvent=YAHOO.util.Event;
YDom=YAHOO.util.Dom;
chow_js={init:function(){
top_nav_search.init();
if(loadLogin){
this.insertLoginSnippet();
}
if(!loadLogin){
chowLoginSignup.init();
}
this.popup_openers=YDom.getElementsByClassName("open_popup","a");
this.popup_closers=YDom.getElementsByClassName("close_popup","a");
this.popups=YDom.getElementsByClassName("chow_popup");
for(i=0;i<chow_js.popup_openers.length;i++){
YEvent.on(chow_js.popup_openers[i],"click",function(e){
YEvent.preventDefault(e);
chow_js.close_popups();
var _3=this.href.split("#")[1];
YDom.addClass($(_3),"active");
});
}
for(i=0;i<chow_js.popup_closers.length;i++){
YEvent.on(chow_js.popup_closers[i],"click",function(e){
YEvent.preventDefault(e);
chow_js.close_popups();
});
}
},insertLoginSnippet:function(){
YAHOO.util.Connect.asyncRequest("POST","/xhr/loginSnippet",{success:function(e){
$("header_login").innerHTML=e.responseText;
if(e.responseText.indexOf("login_link")!=-1){
chowLoginSignup.init();
}
},failure:function(e){
$("header_login").innerHTML="Failed to load login snippet";
}});
},close_popups:function(){
for(i in chow_js.popups){
YDom.removeClass(chow_js.popups[i],"active");
}
}};
var top_nav_search={init:function(){
this.oAC;
this.addListeners();
this.add_auto_complete(top_nav_search.selectedTab);
},addListeners:function(){
top_nav_search.input_query=$("input_query");
top_nav_search.input_type=$("input_type");
top_nav_search.input_location=$("input_location");
top_nav_search.input_board_location=$("input_board_location");
var _7=YDom.getElementsByClassName("top_nav_search_tab","a");
for(var i=0;i<_7.length;i++){
if(YDom.hasClass(_7[i],"selected")){
top_nav_search.selectedTab=_7[i].href.split("#")[1];
break;
}
}
YEvent.on(_7,"click",function(e){
YEvent.preventDefault(e);
for(var i=0;i<_7.length;i++){
YDom.removeClass(_7[i],"selected");
}
YDom.addClass(this,"selected");
top_nav_search.selectedTab=this.href.split("#")[1];
if(top_nav_search.selectedTab=="allchow"){
top_nav_search.input_type.value="";
top_nav_search.input_type.disabled=true;
}else{
top_nav_search.input_type.disabled=false;
}
if(top_nav_search.selectedTab=="recipes"){
top_nav_search.input_type.value="Recipe";
}else{
if(top_nav_search.selectedTab=="restaurants"){
top_nav_search.input_type.value="Restaurant";
}else{
if(top_nav_search.selectedTab=="chowhound"){
top_nav_search.input_type.value="Topic";
}
}
}
if(top_nav_search.selectedTab=="recipes"||top_nav_search.selectedTab=="allchow"){
YDom.removeClass("header_search","location_search");
YDom.removeClass("header_search","board_search");
top_nav_search.input_location.style.display="none";
top_nav_search.input_location.disabled=true;
}
if(top_nav_search.selectedTab=="restaurants"){
YDom.addClass("header_search","location_search");
YDom.removeClass("header_search","board_search");
top_nav_search.input_location.style.display="inline";
top_nav_search.input_location.disabled=false;
}
if(top_nav_search.selectedTab=="chowhound"){
YDom.addClass("header_search","board_search");
YDom.removeClass("header_search","location_search");
top_nav_search.input_board_location.style.display="inline";
top_nav_search.input_board_location.disabled=false;
$("from_date").disabled=false;
top_nav_search.input_location.style.display="none";
top_nav_search.input_location.disabled=true;
$("search_board_id").disabled=false;
}else{
top_nav_search.input_board_location.disabled=true;
top_nav_search.input_board_location.style.display="none";
$("search_board_id").disabled=true;
$("from_date").disabled=true;
}
top_nav_search.add_auto_complete(top_nav_search.selectedTab);
top_nav_search.add_field_listeners();
});
top_nav_search.add_field_listeners();
YEvent.on("header_search_form","submit",function(e){
if($("input_type").value=="Topic"){
top_nav_search.oAC._onTextboxBlur(null,top_nav_search.oAC);
}
if(top_nav_search.input_query.value.toLowerCase()=="search..."){
top_nav_search.input_query.value="";
}
if(top_nav_search.input_location.value.toLowerCase()=="location..."||top_nav_search.input_location.value.toLowerCase()=="address, city, state or zip"){
top_nav_search.input_location.value="";
}
if(top_nav_search.input_board_location.value.toLowerCase()=="board name or location"){
top_nav_search.input_board_location.value="";
}
});
},add_field_listeners:function(){
var _c=[top_nav_search.input_query,top_nav_search.input_location,top_nav_search.input_board_location];
YEvent.addListener(_c,"focus",function(){
if(this.defaultValue===""){
this.defaultValue=this.value;
}
if("search... location... board name or location address, city, state or zip".indexOf(this.value.toLowerCase())!=-1){
this.value="";
}
if(this.id=="input_location"){
$("search_board_id").value="";
}
});
YEvent.addListener(_c,"blur",function(){
if(this.value===""){
$(this.id).value=this.defaultValue;
}
});
},add_auto_complete:function(_d){
if(top_nav_search.oAC){
top_nav_search.oAC.destroy();
}
switch(_d){
case "allchow":
var _e=new YAHOO.util.XHRDataSource("/xhr/search/autocomplete/all");
break;
case "recipes":
var _e=new YAHOO.util.XHRDataSource("/xhr/search/autocomplete/recipes");
break;
case "restaurants":
var _e=new YAHOO.util.XHRDataSource("/xhr/search/autocomplete/restaurants");
break;
case "chowhound":
var _e=new YAHOO.util.XHRDataSource("/xhr/boardname/autocomplete");
break;
}
_e.responseType=YAHOO.util.XHRDataSource.TYPE_JSON;
if(_d=="chowhound"){
_e.responseSchema={resultsList:"response.docs",fields:["title","id"]};
top_nav_search.oAC=new YAHOO.widget.AutoComplete(top_nav_search.input_board_location,"autoCompleteContainer",_e);
top_nav_search.oAC.forceSelection=true;
top_nav_search.oAC._bItemSelected=true;
top_nav_search.oAC.itemSelectEvent.subscribe(function(_f,_10,_11){
top_nav_search.input_board_location.value=_10[2][0];
$("search_board_id").value=_10[2][1];
if($("search_options_advanced")){
Search.update_board_options(_10[2][1]);
}
});
top_nav_search.oAC.selectionEnforceEvent.subscribe(function(_12,_13){
$("search_board_id").value="";
if($("search_options_advanced")){
Search.board_parent=$("boards_all");
Search.board_parent.checked=true;
Search.sub_level_board_id="";
Search.update_board_options();
}
});
}else{
_e.responseSchema={resultsList:"response.docs",fields:["title"]};
top_nav_search.oAC=new YAHOO.widget.AutoComplete(top_nav_search.input_query,"autoCompleteContainer",_e);
}
top_nav_search.oAC.generateRequest=function(_14){
return "?prefix="+_14;
};
top_nav_search.oAC.autoHighlight=false;
top_nav_search.oAC.allowBrowserAutocomplete=false;
top_nav_search.oAC.animVert=false;
top_nav_search.oAC.useIFrame=true;
return {oDS:_e,oAC:top_nav_search.oAC};
}};
var chowLoginSignup={init:function(){
if(!chow_logged_in){
this.add_static_listeners();
this.add_dynamic_listeners();
this.new_location="";
}
},add_static_listeners:function(){
var _15=YAHOO.util.Dom.getElementsByClassName("show_login_box");
YAHOO.util.Event.on(_15,"click",function(e){
YAHOO.util.Event.preventDefault(e);
var _17=this.className;
if(_17.indexOf("on_success")!=-1){
chowLoginSignup.externalSuccess=_17.split("on_success_")[1].split(" ")[0];
}
chowLoginSignup.open_login(YAHOO.util.Event.getPageY(e));
chowLoginSignup.new_location=(this.href!==undefined)?this.href:"";
});
var _18=YAHOO.util.Dom.getElementsByClassName("show_signup_box");
YAHOO.util.Event.on(_18,"click",function(e){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.open_signup(YAHOO.util.Event.getPageY(e));
});
var _1a=YAHOO.util.Dom.getElementsByClassName("chow_lightbox_bg");
YAHOO.util.Event.on(_1a,"click",function(e){
YAHOO.util.Dom.getAncestorByTagName(this,"DIV").style.display="none";
chowLoginSignup.clear_login_signup_errors("all");
});
var _1c=YAHOO.util.Dom.getElementsByClassName("close_lightbox");
YAHOO.util.Event.on(_1c,"click",function(e){
YAHOO.util.Event.preventDefault(e);
$(this.href.split("#")[1]).style.display="none";
chowLoginSignup.clear_login_signup_errors("all");
});
YAHOO.util.Event.on("user_name","blur",function(e){
YAHOO.util.Connect.asyncRequest("POST","/account/check_username?name="+this.value,{success:function(e){
if(e.responseText=="username_ok"){
$("username_ok").style.display="block";
$("username_error").style.display="none";
}
},failure:function(e){
if(e.responseText=="username_in_use"){
$("username_error").innerHTML="Already taken";
}
if(e.responseText=="username_invalid_format"){
$("username_error").innerHTML="Username must be between<br>3 and 20 characters";
}
$("username_error").style.display="block";
$("username_ok").style.display="none";
YAHOO.util.Dom.addClass("user_name","login_error");
}});
});
YAHOO.util.Event.on("user_email","blur",function(e){
YAHOO.util.Connect.asyncRequest("POST","/account/check_email?email="+this.value,{success:function(e){
if(e.responseText=="email_ok"){
$("signup_email_ok").innerHTML="Email OK";
$("signup_email_ok").style.display="block";
$("signup_email_error").style.display="none";
}
},failure:function(e){
if(e.responseText=="email_invalid_format"){
$("signup_email_error").innerHTML="Invalid email format";
}
if(e.responseText=="email_in_use"){
$("signup_email_error").innerHTML="Already registered.<br/><a href=\"/account/lost_password\" onclick=\"chowLoginSignup.request_password('signup_form'); return false\" class=\"blue\">Email password</a>";
}
$("signup_email_error").style.display="block";
$("signup_email_ok").style.display="none";
YAHOO.util.Dom.addClass("user_email","login_error");
}});
});
YAHOO.util.Event.on(document,"keydown",function(e){
if(YAHOO.util.Event.getCharCode(e)=="13"&&$("chow_login")&&$("chow_login").style.display=="block"){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_login_form();
}
if(YAHOO.util.Event.getCharCode(e)=="13"&&$("chow_signup")&&$("chow_signup").style.display=="block"){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_signup_form();
}
});
YAHOO.util.Event.on("login_submit","click",function(e){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_login_form();
});
YAHOO.util.Event.on("login_form","submit",function(e){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_login_form();
});
YAHOO.util.Event.on("signup_submit_lightbox","click",function(e){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_signup_form();
});
YAHOO.util.Event.on("signup_form","submit",function(e){
YAHOO.util.Event.preventDefault(e);
chowLoginSignup.submit_signup_form();
});
},add_dynamic_listeners:function(){
var _29=["login_name","login_password","user_name","user_password","user_password_confirmation","user_email"];
YAHOO.util.Event.on(_29,"focus",function(e){
if(YAHOO.util.Dom.hasClass(this,"login_error")){
chowLoginSignup.clear_login_signup_errors(this.id);
}
});
YAHOO.util.Event.on("user_password","blur",function(e){
if(this.value.length<3){
$("password_error").style.display="block";
$("password_ok").style.display="none";
YAHOO.util.Dom.addClass("user_password","login_error");
}else{
$("password_ok").style.display="block";
$("password_error").style.display="none";
}
});
YAHOO.util.Event.on("user_password_confirmation","blur",function(e){
if($("user_password_confirmation").value!=$("user_password").value){
$("confirm_password_error").style.display="block";
YAHOO.util.Dom.addClass("user_password_confirmation","login_error");
}
});
},open_login:function(_2d){
if(_2d!==undefined&&_2d>500){
$("chow_login").style.top=(_2d-400)+"px";
$("chow_signup").style.top=(_2d-400)+"px";
}else{
$("chow_login").style.top=0;
$("chow_signup").style.top=0;
}
var _2e=["Let's get cooking!","Looking good today!","Let's stir it up!","Hope you're hungry!","Come and get it!","Hola, guapo!"];
$("login_header").innerHTML=_2e[Math.floor(Math.random()*_2e.length)];
$("chow_login").style.display="block";
$("login_name").focus();
},open_signup:function(_2f){
if(_2f!==undefined&&_2f>500){
$("chow_signup").style.top=(_2f-400)+"px";
}else{
$("chow_signup").style.top=0;
}
$("chow_signup").style.display="block";
$("user_name").focus();
},clear_login_signup_errors:function(id){
if(id=="all"){
var _31=YAHOO.util.Dom.getElementsByClassName("login_error");
for(var i=0;i<_31.length;i++){
YAHOO.util.Dom.removeClass(_31[i],"login_error");
_31[i].value="";
}
}else{
YAHOO.util.Dom.removeClass(id,"login_error");
$(id).value="";
}
if(id=="user_name"||id=="all"){
$("username_ok").style.display="none";
$("username_error").style.display="none";
}
if(id=="user_password"||id=="all"){
$("password_ok").style.display="none";
$("password_error").style.display="none";
}
if(id=="user_password_confirmation"||id=="all"){
$("confirm_password_error").style.display="none";
}
if(id=="user_email"||id=="all"){
$("signup_email_ok").style.display="none";
$("signup_email_error").style.display="none";
}
$("login_error").innerHTML="";
$("signup_error").innerHTML="";
if(id=="user_password"||id=="user_password_confirmation"||id=="login_password"){
changeInputType($(id),"password");
chowLoginSignup.add_dynamic_listeners();
$(id).focus();
}
},submit_login_form:function(){
if($("login_name").value==""){
YAHOO.util.Dom.addClass("login_name","login_error");
$("login_name").value="Username or Email is Required";
}
if($("login_password").value==""){
YAHOO.util.Dom.addClass("login_password","login_error");
$("login_password").value="Password is Required";
changeInputType($("login_password"),"text");
chowLoginSignup.add_dynamic_listeners();
}
if(!YAHOO.util.Dom.hasClass("login_password","login_error")&&!YAHOO.util.Dom.hasClass("login_name","login_error")){
chowLoginSignup.set_timezone();
YAHOO.util.Connect.setForm("login_form");
toggleSpinner("login_submit","hide");
YAHOO.util.Connect.asyncRequest("POST","/account/login",{success:function(e){
if(chowLoginSignup.new_location.indexOf("/account/combined")!=-1||chowLoginSignup.new_location.indexOf("/account/login")!=-1||chowLoginSignup.new_location.indexOf("/account/signup")!=-1||chowLoginSignup.new_location==""){
chowLoginSignup.new_location=document.location;
}
if(chowLoginSignup.externalSuccess){
chow_logged_in=true;
toggleSpinner("login_submit","show");
$("chow_login").style.display="none";
YAHOO.util.Event.removeListener(YAHOO.util.Dom.getElementsByClassName("show_login_box"),"click");
eval(chowLoginSignup.externalSuccess+"()");
}else{
document.location=chowLoginSignup.new_location;
}
},failure:function(e){
toggleSpinner("login_submit","show");
if(e.responseText.indexOf("invalid_username")!=-1){
$("login_error").innerHTML="User name / email not found";
}else{
if(e.responseText.indexOf("invalid_password")!=-1){
$("login_error").innerHTML="Invalid Password. Please try again";
}else{
if(e.responseText.indexOf("unknown_login_state")!=-1){
$("login_error").innerHTML="You need to verify your account with the email we sent you before you can log in. Contact <a href=\"mailto:moderators@chowhound.com\" class=\"blue\">moderators@chowhound.com</a> if you didn't recieve an email when you signed up";
}else{
$("login_error").innerHTML="Unexpected Error";
}
}
}
$("login_error").style.display="block";
}});
}
},submit_signup_form:function(){
var _35=false;
if($("user_name").value==""){
YAHOO.util.Dom.addClass("user_name","login_error");
$("user_name").value="Username is Required";
_35=true;
}
if($("user_password").value==""){
YAHOO.util.Dom.addClass("user_password","login_error");
changeInputType($("user_password"),"text");
$("user_password").value="Password is Required";
chowLoginSignup.add_dynamic_listeners();
_35=true;
}
if($("user_password_confirmation").value==""){
YAHOO.util.Dom.addClass("user_password_confirmation","login_error");
changeInputType($("user_password_confirmation"),"text");
$("user_password_confirmation").value="Password is Required";
chowLoginSignup.add_dynamic_listeners();
_35=true;
}
if($("user_email").value==""){
YAHOO.util.Dom.addClass("user_email","login_error");
$("user_email").value="Email is Required";
_35=true;
}
if($("user_password_confirmation").value!=$("user_password").value){
YAHOO.util.Dom.addClass("user_password_confirmation","login_error");
changeInputType($("user_password_confirmation"),"text");
$("user_password_confirmation").value="Both Passwords Must Match";
chowLoginSignup.add_dynamic_listeners();
_35=true;
}
if(!_35){
toggleSpinner("signup_submit_lightbox","hide");
chowLoginSignup.set_timezone();
YAHOO.util.Connect.setForm("signup_form");
YAHOO.util.Connect.asyncRequest("POST","/account/signup",{success:function(e){
$("signup_header").innerHTML="Thanks for signing up!";
$("signup_form").innerHTML="<p class=\"ml10 mr10 f12\">We just sent a <strong>verification email</strong> to your email address. You'll need to open it and click the link to finish the registration process. (If you don't receive it, check your spam folder! If you still haven't received it email <a href=\"mailto:moderators@chowhound.com\" class=\"blue\">moderators@chowhound.com</a>.)</p>";
},failure:function(e){
toggleSpinner("signup_submit_lightbox","show");
if(e.responseText=="invalid_username"){
$("signup_error").innerHTML="Username / email not found.";
}else{
if(e.responseText.indexOf("password_invalid_format")!=-1){
$("signup_error").innerHTML="Invalid Format for Password.";
}else{
if(e.responseText=="invalid_password"){
$("signup_error").innerHTML="Invalid Password. Please try again.";
}else{
$("signup_error").innerHTML="Unexpected Error";
}
}
}
$("signup_error").style.display="block";
}});
}
},set_timezone:function(){
var _38=-(new Date()).getTimezoneOffset()*60;
$("login_timezone").value=_38;
$("signup_timezone").value=_38;
},request_password:function(_39){
var _3a="";
if(_39=="login_form"){
_3a=$("login_name").value;
if(_3a==""){
$("login_name").value="Please enter your email address.";
YAHOO.util.Dom.addClass("login_name","login_error");
return;
}
}else{
_3a=$("user_email").value;
}
YAHOO.util.Connect.asyncRequest("GET","/account/lost_password?email="+_3a,{success:function(e){
var msg="An email has been sent to "+_3a+" with your password.";
if(_39=="login_form"){
$("login_error").innerHTML=msg;
}else{
$("signup_email_ok").innerHTML=msg;
$("signup_email_ok").style.display="block";
$("signup_email_error").style.display="none";
}
},failure:function(e){
if(e.responseText=="email_not_found"){
if(_39=="login_form"){
$("login_error").innerHTML="Email not found. Please enter the email address you used to register.";
YAHOO.util.Dom.addClass("login_name","login_error");
}else{
$("signup_email_error").innerHTML="We couldn't find that email address.";
}
}
}});
}};
var chowLoginSignupReady=true;
function toggleSpinner(id,_3f){
if(_3f=="hide"){
$(id).style.display="none";
$(id+"_spinner").style.display="block";
}else{
$(id).style.display="block";
$(id+"_spinner").style.display="none";
}
}
function changeInputType(_40,_41){
var _42=document.createElement("input");
_42.type=_41;
if(_40.size){
_42.size=_40.size;
}
if(_40.value){
_42.value=_40.value;
}
if(_40.name){
_42.name=_40.name;
}
if(_40.id){
_42.id=_40.id;
}
if(_40.className){
_42.className=_40.className;
}
_40.parentNode.replaceChild(_42,_40);
return _42;
}
function doNothing(){
return;
}
function chowClickHandler(e){
var _44=DW.getEventTarget(e);
var _45=DW.getLinkObject(_44);
if(null==_45||DW.ignoreClick(_45)||(DW.isInternalLink(_45)&&DW.hasTagParam(_45))){
return;
}
var tag=DW.buildTag(_44);
var _47=_45.href.indexOf("chow.com/action/rd2")!=-1;
if(DW.isInternalLink(_45)&&!_47){
DW.addTag(_45,tag);
}else{
DW.trackClickInBackground(_45,tag,_44.nodeName,e.type);
}
}
var mixedSlider={init:function(){
var _48=YAHOO.util.Dom;
var _49=YAHOO.util.Event;
var _4a="";
var _4b=_48.get("thumb_description");
var _4c=24;
var _4d=8;
var _4e=_4d;
var _4f=97;
var _50=10;
var _51=0;
var _52=_4d;
var _53=0;
var _54="true";
if(_4c<=_4d){
_48.addClass("mixed_slider_nav_r","end");
}
register_thumb_handlers();
function register_thumb_handlers(){
_4a=_48.getElementsByClassName("thumb_link","a");
for(var i=0;i<_4a.length;i++){
_49.on(_4a[i],"mouseover",function(e){
if(_4b){
_4b.innerHTML=this.title;
_4b.style.display="block";
_4b.style.left=(parseInt(this.getAttribute("pos"))+1-_51)*(_4f+_50)-58+"px";
if(_52-3<=this.getAttribute("pos")){
_48.addClass(_4b,"end");
_4b.style.left=(parseInt(this.getAttribute("pos"))+1-_51)*(_4f+_50)-_4b.offsetWidth+37+"px";
_4b.style.backgroundPosition=_4b.offsetWidth-10+"px -2598px";
}
}
});
_49.on(_4a[i],"mouseout",function(e){
if(_4b){
_4b.style.display="none";
_48.removeClass(_4b,"end");
_4b.style.backgroundPosition="0 -2598px";
}
});
}
}
_49.on("mixed_slider_nav_r","click",function(e){
_49.preventDefault(e);
if(_52<_4c){
var _59=_4c-_52;
var _5a=(_59>=_4e)?_4e:_59;
var _5b={left:{by:-(_5a*(_4f+_50))}};
var _5c=new YAHOO.util.Anim("mixed_slider_inner",_5b,1,YAHOO.util.Easing.easeOut);
_5c.animate();
_5c.onComplete.subscribe(function(){
if(_52==_4c){
_48.addClass("mixed_slider_nav_r","end");
}
});
_52=_52+_5a;
_51=_51+_5a;
_48.removeClass("mixed_slider_nav_l","cap");
}
});
_49.on("mixed_slider_nav_l","click",function(e){
_49.preventDefault(e);
if(_51>0){
var _5e=(_51>_4e)?_4e:_51;
var _5f={left:{by:(_5e*(_4f+_50))}};
var _60=new YAHOO.util.Anim("mixed_slider_inner",_5f,1,YAHOO.util.Easing.easeOut);
_60.animate();
_60.onComplete.subscribe(function(){
if(_51==0){
_48.addClass("mixed_slider_nav_l","cap");
}
});
_52=_52-_5e;
_51=_51-_5e;
_48.removeClass("mixed_slider_nav_r","end");
}
});
}};

/* MAC ad */
function CbsiMantaRay(){var M=this;var e="$Id: MantaRay.js 126910 2010-08-31 01:52:55Z harpere $";var l="3.7.4";var P;var F;var o=2000;var Z="&";var A=false;var t=new Array();var y=new Object();var b;var B=null;var H=null;function I(){return location.hash=="#mad_debug"}function f(){return location.hash=="#mad_stage"}var L=function(){var z=document.getElementsByTagName("script");var AA=z[z.length-1].src;if(AA.match("^http(s)?://[^:]+:(\\d+)")){return RegExp.$2}return""};var C=L();var U=function(AB){var AC=null;var AA=document.cookie;var AE=AA.indexOf(AB);if(AE!=-1){var AD=AE+AB.length+1;var z=AA.indexOf(";",AD);if(z==-1){z=AA.length}AC=AA.substring(AD,z)}return AC?AC:null};var a={};this.registerAdGlobals=function(z){if(z!=undefined){a=z;D(z)}};var Y=function(){if(window.cbsiMadsCookiesOn){return window.cbsiMadsCookiesOn}var AA=U("MADTEST");if(AA=="1"){window.cbsiMadsCookiesOn={cookiesOn:"1"}}else{var z=86400000;O("MADTEST","1",z);var AA=U("MADTEST");if(AA=="1"){window.cbsiMadsCookiesOn={cookiesOn:"1"}}else{window.cbsiMadsCookiesOn={cookiesOn:"0"}}}if(I()){alert("cookiesOn="+window.cbsiMadsCookiesOn.cookiesOn)}return window.cbsiMadsCookiesOn};var R=function(AB,z){if(AB!=undefined&&z!=undefined){for(var AA in z){AB[AA]=z[AA]}}};var k=function(AO,AJ){var AG={CAT:"NCAT"};var AM=Q();var AF="";if(C.length>0){AF=":"+C}var AH="";if(window.location.protocol.match(/https:/i)){AH="&amp;referer="+encodeURIComponent(window.location.href)}AJ.DVAR_INSTLANG=T();var AI="";if(document.referrer!=undefined&&document.referrer.length>0){var AP=document.referrer.replace(/^[^\/]+:\/\//,"");var AQ=AP.replace(/[^\w\-\.].*$/,"");var AK=AQ.match(/[^\.]+\.\w{2,4}$/);if(AK!=undefined){AI="&amp;IREFER_HOST="+encodeURIComponent(AK)}}var AD=Math.floor(Math.random()*100000000);var AB=U("XCLGFbrowser");if(AB&&AB!=""){AJ["COOKIE:ANON_ID"]=AB}var AA="";var AN="";var AL="mads.";for(var AC in AJ){var AE=AJ[AC];if(AG[AC]!=null){AC=AG[AC]}if(AC=="STAGING"&&AE=="1"){AL="madstage.";AF=":8000"}else{if(AC=="AD_HOST"){AL=AE;AM="";AF=""}else{AN+="&amp;"+encodeURIComponent(AC)+"="+encodeURIComponent(AE)}}}if(f()){AL="madstage.";AF=":8000"}var z=j()?"cnet-ad":"mac-ad";AA="http://"+AL+AM+AF+"/"+z+"?CLIENT:ID=SJS&amp;celt="+AO+"&amp;x-cb="+AD+AH+AI+AN;if(y.USE_STATICPAGESTATE==1){if(y.STATICPAGESTATE!=null&&y.STATICPAGESTATE.length>0){AA+="&amp;PAGESTATE="+encodeURIComponent(y.STATICPAGESTATE)}}else{if(window.CBSI_PAGESTATE!=null&&window.CBSI_PAGESTATE.length>0){AA+="&amp;PAGESTATE="+encodeURIComponent(window.CBSI_PAGESTATE)}}if(AA.length>2000){AA=AA.match(/.{0,2000}\&amp;/)}return AA};this.getAdCallURL=function(AE,AA,AH,AC){var AG=new Object();R(AG,a);R(AG,AA);R(AG,AC);D(AG);var AF=V;var AD=p;var AB=parseInt(AG.SITE);switch(AB){case 189:R(AG,AD());break;case 190:R(AG,AD());break;default:}switch(AB){case 175:break;default:R(AG,Y())}var z=k(AE,AG);if(AH==1){z=z.replace(/&amp;/gi,"&")}return z};this.getAd=function(AB,AC){var z=new Object();R(z,AC);R(z,AB);D(z);var AA=M.getAdCallURL("js",z);document.write("<script type='text/javascript' src='"+AA+"'><\/script>\n")};this.cnetGetAd=function(z){M.getAd(z,new Object())};var j=function(){return(A==true)};var D=function(z){if("".toLowerCase()=="yes"){A=true}else{for(var AA in z){if(AA.toLowerCase()=="partner"&&z[AA]){A=true}}}};var Q=function(){return j()?"com.com":"chow.com"};var T=function(){var z="unk";if(navigator.userLanguage){z=navigator.userLanguage}else{if(navigator.language){z=navigator.language}}return z};var K=undefined;var V=function(AA){if(K!=undefined){return K}var AB=U("MAD_SESSION");if(AB==undefined){var z=["a","b","c","d","e","f"];AB=z[Math.floor(Math.random()*z.length)];document.cookie=("MAD_SESSION="+AB+";domain="+Q()+";path=/")}K={DVAR_SESSION:AB};return K};var c=undefined;function p(){if(c!=undefined){return c}var z=U("MAD_FIRSTPAGE");if(z==undefined){z=1;document.cookie=("MAD_FIRSTPAGE="+z+";domain="+Q()+";path=/")}else{if(z==1){z=0;document.cookie=("MAD_FIRSTPAGE="+z+";domain="+Q()+";path=/")}}c={DVAR_FIRSTPAGE:z};return c}function w(AA){var AB=(AA.getMonth()+1)+"";if(1==AB.length){AB="0"+AB}var z=AA.getDate()+"";if(1==z.length){z="0"+z}return AB+z}function O(AN,AC,AD,AE,AM){if(AE){AE=AE.replace(/^\./,"");var AL=AE.split(".").reverse();var AB=document.domain.split(".").reverse();var AI=true;for(var AG=0;AG<AL.length;AG++){if(AL[AG].toLowerCase()!=AB[AG].toLowerCase()){AI=false;break}}if(!AI){var AA="http://mads."+AE;if(C){AA+=":"+C}if(AC===""){AC="|";AD=-300000}AA+="/sc?c="+AN+":"+AC+":."+AE;if(AM=="/"){AM=""}if(AD||AM||parseInt(AD)===0){var AK="";if(AD||parseInt(AD)===0){AK=AD/60000}AA+=":"+AK;if(AM){AA+=":"+AM}}var AF=document.createElement("img");AF.setAttribute("src",AA);return }}else{var AH=document.domain.split(".");AE=AH[AH.length-2]+"."+AH[AH.length-1]}var z=new Array(AN+"="+AC,"domain=."+AE);if(AD||parseInt(AD)===0){var AJ=new Date(new Date().getTime()+AD);z.push("expires="+AJ.toGMTString())}if(!AM){AM="/"}z.push("path="+AM);document.cookie=z.join(";");if(I()){alert("Final Cookie string: '"+z.join(";")+"'")}}function v(z){if(I()){alert("Appending file: "+z)}var AA=document.getElementsByTagName("head")[0];var AB=document.createElement("script");AB.setAttribute("language","javascript");AB.setAttribute("type","text/javascript");AB.setAttribute("src",z);AA.appendChild(AB);return AB}function u(AB){if(I()){alert("Appending image: "+AB)}var AA=document.getElementsByTagName("body")[0];var z=document.createElement("img");z.setAttribute("src",AB);z.setAttribute("width","1");z.setAttribute("height","1");z.setAttribute("border","0");if(window.addEventListener){window.addEventListener("load",function(){AA.appendChild(z)},false)}else{window.attachEvent("onload",function(){AA.appendChild(z)})}return z}function q(){if(I()){alert("In loadASI() function")}if(typeof rsinetsegs=="undefined"){var z=v("http://js.revsci.net/gateway/gw.js?csid=K05540");z.onload=E;z.onreadystatechange=function(){if(this.readyState==="loaded"||this.readyState==="complete"){E()}}}}function E(){var z=a;var AA;for(var AC in z){var AB=z[AC];AA=AC.toLowerCase();if(AA=="ncat"||AA=="site"||AA=="ptype"||AA=="context"||AA=="os"){K05540.DM_addEncToLoc(AA,AB)}}K05540.DM_tag()}function S(){if(I()){alert("In loadBK() function")}var z=new Date();var AA=w(z);var AB=U("MADUCAT");var AC;if(null!=AB){AC=AB.split(Z)}if(I()){alert("today is "+AA)}if(I()){alert("maducat_cookievalue[1] is "+AC[1])}if(null==AB||AC[1]!=AA){u("http://tags.bluekai.com/site/2607");b="BK";d()}}this.cbsiAdBehavioralSetup=function(){if(I()){alert("cbsiAdBehavioralSetup() called")}G()};function G(){if(I()){alert("getAdBeacon() called")}if(!F){F=1;var AE=1;var AF=Math.floor(Math.random()*100+1);var z=new Object();R(z,a);z.beacon="1";if(I()){alert("RandomNum: "+AF)}if(AF<=AE){var AD="";AD+="http://adlog.com.com";AD+="/adlog/i/r=7807&sg=355140&h=cn&p=2&l=en_US";AD+="&t=-1&x-rnd="+Math.floor(Math.random()*100000+1);AD+="&o="+((z.NCAT==null)?"1:":z.NCAT);AD+="&b="+((z.BRAND==null)?"":z.BRAND);AD+="&site="+((z.SITE==null)?"":z.SITE);AD+="&ptype="+((z.PTYPE==null)?"":z.PTYPE);AD+="&pid="+((z.PID==null)?"":z.PID);AD+="&cid="+((z.CID==null)?"":z.CID);if(z.DVAR_MFG||z.DVAR_SELECTTAG){var AA;if(z.DVAR_MFG){AA="dvar_mfg="+z.DVAR_MFG;if(z.DVAR_SELECTTAG){AA+="#"}}if(z.DVAR_SELECTTAG){AA+="dvar_selecttag="+z.DVAR_SELECTTAG}AD+="&dvar="+encodeURIComponent(encodeURIComponent(AA))}AD+="/http://i.i.com.com/cnwk.1d/Ads/common/dotclear.gif";var AC=u(AD)}var AB=M.getAdCallURL("js",z);B=v(AB)}}this.getAdBehavioral=function(){if(I()){alert("getAdBehavioral() called")}q();S()};function d(){if(I()){alert("In updateMADUCATCookie() function")}if(!P){P=1;if(typeof b!="undefined"&&b.length>0){var z=1;var AC=Z;var AB=2592000000;var AA=new Date();var AD=z;AD+=AC;AD+=w(AA);AD=AD+Z+"EX";if(I()){alert("new cookie calculated: "+AD)}O("MADUCAT",AD,AB)}else{if(I()){alert("Results are empty.  Cookie unchanged.")}}}}var s=function(){window.CBSI_PAGESTATE=""};this.cbsiStorePageState=function(){y.STATICPAGESTATE=window.CBSI_PAGESTATE;y.USE_STATICPAGESTATE=1};this.storePageStateCookie=function(AA,AB,z){if(!AA){AA="cbs.com"}if(!AB){AB="/pacific"}if(!z){z=1800000}var AC=window.CBSI_PAGESTATE;if(!AC){AC=""}O("MAD_PAGESTATE",encodeURIComponent(AC),z,AA,AB)};var r=5*1000;var X=1;var W="";this.cbsiSetWaitTime=function(z){r=z*1000};this.cbsiSetAdvancedAsync=function(z){if(z!=undefined){W=z}};this.getAsyncAd=function(AA,z){document.write("<div id='ad_"+AA+"' class='madison_async_ad'></div>");var AB=document.getElementById("ad_"+AA);AB.localAdObj=z;AB.overrideAdObj=new Object;AB.RMIFOnLoad=RMIFOnLoad;AB.ClearAd=n;AB.LoadAd=x;AB.GetAdURL=h;if(W==""){if(z.WIDTH!=null){AB.style.width=z.WIDTH+"px"}if(z.HEIGHT!=null){AB.style.height=z.HEIGHT+"px"}}AB.LoadAd();t[t.length]=AB;return AB};this.RMIFOnLoad=function(AF,AE){var AC=AF.frameElement;var AG=AC.parentNode;if(AG.childNodes.length==1){var AA=AE.getElementById("adSpan");var AB=AE.getElementById("adDiv");if(AA){var z=AA.offsetWidth;if(navigator.appName=="Microsoft Internet Explorer"){var AD=AA.offsetHeight}else{var AD=AB.offsetHeight}AC.style.width=z+"px";AC.style.height=AD+"px"}}AG.overrideAdObj=new Object()};function n(){N(this)}function N(AA){var z=null;while(AA.childNodes.length>0){var AC=AA.childNodes[0];var AB=AC.id;if(AB=="adFrame"){z=AC;z.src="about:blank"}if(AB){AC.id=""}if(AC.childNodes.length>0){N(AC)}AA.removeChild(AC)}}function x(){if(this.localAdObj==null){return }var z=new Object;R(z,a);R(z,this.localAdObj);R(z,this.overrideAdObj);this.ClearAd();var AA=document.createElement("iframe");AA.id="adFrame";AA.style.width=0+"px";AA.style.height=0+"px";AA.allowTransparency="true";AA.width=0+"px";AA.height=0+"px";AA.marginWidth=0+"px";AA.marginHeight=0+"px";AA.frameBorder=0;AA.scrolling="no";if(W==""){if(z.WIDTH!=null){AA.style.width=z.WIDTH+"px";AA.width=z.WIDTH+"px";this.style.width=z.WIDTH+"px"}if(z.HEIGHT!=null){AA.style.height=z.HEIGHT+"px";AA.height=z.HEIGHT+"px";this.style.height=z.HEIGHT+"px"}}this.appendChild(AA);if(W==""){AA.src=this.GetAdURL()}else{AA.src=W}}function h(){var z;if(W==""){z=M.getAdCallURL("ifc",this.localAdObj,1,this.overrideAdObj)}else{z=M.getAdCallURL("js",this.localAdObj,1,this.overrideAdObj)}return z}this.LoadAds=function(){if(X==1){s();g();setTimeout("DoLoadAds();",100);X=0;tmp=setTimeout("allowAd()",r)}};function g(){for(i=0;i<t.length;i++){t[i].ClearAd()}}this.DoLoadAds=function(){for(i=0;i<t.length;i++){t[i].LoadAd()}};this.allowAd=function(){X=1};this.DivGetAdURL=function(AA){var z=AA.frameElement;var AB=z.parentNode;return AB.GetAdURL()};this.cbsiPrepareRefresh=function(AA,z){var AB=document.getElementById("ad_"+AA);if(AB==undefined){return }AB.overrideAdObj=z};function m(){var z=this;var AA=this.GetPlaceHolder();if(z!=null&&AA!=null){z.parentNode.removeChild(z);AA.appendChild(z)}}function J(){var z=this.placeHolder;if(z==null){z=this.placeHolder=document.getElementById("ph_"+this.id)}return z}}if(window.cbsiMantaRay==undefined){window.cbsiMantaRay=new CbsiMantaRay();var cbsiGetAd=cbsiMantaRay.getAd;var cnetGetAd=cbsiMantaRay.cnetGetAd;var cbsiRegisterAdGlobals=cbsiMantaRay.registerAdGlobals;var cbsiAdBehavioral=cbsiMantaRay.getAdBehavioral;var cbsiAdBehavioralSetup=cbsiMantaRay.cbsiAdBehavioralSetup;var cbsiSetAdvancedAsync=cbsiMantaRay.cbsiSetAdvancedAsync;var cbsiGetAsyncAd=cbsiMantaRay.getAsyncAd;var cbsiRefreshAds=cbsiMantaRay.LoadAds;var cbsiPrepareRefresh=cbsiMantaRay.cbsiPrepareRefresh;var cbsiDivGetAdURL=cbsiMantaRay.DivGetAdURL;var cbsiStorePageState=cbsiMantaRay.cbsiStorePageState;var cbsiStorePageStateCookie=cbsiMantaRay.storePageStateCookie;var cbsiSetWaitTime=cbsiMantaRay.cbsiSetWaitTime;var DoLoadAds=cbsiMantaRay.DoLoadAds;var allowAd=cbsiMantaRay.allowAd;var RMIFOnLoad=cbsiMantaRay.RMIFOnLoad};/* MAC [r20100621-1350-ContainsOpSegment500K:1.13.11] c17-ad-xw6.cnet.com::2561604496 2010.09.05.16.11.26 *//* MAC T 0.0 */
