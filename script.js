document.addEventListener('DOMContentLoaded', () => {
  const hutangTableBody = document.getElementById('hutangTableBody');
  const hutangForm = document.getElementById('hutangForm');
  const namaInput = document.getElementById('nama');
  const pinjamanInput = document.getElementById('pinjaman');
  const bayarInput = document.getElementById('bayar');
  const totalInput = document.getElementById('total');
  const hutangIndexInput = document.getElementById('hutangIndex');
  const totalHutangDiv = document.getElementById('totalHutang');

  function loadHutang() {
    hutangTableBody.innerHTML = '';
    const data = JSON.parse(localStorage.getItem('hutang')) || [];
    let totalBelumLunas = 0;
    data.forEach((item, index) => {
      const sisa = item.pinjaman - item.bayar;
      if (sisa > 0) totalBelumLunas += sisa;
      const row = document.createElement('tr');
      row.innerHTML = `
        <td class="text-center fw-bold class="text-nowrap">${index + 1}</td>
        <td>${item.nama}</td>
        <td class="text-center text-nowrap">Rp ${item.pinjaman.toLocaleString('id-ID')}</td>
        <td class="text-center text-nowrap">Rp ${item.bayar.toLocaleString('id-ID')}</td>
        <td class="text-center text-nowrap">Rp ${sisa.toLocaleString('id-ID')}</td>
        <td class="text-center text-nowrap">
          <button class="btn btn-outline-primary btn-sm" onclick="editHutang(${index})">Edit</button>
          <button class="btn btn-outline-danger btn-sm" onclick="hapusHutang(${index})">Hapus</button>
        </td>
      `;
      hutangTableBody.appendChild(row);
    });
    totalHutangDiv.textContent = `> Total Uang di Luar: Rp ${totalBelumLunas.toLocaleString('id-ID')}`;
  }

  function simpanHutang(data) {
    localStorage.setItem('hutang', JSON.stringify(data));
  }

  hutangForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama = namaInput.value.trim();
    const pinjaman = parseInt(pinjamanInput.value) || 0;
    const bayar = parseInt(bayarInput.value) || 0;
    const index = hutangIndexInput.value;

    const data = JSON.parse(localStorage.getItem('hutang')) || [];
    if (index === '') {
      data.push({ nama, pinjaman, bayar: 0 });
    } else {
      data[index] = { nama, pinjaman, bayar };
    }

    simpanHutang(data);
    loadHutang();
    hutangForm.reset();
    bayarInput.disabled = true;
    totalInput.value = '';
    hutangIndexInput.value = '';
    const modal = bootstrap.Modal.getInstance(document.getElementById('addModal'));
    modal.hide();
  });

  window.editHutang = function(index) {
    const data = JSON.parse(localStorage.getItem('hutang')) || [];
    const hutang = data[index];
    namaInput.value = hutang.nama;
    pinjamanInput.value = hutang.pinjaman;
    bayarInput.value = hutang.bayar;
    totalInput.value = hutang.pinjaman - hutang.bayar;
    bayarInput.disabled = false;
    hutangIndexInput.value = index;

    const modal = new bootstrap.Modal(document.getElementById('addModal'));
    modal.show();
  };

  window.hapusHutang = function(index) {
    const data = JSON.parse(localStorage.getItem('hutang')) || [];
    data.splice(index, 1);
    simpanHutang(data);
    loadHutang();
  };

  pinjamanInput.addEventListener('input', () => {
    if (hutangIndexInput.value === '') {
      totalInput.value = pinjamanInput.value;
    }
  });

  bayarInput.addEventListener('input', () => {
    const pinjaman = parseInt(pinjamanInput.value) || 0;
    const bayar = parseInt(bayarInput.value) || 0;
    totalInput.value = pinjaman - bayar;
  });

  document.getElementById('downloadBtn').addEventListener('click', () => {
    const data = JSON.parse(localStorage.getItem('hutang')) || [];
    const lines = [];

    data.forEach(item => {
      const sisa = item.pinjaman - item.bayar;
      if (sisa > 0) {
        lines.push(`${item.nama} masih memiliki hutang sebesar Rp. ${sisa.toLocaleString('id-ID')},-`);
      }
    });

    if (lines.length === 0) {
      alert("Tidak ada hutang yang belum lunas.");
      return;
    }

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'catatan-hutang.txt';
    a.click();

    URL.revokeObjectURL(url);
  });

  loadHutang();
});

// Tanggal real-time
function updateTanggal() {
  const now = new Date();
  const tgl = String(now.getDate()).padStart(2, '0');
  const bln = String(now.getMonth() + 1).padStart(2, '0');
  const thn = now.getFullYear();
  document.getElementById('tanggalSekarang').textContent = `${tgl}/${bln}/${thn}`;
}
setInterval(updateTanggal, 1000);
updateTanggal();
