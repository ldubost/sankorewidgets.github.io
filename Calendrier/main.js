Date.prototype.addDays = function(days)
{
    this.setDate(this.getDate() + days);
    return this;
};

Date.prototype.addMonths = function(months)
{
    this.setMonth(this.getMonth() + months);
    return this;
};

Date.prototype.addYears = function(years)
{
    this.setYear(this.getFullYear() + years);
    return this;
};

function getNbJours(date){
	return new Date(date.getFullYear(), date.getMonth()+1, -1).getDate()+1;
}

var listeJours = [
	"Lun",
	"Mar",
	"Mer",
	"Jeu",
	"Ven",
	"Sam",
	"Dim"
];

var listeMois = [
	"Janvier",
	"Février",
	"Mars",
	"Avril",
	"Mai",
	"Juin",
	"Juillet",
	"Août",
	"Septembre",
	"Octobre",
	"Novembre",
	"Décembre"
];

var tableau = $("table");
var mois = $("#mois span");
var annee = $("#annee span");

var today = new Date();
var currentDate = new Date();

var buttons = {

	mois:{
		previous: $("#mois .foundicon-left-arrow"),
		next: $("#mois .foundicon-right-arrow")
	},

	annee:{
		previous: $("#annee .foundicon-left-arrow"),
		next: $("#annee .foundicon-right-arrow")
	},

	today: $('#today')
};

function refreshTable(date)
{
	date = new Date(date.getTime());
	date.setDate(2);

	tableau.empty();

	mois.text(listeMois[date.getMonth()]);
	annee.text(date.getFullYear());

	var firstPassed = false ;
	var out = true;
	var fullMonth = false;
	var line ;

	line = $("<tr>");

	for (var i = 0, c = listeJours.length ; i < c; i++) {
		line.append($('<th>').text(listeJours[i]));
	}

	tableau.append(line);

	while(date.getDay() != 1 || !firstPassed){
		date.addDays(-1);

		if(date.getDate() == 1)
		{
			firstPassed = true ;
		}
	}

	while(!fullMonth){

		if(date.getDay() == 1)
		{
			line = $("<tr>");
			tableau.append(line);
		}

		var day = $("<td>").text(date.getDate());

		if(date.getMonth() != currentDate.getMonth())
		{
			day.addClass("out");
		}

		if(date.getMonth() == today.getMonth() && date.getDate() == today.getDate() && date.getFullYear() == today.getFullYear())
		{
			day.addClass("today");
		}

		line.append(day);

		if(date.getMonth() == currentDate.getMonth() && date.getDate() == getNbJours(currentDate))
		{
			fullMonth = true ;
		}

		date.addDays(1);
	}

	while(date.getDay() != 1){
		var day = $("<td>").text(date.getDate());

		if(date.getMonth() != currentDate.getMonth())
		{
			day.addClass("out");
		}

		line.append(day);
		date.addDays(1);
	}

	$("td").click(function(){

		var that = $(this);
		if(that.hasClass("selected"))
		{
			that.removeClass("selected");
		}
		else
		{
			that.addClass("selected");
		}

	});

}

function showTodayButton()
{
	if(currentDate.getMonth() != today.getMonth() || currentDate.getFullYear() != today.getFullYear())
	{
		buttons.today.fadeIn(500, 'swing');
	}
	else
	{
		buttons.today.fadeOut(500, "swing");
	}
}

buttons.mois.previous.click(function(){

	currentDate.addMonths(-1);
	refreshTable(currentDate);

	showTodayButton();

});


buttons.mois.next.click(function(){

	currentDate.addMonths(1);
	refreshTable(currentDate);
	showTodayButton();

});

buttons.annee.previous.click(function(){

	currentDate.addYears(-1);
	refreshTable(currentDate);
	showTodayButton();

});

buttons.annee.next.click(function(){

	currentDate.addYears(1);
	refreshTable(currentDate);
	showTodayButton();

});

buttons.today.click(function(){

	currentDate = new Date(today.getTime());
	refreshTable(currentDate);

	showTodayButton();

});


buttons.today.hide();
refreshTable(currentDate);