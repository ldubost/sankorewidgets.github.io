<?php
	//header("Content-Type: application/octet-stream");
	//header('Content-Disposition: attachment; filename='.$_POST['nom_iep'] );
	//echo urldecode($_POST['script_iep']);

//il faut éventuellement créer le dossier contenant les zip temporaires
//mkdir("tmp", 0777);

//pb avec la config sur iep.net, patch
ini_set('zend.ze1_compatibility_mode', 'Off');

$zip = new ZipArchive();

$filename = tempnam("tmp", "zip");

if ($zip->open($filename, ZIPARCHIVE::OVERWRITE)!==TRUE) {
    exit("Impossible d'ouvrir <$filename>\n");
}

$str="<title>InstrumenPoche</title><BODY bgcolor=\"#ffffff\"><div align=\"center\"><font face=\"Arial, Helvetica, sans-serif\" size=\"2\"><object classid=\"clsid:d27cdb6e-ae6d-11cf-96b8-444553540000\"codebase=\"http://fpdownload.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=7,0,0,0\" id=\"instrumenpoche\" width=\"962\" height=\"612\" align=\"middle\"><param name=\"allowScriptAccess\" value=\"sameDomain\" /><param name=\"movie\" value=\"iep.swf?anim=".$_POST['nom_iep'].".xml&config=config_lecture\" /><param name=\"quality\" value=\"high\" /><param name=\"bgcolor\" value=\"#ffffff\" /><embed src=\"iep.swf?anim=".$_POST['nom_iep'];
$str1=".xml&config=config_lecture\"  loop=\"false\" quality=\"high\" bgcolor=\"#ffffff\" width=\"962\" height=\"612\" swLiveConnect=true id=\"instrumenpoche\" name=\"instrumenpoche\" align=\"middle\" allowScriptAccess=\"sameDomain\" type=\"application/x-shockwave-flash\" pluginspage=\"http://www.macromedia.com/go/getflashplayer\" /></object></font></div></BODY>";
$zip->addFromString($_POST['nom_iep'].".html" , $str.$str1);
$zip->addFromString($_POST['nom_iep'].".xml" , urldecode($_POST['script_iep']));
$zip->addFile("iep.swf");

$zip->close();

header('Content-Type: application/x-zip') ; //on d�termine les en-t�te
header('Content-Disposition: inline; filename='.$_POST['nom_iep'].'.zip') ;
readfile($filename);
unlink($filename);
?>
