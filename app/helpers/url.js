var makeValidUrl = function(url) {
    var urlregex = new RegExp("^(http:\/\/|https:\/\/\.)");

    if (!urlregex.test(url)) {
        url = "http://" + url;
    }

    return url;
}

var getDomainNameFromUrlString = function(url) {
    var match = url.match(/:\/\/(.[^/]+)/);
    if (match) {
        return match[1];
    } else {
        return url;
    }
}

var concatenateInternalLinkWithBase = function(url, hostname) {
    hostnameRegex = new RegExp(/hostname/i);
    var isExternal = (/^https?:\/\//i.test(url) || /^www./i.test(url));
    var glue = "";

    if (!hostnameRegex.test(url) && !isExternal) {
        if (url.indexOf('/') != 0 && hostname.charAt(hostname.length - 1) != '/') {
            glue = "/";
        }

        url = makeValidUrl(hostname + glue + url);
    }

    return url;
}


module.exports = {
    concatenateInternalLinkWithBase : concatenateInternalLinkWithBase,
    getDomainNameFromUrlString : getDomainNameFromUrlString,
    makeValidUrl : makeValidUrl
}