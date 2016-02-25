var $ = require('jquery');
window.jQuery = $ = require('jquery');
var _ = require('underscore');
var bootstrap = require('bootstrap');
var handlebars = require('handlebars');

var lastResults;
var keyword = "dog";

// Submit button Handler
var searchSubmitButton = $(".search-button");
$('.handmade-filter').click(handMadeButtonHandler);
$('.vintage-filter').click(vintageButtonHandler);
$('.all-items-filter').click(allItemsButtonHandler);
$("#price-filter-button").click(priceFilterButtonHandler);

$(searchSubmitButton).click(submitButtonHandler);

function submitButtonHandler(){
    event.preventDefault();
    var searchKeyword = $("#main-search-field").val();
    var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=";
    url += searchKeyword;
    url += "&includes=Images,Shop&sort_on=score";
    console.log( "Handler for .submit() called." );
    $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">Searching for ' + searchKeyword + '!</h3></div></div>');
    fetchJSONP(url, logData);
  }

// Sort Button Handlers //

function priceHighButtonHandler(){
    event.preventDefault();
    var sortParam = "price";
    var sortOrder = "&sort_order=down";
    var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords="
    url += keyword + "&includes=Images,Shop&sort_on=";
    url += sortParam;
    url += sortOrder;
    $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">Sorting by ' + sortParam + ' (highest first)!</h3></div></div>');
    fetchJSONP(url, logData);
  }

function priceLowButtonHandler(event){
    event.preventDefault();
    var sortParam = "price";
    var sortOrder = "&sort_order=up";
    var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=";
    url+= keyword + "&includes=Images,Shop&sort_on=";
    url += sortParam;
    url += sortOrder;
    $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">Sorting by ' + sortParam + ' (lowest first)!</h3></div></div>');
    fetchJSONP(url, logData);
  }

function dateButtonHandler(event){
    event.preventDefault();
    var sortParam = "created";
    var sortOrder = "&sort_order=down";
    var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=";
    url+= keyword + "&includes=Images,Shop&sort_on=";
    url += sortParam;
    url += sortOrder;
    $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">"Sorting by date (newest first)!"</h3></div></div>');
    fetchJSONP(url, logData);
  }

  function relevanceButtonHandler(event){
      event.preventDefault();
      var sortParam = "score";
      var sortOrder = "&sort_order=down";
      var url = "https://api.etsy.com/v2/listings/active.js?api_key=2y6e2yglpdqmnn0ve6wz5iib&keywords=";
      url+= keyword + "&includes=Images,Shop&sort_on=";
      url += sortParam;
      url += sortOrder;
      $(".search-area").html('<div class="panel panel-default" id="searching-panel"><div class="panel-heading"><h3 class="panel-title">"Sorting by relevance!"</h3></div></div>');
      fetchJSONP(url, logData);
    }

  function handMadeButtonHandler(event){
    event.preventDefault();
    var resultsArray = lastResults["results"];
    var handMadeItems = _.filter(resultsArray, function(itemForSale){
      if(itemForSale.who_made == "i_did"){
        return itemForSale;
      }
      return(handMadeItems);
    });
    buildTemplates(handMadeItems);
  }

  function vintageButtonHandler(event){
    event.preventDefault();
    var resultsArray = lastResults["results"];
    var vintageItems = _.filter(resultsArray, function(itemForSale){
      if(itemForSale.when_made == "before_1997"){
        return itemForSale;
      }
      return(vintageItems);
    });
    buildTemplates(vintageItems);
  }

  function allItemsButtonHandler(event){
    event.preventDefault();
    var resultsArray = lastResults["results"];
    console.log(resultsArray);
    buildTemplates(resultsArray);
    return resultsArray;
  }

  function priceFilterButtonHandler(event){
    event.preventDefault();
    var resultsArray = lastResults["results"];
    var maxPrice = $('#high-price-input').val();
    var minPrice = $('#low-price-input').val();
    if(minPrice === ""){
      minPrice = "0";
    }
    if(maxPrice === ""){
      maxPrice = "99999999999";
    }

    var priceFilteredItems = _.filter(resultsArray, function(itemForSale){
      console.log(minPrice);
      console.log(maxPrice);
      var itemPrice = itemForSale.price;
      return (maxPrice > itemPrice > minPrice);
    });
      console.log(priceFilteredItems);
      buildTemplates(priceFilteredItems);
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
  keyword = data["params"].keywords;
  lastResults = data;
  buildTemplates();
}

fetchJSONP(url, logData);

// Handlebars template builder function

function buildTemplates(filteredResults){

  var numberOfResults;
  // Setup my template
  if(filteredResults){
    numberOfResults = filteredResults.length;
  } else {
    numberOfResults = lastResults.count;
  }

  var searchTerm = lastResults["params"].keywords;

  var activeSortFilterTerm = lastResults["params"].sort_on;
  activeSortFilterTerm = activeSortFilterTerm.charAt(0).toUpperCase() + activeSortFilterTerm.slice(1);
  var sortOrder = lastResults["params"].sort_order;

  if(activeSortFilterTerm == "Price") {
    if(sortOrder == "down") {
      activeSortFilterTerm = "Price (Highest First)";
    } else {
      activeSortFilterTerm = "Price (Lowest First)";
    }
  } else if(activeSortFilterTerm == "Created") {
      activeSortFilterTerm = "Date (Newest First)";
  } else if(activeSortFilterTerm == "Score") {
      activeSortFilterTerm = "Relevance";
  }

  var searchHeaderSource = $("#search-header-template").html();
  var searchHeaderTemplate = handlebars.compile(searchHeaderSource);
  var searchHeaderRenderedTemplate = searchHeaderTemplate(
    {
    "activeSortFilterTerm": activeSortFilterTerm,
    "numberOfResults": numberOfResults,
     "searchTerm": searchTerm}
  );

  $('.search-area').html(searchHeaderRenderedTemplate);
  $('.price-sorter-high').click(priceHighButtonHandler);
  $('.price-sorter-low').click(priceLowButtonHandler);
  $('.date-sorter').click(dateButtonHandler);
  $('.relevance-sorter').click(relevanceButtonHandler);

  var resultsArray;

  if(filteredResults){
    resultsArray = filteredResults;
  } else {
    resultsArray = lastResults["results"];
  }

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
