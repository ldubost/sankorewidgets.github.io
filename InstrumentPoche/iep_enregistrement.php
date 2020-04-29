<?php
header("Content-Type: application/octet-stream");
header('Content-Disposition: attachment; filename="'.$_POST['nom_iep'].'.xml"');
echo rawurldecode($_POST['script_iep']);
?>
