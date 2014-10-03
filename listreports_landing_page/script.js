$(document).on('ready', function (e) {

    var enableScrollMagic = !!($(window) && $(window).width() > 640);

    if(enableScrollMagic){
        var duration = $("#hero").height() + $(window).height();
        var bgPosMovement = "0 " + (duration*0.5) + "px";

        var controllerHeader = new ScrollMagic({container: "#landing"});

        var sceneHeader = new ScrollScene({triggerElement: "#below-the-fold"})
                        .setClassToggle("#header", "scrolled")
                        .addTo(controllerHeader);

        var controllerHero = new ScrollMagic({container: "#landing", globalSceneOptions: {duration: duration}});
        var sceneHero = new ScrollScene({triggerElement: ".btn-cta"})
                        .setTween(TweenMax.to("#hero", 1, {backgroundPosition: bgPosMovement, ease: Linear.easeNone}))
                        .addTo(controllerHero);
    }

});
