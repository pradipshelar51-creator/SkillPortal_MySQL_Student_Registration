<?php
session_start();
$errors = [];
$message = '';
$name = '';
$email = '';
$skills = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $skills = trim($_POST['skills'] ?? '');

    // Practical 12: validation and safe string handling.
    if (mb_strlen($name) < 2) $errors[] = 'Name must contain at least 2 characters.';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email address.';
    if ($skills === '') $errors[] = 'Please enter at least one skill.';

    if (!$errors) {
        $formattedName = mb_convert_case($name, MB_CASE_TITLE, 'UTF-8');
        $skillWords = array_map('trim', explode(',', $skills));
        $_SESSION['student'] = ['name' => $formattedName, 'email' => $email, 'skills' => $skillWords];
        $message = 'Form submitted successfully. Session created for ' . $formattedName . '.';
        $name = $formattedName;
    }
}
if (isset($_GET['logout'])) {
    unset($_SESSION['student']);
    header('Location: form-session.php');
    exit;
}
function e($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PHP Form and Session — SkillPortal</title>
<style>
*{box-sizing:border-box}body{font-family:Arial,sans-serif;background:#f3f6ff;color:#17233d;margin:0;padding:30px}.wrap{max-width:760px;margin:auto;background:#fff;padding:30px;border-radius:16px;box-shadow:0 12px 35px #1b326015}h1{color:#203c7b}label{display:block;font-weight:bold;margin:15px 0 6px}input,textarea{width:100%;padding:12px;border:1px solid #ccd5e7;border-radius:8px;font:inherit}button,.btn{display:inline-block;background:#3b63df;color:#fff;padding:11px 16px;border:0;border-radius:8px;text-decoration:none;font-weight:bold;margin-top:18px;cursor:pointer}.error{background:#fff0f0;color:#a11;padding:12px;border-radius:8px}.success{background:#e8fff2;color:#12643a;padding:12px;border-radius:8px}.muted{color:#62708a;font-size:14px}li{margin:6px 0}
</style></head><body><main class="wrap">
<a href="/" class="muted">← SkillPortal home</a><h1>PHP Form Handling & Session</h1>
<p class="muted">Practical 12: validation, string manipulation and session management.</p>
<?php if ($errors): ?><div class="error"><strong>Please correct these items:</strong><ul><?php foreach ($errors as $error): ?><li><?= e($error) ?></li><?php endforeach; ?></ul></div><?php endif; ?>
<?php if ($message): ?><p class="success"><?= e($message) ?></p><?php endif; ?>
<form method="post" action="">
<label for="name">Student name</label><input id="name" name="name" value="<?= e($name) ?>" required minlength="2">
<label for="email">Email address</label><input id="email" name="email" type="email" value="<?= e($email) ?>" required>
<label for="skills">Skills (comma-separated)</label><textarea id="skills" name="skills" rows="3" required><?= e($skills) ?></textarea>
<button type="submit">Validate and Save Session</button></form>
<section><h2>Session information</h2>
<?php if (!empty($_SESSION['student'])): ?><p><strong>Name:</strong> <?= e($_SESSION['student']['name']) ?></p><p><strong>Email:</strong> <?= e($_SESSION['student']['email']) ?></p><p><strong>Skills:</strong> <?= e(implode(', ', $_SESSION['student']['skills'])) ?></p><a class="btn" href="?logout=1">Clear Session</a>
<?php else: ?><p class="muted">No student session is active. Submit the valid form to create one.</p><?php endif; ?></section>
</main></body></html>
