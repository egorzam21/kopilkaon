<?php
// send_email.php

// Настраиваем заголовки для CORS и JSON
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обрабатываем preflight запросы
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Метод не разрешен']);
    exit;
}

// Получаем данные из формы
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$topic = trim($_POST['topic'] ?? '');
$message = trim($_POST['message'] ?? '');

// Проверяем обязательные поля
if (empty($name) || empty($email) || empty($message)) {
    echo json_encode(['success' => false, 'error' => 'Все поля обязательны для заполнения']);
    exit;
}

// Валидация email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'error' => 'Некорректный email адрес']);
    exit;
}

// Защита от спама - проверка длины сообщения
if (strlen($message) < 10) {
    echo json_encode(['success' => false, 'error' => 'Сообщение слишком короткое']);
    exit;
}

// Настройки email
// ЗАМЕНИТЕ 'info@kopilka.ru' НА ВАШ РЕАЛЬНЫЙ EMAIL
$to = "egorzamula3@gmail.com";
$subject = "Обратная связь с сайта Копилка: " . htmlspecialchars($topic);

// Формируем тело письма
$emailMessage = "
Новое сообщение с формы обратной связи:

Имя: " . htmlspecialchars($name) . "
Email: " . htmlspecialchars($email) . "
Тема: " . htmlspecialchars($topic) . "

Сообщение:
" . htmlspecialchars($message) . "

---
Это сообщение было отправлено с сайта Копилка
";

// Заголовки письма
$headers = "From: no-reply@kopilka.ru\r\n" .
           "Reply-To: " . $email . "\r\n" .
           "X-Mailer: PHP/" . phpversion() . "\r\n" .
           "Content-Type: text/plain; charset=utf-8\r\n" .
           "MIME-Version: 1.0";

// Пытаемся отправить email
try {
    $success = mail($to, $subject, $emailMessage, $headers);
    
    if ($success) {
        // Логируем успешную отправку (опционально)
        error_log("Email sent successfully to: " . $to . " from: " . $email);
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Функция mail() вернула false');
    }
} catch (Exception $e) {
    // Логируем ошибку
    error_log('Email sending error: ' . $e->getMessage());
    echo json_encode([
        'success' => false, 
        'error' => 'Не удалось отправить сообщение. Пожалуйста, попробуйте позже.'
    ]);
}
?>
