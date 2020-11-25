<?php
$post = [
    'subscriberCode' => $_GET["sid"],

];
$ch = curl_init('https://myabb.in/totalBalance');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
$response = curl_exec($ch);
curl_close($ch);
header('Content-type: application/json');
echo $response;