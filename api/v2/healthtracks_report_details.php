<?php
$reportId = preg_replace('/[^a-zA-Z0-9\._-]/', '', $_POST['report_id']);
$pathToReport = '_data/healthtracks_report_details/' . $reportId . '.php';
$httpStatus = 200;

if (is_file($pathToReport)) {
    $response = require $pathToReport;
} else {
    $httpStatus = 500;
    $response = array(
        'status' => 'error',
        'error_msg' => 'Report not found. (id: ' . $reportId . ')',
    );
}

header($_SERVER['SERVER_PROTOCOL'] . ' ' . $httpStatus);
header('Content-type: application/json');
echo json_encode($response);
