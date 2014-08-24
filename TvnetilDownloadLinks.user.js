// ==UserScript==
// @name        TvnetilDownloadLinks
// @namespace   http://www.tvnetil.net
// @description Get Tvnetil Download Links On The Review Page
// @include     /^http(s)?://(www\.)?tvnetil\.net/review/\d+/\d+/$/
// @version     1
// @grant       GM_xmlhttpRequest
// @grant       GM_log
// ==/UserScript==
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

Element.prototype.remove = function() {
    this.parentElement.removeChild(this);
}

// Element.prototype.replace = function(elementName, innerHTML) {
//     this.parentElement.replaceChild(this, );
// }

function setDis(obj) {
  if (document.getElementById(obj).style.display == 'none') {
    document.getElementById(obj).style.display = '';
  } else {
    document.getElementById(obj).style.display = 'none';
  }
}

function encodeWin1255URIComponent(str) {
  var win1255EncodedString = encodeURIComponent(str);
  for(i=0x90; i<=0xAA; i++) {
    var from = "%D7%" + i.toString(16).toUpperCase();
    win1255EncodedString = win1255EncodedString.replaceAll(
      "%D7%" + i.toString(16).toUpperCase(),
      "%" + (i + 0x50).toString(16).toUpperCase()
    );
  };
  win1255EncodedString = win1255EncodedString.replaceAll('(', '%28');
  win1255EncodedString = win1255EncodedString.replaceAll(')', '%29');
  win1255EncodedString = win1255EncodedString.replaceAll('%20', '+');
  win1255EncodedString = win1255EncodedString.replaceAll('%C2%A0', '+');
  return win1255EncodedString;
}

var tvshow_title = document.evaluate(
  "//div[@class='blokl1']/h1",
  document,
  null,
  XPathResult.STRING_TYPE,
  null
).stringValue.trim();
// alert(encodeURIComponentWin1255(tvshow_title));
var response = GM_xmlhttpRequest({
  method: "POST",
  url: "http://www.favez0ne.net/search.php",
  overrideMimeType: "text/html; charset=windows-1255",
  data: "srch=" + encodeWin1255URIComponent(tvshow_title),
  synchronous: true,
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});
// alert(response.responseText);
var sheet = (function() {
  // Create the <style> tag
  var style = document.createElement("style");
  // Add a media (and/or media query) here if you'd like!
  // style.setAttribute("media", "screen")
  // style.setAttribute("media", "@media only screen and (max-width : 1024px)")

  // WebKit hack :(
  style.appendChild(document.createTextNode(""));

  // Add the <style> element to the page
  document.head.appendChild(style);

  return style.sheet;
})();
sheet.insertRule('#pagetext {direction: rtl; background: url("http://www.favez0ne.net/images/dots_bg2.gif") repeat scroll 100% center rgba(0, 0, 0, 0); height: auto; min-height: 580px; padding: 10px 0px; text-align: right; width: 670px; margin-right: 10px;}', sheet.cssRules.length);
var blokl1 = document.getElementsByClassName('blokl1')[0];
console.log(blokl1.getElementsByTagName('div')[0]);
blokl1.getElementsByTagName('div')[0].remove();