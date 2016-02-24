var $ = require('jquery');
window.jQuery = $ = require('jquery');
var _ = require('underscore');
var bootstrap = require('bootstrap');
var handlebars = require('handlebars');

// Submit button Handler
var searchSubmitButton = $(".search-button");

var keyword = "dog";

$(searchSubmitButton).click(submitButtonHandler);

function submitButtonHandler(){
    event.preventDefault();
    var keyword = $("#main-search-field").val();
    var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=";
    url += keyword;
    url += "&includes=Images,Shop&sort_on=score";
    console.log( "Handler for .submit() called." );
    $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">Searching for ' + keyword + '!</h3></div></div>');
    fetchJSONP(url, logData);
  }

//AJAX CALL

var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=" + keyword + "&includes=Images,Shop&sort_on=price";

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

// Handlebars template builder function

function buildTemplates(data){
  // Setup my template
  var numberOfResults = data.count;
  var searchTerm = data["params"].keywords;
  var activeSortFilterTerm = data["params"].sort_on;
  activeSortFilterTerm = activeSortFilterTerm.charAt(0).toUpperCase() + activeSortFilterTerm.slice(1);

  console.log(searchTerm);
  console.log(numberOfResults);

  var searchHeaderSource = $("#search-header-template").html();
  var searchHeaderTemplate = handlebars.compile(searchHeaderSource);
  var searchHeaderRenderedTemplate = searchHeaderTemplate(
    {
    "activeSortFilterTerm": activeSortFilterTerm,
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

  }

//Visuals
$(document).ready(checkSize);
$(window).resize(checkSize);
function checkSize(){
	if ($(window).width() <= 768){
    console.log("resize");
		$('#side-search-panel').removeClass('in');
    $('#mobile-refine-panel').removeClass('in');
	} else {
    $('#side-search-panel').addClass('in');
    $('#mobile-refine-panel').addClass('in');
  }
}
