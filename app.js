const form = document.querySelector('#booking-form');
const dialog = document.querySelector('#request-dialog');
const requestText = document.querySelector('#request-text');
const copyButton = document.querySelector('#copy-request');
const closeButton = document.querySelector('.dialog-close');
const pickupInput = document.querySelector('#pickup-date');
const returnInput = document.querySelector('#return-date');

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(today.getDate() + 1);
const formatInputDate = (date) => date.toISOString().split('T')[0];
pickupInput.min = formatInputDate(today);
returnInput.min = formatInputDate(tomorrow);

pickupInput.addEventListener('change', () => {
  if (!pickupInput.value) return;
  const nextDay = new Date(`${pickupInput.value}T12:00:00`);
  nextDay.setDate(nextDay.getDate() + 1);
  returnInput.min = formatInputDate(nextDay);
  if (returnInput.value && returnInput.value < returnInput.min) returnInput.value = '';
});

const formatTR = (value) => {
  if (!value) return '';
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit', month: '2-digit', year: 'numeric'
  }).format(new Date(`${value}T12:00:00`));
};

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const pickup = pickupInput.value;
  const returned = returnInput.value;
  const location = document.querySelector('#location').value.trim();

  if (returned <= pickup) {
    returnInput.setCustomValidity('İade tarihi teslim alma tarihinden sonra olmalıdır.');
    returnInput.reportValidity();
    returnInput.setCustomValidity('');
    return;
  }

  requestText.value = [
    'Merhaba, Fiat Egea kiralamak istiyorum.',
    `Teslim alma: ${formatTR(pickup)}`,
    `İade: ${formatTR(returned)}`,
    `Teslim yeri: ${location}`,
    'Müsaitlik ve toplam fiyat bilgisini paylaşır mısınız?'
  ].join('\n');
  dialog.showModal();
});

copyButton.addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(requestText.value);
  } catch {
    requestText.select();
    document.execCommand('copy');
  }
  copyButton.textContent = 'Kopyalandı';
  setTimeout(() => { copyButton.textContent = 'Mesajı Kopyala'; }, 1600);
});

closeButton.addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
  if (outside) dialog.close();
});
