var canvas;
//canvas context variable (ctx) used to draw into canvas
var ctx;

//pen is the default tool
//object array to know which tool is currently used
var toolList = 
	[{"tool" : "pen", "currentlyUsed" : true},
	{"tool" : "marker", "currentlyUsed" : false},
	{"tool" : "line", "currentlyUsed" : false}];

var images = [ // predefined array of used images
    'images/colormap.gif',
    'images/pic2.jpg', //what is it for ? no picture is found on images folder
];

var bImages = [ // predefined array of button icons
	'images/pen.png',
	'images/marker.png',
	'images/line.png'
];

var colorPalette = ['','','','',''];
//var colorPalette = ['ea2222','663ced','50a1b5','1ad72c','e8a30f'];



//current index for images
var iActiveImage = 0;
//current index for button icons
var iActiveBImage = 0;
//when we change tool, a default color is loaded, to avoid loading default color
//we save it in this variable
var currentColor = null;

function toHex(n) {
 n = parseInt(n,10);
 if (isNaN(n)) return "00";
 n = Math.max(0,Math.min(n,255));
 return "0123456789ABCDEF".charAt((n-n%16)/16)
      + "0123456789ABCDEF".charAt(n%16);
}

//returns index of current tool
function getCurrentTool(){
	for (var i = 0; i <= toolList.length; i++){
			if (toolList[i].currentlyUsed == true){
				return i
			}
	}
	return -1;
}

//find the place for the next color to be placed
function findPlace(){
	for (var i = 0; i <= colorPalette.length; i++){
		if (colorPalette[i] == '')
			return i;
	}
	return -1;
}

function switchFifo(pColor){
	//add the new color at the end of the color palette
	var aux = ['','','','',pColor];
	for (var i = 1; i < colorPalette.length; i++){
		aux[i - 1] = colorPalette[i];
	}
	
	colorPalette = aux;
}

//update the colorPalette div using stored color in colorPalette variable
function updateColorPalette(){
	
	for (var i = 0; i < colorPalette.length; i++){
		var currentId = 'img' + i;
		var imgColor = document.getElementById(currentId);
		imgColor.style.background = "#" + colorPalette[i];
	}
}

//save colors in colorPalette using FIFO algorithm
function saveColor(pColor){
	var place = findPlace();
	
	if (place != -1)
		colorPalette[place] = pColor;
	else
		switchFifo(pColor);
	updateColorPalette();
}

function detectAndChangeTool(pColor, isSaving){
	//in order to save the current color
	currentColor = pColor;
	if (isSaving)
		saveColor(pColor);
	var tool = getCurrentTool();
	switch(tool){
		case 0: 
			window.sankore.setPenColor('#' + pColor);
			//sankore.returnStatus("PEN installed", true);
			break;
		case 1:
			//missing alpha parameter...
			//checked opensankore 3.1 source and it appears that setMarkerAlpha is
			//not implemented in setMarkerColor method nor setMarkerAlpha is not
			//callable from opensankore API
			window.sankore.setMarkerColor('#' + pColor);
			//	window.sankore.setMarkerAlpha(0.90);
			//sankore.returnStatus("MARKER installed", true);
			break;
		case 2:
			window.sankore.setPenColor('#' + pColor);
			//sankore.returnStatus("LINE installed", true);
			break;
		case -1:
			//sankore.returnStatus("NO TOOL installed", true);
			break;
	}
}

//generic function to create button
//HTML id attribute is not used here, that's why we don't implement it
function addButton(pFun){//pId, pFun, pWhere){
	var bZone = document.getElementById('toolselection');
	//toolSelection is an HTML div created in table.html
	var bTool = document.createElement('input');
	bTool.type = 'image';
	bTool.src = bImages[iActiveBImage++];
	bTool.setAttribute('onClick',pFun);
	bZone.appendChild(bTool);
}

//this one is hard to factorise...
function setTool(whichOne){
	//set all tools as not used and the one which is whichOne is set to true
	//and set color from global saved color currentColor
	for (var i = 0; i < toolList.length; i++){
		toolList[i].currentlyUsed = false;
		if (toolList[i].tool == whichOne){
			toolList[i].currentlyUsed = true;
			//to get a clear view of which tool is currently in use
			if (toolList[i].tool == 'pen'){
				window.sankore.setTool('pen');
				//sankore.returnStatus("PEN installed", true);
				if (currentColor != null){
					window.sankore.setPenColor('#' + currentColor);
				}
			}
			else if (toolList[i].tool == 'marker'){
				window.sankore.setTool('marker');
				//sankore.returnStatus("MARKER installed", true);
				if (currentColor != null){
					window.sankore.setMarkerColor('#' + currentColor);
				}
			}
			else if (toolList[i].tool == 'line'){
				window.sankore.setTool('line');
				//sankore.returnStatus("LINE installed", true);
				if (currentColor != null){
					window.sankore.setPenColor('#' + currentColor);
				}
			}
		}
	}
}

//create the buttons to select tools using generic function
function createButton(){
	addButton("setTool('pen')");
	addButton("setTool('marker')");
	addButton("setTool('line')");
}

function createColor(index){
	//toolSelection is an HTML div created in table.html
	var csZone = document.getElementById('colorSaver');
	var currentId = 'img' + index;
	var imgColor = document.createElement('img');
	var color = "#" + colorPalette[index];
	
	imgColor.src = 'images/transparentImage.png';
	imgColor.width = '40';
	imgColor.id = currentId;
	imgColor.style.background = color;

	
    imgColor.setAttribute('onClick','detectAndChangeTool(colorPalette['+index+'],false)');
	
	csZone.appendChild(imgColor);
}

//create the tools to select future saved colors
function createColorSaver(){
	for (var i = 0; i < colorPalette.length; i++){
		createColor(i);
	}
}

$(function(){
    // drawing active image
    var image = new Image();
    image.onload = function () {
        ctx.drawImage(image, 0, 0, image.width, image.height); // draw the image on the canvas
    }
    image.src = images[iActiveImage];
    // creating canvas object
    canvas = document.getElementById('panel');
    ctx = canvas.getContext('2d');
    createButton();
    createColorSaver();
    $('#panel').mousemove(function(e) { // mouse move handler
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
        var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
        $('#preview').css('backgroundColor', pixelColor);
    });

    $('#panel').click(function(e) { // mouse click handler
        var canvasOffset = $(canvas).offset();
        var canvasX = Math.floor(e.pageX - canvasOffset.left);
        var canvasY = Math.floor(e.pageY - canvasOffset.top);
        var imageData = ctx.getImageData(canvasX, canvasY, 1, 1);
        var pixel = imageData.data;
        var dColor = toHex(pixel[0]) + toHex(pixel[1]) + toHex(pixel[2]);
		var pixelColor = "rgba("+pixel[0]+", "+pixel[1]+", "+pixel[2]+", "+pixel[3]+")";
		detectAndChangeTool(dColor,true);     
    }); 

    $('#swImage').click(function(e) { // switching images
        iActiveImage++;
        if (iActiveImage >= 10) iActiveImage = 0;
        image.src = images[iActiveImage];
    });
});
