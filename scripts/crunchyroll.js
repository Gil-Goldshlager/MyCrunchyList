/* Global variables */
	site = 'cr',
	containerElem = '.portrait-grid',
	itemElem = '.group-item',
	titleElem = '.series-title',
	targetElem = '.wrapper',
	loadMoreButton = $('a.load-more');
var watchLinkAdded;

function init(){
	pageInit = true;

	/* Page type - Crunchyroll doesn't have a unique class-name or ID to each type of page */
	page.home = window.location.pathname == '/' || $('#welcome_right ul.landscape-grid.shows');
	page.queue = pageUrl.indexOf('home/queue') != -1 || $('.main-tabs a[href="/home/queue"].selected');
	page.list = $('#source_browse');
	page.anime = $('.main-tabs a[href="/videos/anime"].selected');
	page.manga = $('.main-tabs a[href="/comics/manga"].selected');
	page.alpha = $('.sub-tabs-menu a[href*="/alpha"].selected');
	page.alphaAll = $('.content-menu a[href*="?group=all"].selected');
	page.single = $('#sidebar img.poster');
	page.singleAnime = $('#source_showview');
	page.singleManga = $('#source_manga_showview');
	page.watch = $('#showmedia_video');

	/* If page isn't supported */
	checkPage();
	if(!allowedPage){return false;}

	/* Home page */
	if(page.home){
		$body.classList.add('page-home');
		containerElem = '#welcome_right ul.landscape-grid.shows';
	}

	/* Queue page */
	if(page.queue){
		$body.classList.add('page-queue');
		containerElem = '.queue-sortable';
		itemElem = '.queue-item';
	}

	/* List page */
	if(page.list){
		$body.classList.add('page-list');
	}

	/* Anime page */
	if(page.anime){
		$body.classList.add('page-anime');
	}

	/* Manga page */
	if(page.manga){
		$body.classList.add('page-manga');
		malType = 'manga';
	}

	/* Alphabetical list */
	if(page.alpha){
		$body.classList.add('page-alpha');
		containerElem = '.landscape-grid';
	}

	/* Alphabetical list all */
	if(page.alphaAll){
		$body.classList.add('page-alpha-all');
		containerElem = '.videos-column-container';
		targetElem = itemElem;
		titleElem = '.text-link';
	}

	/* Watch */
	if(page.watch){
		$body.classList.add('page-watch');
		if(!watchLinkAdded && settings.crOn){setWatch();}
	}

	/* Single page */
	if(page.single){
		$body.classList.add('page-single');
		if(page.singleAnime){
			$body.classList.add('page-single-anime');
		}else if(page.singleManga){
			$body.classList.add('page-single-manga');
			malType = 'manga';
		}

		if(!singleLinkAdded && settings.crOn){setSingle();}

	}else if(!page.watch && !listLinksAdded && settings.crOn){
		setLinks();
	}

	checkLightbox();
}

/* MAL list links */
function setLinks(){
	listLinksAdded = true;

	var container = $(containerElem);
	var items = container.querySelectorAll(itemElem+':not(.'+itemAddedClass+')');
	if(!container || !items){return false;}

	for(var i=0; i<items.length; i++){
		var title = items[i].querySelector(titleElem).textContent.trim();
		if(title){
			var $link = document.createElement('a');
				$link.classList.add('mcl-link');
				$link.href = 'https://myanimelist.net/'+malType+'.php?q='+encodeURIComponent(title);
				$link.target = '_blank';
				$link.title = 'Search MyAnimeList for - '+title;
			var $linkTxtNode = document.createTextNode('MyAnimeList');
				$link.appendChild($linkTxtNode);

			$link.addEventListener('click',function(e){
				if(settings.crLightbox && lightboxReady){
					e.preventDefault();
						toggleLightbox(this.href);
					return false;
				}
			});

			var target = items[i];
			if(targetElem != itemElem){
				target = items[i].querySelector(targetElem);
			}
			target.appendChild($link);
			items[i].classList.add(itemAddedClass);
		}
	}

	/* Mutation Observer for new items being added via ajax */
	if(!loadMoreButton){
		return false;
	}else if(!observer){
		observer = new MutationObserver(function(mutations){
			setLinks();

			if(!$('a.load-more')){
				observer.disconnect();
			}
		});
		observer.observe(container, {childList: true});
	}
}

/* MAL single link */
function setSingle(){
	singleLinkAdded = true;

	var container = $('#container h1');
	var title = container.textContent.trim();
	if(!title){return false;}

	var $link = document.createElement('a');
		$link.classList.add('mcl-link');
		$link.href = 'https://myanimelist.net/'+malType+'.php?q='+encodeURIComponent(title);
		$link.target = '_blank';
		$link.title = 'Search MyAnimeList for - '+title;
	var $linkTxtNode = document.createTextNode('MyAnimeList');
		$link.appendChild($linkTxtNode);

	$link.addEventListener('click',function(e){
		if(settings.crLightbox && lightboxReady){
			e.preventDefault();
				toggleLightbox(this.href);
			return false;
		}
	});

	container.appendChild($link);
}

/* MAL watch page link */
function setWatch(){
	watchLinkAdded = true;

	var container = $('.showmedia-submenu');
	var title = $('.showmedia-header h1 .text-link span') || $('#showmedia_about_episode_num a.text-link');
	if(title && title.textContent){
		title = title.textContent.trim();
	}else{
		return false;
	}

	var $link = document.createElement('a');
		$link.classList.add('mcl-link');
		$link.href = 'https://myanimelist.net/anime.php?q='+encodeURIComponent(title);
		$link.target = '_blank';
		$link.title = 'Search MyAnimeList for - '+title;
	var $linkTxtNode = document.createTextNode('MyAnimeList');
		$link.appendChild($linkTxtNode);

	$link.addEventListener('click',function(e){
		if(settings.crLightbox && lightboxReady){
			e.preventDefault();
				toggleLightbox(this.href);
			return false;
		}
	});

	container.insertBefore($link, container.firstChild);
}


chrome.storage.sync.get(
	settings,
	function(results){
		if(settings != results){
			settings = results;
		}

		if(!pageInit){
			init();
		}
	}
);
