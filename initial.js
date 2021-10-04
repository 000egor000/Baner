"use strict"
window.onload = function () {
    /**
     * Enabler
     */
    if (Enabler.isInitialized()) {
        init()
    } else {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, init)
    }


    /**
     * Setting Dynamic Profile Id
     */
    function init() {
        if (Enabler.isPageLoaded()) {
            Enabler.setProfileId(10675274)
            politeInit()
        } else {
            Enabler.setProfileId(10675274)
            Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, politeInit)
        }
    }

    async function politeInit() {
        const select = (s) => document.querySelector(s)
        const selectAll = (s) => document.querySelectorAll(s)
        
        
        /**
         * Exit 
         */
        let clickable = selectAll(".clickable")
        clickable.forEach(element => element.addEventListener("click", function (e) {
            Enabler.exit('Exit')
            return false
        }, false))


        /**
         * Set dynamic
         */
        const dc = dynamicContent
        const cta = select('#cta')
        const ctaback = select('#ctaback')
        const text1 = select('#text1')
        const text2 = select('#text2')
        const text3 = select('#text3')
        text1.innerHTML = dc.Image[0].slogan;
        text2.innerHTML = dc.Headline[0].headline;
        text3.innerHTML = dc.Subheadline[0].subheadline;
        cta.innerHTML = ctaback.innerHTML = dc.Cta[0].cta;
        
        
        /**
         * Preloading images
         */
        const imagesCont = select('#images')
        const imagesSrc = [{
            name: 'imgBg',
            src: dc.Image[0].billboard_image.Url
        }]

        for (let i = 0; i < imagesSrc.length; i++) {
            const imgDiv = document.createElement('div')

            imgDiv.classList.add('img')
            imgDiv.style.background = `url('${imagesSrc[i].src}') no-repeat`
            imgDiv.style.backgroundSize = "cover"
            imgDiv.style.backgroundPosition = "50% 54%"
            imagesCont.append(imgDiv)
        }

        const loadImages = async (srcsArr) => {
            const imagesArr = await Promise.all(srcsArr.map((img) => {
                return new Promise((resolve) => {
                    const image = new Image()

                    image.nameImg = img.name
                    image.src = img.src
                    image.onload = () => resolve(image)
                })
            }))

            const images = imagesArr.reduce((acc, img) => {
                acc[img.nameImg] = img
                return acc
            }, {})

            return images
        }

        await loadImages(imagesSrc)    
        


        /**
         * Animatimg
         */
        const tl = gsap.timeline()
        const wrect = select('#wrect')
        const logo = select('#logo')
        const ctawrap = select('#ctawrap')
        const ctas = selectAll('.cta')
        const headlinesSplitted = []
        const subheadlinesSplitted = []

        ctawrap.style.width = 60 + Math.floor(ctaback.innerHTML.length*6.3) + "px";

        /**
         * Splitting texts
         */        

        
        headlinesSplitted.push(new SplitText(text1, {type:"words, lines", linesClass:"slanted"}))
        subheadlinesSplitted.push(new SplitText(text2, {type:"words, lines", linesClass:"slanted"}))
        
    

        /**
         * Animatimg
         */
                
        gsap.set(ctas, {backfaceVisibility:"hidden"});
        gsap.set(ctaback, {rotationY:-180});
        gsap.set(ctawrap, {perspective:300});
        gsap.set(ctas, {transformStyle:"preserve-3d"});
                
        tl
        .to(wrect, {duration:0.7, alpha:0, ease:"none"})
        .from(logo, {duration:0.7, rotationX:90, force3D:true, rotation:0.01, ease:"back"}, "<0.5")
                
        //slogan            
        .from(headlinesSplitted[0].words[0], {duration:0.7, x:"+=70", force3D:true, rotation:0.01, alpha:0, ease:"back"}, ">-0.3")
        .from(headlinesSplitted[0].words[2], {duration:0.7, y:"+=20", force3D:true, rotation:0.01, alpha:0, ease:"back"}, "<")
        .from(headlinesSplitted[0].words[1], {duration:0.7, scale:0, ease:"back"}, "<")

        //headline
        .from(subheadlinesSplitted[0].words, {duration:0.7, stagger:0.2, autoAlpha:0, x:"+=50", ease:"power2"}, ">0.1")
        
        //subheadline
        .from(text3, {duration:1.2, stagger:0.3, rotationX:90, force3D:true, rotation:0.01, ease:"back"}, ">0.1")
            
        //cta
        .from(ctawrap, {duration:0.7, alpha:0, ease:"none"}, ">-0.8")
        .to(ctas, {duration:2, rotationY:"+=360", ease:"back.inOut", repeat:3, repeatDelay:4}, "<-0.8")

    }
}
   
        
        