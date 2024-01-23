const mainScript = () => {
    const lenis = new Lenis({
        lerp: false,
        duration: 1.6
    })
    function raf(time) {
        lenis.raf(time)
        requestAnimationFrame(raf)
    }
    
    requestAnimationFrame(raf)

    //Utils
    const lerp = (a,b,t = 0.08) => {
        return a + (b - a) * t;
    }
    let pointer = {x: $(window).width()/2, y: $(window).height()/2};
    $(window).on('pointermove', function(e) {
        pointer.x = e.clientX;
        pointer.y = e.clientY;
    })
    const pointerCurr = () => {
        return pointer
    }
    const parseRem = (input) => {
        return input / 10 * parseFloat($('html').css('font-size'))
    }
    const xSetter = (el) => gsap.quickSetter(el, 'x', `px`);
    const ySetter = (el) => gsap.quickSetter(el, 'y', `px`);
    const rotXSetter = (el) => gsap.quickSetter(el, 'rotateY', `deg`);
    const rotYSetter = (el) => gsap.quickSetter(el, 'rotateX', `deg`);
    const rotZSetter = (el) => gsap.quickSetter(el, 'rotateZ', `deg`);

    const xGetter = (el) => gsap.getProperty(el, 'x')
    const yGetter = (el) => gsap.getProperty(el, 'y')
    const rotXGetter = (el) => gsap.getProperty(el, 'rotateY')
    const rotYGetter = (el) => gsap.getProperty(el, 'rotateX')
    const rotZGetter = (el) => gsap.getProperty(el, 'rotateZ')

    function debounce(func, delay = 100){
        let timer;
        return function(event) {
            if (timer) clearTimeout(timer);
            timer = setTimeout(func, delay, event);
        };
    }
    let typeOpts = {
        lines: { type: 'lines', linesClass: 'g-lines'},
        words: { type: 'words,lines', linesClass: 'g-lines'},
        chars: { type: 'chars,words,lines', linesClass: 'g-lines'}
    };
    let gOpts = {
        ease: 'power2.easeOut',
    };
    const activeIndex = (el, currIdx) => {
        el.removeClass('active')
        el.eq(currIdx).addClass('active')
    }
    const stickAndPan = (el, speed) => {
        let parent = $(el).find('[data-sap="parent"]')
        let target = $(el).find('[data-sap="target"]')

        parent.css('height', ' ' + $(window).outerHeight() + 'px')
    }

    $('.layout-css').addClass('hidden')

    const SCRIPT = [];

    SCRIPT.home = {
        namespace: 'home',
        afterEnter() {
            console.log("Enter Home");
            function homeTesti() {
                $('.testi-popup').css('top', ' ' + ($(window).outerHeight() - $('.testi-popup').outerHeight())/2 + 'px')

                $('[data-swiper="swiper"]').addClass('swiper')
                $('[data-swiper="wrapper"]').addClass('swiper-wrapper')
                $('[data-swiper="slide"]').addClass('swiper-slide')
        
                const popupEl = $('.testi-popup')
                const sliderParent = $('.testi-slider')
                
                let sliderSwiper
                let sliderStatus
                let thumbSwiper
                let thumbStatus
        
                const popup = {
                    open: (el) => {
                        lenis.stop()
                        popupEl.addClass('active')
                        swiper.init(el)
                        swiper.updateSwiper(el)
                    },
                    close: (el) => {
                        lenis.start()
                        popupEl.removeClass('active')
                        $('.testi-slider-item').slice(1).remove();
                        $('.testi-thumb-item').slice(1).remove();
                    },
                }
                const swiper = {
                    init: (el) => {
                        if (sliderStatus !== 'initialized' && thumbStatus !== 'initialized') {
                            sliderSwiper = new Swiper('[data-slider]', {
                                slidesPerView: 'auto',
                                watchSlidesProgress: true,
                                allowTouchMove: true,
                                on: {
                                    init: function() {
                                        sliderStatus = 'initialized'
                                        console.log('init sliderSwiper');
                                    }
                                }
                            })
                            thumbSwiper = new Swiper('[data-thumb]', {
                                slidesPerView: 1,
                                centeredSlides: true,
                                effect: 'fade',
                                fadeEffect: {
                                    crossFade: true,
                                },
                                speed: 700,
                                thumbs: {
                                    swiper: sliderSwiper,
                                },
                                on: {
                                    init: function() {
                                        thumbStatus = 'initialized'
                                        console.log('init thumbSwiper');
                                    }
                                }
                            })
                        }
                    },
                    updateSwiper: (el) => {
                        for (let i = 0; i <= $(el).find('img').length; i++) {
                            popupEl.find('[data-popup-img-wrap] img').eq(i).attr('src', $(el).find('img').eq(i).attr('src'))
                        }
        
                        for (let i = 0; i < $('[data-popup-img-wrap] img').length; i++) {
                            let slideCloner = $('.testi-slider-item').eq(0).clone()
                            slideCloner.find('img').attr('src', $('[data-popup-img-wrap] img').eq(i).attr('src'))
        
                            let thumbCloner = $('.testi-thumb-item').eq(0).clone()
                            thumbCloner.find('img').attr('src', $('[data-popup-img-wrap] img').eq(i).attr('src'))
        
                            $('.testi-slider-list').append(slideCloner)
                            $('.testi-thumb-list').append(thumbCloner)
                        }
                        $('.testi-slider-item').eq(0).remove()
                        $('.testi-thumb-item').eq(0).remove()
        
                        sliderSwiper.update()
                        thumbSwiper.update()
                    },
                    open: (idx) => {
                        console.log(idx);
                        thumbSwiper.slideTo(idx, 400)
                        $('.testi-slider').addClass('active')
                    }
                }
                
                $('.home-testi .testi-item .testi-img-wrapper').on('click', function(e) {
                    e.preventDefault()
                    if (!popupEl.hasClass('active')) {
                        requestAnimationFrame(() => popup.open(this))
                    }
                })
                $(window).on('click', function(e) {
                    e.preventDefault()
                    if(!$('.testi-popup').hasClass('active')) return;
                    if (!$('.testi-popup:hover').length && !$('.testi-slider:hover').length) {
                        popup.close()
                    }
                })
        
                popupEl.find('.testi-popup-info-img img').on('click', function(e) {
                    e.preventDefault()
                    swiper.open($('.testi-popup-info-img img').index(this))
                })
        
                sliderParent.on('click', function(e) {
                    e.preventDefault()
                    if (!$(this).find('[data-swiper="swiper"]:hover').length) {
                        $('.testi-slider').removeClass('active')
                    }
                })

                // console.log($('.testi-list').outerWidth());
            }
            homeTesti()
        },
        beforeLeave() {
            sliderSwiper.destroy()
            thumbSwiper.destroy()
        }
    }
    SCRIPT.about = {
        namespace: 'about',
        afterEnter() {
            console.log("Enter About");
        },
        beforeLeave() {

        }
    }

    const VIEWS = [
        SCRIPT.home,
        SCRIPT.about,
    ]

    barba.init({
        transitions: [{
            name: 'opacity-transition',
            sync: true,
            leave(data) {

            },
            enter(data) {
                lenis.start()
                lenis.scrollTo(0, {
                    force: true,
                    immediate: true
                })
            },
            once(data) {
                
            },
            beforeLeave() {

            },
        }],
        views: VIEWS
    })
}

window.onload = mainScript;