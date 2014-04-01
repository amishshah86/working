var colors = {
	palette: [],
	background: "",
	foregroundPalette: [],
	darks:[],
	brights:[],
	analyzeColor: function(arr, bgArr){
		var lum = colors.luminance(arr);
		var bgLum = colors.luminance(bgArr);
		colors.background = (bgLum < 125.0)?"dark":"light";
		colors.palette.push({
			"value":     arr,
			"luminance": lum,
			"dark":      (lum < 125.0)? true : false,
			"variance":  Math.abs(lum - bgLum)
		})
	},

	luminance: function(arr){
		return 0.2126*arr[0] + 0.7152*arr[1] + 0.0722*arr[2];
	},

	categorizeColors: function(){
		colors.darks   = [];
		colors.brights = [];
		console.log(colors.palette)
		for(var i=0; i<colors.palette.length; i++){
			if(!!colors.palette[i]["dark"]){
				colors.darks.push(colors.palette[i]);
			}else{
				colors.brights.push(colors.palette[i]);
			}
		}
		colors.darks.sort(colors.sortByVariance);
		colors.brights.sort(colors.sortByVariance);

		/*console.log("darks: ", colors.darks);
		console.log("brights: ", colors.brights);*/

		colors.foregroundPalette = (colors.background == "dark")?  colors.brights: colors.darks;
	},

	sortByVariance: function(a,b){
		var varianceA = a.variance;
		var varianceB = b.variance;
		if(varianceA < varianceB) return 1;
		if(varianceA > varianceB) return -1;
		return 0;
	},

	resetColors: function(){
		colors.palette           = [];
		colors.darks             = [];
		colors.brights           = [];
		colors.foregroundPalette = [];
		colors.background        = "";
	}

}

var loadImage = function(src){
	if(typeof src == "undefined"){
		var source = "img/photo1.jpg";
		$(".seedSource").val(source)
	}else{
		var source = src;
	}
	var img = new Image();
	img.src = source;
	$("#seedImage").attr("src",img.src);
}

var getColors = function(){
	var sourceImage = $("#seedImage");
	if(typeof colorThief == "undefined"){
		try{
			var colorThief = new ColorThief();
		}catch(e){console.log(e)}
	}
	var dominantColor = colorThief.getColor(sourceImage[0]);
	var palette = colorThief.getPalette(sourceImage[0], 8);

	updateUi(dominantColor, palette)
}

var arrayToRGB = function(arr){
	var r = "rgb(";
	for(var i=0; i<arr.length; i++){
		r += arr[i];
		r += (i === (arr.length - 1))? ")" : ",";
	}
	return r;
}

var updateUi = function(dominantColor, palette){
	var bgColor = arrayToRGB(dominantColor);
	var swatches = "";

	for(var i=0; i<palette.length; i++){
		swatches += "<div class=\"swatch\" style=\"background-color: " + arrayToRGB(palette[i]) + "\" title=\"" + arrayToRGB(palette[i]) + "\"></div>";
		colors.analyzeColor(palette[i],dominantColor);
	}

	colors.categorizeColors();

	$(".swatches").html(swatches)

	var headingColor = arrayToRGB(colors.foregroundPalette[1].value);
	var textColor    = arrayToRGB(colors.foregroundPalette[0].value);


	$("body, .jumbotron").css({"backgroundColor": bgColor, "color": textColor});
	$("h1").css({"color": headingColor});
	colors.resetColors();
}

$(document).ready(function(){
	loadImage();
});

$("#seedImage").on("load change",function(){
	getColors();
});

$(".seedSource").on("keyup change",function(){
	loadImage($(this).val());
});