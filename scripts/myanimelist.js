/* Global variables */
	site = 'mal';
	malType = 'm'; // "m" for Anime, "mg" for Manga
	var crFallbackURL;

function init(){
	pageInit = true;

	/*
		Page type -
		MyAnimeList doesn't specify a unique class-name or ID to each type of page
		Yes I spent almost a full day writing this, no thank you what so ever!!!
	*/
	page.home = $('body.index');

	page.list = pageUrl.indexOf('/animelist/') != -1 || pageUrl.indexOf('/mangalist/') != -1;
	page.listAnime = pageUrl.indexOf('/animelist/') != -1;
	page.listManga = pageUrl.indexOf('/mangalist/') != -1;

	page.people = pageUrl.indexOf('/people/') != -1 && $('#horiznav_nav ul li:first-child a.horiznav_active');

	page.reviews = (pageUrl.indexOf('reviews.php') != -1 || (pageUrl.indexOf('/profile/') != -1 && $('.horiznav_active[href*="/reviews"]'))) && pageUrl.indexOf('?st=mosthelpful') == -1;
	page.reviewsAnime = (page.reviews && $('#horiznav_nav') && $('a.horiznav_active[href="?t=anime"]')) || (page.reviews && $('small').textContent == '(Anime)');
	page.reviewsManga = (page.reviews && $('#horiznav_nav') && $('a.horiznav_active[href="?t=manga"]')) || (page.reviews && $('small').textContent == '(Manga)');
	page.reviewsUser = page.reviews && (pageUrl.indexOf('/profile/') != -1 && $('.horiznav_active[href*="/reviews"]'));

	page.recommendations = (pageUrl.indexOf('recommendations.php') != -1 || (pageUrl.indexOf('/profile/') != -1 && $('.horiznav_active[href*="/recommendations"]'))) && pageUrl.indexOf('?s=userrecs') == -1;
	page.recommendationsAnime =  page.recommendations && pageUrl.indexOf('t=anime') != -1;
	page.recommendationsManga = page.recommendations && pageUrl.indexOf('t=manga') != -1;
	page.recommendationsUser = page.recommendations && (pageUrl.indexOf('/profile/') != -1 && $('.horiznav_active[href*="/recommendations"]'));

	page.top = pageUrl.indexOf('topanime.php') != -1 || pageUrl.indexOf('topmanga.php') != -1;
	page.topAnime = pageUrl.indexOf('topanime.php') != -1;
	page.topManga = pageUrl.indexOf('topmanga.php') != -1;

	page.seasonal = pageUrl.indexOf('/season') != -1 && $('body.season');
	page.watch = pageUrl.indexOf('/watch') != -1 && $('body.watch .watch-anime-list.watch-video');
	page.stream = pageUrl.indexOf('/watch') != -1 && $('body.watch .watch-anime-list .watch-anime');

	page.category = (pageUrl.indexOf('/anime/') != -1 || pageUrl.indexOf('/manga/') != -1) && $('body.anime-filter');
	page.categoryAnime = page.category && pageUrl.indexOf('/anime/') != -1;
	page.categoryManga = page.category && pageUrl.indexOf('/manga/') != -1;

	page.search = (pageUrl.indexOf('anime.php?q=') != -1 || pageUrl.indexOf('manga.php?q=') != -1) || $('#advancedsearch');

	page.single = (pageUrl.indexOf('/anime/') != -1 || pageUrl.indexOf('/anime.php?id=') != -1 || pageUrl.indexOf('/manga/') != -1 || pageUrl.indexOf('/manga.php?id=') != -1) && ($('#contentWrapper[itemtype*="Product"]') || $('#contentWrapper[itemtype*="TVSeries"]'));
	page.singleAnime = (page.single && pageUrl.indexOf('/anime/') != -1) || (page.single && pageUrl.indexOf('/anime.php?id=') != -1);
	page.singleManga = (page.single && pageUrl.indexOf('/manga/') != -1) || (page.single && pageUrl.indexOf('/manga.php?id=') != -1);
	page.singleWatch = page.single && $('#contentWrapper[itemtype*="TVSeries"]');

	/* If page isn't supported */
	checkPage();
	if(!allowedPage){
		//console.log('We do not modify this page.');
		return false;
	}else{
		//console.log('We do modify this page.');
	}

	/* Home page */
	if(page.home){
		$body.classList.add('page-home');
	}

	/* List page */
	if(page.list){
		$body.classList.add('page-list');
	}
		/* List anime page */
		if(page.listAnime){
			$body.classList.add('page-list-anime');
		}
		/* List manga page */
		if(page.listManga){
			$body.classList.add('page-list-manga');
			malType = 'mg';
		}

	/* People page */
	if(page.people){
		$body.classList.add('page-people');
	}

	/* Reviews page */
	if(page.reviews){
		$body.classList.add('page-reviews');
	}
		/* Reviews anime page */
		if(page.reviewsAnime){
			$body.classList.add('page-reviews-anime');
		}
		/* Reviews manga page */
		if(page.reviewsManga){
			$body.classList.add('page-reviews-manga');
			malType = 'mg';
		}
		/* Reviews user page */
		if(page.reviewsUser){
			$body.classList.add('page-reviews-user');
		}

	/* Recommendations page */
	if(page.recommendations){
		$body.classList.add('page-recommendations');
	}
		/* Recommendations anime page */
		if(page.recommendationsAnime){
			$body.classList.add('page-recommendations-anime');
		}
		/* Recommendations manga page */
		if(page.recommendationsManga){
			$body.classList.add('page-recommendations-manga');
			malType = 'mg';
		}
		/* Recommendations user page */
		if(page.recommendationsUser){
			$body.classList.add('page-recommendations-user');
		}

	/* Top page */
	if(page.top){
		$body.classList.add('page-top');
	}
		/* Top anime page */
		if(page.topAnime){
			$body.classList.add('page-top-anime');
		}
		/* Top manga page */
		if(page.topManga){
			$body.classList.add('page-top-manga');
			malType = 'mg';
		}

	/* Seasonal page */
	if(page.seasonal){
		$body.classList.add('page-seasonal');
	}

	/* Watch page */
	if(page.watch){
		$body.classList.add('page-watch');
	}

	/* Stream page */
	if(page.stream){
		$body.classList.add('page-stream');
	}

	/* Category page */
	if(page.category){
		$body.classList.add('page-category');
	}
		/* Category anime page */
		if(page.categoryAnime){
			$body.classList.add('page-category-anime');
		}
		/* Category manga page */
		if(page.categoryManga){
			$body.classList.add('page-category-manga');
			malType = 'mg';
		}

	/* Search page */
	if(page.search){
		$body.classList.add('page-search');
		if(settings.crSearch){modifySearchInIframe();}
	}

	/* Single page */
	if(page.single){
		$body.classList.add('page-single');
		/* Single anime page */
		if(page.singleAnime){
			$body.classList.add('page-single-anime');
		}
		/* Single manga page */
		if(page.singleManga){
			$body.classList.add('page-single-manga');
			malType = 'mg';
		}
		/* Single watch page */
		if(page.singleWatch){
			$body.classList.add('page-single-watch');
		}

		if(!singleLinkAdded && settings.malOn){setSingle();}
	}

	if(!listLinksAdded && settings.malOn){setLinks();}

	checkLightbox();
}

