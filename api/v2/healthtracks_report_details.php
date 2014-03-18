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

if (!empty($_COOKIE['response_override'])) {
    $override = json_decode($_COOKIE['response_override'], true);

    if (!empty($override['healthtracks_report_details'])) {
        $values = $override['healthtracks_report_details'];

        if (!empty($values['httpStatus'])) {
            $httpStatus = $values['httpStatus'];
        }

        if (!empty($values['status'])) {
            $response['status'] = $values['status'];
            unset($response['healthtracks_info']);
        }

        if (!empty($values['error_msg'])) {
            $response['error_msg'] = $values['error_msg'];
        }
    }
}

header($_SERVER['SERVER_PROTOCOL'] . ' ' . $httpStatus);
header('Content-type: application/json');
echo json_encode($response);
