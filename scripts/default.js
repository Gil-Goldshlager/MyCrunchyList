/* Global variables */
var site,
	pageUrl = window.location.href,
	page = {},
	pageInit,
	$body = $('body'),
	lbBodyClass = 'mcl-lightbox',
	lbIframe,
	malType = 'anime',
	malSearchModified,
	itemAddedClass = 'mcl-link-added',
	observer,
	
	allowedPage,
	lightboxReady,
	listLinksAdded,
	singleLinkAdded,
	hidenLinks;
	
var settings = {
	'crOn': true,
	'crLightbox': true,
	'crSearch': true,
	'malOn': true,
	'malLightbox': true,
	'malEnglish': true
}
	
function checkPage(){
	for(var x in page){
		if(page[x]){
			allowedPage = true;
		}
	}
}

/* Lightbox init */
function initLightbox(){
	var lbOverlay = document.createElement('div');
		lbOverlay.classList.add('mcl-lb-overlay');
		
	var lbLoader = document.createElement('span');
		lbLoader.classList.add('mcl-lb-loader');
	var lbLoaderTxtNode = document.createTextNode('Loading...');
		lbLoader.appendChild(lbLoaderTxtNode);
		lbOverlay.appendChild(lbLoader);
		
	var lbContainer = document.createElement('div');
		lbContainer.classList.add('mcl-lb-container');
		
		lbIframe = document.createElement('iframe');
		lbIframe.classList.add('mcl-lb-iframe');
		lbIframe.setAttribute('frameborder',0);
		
	var lbClose = document.createElement('button');
		lbClose.classList.add('mcl-lb-close');
		lbClose.type = 'button';
		lbClose.title = 'Close';
	var lbCloseTxtNode = document.createTextNode('Close');
		lbClose.appendChild(lbCloseTxtNode);
	
		lbContainer.appendChild(lbIframe);
		lbContainer.appendChild(lbClose);
	
		$body.appendChild(lbOverlay);
		$body.appendChild(lbContainer);
		
		lbOverlay.addEventListener('click',function(){
			toggleLightbox(0);
		});
		
		lbClose.addEventListener('click',function(){
			toggleLightbox(0);
		});
		
		document.onkeydown = function(e){
			if(e.keyCode == 27 && $body.classList.contains(lbBodyClass)){
				toggleLightbox(0);
			}
		}
	
	lightboxReady = true;
}

/* Lightbox toggle */
function toggleLightbox(url){
	if(url){
		lbIframe.src = url;
		$body.classList.add(lbBodyClass);
		setTimeout(function(){$body.classList.add(lbBodyClass+'-overlay');},50);
		setTimeout(function(){$body.classList.add(lbBodyClass+'-loaded');},1000);
	}else{
		lbIframe.src = '';
		$body.classList.remove(lbBodyClass+'-loaded',lbBodyClass+'-overlay');
		setTimeout(function(){$body.classList.remove(lbBodyClass);},600);
	}
}

/* Lightbox init check */
function checkLightbox(){
	if(!lightboxReady && (settings.crLightbox || settings.malLightbox)){
		initLightbox();
	}
}

/* Query selector */
function $(elem){
	return document.querySelector(elem);
}

/* Show links, in case and they were hidden */
function showLinks(){
	$body.classList.remove('mcl-hide-links');
	hidenLinks = false;
}

/* Hide links, in case and they were created */
function hideLinks(){
	$body.classList.add('mcl-hide-links');
	hidenLinks = true;
}

/* On storage change */
chrome.storage.onChanged.addListener(function(){
	getSettings();
});

/* Update settings */
function updateSettings(data){
	if(settings == data){
		return false;
	}
	
	settings = data;
	
	checkLightbox();
	
	if((settings.crOn && site == 'cr') || (settings.malOn && site == 'mal')){
		if((listLinksAdded || singleLinkAdded) && hidenLinks){
			showLinks();
		}else if(!listLinksAdded){
			if(typeof(setLinks) === typeof(Function)){
				if(site == 'mal' || (site == 'cr' && !page.single)){
					setLinks();
				}
			}
			if(page.single && typeof(setSingle) === typeof(Function)){
				setSingle();
			}
		}
	}else if(listLinksAdded || singleLinkAdded){
		hideLinks();
	}
	
	if(settings.crSearch && page.search){
		if(!malSearchModified){
			modifySearchInIframe();
		}else{
			var searchImages = document.querySelectorAll('#content img');
			for(var i=0; i<searchImages.length; i++){
				searchImages[i].src = searchImages[i].getAttribute('data-big');
			}
			$body.classList.add('mcl-mal-modify-search');
		}
	}else if(malSearchModified){
		var searchImages = document.querySelectorAll('#content img');
		for(var i=0; i<searchImages.length; i++){
			searchImages[i].src = searchImages[i].getAttribute('data-small');
		}
		$body.classList.remove('mcl-mal-modify-search');
	}
	
	saveToStorage();
}

/* Get data from storage */
function getSettings(){
	chrome.storage.sync.get(
		settings,
		function(results){
			updateSettings(results);
		}
	);
}

/* Save data to storage */
function saveToStorage(){
	chrome.storage.sync.set(settings);
}