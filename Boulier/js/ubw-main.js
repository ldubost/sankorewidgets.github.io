/*
 * Auteur : Frédéric Misery (MiCetF).
 * Site de l'auteur : http://micetf.fr
 * Version 0.2 du 02 mars 2013
*/

function init(){
	
    var w = 470;
    var h = 400;
    var eSocle=40;
    var eMontant=10;
    var eTige=2;
    var rBoule=Math.round((w-(2*eSocle))/30);
    var ecartTiges = Math.round((h-eSocle/2)/11);
    var boules=new Array(0,0,0,0,0,0,0,0,0,0);
    
    $('body').css({
      fontFamily:'Comic Sans MS',
      textAlign:'center',
      padding:0,
      backgroundColor:'#F2DCB3'
    });

//  Barre d'outils
    var toolbar=document.createElement('div');
    $(toolbar).css({
      verticalAlign:'middle'
    });

//  Zone d'affichage du nombre représenté sur le boulier.
    var affichage=document.createElement('span');
    $(affichage).css({
      display:'inline-block',
      height:23,
      width:100,
      border:'5px solid #786056',
      backgroundColor:'#536E7D',
      color:'#F2DCB3',
      textAlign:'center',
      margin:2
    });
    $(toolbar).append(affichage);

//  Bouton de commande pour l'affichage du nombre.
    var voir=document.createElement('input');
    voir.type='button';
    voir.value='Voir';
    voir.title='Voir le nombre de boules déplacées sur le boulier.';
    $(voir).css({
      width:100,
      margin:2,
      cursor:'pointer'
    });
    $(toolbar).append(voir);

//  Bouton de commande pour la capture de l'image du boulier.
    var capture=document.createElement('input');
    capture.type='button';
    capture.value='Capture';
    capture.title="Capturer et ajouter l'image actuelle du boulier sur la page courante.";
    $(capture).css({
      width:100,
      margin:2,
      cursor:'pointer'
    });
    $(toolbar).append(capture);

//  Fonction gérant l'affichage du nombre.
    var afficherNombre=function() {
      if (voir.value=='Masquer') {
        var tot=0;
        for (var iTige=0;iTige<10;iTige++) {
          tot+=boules[iTige];
        }
        $(affichage).text(tot);
      } else {
        $(affichage).html("&nbsp;");
      }
    };

//  Gestion de l'évènement clic sur le bouton de commande de l'affichage.
    $(voir).click(function(){
      if (voir.value=='Voir') {
        voir.value='Masquer';
        voir.title='Masquer le nombre de boules déplacées sur le boulier.';
      } else {
        voir.value='Voir';
        voir.title='Voir le nombre de boules déplacées sur le boulier.';
      }
      $(message).text(this.title);
      $(message).show();
      afficherNombre();
    });

//  Gestion de l'évènement clic sur le bouton de capture.
    $(capture).click(function(){
      sankore.addObject(canvas.toDataURL("image/png"));
    });

//  Dessin du boulier
    var canvas= document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.id='boulier';
    canvas.width=w;
    canvas.height=h;

    var structureBoulier=function() {
//    Arrière-plan du Boulier
      ctx.fillStyle='#F2DCB3';
      ctx.fillRect(0,0,w,h);

//    Socle du boulier
      ctx.strokeStyle='#786056';
      ctx.lineWidth=eSocle;
      ctx.lineJoin='round';
      ctx.lineCap='round';

      ctx.beginPath();
      ctx.moveTo(eSocle/2,h);
      ctx.lineTo(w-eSocle/2,h);
      ctx.closePath();
      ctx.stroke();
//    Signature
      ctx.font='10pt Comic Sans MS';
      ctx.textAlign='middle';
      ctx.textBaseline='bottom';
      ctx.fillText('MiCetF',w/2,h);

//    Tiges du boulier
      ctx.strokeStyle='#536E7D';
      ctx.lineWidth=eTige;
      ctx.beginPath();
      for (var iTige=0;iTige<10;iTige++) {
        var delta=(iTige<5) ? -eTige : eTige;
        ctx.moveTo(eSocle/2,delta+ecartTiges*(iTige+1));
        ctx.lineTo(w-eSocle/2,delta+ecartTiges*(iTige+1));
      }
      ctx.closePath();
      ctx.stroke();

//    Montants du boulier
      ctx.strokeStyle='#786056';
      ctx.lineWidth=eMontant;
      ctx.lineJoin='round';
      ctx.lineCap='round';

      ctx.beginPath();
      ctx.moveTo(eSocle/2,eMontant/2);
      ctx.lineTo(eSocle/2,h);
      ctx.moveTo(w-eSocle/2,eMontant/2);
      ctx.lineTo(w-eSocle/2,h);
      ctx.closePath();
      ctx.stroke();
    };

    var afficherBoules=function() {
      ctx.lineWidth=1;
      ctx.strokeStyle='#1A3540';
      ctx.fillStyle='#F2B28D';
      for (var iTige=0;iTige<10;iTige++) {
        var deltaH=(iTige<5) ? -eTige : eTige;
        for (var iBoule=0;iBoule<10;iBoule++) {
          ctx.beginPath();
          var deltaW=(iBoule<5) ? rBoule+(eMontant+eSocle)/2 : rBoule+(eMontant+eSocle)/2+eTige*2;
          if (boules[iTige]+iBoule>=10) deltaW+=(w-(eMontant+eSocle))-(2+eTige+20*rBoule);
          ctx.arc(deltaW+2*rBoule*iBoule,deltaH+ecartTiges*(iTige+1),rBoule,0,Math.PI*2,true);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
      }
    };
    
    var estUneBoule=function(iTige,iBoule,dx,dy) {
      var deltaH=(iTige<5) ? -eTige : eTige;
      var deltaW=(iBoule<5) ? rBoule+(eMontant+eSocle)/2 : rBoule+(eMontant+eSocle)/2+eTige*2;
      if (boules[iTige]+iBoule>=10) deltaW+=(w-(eMontant+eSocle))-(2+eTige+20*rBoule);
      var x=deltaW+2*rBoule*iBoule;
      var y=deltaH+ecartTiges*(iTige+1);
      if (dx>x-rBoule && dx<x+rBoule && dy>y-rBoule && dy<y+rBoule) return true;
      return false;
    };
    
    $(canvas).click(function(e){
		  var offset = $(this).offset();
		  dx=Math.round(e.pageX-offset.left);
		  dy=Math.round(e.pageY-offset.top);
      for (var iTige=0;iTige<10;iTige++) {
        for (var iBoule=0;iBoule<10;iBoule++) {
          if (estUneBoule(iTige,iBoule,dx,dy)) {
            boules[iTige]=(boules[iTige]<10-iBoule)? 10-iBoule : 9-iBoule;
          }
        }
      }
      rafraichir();
    });
    $(canvas).mousemove(function(e){
      var boule=false;
		  var offset = $(this).offset();
		  dx=Math.round(e.pageX-offset.left);
		  dy=Math.round(e.pageY-offset.top);
      for (var iTige=0;iTige<10;iTige++) {
        for (var iBoule=0;iBoule<10;iBoule++) {
          if (estUneBoule(iTige,iBoule,dx,dy)) boule=true;
        }
      }
      (boule) ?
        $("#ubwidget").css({cursor:"pointer"}):
        $("#ubwidget").css({cursor:"auto"});
    });

    var rafraichir=function() {
      structureBoulier();
      afficherBoules();
      afficherNombre();
    };

//  Fenêtre de message
    var message=document.createElement('div');
    $(message).css({
      position:'absolute',
      top:h-13,
      left:11,
      width:w,
      fontSize:'0.9em',
      color:'#F2DCB3',
      backgroundColor:'#1A3540',
      display:'none'
    });

    $("#ubwidget").append(canvas);
    $('#ubwidget').append(toolbar);
    $("#ubwidget").append(message);

    $('input[type=button]').mouseover(function(){
      $(message).text(this.title);
      $(message).show();
    }).mouseout(function(){
      $(message).text(this.title);
      $(message).hide();
    });

    rafraichir();
}
