function searchMessages(input) {
  const table = document.querySelector(".message-table");
  const tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    const td = tr[i].querySelector(".message-content");
    if (td) {
      const txtValue = td.innerText || td.textContent;
      if (txtValue.toUpperCase().indexOf(input) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

function showAllRows() {
  const table = document.querySelector(".message-table");
  const tr = table.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    tr[i].style.display = "";
  }
}

module.exports = { searchMessages, showAllRows };
