<?php
/**
 * Yalla Ads (يلا ادز) — contact form handler.
 *
 * Receives the contact-page form and emails the lead through the agency's
 * own Google Workspace over authenticated SMTP, so SPF/DKIM pass and the
 * message lands in the inbox rather than spam.
 *
 * Credentials are NOT stored here. They live in mail_secrets.php, placed
 * one level above public_html on the server and never committed to git.
 *
 * Mirrors the handler already in production on performancemaxagency.com.
 */

header('Content-Type: application/json; charset=utf-8');

// Always answer 200 with a JSON body — a proxy replacing an origin 4xx/5xx
// with its own HTML page would break the JSON contract the form relies on,
// so success/failure is carried in the body, not the status code.

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
    exit;
}

// Honeypot: bots fill hidden fields, humans don't. Feign success so the bot moves on.
if (!empty($_POST['hp_field'] ?? '')) {
    echo json_encode(['success' => true]);
    exit;
}

function field(string $key, int $max = 2000): string {
    $v = trim((string) ($_POST[$key] ?? ''));
    return str_replace(["\r", "\n", "\0"], [' ', ' ', ''], substr($v, 0, $max));
}
function multiline(string $key, int $max = 5000): string {
    return trim(substr((string) ($_POST[$key] ?? ''), 0, $max));
}

$name    = field('name', 120);
$email   = field('email', 200);
$phone   = field('phone', 60);
$service = field('service', 120);
$message = multiline('message');

$errors = [];
if ($name === '')                                                $errors[] = 'name';
if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'email';

if ($errors) {
    echo json_encode([
        'success' => false,
        'error'   => 'الرجاء إدخال الاسم وبريد إلكتروني صحيح.',
        'fields'  => $errors,
    ]);
    exit;
}

// Credentials live above the web root: unreachable by URL and untouched by deploys.
$secretsFile = null;
foreach ([
    dirname(__DIR__) . '/mail_secrets.php', // above web root (recommended)
    __DIR__ . '/mail_secrets.php',          // fallback: inside public_html
] as $candidate) {
    if (is_file($candidate)) { $secretsFile = $candidate; break; }
}
if ($secretsFile === null) {
    echo json_encode([
        'success' => false,
        'error'   => 'البريد غير مهيأ بعد. راسلنا مباشرة على info@yalla-ads.com',
    ]);
    exit;
}
$cfg = require $secretsFile; // ['user' => ..., 'pass' => ..., 'to' => ...]

require __DIR__ . '/vendor/PHPMailer/Exception.php';
require __DIR__ . '/vendor/PHPMailer/PHPMailer.php';
require __DIR__ . '/vendor/PHPMailer/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Arabic labels so the email reads naturally in the inbox.
$rows = [
    'الاسم'         => $name,
    'البريد'        => $email,
    'الجوال'        => $phone,
    'الخدمة المطلوبة' => $service,
];
$lines = [];
foreach ($rows as $label => $val) {
    if ($val !== '') { $lines[] = $label . ': ' . $val; }
}
if ($message !== '') {
    $lines[] = '';
    $lines[] = 'الرسالة:';
    $lines[] = $message;
}
$body = implode("\n", $lines);

$mail = new PHPMailer(true);
try {
    $mail->isSMTP();
    $mail->Host       = $cfg['host'] ?? 'smtp.gmail.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = $cfg['user'];
    $mail->Password   = $cfg['pass'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = (int) ($cfg['port'] ?? 587);
    $mail->CharSet    = 'UTF-8';
    $mail->Timeout    = 15;

    // Authenticate as the real Workspace user, but send AS the Yalla Ads
    // address so nothing in the inbox reads "Performance MAX". Google accepts
    // this because yalla-ads.com is a user alias domain of the same account.
    // Replies go straight to the lead.
    $mail->setFrom($cfg['from'] ?? 'info@yalla-ads.com', 'Yalla Ads');
    $mail->addAddress($cfg['to'] ?? $cfg['user']);
    $mail->addReplyTo($email, $name);

    $mail->Subject = "[yalla-ads.com] طلب جديد — {$name}";
    $mail->Body    = $body;

    $mail->send();
    echo json_encode(['success' => true]);
} catch (Exception $e) {
    error_log('[send.php] Mail error: ' . $mail->ErrorInfo);
    echo json_encode([
        'success' => false,
        'error'   => 'صار خطأ أثناء إرسال رسالتك. راسلنا على info@yalla-ads.com',
    ]);
}