/* MAL list links */
function setLinks(){
	listLinksAdded = true;

	var items = document.querySelectorAll('a.Lightbox_AddEdit:not(.'+itemAddedClass+'), .page-list #list_surround a.List_LightBox:not(.'+itemAddedClass+'), .page-list .list-table .edit a.List_LightBox:not(.'+itemAddedClass+')');
	if(!items){return false;}

	for(var i=0; i<items.length; i++){
		var itemType = 'anime';
		if(page.listManga || items[i].href.indexOf('?go=addmanga') != -1){
			itemType = 'manga';
			malType = 'mg';
		}
		var itemID = items[i].href;
			if(itemID.indexOf('id=') != -1){
				itemID = itemID.split('id=')[1].split('&')[0];
			}else if(page.list){
				itemID = itemID.split('/edit?')[0].split('/').pop();
			}

		var itemTitleElem;
		var itemTitle;
			if(itemID){
				itemTitleElem =
					$('.page-watch .watch-anime-list a.mr4[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-people td > a[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-home .widget.popular_ranking .ranking-unit a.title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-home .widget.upcoming_ranking .ranking-unit a.title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-home .widget.airing_ranking .ranking-unit a.title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-home .widget.reviews a[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('.page-home .widget.recommendations a[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('.page-reviews a.hoverinfo_trigger[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('.page-recommendations a[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('.page-top .detail a.hoverinfo_trigger[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-seasonal .title-text a.link-title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-category .title-text a.link-title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-search a.hoverinfo_trigger[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('.page-list .data.title a.link[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.page-list a.animetitle[href*="/'+itemType+'/'+itemID+'/"] span') ||
					$('a[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('a[href*="/'+itemType+'.php?id='+itemID+'"] strong') ||
					$('a.title[href*="/'+itemType+'/'+itemID+'/"] strong') ||
					$('a.title[href*="/'+itemType+'.php?id='+itemID+'"] strong') ||
					$('.ranking-list .title .detail a[id="#area'+itemID+'"][href*="/'+itemType+'/'+itemID+'/"]') ||
					$('.ranking-list .title .detail a[id="#area'+itemID+'"][href*="/'+itemType+'.php?id='+itemID+'"]') ||
					$('a.title[href*="/'+itemType+'.php?id='+itemID+'"]') ||
					$('a[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('a.title[href*="/'+itemType+'/'+itemID+'/"]') ||
					$('a[href*="/'+itemType+'.php?id='+itemID+'"]');

				if(itemTitleElem && itemTitleElem.textContent.length){
					itemTitle = itemTitleElem.textContent.trim();
				}
			}

		if(itemTitle && itemTitle.length){
			var $link = document.createElement('a');
				$link.classList.add('mcl-link');
				$link.href = 'https://www.crunchyroll.com/search?q='+encodeURIComponent(itemTitle)+'&o='+malType;
				$link.target = '_blank';
				$link.title = 'Search Crunchyroll for - '+itemTitle;
				$link.setAttribute('data-mal-url','https://myanimelist.net/'+itemType+'/'+itemID);
				$link.setAttribute('data-cr-fallback-url','https://www.crunchyroll.com/search?q='+encodeURIComponent(itemTitle)+'&o='+malType);
				$link.setAttribute('data-mal-type',malType);
				$link.setAttribute('data-mal-id',itemID);
			var $linkTxtNode = document.createTextNode('Crunchyroll');
				$link.appendChild($linkTxtNode);

/*
			$link.addEventListener('click',function(e){
				if(settings.malLightbox && lightboxReady){
					e.preventDefault();
						crFallbackURL = this.getAttribute('data-cr-fallback-url');
						$body.classList.add(lbBodyClass);
						setTimeout(function(){$body.classList.add(lbBodyClass+'-overlay');},50);
						if(settings.malEnglish){
							getENtitle(this.getAttribute('data-mal-url'));
						}else{
							toggleLightbox(this.href);
						}
					return false;
				}
			});
*/

			var parent = items[i].parentNode;
			parent.classList.add('mcl-link-container');
			if(page.list){
				items[i].parentNode.insertBefore($link, items[i]);
			}else{
				items[i].parentNode.insertBefore($link, items[i].nextSibling);
			}

			items[i].classList.add(itemAddedClass);
		}
	}
}

/* MAL single link */
function setSingle(){
	singleLinkAdded = true;

	var container = $('.js-sns-icon-container');
	var itemTitle = document.querySelector('h1 span[itemprop="name"]').textContent.trim();
	var itemENtitle;
	var enTitleElem = document.querySelectorAll('span.dark_text');
	for(var i=0; i<enTitleElem.length; i++){
		if(enTitleElem[i].textContent.indexOf('English:') != -1){
			if(enTitleElem[i].nextSibling.textContent.length){
				itemENtitle = enTitleElem[i].nextSibling.textContent.trim();
			}
		}
	}

	if(!itemTitle){return false;}

	var $link = document.createElement('a');
		$link.classList.add('icon-social','mcl-link','mcl-link-main');
		$link.href = 'https://www.crunchyroll.com/search?q='+encodeURIComponent(itemTitle)+'&o='+malType;
		$link.setAttribute('data-jp-href',$link.href);
		if(itemENtitle){
			$link.setAttribute('data-en-href','https://www.crunchyroll.com/search?q='+encodeURIComponent(itemENtitle)+'&o='+malType);
		}
		$link.target = '_blank';
		$link.title = 'Search Crunchyroll for - '+itemTitle;
	var $linkTxtNode = document.createTextNode('Crunchyroll');
		$link.appendChild($linkTxtNode);

		$link.addEventListener('click',function(e){
			var enTitle = this.getAttribute('data-en-href');
			if(enTitle && settings.malEnglish){
				this.href = this.getAttribute('data-en-href');
			}else{
				this.href = this.getAttribute('data-jp-href');
			}
			/*
			if(settings.malLightbox && lightboxReady){
				e.preventDefault();
					toggleLightbox(this.href);
				return false;
			}
			*/
		});

	container.classList.add('mcl-link-container');
	container.insertBefore($link, container.firstChild);
}

/* Get the English title from single-page by URL using Ajax */
function getENtitle(malURL){
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function(){
		if(xhttp.readyState == 4 && xhttp.status == 200){
			var data = document.createElement('div');
				data.innerHTML = xhttp.responseText;

			var itemTitle = data.querySelector('h1 span[itemprop="name"]').textContent.trim();
			var enTitleElem = data.querySelectorAll('span.dark_text');

			for(var i=0; i<enTitleElem.length; i++){
				if(enTitleElem[i].textContent.indexOf('English:') != -1){
					if(enTitleElem[i].nextSibling.textContent.length){
						itemTitle = enTitleElem[i].nextSibling.textContent.trim();
					}
				}
			}
			var url = 'https://www.crunchyroll.com/search?q='+encodeURIComponent(itemTitle)+'&o='+malType;
			toggleLightbox(url);
		}else if(xhttp.status == 404){
			toggleLightbox(crFallbackURL);
		}
	}

	xhttp.open('GET', malURL, true);
	xhttp.send();
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


/* Search page modifications in iframe from crunchyrol */
function modifySearchInIframe(){
	var parentOrigin = location.ancestorOrigins[0],
		images = document.querySelectorAll('#content img[data-src]');

	if(parentOrigin && parentOrigin.indexOf('crunchyroll.com') != -1 && page.search && images.length > 1){
		malSearchModified = true;
	}else{
		return false;
	}

	$body.classList.add('mcl-mal-modify-search');

	/* Enlarge images */
	for(var i=0; i<images.length; i++){
		var imgSrc = images[i].getAttribute('data-src');
		var imgOriginalSrc;

		if(imgSrc.indexOf('/r/') != -1){
			imgOriginalSrc = imgSrc;
			imgSrc = imgSrc.split('/r/');
			imgSrc = imgSrc[0]+'/images/'+imgSrc[1].split('/images/')[1];
		}

		images[i].setAttribute('data-small',imgOriginalSrc);
		images[i].setAttribute('data-big',imgSrc);
		images[i].setAttribute('data-src',imgSrc);
		images[i].removeAttribute('data-srcset');
		images[i].removeAttribute('srcset');
		images[i].src = imgSrc;
	}
}
