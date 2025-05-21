let logoData = "";

document.getElementById("logoInput").addEventListener("change", function(e) {
  const reader = new FileReader();
  reader.onload = function(event) {
    logoData = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
});

function addItem() {
  const row = document.createElement("tr");
  row.innerHTML = `
    <td><input type="text" class="item-name"></td>
    <td><input type="number" class="item-qty" value="1" min="1"></td>
    <td><input type="number" class="item-price" value="0" step="0.01"></td>
    <td><button onclick="this.parentNode.parentNode.remove()">❌</button></td>
  `;
  document.querySelector("#itemTable tbody").appendChild(row);
}

function generateReceipt() {
  const name = document.getElementById('customerName').value;
  const cashier = document.getElementById('cashier').value;
  const date = document.getElementById('date').value;
  const time = document.getElementById('time').value;
  const taxPercent = parseFloat(document.getElementById('tax').value);
  const discount = parseFloat(document.getElementById('discount').value);

  const names = document.querySelectorAll(".item-name");
  const qtys = document.querySelectorAll(".item-qty");
  const prices = document.querySelectorAll(".item-price");

  let itemsHtml = '';
  let subtotal = 0;

  for (let i = 0; i < names.length; i++) {
    const itemName = names[i].value;
    const itemQty = parseInt(qtys[i].value);
    const itemPrice = parseFloat(prices[i].value);
    const total = itemQty * itemPrice;
    subtotal += total;
    itemsHtml += `<tr><td>${itemName}</td><td>${itemQty}</td><td style="text-align:right">Rs ${total.toFixed(2)}</td></tr>`;
  }

  const tax = (subtotal * taxPercent) / 100;
  const total = subtotal + tax - discount;

  const receiptHtml = `
    <div class="center">
      ${logoData ? `<img src="${logoData}" alt="Logo">` : ''}
      <h3>🛒 My Store</h3>
      <p>123 Market Road, City<br>Phone: 123-456-7890</p>
    </div>
    <hr>
    <table>
      <tr><td>Invoice #: 000${Math.floor(Math.random() * 1000)}</td>
      <td style="text-align:right">${date} ${time}</td></tr>
      <tr><td>Cashier: ${cashier}</td><td></td></tr>
      <tr><td>Customer: ${name}</td><td></td></tr>
    </table>
    <hr>
    <table>${itemsHtml}</table>
    <hr>
    <table>
      <tr><td>Subtotal</td><td style="text-align:right">Rs ${subtotal.toFixed(2)}</td></tr>
      <tr><td>Tax (${taxPercent}%)</td><td style="text-align:right">Rs ${tax.toFixed(2)}</td></tr>
      <tr><td>Discount</td><td style="text-align:right">Rs ${discount.toFixed(2)}</td></tr>
      <tr><td><strong>Total</strong></td><td style="text-align:right"><strong>Rs ${total.toFixed(2)}</strong></td></tr>
    </table>
    <hr>
    <div class="center">Thank you for shopping!</div>
  `;

  document.getElementById("receipt").innerHTML = receiptHtml;
  document.getElementById("receiptContainer").style.display = "block";
}

async function downloadPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, 150] });
  const receiptElement = document.getElementById("receipt");
  await doc.html(receiptElement, { x: 2, y: 2 });
  doc.save("invoice.pdf");
}
