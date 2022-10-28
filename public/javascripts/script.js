let idEdit = null;
const readData = () => {
  fetch('http://localhost:3000/users')
    .then((response) => response.json())
    .then((data) => {
      // console.log('data', data);
      let html = '';
      data.forEach((item, index) => {
        html += `
      <tr>
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
    });
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

readData();
