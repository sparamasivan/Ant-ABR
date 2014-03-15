<?php

$response = require '_data/healthtracks_report_details/1.php';

header('Content-type: application/json');
echo json_encode($response);
