// The code below can be used to retrieve a canvas link that is URL encoded in 
// the description of a ServiceNow ticket. This happens when the user submits
// a ticket from within Canvas.
//
// The description of the ticket might look something like this:
//
//      Client: John Harvard
//
//      Email:john_harvard@fas.harvard.edu
//      Severity:I need some help but it's not urgent
//
//      Link:https%3A%2F%2Fcanvas.harvard.edu%2Fcourses%2F12345
//
//      Issue:I would like my colleagues to have access to my Canvas site including
//
// Our task is to get the value of the Link and reverse the URL encoding. Bonus points
// if we can open it in a new window automatically.
//
// The code below accomplishes this task and can be run in one of two ways:
//      1. Run from the Javascript Console. Simply copy & paste this code into
//         the Javascript Console while on the ServiceNow page. 
//      2. Run as a bookmarklet while on the ServiceNow page.
//
// To create a bookmarklet:
//      1. Toggle the bookmarklet variable to true (e.g. bookarmklet = true).
//      2. Copy & paste this code into https://javascript-minifier.com/.
//      3. Copy the output of the minified code to your clipboard.
//      4. Create a new bookmark in your browser and paste the code as
//         the value of the URL. For example:
//
//          Name: SNowOpenCanvasUrl
//          URL: javascript:!function(){ ... }();
//

(function() { 
    let bookmarklet = false; // determines whether to escape % so %3A becomes %253A

    // Extract the INCxxx value 
    let incident = document.title.replace(/^(INC\d+).*$/, '$1');
    
    // Extract the description 
    let iframeDoc = document.getElementById('gsft_main').contentWindow.document;
    let el = iframeDoc.getElementById('incident.description');
    let text = (el ? el.value : '');
    console.log(incident + ' description:', text);

    // Construct the regex pattern used to match the canvas link
    let canvas_url = 'https://canvas.harvard.edu';
    let encoded_url = bookmarklet ? encodeURIComponent(canvas_url).replace('%', '%25') : encodeURIComponent(canvas_url);
    let pattern = 'Link:('+encoded_url+'\\S+)';
    console.log(incident + ' pattern:', pattern);

    // Extract the canvas link
    let found = text.match(pattern);
    let url = (found ? decodeURIComponent(found[1]) : null);
    console.log(incident + ' url: ' + url);
    
    // Show a message to the user and optionally open the URL in a new window
    if (url) {
        let ok = window.confirm('Successfully extracted canvas link for '+incident+".\n\nOpen "+url+' in new window?');
        if(ok) { 
            window.open(url, '_blank');
        }
    } else {
        alert('Canvas link not found in description of '+incident);
    }
})();
