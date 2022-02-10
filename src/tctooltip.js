function tctooltip(options){
    let defaultOptions = {
        trigger:'tooltip',
        container:'tctooltip-box',
        content:'tctooltip-content',
        position:'cursor',
        skew:'default',
        cssOuter:{},
        cssInner:{},
        openDelay:0,
        closeDelay:0,
        effectSpeed:500,
        slide:true,
        slideAmount:'6px',
        fade:true
    };
    let defaultOuterCss = {
        padding:'3px',
        'background-color':'transparent',
        'z-index':1000,
        opacity:'0',
        display:'inline-block',
        position:'absolute'
    }
    let defaultInnerCss = {
        padding:'8px',
        'background-color':'#000',
        color:'#fff',
        'font-size':'12px',
        'font-family':'arial, sans-serif',
        'text-align':'left',
        'border-radius':'8px',
        opacity:'1',
        'box-sizing':'border-box',
        display:'inline-block',
        position:'relative',
        top:'0px',
        bottom:'0px',
        left:'0px',
        right:'0px'
    };
    options = {...defaultOptions, ...options};
    this.init = function(){
        let trigger = document.querySelectorAll('.'+options.trigger);
        this.settings = [];
        trigger.forEach((element, i) => {
            settings[i] = {
                boxIsOpen:false,
                mouseIsOver:false,
                mouseOverBox:false,
                animationOn:false,
                theBox:'',
                openTimer:'',
                closeTimer:'',
                fadeTimer:'',
                moveTimer:'',
                titleContent:'',
                trigger:element,
                reposition:options.position
            }
            attachEvents(element, i);
        })
    }
    

    this.attachEvents = function(trigger, i){
        trigger.addEventListener('mouseenter',function(){
            if(settings[i].boxIsOpen){
                effects.fadeIn(i);
                effects.slideIn(i);
                stopClosing(i);
                return;
            }
            getTitleContent(trigger, i);
            if(options.position === 'cursor'){
                return;
            }
            settings[i].openTimer = setTimeout(function(){
                settings[i].theBox = createTooltipBox(i);
                fillTitleContent(settings[i].theBox.querySelector('.'+options.content), i);
                placeTooltipBox(settings[i].theBox, trigger, i);
                effects.fadeIn(i);
                effects.slideIn(i);
            }, options.openDelay);
            
        })
        trigger.addEventListener('mouseleave',function(){
            if(!settings[i].boxIsOpen){
                replaceTitleContent(i);
                clearTimeout(settings[i].openTimer);
                clearTimeout(settings[i].moveTimer);
                return;
            }
            removeBoxOnTimer(settings[i].theBox, i);
        })
        trigger.addEventListener('mousemove',function(e){
            if(settings[i].boxIsOpen || options.position != 'cursor'){
                return;
            }
            clearTimeout(settings[i].moveTimer);
            settings[i].moveTimer = setTimeout(function(){
                settings[i].theBox = createTooltipBox(i);
                fillTitleContent(settings[i].theBox.querySelector('.'+options.content), i);
                placeTooltipBox(settings[i].theBox, trigger, i, e);
                effects.fadeIn(i);
                effects.slideIn(i);
            }, options.openDelay)
        })
    }

    this.cssObjToString = function(obj, defaultValues){
        Object.entries(defaultValues).forEach(entry => {
            const [key, value] = entry;
            if(typeof obj[key] === 'undefined'){
                obj[key] = value;
            }
        })
        const str = (
            Object.entries(obj).map(([k, v]) => `${k}:${v}`).join(';')
        );
        return str;
    }

    this.createTooltipBox = function(i){
        const outerBox = document.createElement('div');

        outerBox.style.cssText = cssObjToString(options.cssOuter, defaultOuterCss);

        if(options.slide){
            outerBox.style.padding = parseInt(options.cssOuter.padding) + parseInt(options.slideAmount) + 'px';
        }
        if(options.position === 'above' || options.position === 'below'){
            outerBox.style.paddingLeft = '1px';
            outerBox.style.paddingRight = '1px';
        }
        if(options.position === 'left' || options.position === 'right'){
            outerBox.style.paddingTop = '1px';
            outerBox.style.paddingBottom = '1px';
        }

        outerBox.classList.add(options.container);
        document.querySelector('body').appendChild(outerBox);

        const innerBox = document.createElement('div');

        innerBox.style.cssText = cssObjToString(options.cssInner, defaultInnerCss);

        innerBox.classList.add(options.content);
        outerBox.appendChild(innerBox);
        settings[i].boxIsOpen=true;

        outerBox.addEventListener('mouseenter', function(){
            if(settings[i].boxIsOpen){
                effects.fadeIn(i);
                effects.slideIn(i);
            }
            stopClosing(i);
        })
        outerBox.addEventListener('mouseleave', function(){
            removeBoxOnTimer(settings[i].theBox, i);
        })
        return outerBox;
    }

    this.getTitleContent = function(element, i){
        settings[i].titleContent = element.getAttribute('title');
        element.setAttribute('title','');
    }
    this.replaceTitleContent = function(i){
        settings[i].trigger.setAttribute('title', settings[i].titleContent);
    }
    this.fillTitleContent = function(element, i){
        element.innerHTML = settings[i].titleContent;
    }
    this.destroyTooltipBox = function(element, i){
        element.remove();
        settings[i].boxIsOpen=false;
        settings[i].reposition=options.position;
    }

    this.openBoxOnTimer = function(element, i){
        settings[i].openTimer = setTimeout(function(){

        }, options.openDelay);
    }
    this.removeBoxOnTimer = function(element, i){
        settings[i].closeTimer = setTimeout(function(){
            effects.fadeOut(i);
            effects.slideOut(i);
            if(!options.fade && !options.slide){
                destroyTooltipBox(element, i);
                replaceTitleContent(i);
                return;
            }
            settings[i].fadeTimer = setTimeout(function(){
                destroyTooltipBox(element, i);
                replaceTitleContent(i);
            }, options.effectSpeed);
        }, options.closeDelay)
    }

    this.getElementPosition = function(element){
        let boundaries = element.getBoundingClientRect();
        return boundaries;
    }
    this.ifBoxAtEndOfWindow = function(box, trigger, i){
        let boxPos = getElementPosition(box);
        let triggerPos = getElementPosition(trigger);
        if((boxPos.left + box.offsetWidth) + 1 > window.innerWidth){
            return true;
        }
        return false;
    }
    
    const positionOfBox = (box, element) => {
        let position = getElementPosition(element);
        let contents = box.querySelector('.'+options.content);
        let boxSize = {
            width: box.offsetWidth,
            height:box.offsetHeight
        };
        let elemSize = {
            width:element.offsetWidth,
            height:element.offsetHeight
        }
        const above = () => {
            box.style.top = position.top - boxSize.height + 'px';
        }
        const below = () => box.style.top = position.top + elemSize.height + 'px';
        const left = () => {
            box.style.top = position.top - (boxSize.height/2) + (elemSize.height/2) + 'px';
            box.style.left = position.left - boxSize.width + 'px';
        }
        const right = () => {
            box.style.top = position.top - (boxSize.height/2) + (elemSize.height/2) + 'px';
            box.style.left = position.left + elemSize.width + 'px';
        }
        const skewDefault = () => box.style.left = position.left - (boxSize.width/2) + (elemSize.width/2) + 'px';
        const skewRight = () => box.style.left = position.left - boxSize.width + elemSize.width + 'px';
        const skewLeft = () => box.style.left = position.left + 'px';
        const correctRight = () => box.style.left = '0px';
        const correctLeft = () => box.style.left = window.innerWidth - boxSize.width + 'px';
        const correctTop = () => box.style.top = window.innerHeight - boxSize.height + 'px';
        const correctBottom = () => box.style.top = '0px';
        return {above, below, left, right, skewDefault, skewRight, skewLeft, correctRight, correctLeft, correctTop, correctBottom};
    };

    this.placeTooltipBox = function(box, trigger, i, evt){
        boxLocation = positionOfBox(box, trigger);
        if(options.position === 'cursor'){
            box.style.top = evt.pageY + 2 + 'px';
            box.style.left = evt.pageX + 2 + 'px';
            
            if(ifBoxAtEndOfWindow(box, trigger, i)){
                box.style.left = box.offsetLeft - box.offsetWidth + 'px';
                boxLocation.correctLeft();
            }
            if(box.offsetTop + box.offsetHeight > window.innerHeight){
                box.style.top = box.offsetTop - box.offsetHeight + 'px';
            }
        }
        if(options.position === 'above'){
            boxLocation.above();
            if(box.offsetTop < 0){
                boxLocation.below();
                settings[i].reposition = 'below';
            }
            
        }
        if(options.position === 'below'){
            boxLocation.below();
            if(box.offsetTop + box.offsetHeight > window.innerHeight){
                boxLocation.above();
                settings[i].reposition = 'above';
            }
            
        }
        
        if(options.position === 'left'){
            boxLocation.left();
            if(box.offsetLeft < 0){
                boxLocation.right();
                settings[i].reposition = 'right';
            }
        }
        if(options.position === 'right'){
            boxLocation.right();
            if(box.offsetLeft + box.offsetWidth > window.innerWidth){
                boxLocation.left();
                settings[i].reposition = 'left';
            }
        }
        if(options.position === 'left' || options.position === 'right'){
            if(box.offsetTop + box.offsetHeight > window.innerHeight){
                boxLocation.correctTop();
            }
            if(box.offsetTop < 0){
                boxLocation.correctBottom();
            }
        }
        if(options.position === 'above' || options.position === 'below'){
            if(options.skew != 'right' || options.skew != 'left'){
                boxLocation.skewDefault();
                if(box.offsetLeft < 0){
                    boxLocation.correctRight();
                }
                if(box.offsetLeft + box.offsetWidth > window.innerWidth){
                    boxLocation.correctLeft();
                }
            }
            if(options.skew === 'right'){
                boxLocation.skewRight();
                if(box.offsetLeft < 0){
                    boxLocation.correctRight();
                }
            }
            if(options.skew === 'left'){
                boxLocation.skewLeft();
                if(box.offsetLeft + box.offsetWidth > window.innerWidth){
                    boxLocation.correctLeft();
                }
            }
            // THIS IS A HACKY FIX FOR A BUG WITH THE RIGHT SIDE OF THE WINDOW
            // I DON'T KNOW WHY IT FIXES IT.
            // I SHOULD LOOK INTO DOING A REAL FIX FOR THIS AT SOME POINT.
            // ... I REALLY SHOULD.
            if(ifBoxAtEndOfWindow(box, trigger, i)){
                boxLocation.skewLeft();
                boxLocation.correctLeft();
            }
        }
        
    }

    this.stopClosing = function(i){
        clearTimeout(settings[i].closeTimer);
        clearTimeout(settings[i].fadeTimer);
    }

    

    const effects = {
        fadeIn:function(i){
            settings[i].theBox.style.opacity = '1';
            if(!options.fade){
                return;
            }
            settings[i].theBox.style.transitionProperty = 'opacity';
            settings[i].theBox.style.transitionDuration = options.effectSpeed / 1000 + 's';
        },
        fadeOut:function(i){
            if(!options.fade){
                return;
            }
            settings[i].theBox.style.opacity = '0';
            settings[i].theBox.style.transitionProperty = 'opacity';
            settings[i].theBox.style.transitionDuration = options.effectSpeed / 1000 + 's';
        },
        slideIn:function(i){
            if(!options.slide){
                return;
            }
            let contentBox = settings[i].theBox.querySelector('.'+options.content);
            let slideAmount = options.slideAmount;
            if(settings[i].reposition === 'above'){
                contentBox.style.top = slideAmount;
            }
            if(settings[i].reposition === 'below' || settings[i].reposition === 'cursor'){
                contentBox.style.top = '-'+slideAmount;
            }
            if(settings[i].reposition === 'left'){
                contentBox.style.left = slideAmount;
            }
            if(settings[i].reposition === 'right'){
                contentBox.style.left = '-'+slideAmount;
            }
            contentBox.style.transitionProperty = 'top, bottom, left, right';
            contentBox.style.transitionDuration = options.effectSpeed / 1000 + 's';
        },
        slideOut:function(i){
            if(!options.slide){
                return;
            }
            let contentBox = settings[i].theBox.querySelector('.'+options.content);
            let slideAmount = options.slideAmount;
            if(settings[i].reposition === 'above'){
                contentBox.style.top = '-'+slideAmount;
            }
            if(settings[i].reposition === 'below' || settings[i].reposition === 'cursor'){
                contentBox.style.top = slideAmount;
            }
            if(settings[i].reposition === 'left'){
                contentBox.style.left = '-'+slideAmount;
            }
            if(settings[i].reposition === 'right'){
                contentBox.style.left = slideAmount;
            }
            contentBox.style.transitionProperty = 'top, bottom, left, right';
            contentBox.style.transitionDuration = options.effectSpeed / 1000 + 's';
        }
    }


    
    
    this.init();
};


