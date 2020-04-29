<? header('Content-type: text/html; charset=UTF-8'); ?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type"
              content="text/html; charset=utf-8" />
        <title>Instrumenpoche</title>
        <link rel="stylesheet" type="text/css" href="iep.css"></link>
        <script type="text/javascript" src="iep.js"></script>
    </head>
    <body>
        <?php
        $formulaire = '<div class="enhaut"><a href="http://instrumenpoche.net">
            <img src="logoiep.png" class="logoiep"/>
            </a><form method="post" action="iep.php" enctype="multipart/form-data">
            <input type="hidden" name="MAX_FILE_SIZE" value="66000">
            Ouvrir une animation : <input type="file" name="anim">
            <input type="submit" value="Envoyer">
            <noscript> Javascript est désactivé, certaines animations peuvent ne pas s\'afficher correctement</noscript></form>';

        function affiche_iep($anim) {
            echo "<script language=\"JavaScript\" type=\"text/javascript\">
	AC_FL_RunContent(
		'codebase', 'http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0',
		'width', screen.availWidth-50,
		'height', screen.availHeight-200 ,
		'src', 'iep',
		'quality', 'high',
		'pluginspage', 'http://www.adobe.com/go/getflashplayer_fr',
		'align', 'left',
		'play', 'true',
		'loop', 'true',
		'scale', 'showall',
		'wmode', 'window',
		'devicefont', 'false',
		'id', 'iep',
		'bgcolor', '#ffffff',
		'name', 'iep',
		'menu', 'true',
		'allowFullScreen', 'true',
		'allowScriptAccess','always',
		'movie', 'iep',
		'salign', 'lt',
                 'FlashVars', 'test_php_iep=1&iep_anim_echap=$anim'
		); //end AC code
</script>
<noscript>
	<object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\" codebase=\"http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0\" width=\"800\" height=\"600\" id=\"iep\" align=\"left\">
	<param name=\"allowScriptAccess\" value=\"always\" />
	<param name=\"allowFullScreen\" value=\"true\" />
        <param name=\"salign\" value=\"lt\" />
        <param name='Flashvars' value='test_php_iep=1&iep_anim_echap=$anim' />
	<param name=\"movie\" value=\"iep.swf\" />
        <param name=\"quality\" value=\"high\" />
        <param name=\"bgcolor\" value=\"#ffffff\" />
        <embed src=\"iep.swf\" Flashvars='test_php_iep=1&iep_anim_echap=$anim' salign=\"lt\"  quality=\"high\" bgcolor=\"#ffffff\" width=\"800\" height=\"600\" name=\"iep\" align=\"left\" wmode=\"window\" allowScriptAccess=\"always\" allowFullScreen=\"true\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.adobe.com/go/getflashplayer_fr\" />
	</object>
</noscript>";
        }
        //gestion des erreurs possibles :
        if (!empty($_FILES['anim']['tmp_name'])) {
            if ($_FILES['anim']['error']) {
                switch ($_FILES['anim']['error']) {
                    case 1: // UPLOAD_ERR_INI_SIZE   
                        echo "<b>ERREUR.</b> Le fichier dépasse la limite autorisée par le serveur.<br/>";
                        break;
                    case 2: // UPLOAD_ERR_FORM_SIZE   
                        echo "<b>ERREUR.</b> Le fichier dépasse la limite autorisée dans le formulaire HTML.<br/>";
                        break;
                    case 3: // UPLOAD_ERR_PARTIAL   
                        echo "<b>ERREUR.</b> L'envoi du fichier a été interrompu pendant le transfert.<br/>";
                        break;
                    case 4: //<b>ERREUR.</b>  UPLOAD_ERR_NO_FILE   
                        echo "Le fichier que vous avez envoyé est vide.<br/>";
                        break;
                }
            } else {
                if ($_FILES['anim']['type'] != "text/xml" && $_FILES['anim']['type'] != "application/xml") {
                    echo "<b>ERREUR.</b> Le fichier instrumenpoche doit être au format XML et non " . $_FILES['anim']['type']."<br/>";
                } else if (filesize($_FILES['anim']['tmp_name']) > 66000) {
                    echo "<b>ERREUR.</b> Le fichier dépasse la limite autorisée.<br/>";
                }
            }
        }
        //dans tous les cas on affiche le formulaire et iep
        echo $formulaire;
        $anim = @urlencode(file_get_contents($_FILES['anim']['tmp_name'], "r"));
        affiche_iep($anim);
        echo $anim;       
        ?>            
    </body>
</html>