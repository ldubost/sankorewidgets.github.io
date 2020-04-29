/*
 * Auteur : Frédéric Misery (MiCetF).
 * Site de l'auteur : http://micetf.fr
 * Version du 1er mars 2013
*/
function init(){

  $('body').css({
    color:'#786056',
    backgroundColor:'#F2DCB3',
    fontFamily:'Comic Sans MS'
  });

  $('#outils').css({
    margin:0,
    padding:0,
    width:476,
    height:66
  });

  $('#signature').css({
    margin:0,
    padding:0,
    fontSize:'0.8em',
    textAlign:'center'
  });

  $('#tableau').css({
    margin:0,
    padding:0,
    width:466,
    height:400,
    color:'#F2DCB3',
    backgroundColor:'#535E7D',
    border:'5px solid #786056'
  });

  var texte=document.createElement('input');
  texte.type='text';
  $(texte).css({width:476});
  $('#outils').append(texte);

  var bouton=document.createElement('input');
  bouton.type='button';
  bouton.value='Créer les étiquettes';
  $('#outils').append(bouton);
  $(bouton).click(function() {
    if (texte.value.trim()=='') {
      $(texte).focus();
      return false;
    }
    var etiquettes=texte.value.split(' ');
    for(var i=0;i<etiquettes.length;i++){
      var span=document.createElement('span');
      $(span)
        .css({
          position:'absolute',
          top:(100+2*i)+'px',
          left:(20+2*i)+'px',
          padding:'5px',
          border:'1px solid #786056',
          cursor:'pointer',
          color:'#535E7D',
          backgroundColor:'#F2DCB3',
        })
        .text(etiquettes[i])
        .draggable({containment:'#tableau'});
     $('#tableau').append(span);
    }
    texte.value='';
    $(texte).focus();
  });
  var corbeille=document.createElement('img');
  $(corbeille)
    .attr({src:'images/corbeille.png'})
    .css({
      width:'40px',
      position:'relative',
      top:'350px',
      left:'420px'
    })
    .droppable({
      drop:function(event,ui) {
        $(ui.draggable).remove();
      }
    });
  $('#tableau').append(corbeille);
  $(texte).focus();
}
