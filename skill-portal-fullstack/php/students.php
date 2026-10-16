<?php
require __DIR__ . '/db.php';
$errors = [];
$notice = '';
$editStudent = null;

function e($value) { return htmlspecialchars((string)$value, ENT_QUOTES, 'UTF-8'); }

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
    $name = trim($_POST['name'] ?? '');
    $email = trim($_POST['email'] ?? '');
    $skill = trim($_POST['skill'] ?? 'React');

    try {
        if ($action === 'delete' && $id) {
            $stmt = $pdo->prepare('DELETE FROM students WHERE id = ?');
            $stmt->execute([$id]);
            $notice = 'Student deleted.';
        } elseif (in_array($action, ['create', 'update'], true)) {
            if (mb_strlen($name) < 2) $errors[] = 'Name must contain at least 2 characters.';
            if (!filter_var($email, FILTER_VALIDATE_EMAIL)) $errors[] = 'Enter a valid email.';
            if (!$errors && $action === 'create') {
                $stmt = $pdo->prepare('INSERT INTO students (name, email, skill) VALUES (?, ?, ?)');
                $stmt->execute([$name, $email, $skill]);
                $notice = 'Student created.';
            } elseif (!$errors && $action === 'update' && $id) {
                $stmt = $pdo->prepare('UPDATE students SET name = ?, email = ?, skill = ? WHERE id = ?');
                $stmt->execute([$name, $email, $skill, $id]);
                $notice = 'Student updated.';
            }
        }
    } catch (PDOException $exception) {
        $errors[] = $exception->getCode() === '23000' ? 'That email is already registered.' : 'Database operation failed.';
    }
}
if (isset($_GET['edit']) && ctype_digit($_GET['edit'])) {
    $stmt = $pdo->prepare('SELECT * FROM students WHERE id = ?');
    $stmt->execute([$_GET['edit']]);
    $editStudent = $stmt->fetch();
}
$students = $pdo->query('SELECT id, name, email, skill, created_at FROM students ORDER BY id DESC')->fetchAll();
?>
<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>PHP MySQL CRUD — SkillPortal</title>
<style>
*{box-sizing:border-box}body{font-family:Arial,sans-serif;background:#f3f6ff;color:#17233d;margin:0;padding:28px}.wrap{max-width:1050px;margin:auto;background:white;padding:28px;border-radius:16px;box-shadow:0 12px 35px #1b326015}h1,h2{color:#203c7b}input,select{padding:10px;border:1px solid #ccd5e7;border-radius:7px;font:inherit}button,.btn{padding:10px 13px;border:0;border-radius:7px;background:#3b63df;color:white;font-weight:bold;text-decoration:none;cursor:pointer}form.row{display:flex;gap:10px;flex-wrap:wrap;margin:18px 0}form.row input,form.row select{flex:1;min-width:160px}table{width:100%;border-collapse:collapse;margin-top:20px;overflow:auto}th,td{text-align:left;padding:11px;border-bottom:1px solid #e1e7f2;font-size:14px}th{background:#f0f3fc}.danger{background:#b42318}.success{background:#e8fff2;color:#12643a;padding:12px;border-radius:8px}.error{background:#fff0f0;color:#a11;padding:12px;border-radius:8px}.muted{color:#62708a;font-size:14px}
</style></head><body><main class="wrap"><a href="/" class="muted">← SkillPortal home</a><h1>PHP + MySQL Student CRUD</h1><p class="muted">Practical 13: create, read, update and delete student records using PDO prepared statements.</p>
<?php if ($notice): ?><p class="success"><?= e($notice) ?></p><?php endif; ?>
<?php if ($errors): ?><div class="error"><?php foreach ($errors as $error): ?><p><?= e($error) ?></p><?php endforeach; ?></div><?php endif; ?>
<h2><?= $editStudent ? 'Update student' : 'Add a student' ?></h2>
<form class="row" method="post">
<input type="hidden" name="action" value="<?= $editStudent ? 'update' : 'create' ?>"><input type="hidden" name="id" value="<?= e($editStudent['id'] ?? '') ?>">
<input name="name" placeholder="Student name" required minlength="2" value="<?= e($editStudent['name'] ?? '') ?>">
<input name="email" type="email" placeholder="Email address" required value="<?= e($editStudent['email'] ?? '') ?>">
<select name="skill"><option <?= ($editStudent['skill'] ?? '') === 'React' ? 'selected' : '' ?>>React</option><option <?= ($editStudent['skill'] ?? '') === 'JavaScript' ? 'selected' : '' ?>>JavaScript</option><option <?= ($editStudent['skill'] ?? '') === 'Python' ? 'selected' : '' ?>>Python</option><option <?= ($editStudent['skill'] ?? '') === 'SQL' ? 'selected' : '' ?>>SQL</option><option <?= ($editStudent['skill'] ?? '') === 'Node.js' ? 'selected' : '' ?>>Node.js</option></select>
<button type="submit"><?= $editStudent ? 'Update Student' : 'Add Student' ?></button><?php if ($editStudent): ?><a class="btn" href="students.php">Cancel</a><?php endif; ?></form>
<h2>Student records</h2><div style="overflow-x:auto"><table><thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Skill</th><th>Created</th><th>Actions</th></tr></thead><tbody>
<?php foreach ($students as $student): ?><tr><td><?= e($student['id']) ?></td><td><?= e($student['name']) ?></td><td><?= e($student['email']) ?></td><td><?= e($student['skill']) ?></td><td><?= e($student['created_at']) ?></td><td><a class="btn" href="?edit=<?= e($student['id']) ?>">Edit</a> <form method="post" style="display:inline" onsubmit="return confirm('Delete this record?')"><input type="hidden" name="action" value="delete"><input type="hidden" name="id" value="<?= e($student['id']) ?>"><button class="danger" type="submit">Delete</button></form></td></tr><?php endforeach; ?>
<?php if (!$students): ?><tr><td colspan="6">No students found. Add the first record above.</td></tr><?php endif; ?>
</tbody></table></div></main></body></html>
