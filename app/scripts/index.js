var $ = require('jquery');
var _ = require('underscore');
var handlebars = require('handlebars');


//AJAX CALL

var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=tequila&includes=Images,Shop&sort_on=score";

function fetchJSONP(url, callback) {
    var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    var script = document.createElement('script');
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

function logData(data) {
  console.log(data);
  buildTemplates(data);
}

fetchJSONP(url, logData);

function buildTemplates(data){
  // Setup my template
  var numberOfResults = data.count;
  var searchTerm = data["params"].keywords;
  console.log(searchTerm);
  console.log(numberOfResults);

  var searchHeaderSource = $("#search-header-template").html();
  var searchHeaderTemplate = handlebars.compile(searchHeaderSource);
  var searchHeaderRenderedTemplate = searchHeaderTemplate(
    {
      "numberOfResults": numberOfResults,
     "searchTerm": searchTerm}
  );

  $('.search-area').html(searchHeaderRenderedTemplate);

  var resultsArray = data["results"];
  console.log(resultsArray[0].price);

  var searchImagesSource = $("#search-images-template").html();
  var searchImagesTemplate = handlebars.compile(searchImagesSource);
  var searchImagesRenderedTemplate = searchImagesTemplate({"results": resultsArray});


    $('.search-area').append(searchImagesRenderedTemplate);

  };
