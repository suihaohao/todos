<?php
$mysqli = new mysqli("localhost","root","","test");
$sql = "UPDATE `todos` SET `content`='{$_GET['content']}',`isDone`='{$_GET['isDone']}' WHERE `id`={$_GET['id']}";
$mysqli->query($sql);
echo "success";
?>