const estimate = document.querySelector('#estimate');
const estimateForm = document.querySelector('#brief');
const tariffMode = estimate.dataset.mode;
const drawingChoice = Number(estimate.dataset.productIndex);
const rubles = new Intl.NumberFormat('ru-RU');
const prices = {
  'aip-nn': {
    'Чёрно-белая': {'10%': {'А1':130,'А2':70}, 'До 50%': {'А1':150,'А2':90}},
    'Цветная': {'10%': {'А1':150,'А2':80}, 'До 50%': {'А1':180,'А2':100}},
  },
  nncopy: {
    'Схема или чертёж': {'А1':150,'А2':100},
    'Рисунок на обычной бумаге': {'А1':350,'А2':250},
    'Плакат на глянцевой фотобумаге': {'А1':670,'А2':400},
  },
};

function estimateDrawing() {
  if (estimateForm.elements.product.selectedIndex !== drawingChoice + 1) {
    estimate.hidden = true;
    return;
  }
  estimate.hidden = false;
  const values = new FormData(estimateForm);
  const format = values.get('format');
  const quantity = Number(values.get('quantity'));
  const rate = tariffMode === 'aip-nn'
    ? values.get('priced_paper') === 'Белая бумага 80 г/м²'
      && prices[tariffMode][values.get('color')]?.[values.get('density')]?.[format]
    : prices[tariffMode][values.get('drawing_type')]?.[format];
  estimate.textContent = Number.isInteger(quantity) && quantity > 0 && rate
    ? 'Ориентир по прайсу — ' + rubles.format(rate * quantity) + ' ₽ за комплект. Итог подтвердит типография.'
    : 'Ориентир доступен для А1 и А2. Укажите параметры печати и количество листов.';
}

for (const event of ['input','change']) estimateForm.addEventListener(event, estimateDrawing);
for (const trigger of document.querySelectorAll('[data-product]')) trigger.addEventListener('click', estimateDrawing);
estimateDrawing();
