let url = window.location.href;
let baseURL;
if (url.split(":")[0] === "http") {
  baseURL = "http://localhost:5001";
} else {
  baseURL = "https://busy-pink-bullfrog-shoe.cyclic.app";
}
let allProducts = [];
const deleteProduct = (productId) => {
  //  console.log("delete product", productId);
  axios.delete(`${baseURL}/product/${productId}`)
  // axios.delete(`${baseURL}/product/63a9e5f480cbce21df4d9a69`)
    .then(function (response){
      console.log("deleted Data Response>>", response)
      console.log("deleted Data Response>>", response.data)
      console.log("deleted Data Response>>", response.data.message)
      getAllProducts();
    })
    .catch((error)=>{
      console.log("error>>> ", error)
    })
};
const editProduct = (currentDivId, productIndex) => {
  document.querySelector(`#${currentDivId}`).style.display = "block";
  let currentDivIndex = currentDivId.slice(-1);
  let product = allProducts[productIndex]
  console.log("Product in Edit Product", product)
  document.querySelector(`#updatedName${currentDivIndex}`).value = product.name;
  document.querySelector(`#updatedPrice${currentDivIndex}`).value = product.price;
  document.querySelector(`#updatedCategory${currentDivIndex}`).value = product.category;
  document.querySelector(`#updatedDescription${currentDivIndex}`).value = product.description;

  // console.log("Edit  product", productId);
};

const updateProduct=(currentDivId, productId, productIndex)=>{
  document.querySelector(`#${currentDivId}`).style.display = "none";
  let currentDivIndex = currentDivId.slice(-1);
  let name= document.querySelector(`#updatedName${currentDivIndex}`).value
  let price= +document.querySelector(`#updatedPrice${currentDivIndex}`).value
  let category= document.querySelector(`#updatedCategory${currentDivIndex}`).value
  let description= document.querySelector(`#updatedDescription${currentDivIndex}`).value

  const update = {
    name,
    price,
    category,
    description
  }
  console.log("update Product values>", update)
  axios.put(`${baseURL}/product/${productId}`, {...update})
    .then((response)=>{
      console.log("updated Product>>", response);
      allProducts[productIndex] = update;
      getAllProducts(); 
      console.log("latest Product >>", allProducts[productIndex])
    })
    .catch((error)=>{
      console.log('error>>>', error)
    })
  // console.log("Updated Product Index", currentDivId.slice(-1))
}
const getAllProducts = () => {
  axios.get(`${baseURL}/products`).then((response) => {
    let products = response.data.data;
    // console.log("response all Products >>> ", response);
    document.querySelector("#allProduct").innerHTML = "";
    // console.log("Products >", products);
    products.map((item, index) => {
      allProducts.push(item);
      return (document.querySelector(
        "#allProduct"
      ).innerHTML += `<div class='productDiv'>
      <h1>  Name : ${item.name} <br />
            Price : ${item.price} <br />
            Category : ${item.category} <br />
            Description : ${item.description} <br />
      </h1>
            <div class='deleteEdit'> 
            <button class='delete' onclick='deleteProduct("${item._id}")'> Delete </button>
            <button class='edit' onclick='editProduct("editFalse${index}", "${index}")'> Edit </button>
            </div>
            <div class="editFalse" id='editFalse${index}'>
            <h1> Edit </h1>

            <input type="text" id="updatedName${index}" placeholder="name"> <br>
            <input type="number" id="updatedPrice${index}" placeholder="price"> <br>
            <input type="text" id="updatedCategory${index}" placeholder="category"> <br>
            <input type="text" id="updatedDescription${index}" placeholder="description"> <br>
            <button onclick="updateProduct('editFalse${index}', '${item._id}', '${index}')"> submit</button>
            </div>
      </div>
      `);
    });
  });
};
{/* <form onsubmit="updateProduct('editFalse${index}'); return false">
</form> */}

const addProduct = () => {
  let name = document.querySelector("#productName").value;
  let price = +document.querySelector("#price").value;
  let category = document.querySelector("#category").value;
  let description = document.querySelector("#description").value;

  let productModel = {
    name,
    price,
    category,
    description,
  };
  axios
    .post(`${baseURL}/product`, productModel)
    // .post(`${baseURL}/product`, { name, price, category, description })
    .then((response) => {
      console.log("response:??>>>>", response.data.data);
      console.log("response:??>>>>", response.data.message);
      document.getElementById("mongodbResult").innerHTML =
        response.data.message;
      getAllProducts();
      // cityName.innerHTML = response.data.cityName;
      // temperature.innerHTML = ` Temperature: ${response.data.temperature} <sup>o</sup>C`;
      // humidity.innerHTML = ` Humidity: ${response.data.humidity}%`;
      // minMaxTemperature.innerHTML = ` Min-Max Temperature : ${response.data.min}<sup>o</sup>C-${response.data.max} <sup>o</sup>C`;
    })
    .catch((error) => {
      console.log("error :>>", error);
      console.log("error :>>", error.response.data);
      // document.getElementById("mongodbResult").innerHTML = error.data.message;
    });
};
//   axios.get(`${baseURL}/weather`)
//   .then((response)=>{
//     console.log("response:??>>>>", response.data)
//     cityName.innerHTML = response.data.cityName;
//     temperature.innerHTML = ` Temperature: ${response.data.temperature} <sup>o</sup>C`;
//     humidity.innerHTML = ` Humidity: ${response.data.humidity}%`;
//     minMaxTemperature.innerHTML = ` Min-Max Temperature : ${response.data.min}<sup>o</sup>C-${response.data.max} <sup>o</sup>C`;

//   })
//   .catch((error)=>{
//     console.log("error :>>", error)
//   })

// }
