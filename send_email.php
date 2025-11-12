<?php
// send_email.php

// Получаем данные из запроса
$input = json_decode(file_get_contents('php://input'), true);

// Настройки email
$to = "egorzamula3@gmail.com"; // Замените на нужный email
$subject = "Обратная связь с сайта Копилка: " . $input['topic'];
$message = "
Имя: " . $input['name'] . "
Email: " . $input['email'] . "
Тема: " . $input['topic'] . "
Сообщение: " . $input['message'];

$headers = "From: " . $input['email'] . "\r\n" .
           "Reply-To: " . $input['email'] . "\r\n" .
           "X-Mailer: PHP/" . phpversion();

// Отправляем email
$success = mail($to, $subject, $message, $headers);

// Возвращаем ответ
header('Content-Type: application/json');
echo json_encode(['success' => $success]);
?>
