$(function () {
   var ua = window.navigator.userAgent;
   var msie = ua.indexOf("MSIE ");
   var isMobile = { Android: function () { return navigator.userAgent.match(/Android/i); }, BlackBerry: function () { return navigator.userAgent.match(/BlackBerry/i); }, iOS: function () { return navigator.userAgent.match(/iPhone|iPad|iPod/i); }, Opera: function () { return navigator.userAgent.match(/Opera Mini/i); }, Windows: function () { return navigator.userAgent.match(/IEMobile/i); }, any: function () { return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows()); } };

   function isIE() {
      ua = navigator.userAgent;
      var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
      return is_ie;
   }

   if (isIE()) {
      document.querySelector('html').classList.add('ie');
   }

   if (isMobile.any()) {
      document.querySelector('html').classList.add('_touch');
   }

   // Липкая кнопка
   $('body').append('<div class="upbtn"></div>');
   $(window).scroll(function () {
      if ($(this).scrollTop() > 100) {
         $('.upbtn').css({
            bottom: '15px'
         });
      } else {
         $('.upbtn').css({
            bottom: '-80px'
         });
      }
   });
   $('.upbtn').on('click', function () {
      $('html, body').animate({
         scrollTop: 0
      }, 500);
      return false;
   });

   //icon-menu................
   window.addEventListener("load", function () {
      if (document.querySelector('.wrapper')) {
         setTimeout(function () {
            document.querySelector('.wrapper').classList.add('_loaded');
         }, 0);
      }
   });
   let unlock = true;

   //icon-menu
   let iconMenu = document.querySelector(".icon-menu");
   if (iconMenu != null) {
      let delay = 500;
      let menuBody = document.querySelector(".menu__body");
      iconMenu.addEventListener("click", function (e) {
         if (unlock) {
            body_lock(delay);
            iconMenu.classList.toggle("_active");
            menuBody.classList.toggle("_active");
         }
      });
   };
   function menu_close() {
      let iconMenu = document.querySelector(".icon-menu");
      let menuBody = document.querySelector(".menu__body");
      iconMenu.classList.remove("_active");
      menuBody.classList.remove("_active");
   }

   //.icon-menu
   function body_lock(delay) {
      let body = document.querySelector("body");
      if (body.classList.contains('_lock')) {
         body_lock_remove(delay);
      } else {
         body_lock_add(delay);
      }
   }
   function body_lock_remove(delay) {
      let body = document.querySelector("body");
      if (unlock) {
         let lock_padding = document.querySelectorAll("._lp");
         setTimeout(() => {
            for (let index = 0; index < lock_padding.length; index++) {
               const el = lock_padding[index];
               el.style.paddingRight = '0px';
            }
            body.style.paddingRight = '0px';
            body.classList.remove("_lock");
         }, delay);

         unlock = false;
         setTimeout(function () {
            unlock = true;
         }, delay);
      }
   }
   function body_lock_add(delay) {
      let body = document.querySelector("body");
      if (unlock) {
         let lock_padding = document.querySelectorAll("._lp");
         for (let index = 0; index < lock_padding.length; index++) {
            const el = lock_padding[index];
            el.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
         }
         body.style.paddingRight = window.innerWidth - document.querySelector('.wrapper').offsetWidth + 'px';
         body.classList.add("_lock");

         unlock = false;
         setTimeout(function () {
            unlock = true;
         }, delay);
      }
   }

   //icon-menu
   window.onload = function () {
      document.addEventListener("click", documentActions);

      function documentActions(e) {
         const targetElement = e.target;
         if (window.innerWidth > 768 && isMobile.any()) {
            if (targetElement.classList.contains('menu__arrow')) {
               targetElement.closest('.menu__item').classList.toggle('_hover');
            }
            if (!targetElement.closest('.menu__item') && document.querySelectorAll('.menu__item._hover').length > 0) {
               _removeClasses(document.querySelectorAll('.menu__item._hover'), "_hover");
            }
         }
      }
   }


   // SPOLLERS .icon-menu
   const spollersArray = document.querySelectorAll('[data-spollers]');
   if (spollersArray.length > 0) {
      const spollersRegular = Array.from(spollersArray).filter(function (item, index, self) {
         return !item.dataset.spollers.split(",")[0];
      });
      if (spollersRegular.length > 0) {
         initSpollers(spollersRegular);
      }

      const spollersMedia = Array.from(spollersArray).filter(function (item, index, self) {
         return item.dataset.spollers.split(",")[0];
      });

      if (spollersMedia.length > 0) {
         const breakpointsArray = [];
         spollersMedia.forEach(item => {
            const params = item.dataset.spollers;
            const breakpoint = {};
            const paramsArray = params.split(",");
            breakpoint.value = paramsArray[0];
            breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
            breakpoint.item = item;
            breakpointsArray.push(breakpoint);
         });

         let mediaQueries = breakpointsArray.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
         });
         mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
         });

         mediaQueries.forEach(breakpoint => {
            const paramsArray = breakpoint.split(",");
            const mediaBreakpoint = paramsArray[1];
            const mediaType = paramsArray[2];
            const matchMedia = window.matchMedia(paramsArray[0]);

            const spollersArray = breakpointsArray.filter(function (item) {
               if (item.value === mediaBreakpoint && item.type === mediaType) {
                  return true;
               }
            });

            matchMedia.addListener(function () {
               initSpollers(spollersArray, matchMedia);
            });
            initSpollers(spollersArray, matchMedia);
         });
      }

      function initSpollers(spollersArray, matchMedia = false) {
         spollersArray.forEach(spollersBlock => {
            spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
            if (matchMedia.matches || !matchMedia) {
               spollersBlock.classList.add('_init');
               initSpollerBody(spollersBlock);
               spollersBlock.addEventListener("click", setSpollerAction);
            } else {
               spollersBlock.classList.remove('_init');
               initSpollerBody(spollersBlock, false);
               spollersBlock.removeEventListener("click", setSpollerAction);
            }
         });
      }

      function initSpollerBody(spollersBlock, hideSpollerBody = true) {
         const spollerTitles = spollersBlock.querySelectorAll('[data-spoller]');
         if (spollerTitles.length > 0) {
            spollerTitles.forEach(spollerTitle => {
               if (hideSpollerBody) {
                  spollerTitle.removeAttribute('tabindex');
                  if (!spollerTitle.classList.contains('_active')) {
                     spollerTitle.nextElementSibling.hidden = true;
                  }
               } else {
                  spollerTitle.setAttribute('tabindex', '-1');
                  spollerTitle.nextElementSibling.hidden = false;
               }
            });
         }
      }
      function setSpollerAction(e) {
         const el = e.target;
         if (el.hasAttribute('data-spoller') || el.closest('[data-spoller]')) {
            const spollerTitle = el.hasAttribute('data-spoller') ? el : el.closest('[data-spoller]');
            const spollersBlock = spollerTitle.closest('[data-spollers]');
            const oneSpoller = spollersBlock.hasAttribute('data-one-spoller') ? true : false;
            if (!spollersBlock.querySelectorAll('._slide').length) {
               if (oneSpoller && !spollerTitle.classList.contains('_active')) {
                  hideSpollersBody(spollersBlock);
               }
               spollerTitle.classList.toggle('_active');
               _slideToggle(spollerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
         }
      }
      function hideSpollersBody(spollersBlock) {
         const spollerActiveTitle = spollersBlock.querySelector('[data-spoller]._active');
         if (spollerActiveTitle) {
            spollerActiveTitle.classList.remove('_active');
            _slideUp(spollerActiveTitle.nextElementSibling, 500);
         }
      }
   }

   let _slideUp = (target, duration = 500) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         target.style.transitionProperty = 'height, margin, padding';
         target.style.transitionDuration = duration + 'ms';
         target.style.height = target.offsetHeight + 'px';
         target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = 0;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideDown = (target, duration = 500) => {
      if (!target.classList.contains('_slide')) {
         target.classList.add('_slide');
         if (target.hidden) {
            target.hidden = false;
         }
         let height = target.offsetHeight;
         target.style.overflow = 'hidden';
         target.style.height = 0;
         target.style.paddingTop = 0;
         target.style.paddingBottom = 0;
         target.style.marginTop = 0;
         target.style.marginBottom = 0;
         target.offsetHeight;
         target.style.transitionProperty = "height, margin, padding";
         target.style.transitionDuration = duration + 'ms';
         target.style.height = height + 'px';
         target.style.removeProperty('padding-top');
         target.style.removeProperty('padding-bottom');
         target.style.removeProperty('margin-top');
         target.style.removeProperty('margin-bottom');
         window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
         }, duration);
      }
   }
   let _slideToggle = (target, duration = 500) => {
      if (target.hidden) {
         return _slideDown(target, duration);
      } else {
         return _slideUp(target, duration);
      }
   };


   // Слайдер slide-services
   $(".slide-services__thumb").slick({
      asNavFor: ".slide-services__big",
      focusOnSelect: true,
      slidesToShow: 8,
      slidesToScroll: 1,
      vertical: true,
      draggable: false,
      infinite: false,
      centerMode: true,
      centerPadding: '0',
      arrows: false,
   });

   $(".slide-services__big").slick({
      draggable: false,
      arrows: false,
      infinite: false,
      asNavFor: ".slide-services__thumb",
      responsive: [
         {
            breakpoint: 1200,
            settings: {
               dots: true,
               draggable: true,
            }
         },
      ]
   });
   //


   // Слайдер reviews-slider
   $('.reviews-slider').slick({
      centerMode: true,
      centerPadding: '0',
      slidesToShow: 3,
      dots: false,
      focusOnSelect: true,
      prevArrow:
         '<button class="slick-prev"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-left" class="svg-inline--fa fa-chevron-left fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M34.52 239.03L228.87 44.69c9.37-9.37 24.57-9.37 33.94 0l22.67 22.67c9.36 9.36 9.37 24.52.04 33.9L131.49 256l154.02 154.75c9.34 9.38 9.32 24.54-.04 33.9l-22.67 22.67c-9.37 9.37-24.57 9.37-33.94 0L34.52 272.97c-9.37-9.37-9.37-24.57 0-33.94z"></path></svg></button>',
      nextArrow:
         '<button class="slick-next"><svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="chevron-right" class="svg-inline--fa fa-chevron-right fa-w-10" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"></path></svg></button>',
      responsive: [
         {
            breakpoint: 1200,
            settings: {
               slidesToShow: 2,
               arrows: false,
               dots: true,
            },
         },
         {
            breakpoint: 768,
            settings: {
               slidesToShow: 1,
               arrows: false,
               dots: true,
               draggable: true,
            },
         },
      ],
   });
   //

   // Слайдер stories__slider
   $('.stories__slider').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
   });

});
