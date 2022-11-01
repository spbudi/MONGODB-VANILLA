let idEdit = null;
let params = {
  display: 5,
  page: 1
}
const readData = () => {
  fetch('http://localhost:3000/users')
    .then((response) =>{
      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`)
      }
    return response.json()
  }).then((response) => {
    params = {...params, totalPages: response.totalPages }
    console.log('in', params);
      // console.log('data', data);
      // let html = '';
      // let offset = (parseInt(params.page) - 1) * params.display
      fetch(`http://localhost:3000/users?${new URLSearchParams(params).toString()}`).then((response) => {
            if (!response.ok) {
              throw new Erorr(`HTTP error! status ${response.status}`)
            }
            return response.json()
          }).then((response) => {
            params = { ...params, totalPages: response.totalPages }
            let html = ''
            let offset = (parseInt(params.page) - 1) * params.display
      response.data.forEach((item, index) => {
        html += `
      <tr>
        <td>${index + 1 + offset}</td>
        <td>${item.string}</td>
        <td>${item.integer}</td>
        <td>${item.float}</td>
        <td>${moment(item.date).format('DD MMM YYYY')}</td>
        <td>${item.boolean}</td>
        <td>
          <button class="btn btn-success" onclick= 'editData(${JSON.stringify(
            item
          )})'>Edit</button>
          <button class="btn btn-danger" onclick= "removeData('${
            item._id
          }')">Delete</button>
        </td>
    </tr>
      `;
      });
      document.getElementById('body-header').innerHTML = html;
      pagination()
    });
  })
};

const saveData = (e) => {
  e.preventDefault();
  const string = document.getElementById('string').value;
  const integer = document.getElementById('integer').value;
  const float = document.getElementById('float').value;
  const date = document.getElementById('date').value;
  const boolean = document.getElementById('boolean').value;
  // console.log(string, integer, float, date, boolean);

  if (idEdit == null) {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ string, integer, float, date, boolean }),
    })
      .then((response) => response.json())
      .then((data) => {
        readData();
        // console.log('data', data);
      });
  } else {
    fetch(`http://localhost:3000/users/${idEdit}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ string, integer, float, date, boolean }),
    })
      .then((response) => response.json())
      .then((data) => {
        readData();
        // console.log('data', data);
      });
    idEdit = null;
  }
  document.getElementById('string').value = '';
  document.getElementById('integer').value = '';
  document.getElementById('float').value = '';
  document.getElementById('date').value = '';
  document.getElementById('boolean').value = '';
  return false;
};

const removeData = (id) => {
  fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => response.json())
    .then((data) => {
      readData();
      // console.log('data', data);
    });
};

const editData = (user) => {
  // console.log('user', user);
  idEdit = user._id;
  document.getElementById('string').value = user.string;
  document.getElementById('integer').value = user.integer;
  document.getElementById('float').value = user.float;
  document.getElementById('date').value = moment(user.date).format(
    'YYYY-MM-DD'
  );
  document.getElementById('boolean').value = user.boolean;
};

const pagination = () => {
  let pagination = `<ul class="pagination">
  <li class="page-item${params.page == 1 ? ' disabled' : ''}">
    <a class="page-link" id="halaman" href="javascripts:void(0)" onclick="changePage(${parseInt(params.page) - 1})" aria-label="Previous">
      <span aria-hidden="true">&laquo;</span>
    </a>
  </li>`
for (let i = 1; i <= params.totalPages; i++) {
pagination += ` 
<li class="page-item${i == params.page ? ' active' : ''}"><a class="page-link" id="halaman" href="javascript:void(0)" id="angka" onclick="changePage(${i})">${i}</a></li>`
}
pagination += `<li class="page-item${params.page == params.totalPages ? ' disabled' : ''}">  
<a class="page-link" href="javascript:void(0)" onclick="changePage(${parseInt(params.page) + 1})" id="halaman" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
</a>
</li>

</ul>`
document.getElementById('pagination').innerHTML = pagination
}

changePage = (page) => {
  params = {...params, page }
  console.log(params);
  readData()
  return false
}

const resetData = () =>{
  document.getElementById('searchForm').reset()
  readData()
}

document.getElementById('searchForm').addEventListener('submit', (event) => {
  event.preventDefault()
  const page = 1
  const string = document.getElementById('searchString').value
  const integer = document.getElementById('searchInteger').value
  const float = document.getElementById('searchFloat').value
  const fromdate = document.getElementById('searchfromdate').value
  const todate = document.getElementById('searchtodate').value
  const boolean = document.getElementById('searchBoolean').value
  params = { ...params, string, integer, float, fromdate, todate, boolean, page }
  readData()
})

const sortTableByColumn = (table, column, asc = true) => {
  const dirModifier = asc ? 1 : -1;
  const tBody = table.tBodies[0];
  const rows = Array.from(tBody.querySelectorAll("tr"));
  const sortedRows = rows.sort((a, b) => {
    const aColText = a.querySelector(`td:nth-child(${column + 1})`).textContent.trim();
    const bColText = b.querySelector(`td:nth-child(${column + 1})`).textContent.trim();

    return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
  });

  // Remove all existing TRs from the table
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  // Re-add the newly sorted rows
  tBody.append(...sortedRows);

  // Remember how the column is currently sorted
  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${column + 1})`).classList.toggle("th-sort-desc", !asc);
}

document.querySelectorAll(".table-sortable th").forEach(headerCell => {
  headerCell.addEventListener("click", () => {
    const tableElement = headerCell.parentElement.parentElement.parentElement;
    const headerIndex = Array.prototype.indexOf.call(headerCell.parentElement.children, headerCell);
    const currentIsAscending = headerCell.classList.contains("th-sort-asc");

    sortTableByColumn(tableElement, headerIndex, !currentIsAscending);
  });
});

readData();
