let products = null; // global var.
let result = null;
// first we will fetch the data in form of array of objects
axios("https://622c71db087e0e041e0b7c99.mockapi.io/products").then((res) => {
  // res will be an object
  if (res.status == 200) {
    products = res.data; // res.data will be an array of objects
    result = res.data;
    renderProducts(res.data); // function call to print res.data
  }
});

// function to display data
function renderProducts(data) {
  // data will be an array of objects
  let tbody = document.querySelector("#products-table tbody");
  tbody.innerHTML = ""; // clear tbody
  data.forEach((product) => {
    tbody.innerHTML += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.color}</td>
                <td>${product.department}</td>
                <td>${product.inStock}</td>
                <td>
                <a href="#" onclick="editProduct(${product.id},event)" class="btn btn-secondary">EDIT</a>
                <button onclick="deleteProduct(${product.id},event)" class="btn btn-danger">DELETE</button>
                <td>
            </tr>
        
        `;
  });
}
// function for search bar functionality
// async function search(e) {
//   let Value = e.target.value; // Value is the text present in seach box
//   console.log(Value);
//   //   products is the array of object which has all the records in the table
//   // ele will traverse each object of products one by  one
//   result = await products.filter((ele) =>
//     // we will split each ele.name by empty space , and then ele.name will becone itself an array of strings .
//     // then we will select only those ele.name whose any element starts with given value
//     ele.name
//       .split(" ")
//       .some((word) => word.toUpperCase().startsWith(Value.toUpperCase()))
//   );
//   //   result stores the filtered array of object which need to be printed
//   renderProducts(result);
//   // console.log(result);
// }
async function search(e) {
  let Value = e.target.value;
  console.log(Value);
  result = await products.filter((ele) => {
    let string = ele.name;
    let curr = 0;
    let flag = true;
    while (string.toUpperCase().startsWith(Value.toUpperCase()) == false) {
      curr = string.indexOf(" ", curr) + 1;
      if (curr == 0) {
        flag = false;
        break;
      }
      string = string.substring(curr);
    }
    return flag;
  });
  renderProducts(result);
}
let count_number = 0;
function number_sort(e) {
  const compare1 = (a, b) => {
    if (count_number % 2 == 0) return a[e] - b[e];
    else return b[e] - a[e];
    // to sort in descending we return "b - a" instead of "a - b"
  };
  result.sort(compare1);
  count_number++;
  renderProducts(result);
}
let count_string = 0;
function string_sort(e) {
  const compare1 = (i, j) => {
    i = i[e].replaceAll(" ", "").toUpperCase();
    j = j[e].replaceAll(" ", "").toUpperCase();
    if (i > j) return 1;
    if (j > i) return -1;
    return 0;
    // this is for ascending order
  };
  const compare2 = (i, j) => {
    i = i[e].replaceAll(" ", "").toUpperCase();
    j = j[e].replaceAll(" ", "").toUpperCase();
    if (i > j) return -1;
    if (j > i) return 1;
    return 0;
    // this is for descending order
  };
  if (count_string % 2 === 0) {
    result.sort(compare1);
  } else {
    result.sort(compare2);
  }
  count_string++;
  renderProducts(result);
}
let isAsc = true;
let sortColumn = "id";
function sortProduct(sortBy, type) {
  // whenever we click on a new column we sort it in ascending else we alter isAsc
  if (sortColumn == sortBy) isAsc = !isAsc;
  else {
    isAsc = true;
    sortColumn = sortBy;
  }
  let res = sorting(result, sortBy, type, isAsc);
  renderProducts(res);
}
function sorting(array, sortBy, type, isAsc) {
  if (type === "string") {
    array.sort((a, b) => {
      a = a[sortBy].toUpperCase();
      b = b[sortBy].toUpperCase();
      if (a > b) return isAsc ? 1 : -1;
      if (a < b) return isAsc ? -1 : 1;
      return 0;
    });
  } else if (type === "number") {
    array.sort((a, b) => {
      a = a[sortBy];
      b = b[sortBy];
      if (isAsc) return a - b;
      return b - a;
    });
  }
  return array;
}

function editProduct(id, e) {
  console.log(id);
  // same as Document we have 'Window' which targets the content in window
  // to redirect ot another page we use " window.location.href = 'html_link' " OR "
  // window.location.replace('https://www.w3schools.com') "

  // the data which we want to send to another page will be send using "query_strings" in which after the
  // link we write a '?' and then a key value pair seperate by '=' and if we want to send
  // more key value pair we write '&' between two key value pairs
  window.location.href = `edit_product.html?id=${id}`;
}

function deleteProduct(id, e) {
  console.log(id);
  console.log(e.target); // e.target is the code of button which we clicked
  let input = confirm(`DO YOU WANT TO DELETE`);
  if (input) {
    axios
      .delete(`https://622c71db087e0e041e0b7c99.mockapi.io/products/${id}`) // this will delete the row in backend
      .then((res) => {
        if (res.status === 200) {
          // closest() is same as querySelector() but it returns the
          // closest 'tr' ancestor of tag/id/class passed
          // example:- e.target.querySelector('x') returns the tag 'x' in 'e.target' .
          // But e.target.closest('x') returns the tag 'x' which is the closest ancestor(parent) of e.target
          e.target.closest("tr").remove(); // remove() will delete the row in frontend only
        }
      });
  }
}
