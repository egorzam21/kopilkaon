<?php
// send_email.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Проверяем метод запроса
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Получаем данные
$input = json_decode(file_get_contents('php://input'), true);

// Проверяем наличие всех обязательных полей
if (!isset($input['name']) || !isset($input['email']) || !isset($input['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

// Валидация email
if (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'error' => 'Invalid email']);
    exit;
}

// Настройки email
$to = "egorzamula3@gmail.com"; // ЗАМЕНИТЕ НА НУЖНЫЙ EMAIL
$subject = "Обратная связь с сайта Копилка: " . htmlspecialchars($input['topic']);

// Формируем тело письма
$message = "
Имя: " . htmlspecialchars($input['name']) . "
Email: " . htmlspecialchars($input['email']) . "
Тема: " . htmlspecialchars($input['topic']) . "
Сообщение: " . htmlspecialchars($input['message']);

$headers = "From: no-reply@kopilka.ru\r\n" .
           "Reply-To: " . $input['email'] . "\r\n" .
           "X-Mailer: PHP/" . phpversion() . "\r\n" .
           "Content-Type: text/plain; charset=utf-8";

// Пытаемся отправить email
try {
    $success = mail($to, $subject, $message, $headers);
    
    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Email sending failed');
    }
} catch (Exception $e) {
    error_log('Email error: ' . $e->getMessage());
    echo json_encode(['success' => false, 'error' => 'Server error']);
}
?>
