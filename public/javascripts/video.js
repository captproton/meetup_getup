var canPlayerObj;
function onCBSIPlayerReady(_1){
canPlayerObj=document["can"];
canPlayerObj.addEventJSCallback("onContentEnd_cbsi","chow_video.onContentEnded");
canPlayerObj.addEventJSCallback("onAdResourcesInfo","onCBSI_AdResourcesInfo");
}
var jsReady=false;
function isJSReady(){
return jsReady;
}
var chow_video={init:function(){
this.numPerPage=18;
this.category=cat_id;
this.playlist=[];
this.init_playlist();
this.fetch_paginator=false;
this.numResults=this.getNumInCollection();
this.autoplay_list=autoplay_list;
this.pageNum=pageNum;
this.numeric_id=numeric_id;
this.cleanUrl=chow_video.scrubUrl();
this.addListeners();
this.chow_tip_counter=chow_tip_counter;
},onContentEnded:function(){
var id=chow_video.autoplay_list.shift();
if(id==chow_video.numeric_id){
id=chow_video.autoplay_list.shift();
}
var LI=YDom.hasClass("playlist_tab","selected")?$("pl_"+id):$("cl_"+id);
var _4=YDom.getChildrenBy(LI,function(el){
return YDom.hasClass(el,"thumb-link");
})[0].href;
_4=_4.split(".com/videos/")[1];
chow_video.updatePageUrl(_4);
chow_video.getVideo(id);
chow_video.highLightThumb(id);
},addListeners:function(){
chow_video.addEmailAndShareListeners();
chow_video.addTabsListeners();
chow_video.addThumbListeners();
chow_video.addPaginatorListener();
chow_video.addSideNavListener();
chow_video.addSearchListener();
},addEmailAndShareListeners:function(){
var _6=$("video-email");
var _7=$("video-share");
YEvent.on("video-email-send","click",function(e){
YEvent.preventDefault(e);
send_email();
});
YEvent.on(["email-link","email-cancel"],"click",function(e){
toggle_email(e);
});
YEvent.on(["share-link","share-close"],"click",function(e){
toggle_share(e);
});
var _b=new YAHOO.util.Anim("video-email-sub-wrapper",{height:{to:250}},0.3);
var _c=new YAHOO.util.Anim("video-email-sub-wrapper",{height:{to:0}},0.3);
var _d=new YAHOO.util.Anim("video-share-sub-wrapper",{height:{to:275}},0.3);
var _e=new YAHOO.util.Anim("video-share-sub-wrapper",{height:{to:0}},0.3);
function toggle_email(e){
YEvent.preventDefault(e);
if(YDom.hasClass(_6,"active")){
_c.animate();
YDom.removeClass(_6,"active");
$("email_success").style.display="none";
$("email_error").style.display="none";
}else{
YDom.addClass(_6,"active");
_b.animate();
YDom.removeClass(_7,"active");
_e.animate();
}
}
function toggle_share(e){
YEvent.preventDefault(e);
if(YDom.hasClass(_7,"active")){
_e.animate();
YDom.removeClass(_7,"active");
}else{
_c.animate();
YDom.removeClass(_6,"active");
$("email_success").style.display="none";
$("email_error").style.display="none";
_d.animate();
YDom.addClass(_7,"active");
}
}
function send_email(){
var _11=$("email_to_field").value.replace(/ /g,"");
var _12=encodeURI("email[from]="+$("email_from").value+"&email[to]="+_11+"&email[message]="+$("email_message_field").value+"&email[item_id]="+$("email_item_id").value+"&email[item_url]="+$("email_item_url").value+"&email[item_title]="+$("email_item_title").value+"&email[item_type]=Story&from_video_hub=1");
YAHOO.util.Connect.asyncRequest("POST","/user/send_to_email",{success:function(e){
$("video-email-sub-wrapper").style.height="285px";
if(e.responseText.indexOf("$(\"email_error\").show()")!=-1){
$("email_error").style.display="block";
$("email_success").style.display="none";
}else{
$("email_error").style.display="none";
$("email_success").style.display="block";
close_email_timeout=setTimeout(toggle_email,1000);
}
}},_12);
}
},addTabsListeners:function(){
var _14=YDom.getElementsByClassName("video-lower-nav-link");
for(i=0;i<_14.length;i++){
YEvent.on(_14[i],"click",function(e){
YEvent.preventDefault(e);
if(YDom.hasClass(this,"selected")){
return;
}
for(i=0;i<_14.length;i++){
YDom.removeClass(_14[i],"selected");
}
YDom.addClass(this,"selected");
var _16=this.href.split("/videos/")[1].split("?")[0];
if(_16=="playlist"){
chow_video.addThumbListeners();
chow_video.compileAutoplayList("playlist");
}else{
var _17=YDom.getElementsByClassName("playlist-thumb");
for(i=0;i<_17.length;i++){
var a=YDom.getChildrenBy(_17[i],function(el){
return YDom.hasClass(el,"thumb-link");
})[0];
YEvent.removeListener(a,"click");
}
}
chow_video.pageNum=1;
chow_video.getTabContent(_16);
});
}
},addThumbListeners:function(){
chow_video.addPlaylistListeners();
var _1a=YDom.getElementsByClassName("thumb-link");
for(i=0;i<_1a.length;i++){
YEvent.on(_1a[i],"click",function(e){
YEvent.preventDefault(e);
var url=this.href;
var id=url.match(/\d{5}/)[0];
chow_video.getVideo(id);
chow_video.compileAutoplayList(id);
url=url.split(".com/videos/")[1];
chow_video.updatePageUrl(url);
for(i=0;i<_1a.length;i++){
YDom.removeClass(YDom.getAncestorByTagName(_1a[i],"LI"),"selected");
}
YDom.addClass(YDom.getAncestorByTagName(this,"LI"),"selected");
});
}
},addPaginatorListener:function(){
var _1e=YDom.getElementsByClassName("pagination");
if(_1e.length>0){
_1e=YDom.getChildren(_1e[0]);
}
YEvent.on(_1e,"click",function(e){
YEvent.preventDefault(e);
if(this.tagName=="A"){
var _20=this.href.split("?")[1];
chow_video.pageNum=_20.split(/^page=|&page=/)[1];
var _21=(chow_video.pageNum-1)*chow_video.numPerPage;
if(_20.indexOf("id=")!=-1&&_20.split("id=")[1].split("&")[0]=="search"){
chow_video.getSearchResults();
}else{
chow_video.getVideoThumbs(_21);
}
}
});
},addPlaylistListeners:function(){
playlistLinks=YDom.getElementsByClassName("playlist-link");
for(i=0;i<playlistLinks.length;i++){
YEvent.on(playlistLinks[i],"click",function(e){
YEvent.preventDefault(e);
var _23="";
var li=YDom.getAncestorByTagName(this,"LI");
var id=YDom.hasClass("playlist_tab","selected")?li.id.split("pl_")[1]:li.id.split("cl_")[1];
if(this.href.indexOf("#add-to-playlist")!=-1){
this.href="#remove-from-playlist";
this.innerHTML="- playlist";
YDom.addClass(this,"remove");
chow_video.playlist.push(id);
_23="add";
}else{
this.href="#add-to-playlist";
this.innerHTML="+ playlist";
YDom.removeClass(this,"remove");
for(var i=0;i<chow_video.playlist.length;i++){
if(chow_video.playlist[i]==id){
chow_video.playlist.splice(i,1);
break;
}
}
_23="remove";
}
$("playlist-count").innerHTML=" (<span class='cC00'>"+chow_video.playlist.length+"</span>)";
chow_video.updatePlaylist(_23,li);
});
}
},addSideNavListener:function(){
var _27=YDom.getElementsByClassName("vid-cat");
for(i=0;i<_27.length;i++){
YEvent.on(_27[i],"click",function(e){
YEvent.preventDefault(e);
var _29=this.rel.split("cat=")[1];
var _2a=YDom.hasClass(YDom.getAncestorByTagName(this,"LI"),"show")?"show":"collection";
chow_video.category=(_29=="all")?"":_29;
chow_video.pageNum=1;
chow_video.getVideoThumbs();
for(i=0;i<_27.length;i++){
var _2b=YDom.getAncestorByTagName(_27[i],"LI");
if(YDom.hasClass(_2b,_2a)){
YDom.removeClass(_2b,"selected");
}
}
YDom.removeClass("side-nav-search-link","selected");
YDom.addClass(YDom.getAncestorByTagName(this,"LI"),"selected");
});
}
},addSearchListener:function(){
YEvent.on("video-search-form","submit",function(e){
YEvent.preventDefault(e);
chow_video.pageNum=1;
chow_video.getSearchResults();
if(YDom.hasClass("playlist_tab","selected")){
YDom.removeClass("playlist_tab","selected");
$("playlist-thumbs").style.display="none";
YDom.addClass("shows_tab","selected");
$("video-thumbs").style.display="block";
$("video-side-nav").style.visibility="visible";
$("pagination").style.display="block";
}
});
},getSearchResults:function(_2d){
if(_2d!==undefined){
chow_video.pageNum=_2d;
}
var _2e=$("video-search-input").value;
YAHOO.util.Connect.asyncRequest("GET","/xhr/videos/searchVideoThumbnails.json?query="+_2e+"&page="+chow_video.pageNum+"&videoid="+chow_video.numeric_id,{success:function(e){
var _30=YDom.getElementsByClassName("video-side-nav-link");
for(var i=0;i<_30.length;i++){
YDom.removeClass(_30[i],"selected");
}
$("side-nav-search-link").style.display="block";
YDom.addClass("side-nav-search-link","selected");
if(e.responseText.indexOf("<li")==-1){
$("video-thumbs").innerHTML="<p class='f15 normal'>Sorry. No videos matched your query for <strong>'"+_2e+"'</strong></p>";
}else{
$("video-thumbs").innerHTML=e.responseText;
chow_video.category="search";
chow_video.compileAutoplayList();
chow_video.getNumInCollection();
chow_video.addThumbListeners();
chow_video.checkPlaylist();
}
},failure:function(e){
$("video-thumbs").innerHTML="Search results can not be obtained at this time";
}});
},getTabContent:function(_33){
$("video-side-nav").style.visibility="visible";
$("video-thumbs").style.display="block";
$("pagination").style.display="block";
$("playlist-thumbs").style.display="none";
if(_33=="playlist"){
$("video-side-nav").style.visibility="hidden";
$("video-thumbs").style.display="none";
$("pagination").style.display="none";
$("playlist-thumbs").style.display="block";
return;
}
var _34=YDom.getElementsByClassName("video-side-nav-link");
for(i=0;i<_34.length;i++){
if(YDom.hasClass(_34[i],_33)){
_34[i].style.display="block";
if(YDom.hasClass(_34[i],"selected")){
var _35=YDom.getChildrenBy(_34[i],function(el){
return YDom.hasClass(el,"vid-cat");
})[0].rel.split("cat=")[1];
chow_video.category=(_35=="all")?"":_35;
chow_video.getVideoThumbs();
}
}else{
if(!YDom.hasClass(_34[i],"search")){
_34[i].style.display="none";
}
}
}
if(YDom.hasClass("side-nav-search-link","selected")){
chow_video.compileAutoplayList();
chow_video.checkPlaylist();
}
},getVideo:function(id){
var _38="/xhr/videos/getVideo.json?id="+id;
YAHOO.util.Connect.asyncRequest("GET",_38,{success:function(e){
var O=YAHOO.lang.JSON.parse(e.responseText);
O=O.videoResult.response.result.doc[0];
if(chow_video.chow_tip_counter==3){
var _3b=default_ad;
chow_video.chow_tip_counter=-1;
chow_video.autoplay_list.unshift(id);
chow_video.autoplay_list.unshift(id);
}else{
var _3b=O.video_id;
}
if(O.category=="CHOW Tip"){
chow_video.chow_tip_counter++;
}else{
chow_video.chow_tip_counter=0;
}
chow_video.numeric_id=O.id;
var _3c="<object width='640' height='360' id='can' "+"classid='clsid:D27CDB6E-AE6D-11cf-96B8-444553540000' "+"codebase='http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,115,0'> "+"<param name='quality' value='high'></param> "+"<param name='bgcolor' value='#000000'></param> "+"<param name='menu' value='true'></param> "+"<param name='movie' value='http://www.cbs.com/thunder/canplayer/canplayer.swf'></param>"+"<param name='wmode' value='transparent'></param> "+"<param name='allowNetworking' value='all'></param> "+"<param name='allowFullScreen' value='true'></param> "+"<param name='allowScriptAccess' value='always'></param> "+"<param name='FlashVars'  value='pid="+_3b+"&amp;partner=chow&amp;autoPlayVid=true&amp;config="+searchurl+"/config/canPlayer.xml?showAd=n&amp;link="+searchurl+"/api/getVideo?pid="+_3b+"'></param> "+"<embed "+"src='http://www.cbs.com/thunder/canplayer/canplayer.swf' "+"quality='high' "+"bgcolor='#000000' name='can' "+"allownetworking='all' "+"wmode='transparent' "+"allowscriptaccess='always'  "+"menu='true' allowfullscreen='true' "+"flashvars='pid="+_3b+"&amp;partner=chow&amp;autoPlayVid=true&amp;config="+searchurl+"/config/canPlayer.xml?showAd=n&amp;link="+searchurl+"/api/getVideo?pid="+_3b+"' "+"type='application/x-shockwave-flash' "+"pluginspage='http://www.macromedia.com/go/getflashplayer' "+"height='360' "+"width='640'> "+"</embed>"+"</object>";
var _3d=(O.category=="Obsessives")?"":O.category+": ";
var _3e=(O.duration==null)?"":"<span class=\"f12 ml5\">("+O.duration+")</span>";
$("video-obj").innerHTML=_3c;
$("video-title").innerHTML=_3d+O.title+_3e;
document.title=O.title+" - Videos - CHOW";
chow_video.updateEmailItems();
chow_video.updateShareLinks();
chow_video.updateEmbedCode(_3b);
chow_video.updateCommentLink(O.link);
DW.clear({CVAL:chow_video.numeric_id+";"+O.title+";"+O.category,ASID:chow_video.numeric_id});
if(gaTracker!==undefined){
gaTracker._trackPageview(chow_video.cleanUrl.split(".com")[1]);
}
},failure:function(e){
}});
},getVideoThumbs:function(_40){
if(_40===undefined){
_40=0;
}
YAHOO.util.Connect.asyncRequest("GET","/xhr/videos/getVideoThumbnails.json?id="+chow_video.category+"&videoid="+chow_video.numeric_id+"&start="+_40,{success:function(e){
$("video-thumbs").innerHTML=e.responseText;
chow_video.compileAutoplayList();
chow_video.getNumInCollection();
chow_video.addThumbListeners();
chow_video.checkPlaylist();
}});
},getPaginator:function(){
var _42="/xhr/videos/getPaginator.json?id="+chow_video.category+"&numresults="+chow_video.numResults+"&numperpage="+chow_video.numPerPage+"&pagenumber="+chow_video.pageNum;
if(chow_video.fetch_paginator){
YAHOO.util.Connect.asyncRequest("GET",_42,{success:function(e){
$("pagination").innerHTML=e.responseText;
chow_video.addPaginatorListener();
}});
}
},getNumInCollection:function(){
chow_video.numResults=$("numTotal").value;
if(chow_video.numResults>chow_video.numPerPage){
chow_video.getPaginator();
}else{
$("pagination").innerHTML="";
}
chow_video.fetch_paginator=true;
},init_playlist:function(){
chow_video.playlist=YAHOO.util.Cookie.get("video_playlist2");
chow_video.playlist=(chow_video.playlist!==null)?chow_video.playlist.split(","):[];
if(chow_video.playlist.length>0&&chow_video.playlist[0].match(/^\d{5}/)==null){
chow_video.playlist.shift();
}
if(chow_video.playlist.length>0){
$("playlist-text").style.display="none";
$("playlist-count").innerHTML=" ("+chow_video.playlist.length+")";
chow_video.checkPlaylist();
var _44="/xhr/videos/getVideo.json?id="+chow_video.playlist;
YAHOO.util.Connect.asyncRequest("GET",_44,{success:function(e){
var O=YAHOO.lang.JSON.parse(e.responseText);
if(O.videoResult.response.result.doc){
for(var j=0;j<chow_video.playlist.length;j++){
for(var i=0;i<chow_video.playlist.length;i++){
var Obj=O.videoResult.response.result.doc[i];
if(chow_video.playlist[j]==Obj.id){
var _4a="/videos/show/all/"+Obj.id+"/"+encodeURIComponent(Obj.title);
_4a=_4a.toLowerCase().replace(/\s|%20/g,"-");
$("playlist-thumbs").innerHTML+="<li id=\"pl_"+Obj.id+"\" class=\"video-thumb playlist-thumb\">"+"<a class=\"thumb-link\" href=\""+_4a+"\">"+"<img height=\"72\" width=\"105\" alt=\""+Obj.title+"\""+"src=\"http://search.chow.com/thumbnail/105/72/www.chow.com/"+Obj.main_image+"\"/>"+"<img alt=\"Play\" class=\"play-arrow\" src=\"http://search.chow.com/static/i/video/thumb-hover-arrow.png\"/></a>"+"<span class=\"thumb-title\">"+Obj.title+"</span>"+"<a class=\"playlist-link remove\" href=\"#remove-from-playlist\">- playlist</a>"+"<span class=\"thumb-length\">"+Obj.duration+"</span>"+"</li>";
break;
}
}
}
}
}});
}
},updatePlaylist:function(_4b,el){
var _4d=el.innerHTML.match(/\d{5}/);
$("playlist-text").style.display="none";
if(_4b=="add"){
$("playlist-thumbs").innerHTML+="<li id=\"pl_"+_4d+"\" class=\"video-thumb playlist-thumb\">"+el.innerHTML+"</li>";
}else{
$("playlist-thumbs").removeChild($("pl_"+_4d));
}
YAHOO.util.Cookie.set("video_playlist2",chow_video.playlist,{path:"/",expires:new Date("December 31, 2020")});
},checkPlaylist:function(){
for(i=0;i<chow_video.playlist.length;i++){
if($("cl_"+chow_video.playlist[i])){
var _4e=YDom.getChildrenBy($("cl_"+chow_video.playlist[i]),function(el){
return YDom.hasClass(el,"playlist-link");
})[0];
_4e.innerHTML="- playlist";
_4e.href="#remove-from-playlist";
YDom.addClass(_4e,"remove");
}
}
},compileAutoplayList:function(_50){
chow_video.autoplay_list=[];
if(_50=="playlist"||YDom.hasClass("playlist_tab","selected")){
var _51=YDom.getElementsByClassName("playlist-thumb");
for(var i=0;i<_51.length;i++){
chow_video.autoplay_list[i]=_51[i].id.split("pl_")[1];
}
}else{
var _51=YDom.getElementsByClassName("video-thumb");
for(var i=0;i<_51.length;i++){
chow_video.autoplay_list[i]=_51[i].id.split("cl_")[1];
}
}
if(_50!==undefined&&_50.match(/\d{5}/)){
var _53=true;
var _54=0;
for(var i=0;i<chow_video.autoplay_list.length&&_53;i++){
if(chow_video.autoplay_list[i]==_50){
_54=i;
_53=false;
}
}
chow_video.autoplay_list.splice(0,_54+1);
}
},highLightThumb:function(id){
var _56=YDom.hasClass("playlist_tab","selected")?"playlist":"";
if(_56=="playlist"&&$("pl_"+id)){
var _57=YDom.getElementsByClassName("playlist-thumb");
for(i=0;i<_57.length;i++){
YDom.removeClass(_57[i],"selected");
}
YDom.addClass($("pl_"+id),"selected");
}else{
var _57=YDom.getElementsByClassName("video-thumb");
if($("cl_"+id)){
for(i=0;i<_57.length;i++){
YDom.removeClass(_57[i],"selected");
}
YDom.addClass($("cl_"+id),"selected");
}
}
},updateEmailItems:function(){
$("email_item_url").value=chow_video.cleanUrl;
$("email_item_id").value=chow_video.numeric_id;
},updateShareLinks:function(){
var _58=encodeURIComponent(chow_video.cleanUrl);
$("share-facebook").href="http://www.facebook.com/share.php?u="+_58;
$("share-twitter").href="http://twitter.com/home?status="+_58;
$("share-stumble").href="http://www.stumbleupon.com/submit?url="+_58;
$("share-digg").href="http://digg.com/submit?url="+_58;
$("share-reddit").href="http://reddit.com/submit?url="+_58;
$("share-all").href="http://www.addthis.com/bookmark.php?v=15&winname=addthis&pub=CHOW&s=undefined&url="+_58;
$("page_url").value=chow_video.cleanUrl;
},updateEmbedCode:function(_59){
$("embed_code").value="<object width='480' height='270'><param name='movie' value='http://www.cbs.com/e/"+_59+"/chow/1/'></param><param name='allowFullScreen' value='true'></param><param name='allowScriptAccess' value='always'></param><param name='FlashVars' value='config=http://search.chow.com/config/canPlayer.xml'></param><embed width='480' height='270' src='http://www.cbs.com/e/"+_59+"/chow/1/'  allowfullscreen='true' allowScriptAccess='always' type='application/x-shockwave-flash' FlashVars='config=http://search.chow.com/config/canPlayer.xml'></embed></object>";
},updatePageUrl:function(url){
window.location.hash="!/"+url;
chow_video.scrubUrl();
},scrubUrl:function(){
if(document.location.toString().indexOf("!")!=-1){
chow_video.cleanUrl=document.location.toString().replace(/com\/videos.*#!\//,"com/videos/");
}else{
chow_video.cleanUrl=document.location.toString().replace(/com\/videos.*#\//,"com/videos/");
}
},updateCommentLink:function(_5b){
$("comment-link-value").href=_5b+"#comments_container";
}};
function fbs_click(){
u=chow_video.cleanUrl;
t=document.title;
window.open("http://www.facebook.com/sharer.php?u="+encodeURIComponent(u)+"&t="+encodeURIComponent(t),"sharer","toolbar=0,status=0,width=626,height=436");
return false;
}
function getCompanionAdInfo(){
return canPlayerObj.getCompanionAdInfo();
}
function getCompanionAdInfoBySize(w,h){
return canPlayerObj.getCompanionAdInfoBySize(w,h);
}
function onCBSI_AdResourcesInfo(){
var ads=canPlayerObj.getCompanionAdInfoBySize(300,60);
if(ads.length>0){
setExternalAd(ads[0]);
}
}
function setExternalAd(_5f){
var _60=_5f[0];
var _61=_5f[1];
var _62=_5f[2];
insertTrackingPixels(_5f[3]);
if(_62=="img"){
$("ad2").innerHTML="<a href=\""+_61+"\" id=\"extAdLink\" target=\"_blank\"><img id=\"extAd\" src=\""+_60+"\" width=\"300\" height=\"60\" /></a>";
}
if(_62=="swf"){
var _63="";
_63="<object classid=\"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,124,0\" ";
_63+="width=\"300\" height=\"60\" >";
_63+="<param name=\"movie\" value="+_60+">";
_63+="<param name=\"quality\" value=\"high\">";
_63+="<param name=\"scale\" value=\"noscale\">";
_63+="<param name=\"menu\" value=\"false\">";
_63+="<param name=\"salign\" value=\"tl\">";
_63+="<param name=\"allowScriptAccess\" value=\"always\">";
_63+="<param name=\"wmode\" value=\"opaque\">";
_63+="<param name=\"flashVars\" value=\"clickTag="+_61+"\">";
_63+="<embed src="+_60+" width=\"300\" height=\"60\" play=\"true\" quality=\"high\" scale=\"noscale\" ";
_63+="menu=\"false\" salign=\"tl\" allowScriptAccess=\"always\" wmode=\"transparent\" flashVars=\"clickTag="+_61+"\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" ";
_63+="type=\"application/x-shockwave-flash\">";
_63+="</embed>";
_63+="</object>";
$("ad2").innerHTML=_63;
}
}
function insertTrackingPixels(_64){
for(i=0;i<_64.length;i++){
if(_64[i]!=""){
var _65=document.createElement("div");
_65.innerHtml="<img src=\""+_64[i]+"\" width=\"1\" height=\"1\" border=\"0\" style=\"position:absolute; bottom:0; right:0\"/>";
document.getElementsByTagName("body")[0].appendChild(_65);
}
}
}
var chow_video_loaded=true;

