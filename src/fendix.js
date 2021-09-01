/**
 * Fendix Media JS Banner adapted to work for WordPress
 *
 * @todo 1. Find out if the opt-out is essential for intranets
 *
 * @url https://www.fendixmedia.co.uk/segmentation/SPOFendixJSbanner.txt
 */

var URN = fendix.trust_urn;
var USEREMAIL = fendix.user_email;

jQuery(document).ready(function($) {
    var Userhash = "";
    var rethash = "";

    /**
     * @todo 1. Find out if the opt-out is essential for intranets
     */
    // if (checkItemExist("FendixOptOut", USEREMAIL)) {
        //alert(USEREMAIL +" has Opted Out");
        // console.log(USEREMAIL + " has Opted Out");
        // rethash = "//code.fendixmedia.net/tag/" + URN + "/intranet/leaderboard/0/";
        // postscribe('#fendix', '<script src=' + rethash + '><\/script>')
        //Comment out the following line after Testing
        //   document.getElementById("details").innerHTML = "Name: " + USEREMAIL + " Hash: " + Userhash + " Hash64: " + rethash;
    // } else {
        Pseudonymise_email(USEREMAIL, function(result) {
            rethash = result;
            //alert('rethash : '+rethash)
            postscribe('#fendix', '<script src=' + rethash + '><\/script>')
            //Comment out the following line after Testing
            document.getElementById("details").innerHTML = "Name: " + USEREMAIL + " Hash: " + Userhash + " Hash64: " + rethash;
        });
    // }
});

function Pseudonymise_email(str, callback) {
    var groups64;

    var adhash = getAllUrlParams().ad;
    if (adhash == null && window.name && window.name.match(/ad_approval_(.*)/)) {
        adhash = window.name.match(/ad_approval_(.*)/).pop();
    }

    if (adhash == null) {
        groups64 = btoa('REMOTE');
    } else {
        groups64 = btoa("ad_approval," + adhash);
    }

    var NameToHash = str;

    // add name before @ to end of email for obfuscation
    var index = NameToHash.indexOf('@');

    var sub = '';
    if (index >= 0) {
        sub = NameToHash.substring(0, index);
    } else {
        sub = NameToHash;
    }

    var texttoHash = NameToHash + sub;

    var hash = intArrayToHex((new sjcl.hash.sha256()).update(texttoHash.toLowerCase()).finalize());
    Userhash = hash;
    var fullhash = "//code.fendixmedia.net/tag/" + URN + "/intranet/leaderboard/" + groups64 + "/" + btoa(hash);

    callback(fullhash);
}

// opt out check
// function checkItemExist(listname, itemvalue) {
//     var flag = false;
//     var siteURL = _spPageContextInfo.webAbsoluteUrl;
//     var url = siteURL + "/_api/web/lists/getbytitle('" + listname + "')/items?$filter=Title eq '" + itemvalue + "'";
//     //alert(url);
//     $.ajax({
//         url: url,
//         method: "GET",
//         async: false,
//         headers: {
//             "Accept": "application/json; odata=verbose"
//         },
//         success: function(data) {
//             if (data.d.results.length > 0) {
//                 //alert('Flag = true');
//                 flag = true;
//             }
//         },
//         error: function(data) {}
//     });
//     return flag;
// }

function intArrayToHex(arr) {
    var uArr = new Uint32Array(arr);
    var hexCodes = [];
    for (i = 0; i < uArr.length; i++) {

        var stringValue = uArr[i].toString(16)
        // We use concatenation and slice for padding
        var padding = '00000000'
        var paddedValue = (padding + stringValue).slice(-padding.length)
        hexCodes.push(paddedValue);
    }
    return hexCodes.join("");
}

function getAllUrlParams(url) {
    // get query string from url (optional) or window
    var queryString = url ? url.split('?')[1] : window.location.search.slice(1);

    // we'll store the parameters here
    var obj = {};

    // if query string exists
    if (queryString) {

        // stuff after # is not part of query string, so get rid of it
        queryString = queryString.split('#')[0];

        // split our query string into its component parts
        var arr = queryString.split('&');

        for (var i = 0; i < arr.length; i++) {
            // separate the keys and the values
            var a = arr[i].split('=');

            // set parameter name and value (use 'true' if empty)
            var paramName = a[0];
            var paramValue = typeof(a[1]) === 'undefined' ? true : a[1];

            // (optional) keep case consistent
            paramName = paramName.toLowerCase();
            if (typeof paramValue === 'string') paramValue = paramValue.toLowerCase();

            // if the paramName ends with square brackets, e.g. colors[] or colors[2]
            if (paramName.match(/\[(\d+)?\]$/)) {

                // create key if it doesn't exist
                var key = paramName.replace(/\[(\d+)?\]/, '');
                if (!obj[key]) obj[key] = [];

                // if it's an indexed array e.g. colors[2]
                if (paramName.match(/\[\d+\]$/)) {
                    // get the index value and add the entry at the appropriate position
                    var index = /\[(\d+)\]/.exec(paramName)[1];
                    obj[key][index] = paramValue;
                } else {
                    // otherwise add the value to the end of the array
                    obj[key].push(paramValue);
                }
            } else {
                // we're dealing with a string
                if (!obj[paramName]) {
                    // if it doesn't exist, create property
                    obj[paramName] = paramValue;
                } else if (obj[paramName] && typeof obj[paramName] === 'string') {
                    // if property does exist and it's a string, convert it to an array
                    obj[paramName] = [obj[paramName]];
                    obj[paramName].push(paramValue);
                } else {
                    // otherwise add the property
                    obj[paramName].push(paramValue);
                }
            }
        }
    }

    return obj;
}
