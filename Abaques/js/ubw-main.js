/*
 * Auteur : Frédéric Misery (MiCetF).
 * Site de l'auteur : http://micetf.fr
 * Version 0.2 du 02 mars 2013
*/

function init(){

    var w = 470;
    var h = 400;
    var marge=15;
    var eSocle=50;
    var eTige=2;
    var hTige=(h-(2*marge+eSocle));
    var rBoule=Math.round(hTige/18);
    var ecartTiges=Math.round((w-(2*marge))/3);
    var boules=new Array(0,0,0);
    var groupes=new Array('C','D','U');

    $('body').css({
        fontFamily:'Comic Sans MS',
        textAlign:'center',
        backgroundColor:'#F2DCB3',
        padding:0
    });

//  Réservoir
    var reservoir=document.createElement('div');
    $(reservoir).css({textAlign:'center',margin:0,padding:0});
    for (var i=0;i<3;i++) {
        var plus=document.createElement('input');
        plus.type='button';
        plus.value='+';
        plus.title='Ajouter une boule sur la tige ci-dessus.';
        $(plus).css({
            width:30,
            margin:0,
            marginLeft:Math.round(ecartTiges/2)-15,
            marginRight:Math.round(ecartTiges/2)-15,
            cursor:'pointer'
        });
        $(reservoir).append(plus);
    }
    $(reservoir).find('input').each(function(i){
        $(this).click(function(){
            if (boules[i]!=9) {
                boules[i]+=1;
                rafraichir();
            } else {
                alert('Impossible, il n\'y a plus de place sur cette tige !');
            }
        }).mouseover(function(){
            $(message).text(this.title);
            $(message).show();
            rafraichir();
        });
    });

//  Barre d'outils
    var toolbar=document.createElement('div');
    $(toolbar).css({
        verticalAlign:'middle'
    });

//  Bouton de commande pour l'affichage du nombre.
    var voir=document.createElement('input');
    voir.type='button';
    voir.value='Voir';
    voir.title='Voir le nombre représenté par les boules placées sur l\'abaque.';
    $(voir).css({
        width:100,
        margin:2,
        cursor:'pointer'
    });
    $(toolbar).append(voir);

//  Bouton de commande pour la capture de l'image de l'abaque.
    var capture=document.createElement('input');
    capture.type='button';
    capture.value='Capture';
    capture.title="Capturer et ajouter l'image actuelle de l\'abaque sur la page courante.";
    $(capture).css({
        width:100,
        margin:2,
        cursor:'pointer'
    });
    $(toolbar).append(capture);

//  Gestion de l'évènement clic sur le bouton de commande de l'affichage.
    $(voir).click(function(){
      if (voir.value=='Voir') {
        voir.value='Masquer';
        voir.title='Masquer le nombre représenté par l\'abaque.';
      } else {
        voir.value='Voir';
        voir.title='Voir le nombre représenté par l\'abaque.';
      }
      $(message).text(this.title);
      $(message).show();
      rafraichir();
    });

//  Gestion de l'évènement clic sur le bouton de capture.
    $(capture).click(function(){
        sankore.addObject(canvas.toDataURL("image/png"));
    });

//  Dessin de l'abaque
    var canvas= document.createElement('canvas');
    var ctx=canvas.getContext('2d');
    canvas.width=w;
    canvas.height=h;

    var structureAbaque=function() {
//      Arrière-plan de l'abaque
        ctx.fillStyle='#F2DCB3';
        ctx.fillRect(0,0,w,h);

//      Tiges de l'abaque
        ctx.strokeStyle='#536E7D';
        ctx.lineWidth=eTige;
        ctx.beginPath();
        for (var iTige=0;iTige<3;iTige++) {
            ctx.moveTo(marge+ecartTiges/2+iTige*ecartTiges,marge);
            ctx.lineTo(marge+ecartTiges/2+iTige*ecartTiges,marge+hTige);
        }
        ctx.closePath();
        ctx.stroke();

//      Socle de l'abaque
        ctx.strokeStyle='#786056';
        ctx.lineWidth=eSocle;

        ctx.beginPath();
        ctx.moveTo(marge,h-(marge+eSocle/2));
        ctx.lineTo(w-marge,h-(marge+eSocle/2));
        ctx.closePath();
        ctx.stroke();
//      CDU
        ctx.font='24pt Comic Sans MS';
        ctx.textAlign='center';
        ctx.textBaseline='middle';
        ctx.fillStyle='#F2DCB3';
        var inscription=new Array();
        inscription=(voir.value=='Voir')?groupes:boules;
        for (var iGroupe=0;iGroupe<3;iGroupe++) {
            ctx.fillText(inscription[iGroupe],marge+ecartTiges/2+iGroupe*ecartTiges,h-(marge+eSocle/2));
        }
//      Signature
        ctx.font='10pt Comic Sans MS';
        ctx.textAlign='left';
        ctx.textBaseline='top';
        ctx.fillStyle='#1A3540';
        ctx.fillText('MiCetF',0,0);

    };

    var afficherBoules=function() {
        ctx.lineWidth=1;
        ctx.strokeStyle='#1A3540';
        ctx.fillStyle='#F2B28D';
        for (var iTige=0;iTige<3;iTige++) {
            for (var iBoule=0;iBoule<boules[iTige];iBoule++) {
                ctx.beginPath();
                ctx.arc(marge+ecartTiges/2+ecartTiges*iTige,marge+hTige-(rBoule+2*rBoule*iBoule),rBoule,0,Math.PI*2,true);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
        }
    };
    
    var estUneBoule=function(iTige,iBoule,dx,dy) {
        var x=marge+ecartTiges/2+iTige*ecartTiges;
        var y=marge+hTige-(rBoule+2*rBoule*iBoule);
        if (dx>x-rBoule && dx<x+rBoule && dy>y-rBoule && dy<y+rBoule) return true;
        return false;
    };
    
    $(canvas).click(function(e){
        var offset = $(this).offset();
        dx=Math.round(e.pageX-offset.left);
        dy=Math.round(e.pageY-offset.top);
        for (var iTige=0;iTige<3;iTige++) {
            for (var iBoule=0;iBoule<boules[iTige];iBoule++) {
                if (estUneBoule(iTige,iBoule,dx,dy)) {
                    boules[iTige]=iBoule;
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
        for (var iTige=0;iTige<3;iTige++) {
            for (var iBoule=0;iBoule<boules[iTige];iBoule++) {
                if (estUneBoule(iTige,iBoule,dx,dy)) boule=true;
            }
        }
        if (boule) {
            $("#ubwidget").css({cursor:"pointer"});
            $(message).text('Enlever cette boule et celles au-dessus.');
            $(message).show();
        } else {
            $("#ubwidget").css({cursor:"auto"});
            $(message).hide();
        }
        
    });

    var rafraichir=function() {
        structureAbaque();
        afficherBoules();
    };

    
//  Fenêtre de message
    var message=document.createElement('div');
    $(message).css({
        position:'absolute',
        top:h-10,
        left:11,
        width:w,
        fontSize:'0.9em',
        color:'#F2DCB3',
        backgroundColor:'#1A3540',
        display:'none'
    });

    $("#ubwidget").append(canvas);
    $('#ubwidget').append(reservoir);
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
