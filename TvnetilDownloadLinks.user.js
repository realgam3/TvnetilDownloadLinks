// ==UserScript==
// @name        TvnetilDownloadLinks
// @namespace   http://www.tvnetil.net
// @author      RealGame (Tomer Zait)
// @description Get FaveZ0ne Download Links On Tvnetil Review Page
// @include     /^http(s)?://(www\.)?tvnetil\.net/review/\d+/\d+/$/
// @version     1.1
// @grant       GM_xmlhttpRequest
// ==/UserScript==
(function() {
    // Add replaceAll To The String Prototype
    String.prototype.replaceAll = function(search, replacement) {
        var target = this;
        return target.split(search).join(replacement);
    };

    // Add remove To The Element Prototype
    Element.prototype.remove = function() {
        this.parentElement.removeChild(this);
    };

    // EncodeURIComponent With Windows-1255 Special Characters Encoding
    function encodeWin1255URIComponent(str) {
        var win1255EncodedString = encodeURIComponent(str).replaceAll('%C2%A0', '%20');
        for(var i=0x90; i<=0xAA; i++) {
            win1255EncodedString = win1255EncodedString.replaceAll(
                    "%D7%" + i.toString(16).toUpperCase(),
                    "%" + (i + 0x50).toString(16).toUpperCase()
            );
        }
        return win1255EncodedString.replace(/(%20){2,}/g, '%20');
    }

    // Get TvShow Title To Search In FaveZ0ne
    var tvshow_title = document.evaluate(
        "//div[@class='blokl1']/h1[1]",
        document,
        null,
        XPathResult.STRING_TYPE,
        null
    ).stringValue.trim();

    // Add New CSS Rules - For The FaveZ0ne Links
    var sheet = (function() {
      // Create the <style> tag
      var style = document.createElement("style");
      style.appendChild(document.createTextNode(""));
      // Add the <style> element to the page
      document.head.appendChild(style);
      return style.sheet;
    })();
    sheet.insertRule(
        '#pagetext {' +
            'direction: rtl; ' +
            'background: url("http://www.favez0ne.net/images/dots_bg2.gif") repeat scroll 100% center rgba(0, 0, 0, 0); ' +
            'height: auto; ' +
            'min-height: 580px; ' +
            'padding: 10px 0px; ' +
            'text-align: right; ' +
            'width: 670px; ' +
            'margin-right: 10px;}',
        sheet.cssRules.length
    );

    // inject setDis Function (From FaveZ0ne)
    var setDis = document.createElement('script');
    setDis.type="text/javascript";
    setDis.innerHTML = [
        "function setDis(objId) {",
        "    var obj = document.getElementById(objId);",
        "    obj.style.display = (!obj.style.display) ? 'none': '';",
        "}",
        "var toggle = setDis;"
    ].join("\n");
    document.head.appendChild(setDis);

    // Get FaveZ0ne Links Page
    var response = GM_xmlhttpRequest({
        method: "POST",
        url: "http://www.favez0ne.net/search.php",
        overrideMimeType: "text/html; charset=windows-1255",
        data: "srch=" + encodeWin1255URIComponent(tvshow_title),
        synchronous: true,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });

    // Set FaveZ0ne Links Instead Of FaveZ0ne Advertise And Remove adf.ly ads
    var pageText = (function () {
        var blokl1 = document.evaluate(
            "//div[@class='blokl1']/div[contains(., 'FaveZ0ne')]",
            document,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null
        ).singleNodeValue;
        blokl1.id = "pagetext";
        blokl1.style = "";

        return blokl1;
    })();

    pageText.innerHTML = (function () {
        var faveZ0neDoc = new DOMParser().parseFromString(response.responseText, "text/html");
        var faveZ0nePageText = faveZ0neDoc.getElementById("pagetext");
        // Remove Results Found Annoying Text
        faveZ0nePageText.getElementsByTagName('div')[0].remove();

        return faveZ0nePageText.innerHTML.replaceAll(
            /http(s)?:\/\/adf\.ly\/\d+\//g,
            ""
        );
    })();
})();