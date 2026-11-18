const repeatForm = document.querySelector('#brief');
const repeatProduct = repeatForm.elements.namedItem('product');
const save = document.querySelector('#save-repeat');
const restore = document.querySelector('#restore-repeat');
const repeatStatus = document.querySelector('#repeat-status');
const repeatKey = 'print-demo-arztip-previous-spec';

function repeatValues() {
  return [...repeatForm.querySelectorAll('[name]:not([type=file])')]
    .filter(field => !field.disabled && field.name !== 'contact');
}

function readPrevious() {
  try {
    return JSON.parse(localStorage.getItem(repeatKey) || 'null');
  } catch {
    return null;
  }
}

restore.hidden = !readPrevious();
save.addEventListener('click', () => {
  try {
    localStorage.setItem(repeatKey, JSON.stringify(Object.fromEntries(repeatValues().map(field => [field.name, field.value]))));
    repeatStatus.textContent = 'Параметры сохранены в этом браузере. Контакт и файл не сохранены.';
    restore.hidden = false;
  } catch {
    repeatStatus.textContent = 'Браузер не разрешил сохранить параметры.';
  }
});
restore.addEventListener('click', () => {
  const previous = readPrevious();
  if (!previous) return;
  repeatProduct.value = previous.product || '';
  repeatProduct.dispatchEvent(new Event('change'));
  for (const field of repeatValues()) field.value = previous[field.name] || '';
  repeatForm.dispatchEvent(new Event('input'));
  repeatStatus.textContent = 'Параметры восстановлены. Проверьте тираж, срок и добавьте файл заново.';
  repeatProduct.focus();
});
