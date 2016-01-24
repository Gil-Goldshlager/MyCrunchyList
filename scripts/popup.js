/* Global variables */
var malENtitles = document.getElementById('malEnglish');
var settingElem = document.querySelectorAll('.setting-input');

/* Set default settings */
var settings = {
	'crOn': true,
	'crLightbox': true,
	'crSearch': true,
	'malOn': true,
	'malLightbox': true,
	'malEnglish': true
}

/* Save settings */
function save(){
	for(var i=0; i < settingElem.length; i++){
		var name = settingElem[i].id,
			val = settingElem[i].checked;
			
			if(name == 'malLightbox'){
				if(val){
					malENtitles.disabled = false;
				}else{
					malENtitles.disabled = true;
				}
			}
		settings[name] = val;
	}

	chrome.storage.sync.set(settings);
}

/* Get settings from storage */
chrome.storage.sync.get(settings, function(results){
	settings = results;

	for(var i = 0; i < settingElem.length; i++){
		var name = settingElem[i].id,
			val = settings[name];
			
			if(name == 'malLightbox'){
				if(val){
					malENtitles.disabled = false;
				}else{
					malENtitles.disabled = true;
				}
			}
		
		settingElem[i].checked = val;
		settingElem[i].addEventListener('change', save);
	}
	
	setTimeout(function(){
		document.querySelector('body').classList.add('ready');
	},500);
});