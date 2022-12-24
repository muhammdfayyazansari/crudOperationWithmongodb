let url = window.location.href;
let baseURL;
if(url.split("/")[0] === "http:"){
  baseURL = "http://localhost:5001"
}else{
  baseURL = "https://busy-pink-bullfrog-shoe.cyclic.app"
}


let getWeather=()=>{
  let cityName = document.querySelector("#cityName")
  let temperature = document.querySelector("#temperature")
  let humidity = document.querySelector("#humidity")
  let minMaxTemperature = document.querySelector("#minMaxTemperature")
  axios.get(`${baseURL}/weather`)
  .then((response)=>{
    console.log("response:??>>>>", response.data)
    cityName.innerHTML = response.data.cityName;
    temperature.innerHTML = ` Temperature: ${response.data.temperature} <sup>o</sup>C`;
    humidity.innerHTML = ` Humidity: ${response.data.humidity}%`;
    minMaxTemperature.innerHTML = ` Min-Max Temperature : ${response.data.min}<sup>o</sup>C-${response.data.max} <sup>o</sup>C`;


  })
  .catch((error)=>{
    console.log("error :>>", error)
  })

}