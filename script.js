
window.onload = function () {
    init()
}
function init(){
    let httpRequest

    document.querySelector(".submit-button")
        .addEventListener('click', makeRequest)
}



function makeRequest(){
    
    httpRequest = new XMLHttpRequest()

    if (!httpRequest) {
        alert("Giving up! Cannot create an XMLHTTP instance")
    }

    let originplace = document.querySelector(".originplace").value
    let destinationplace = document.querySelector(".destinationplace").value
    let outboundpartialdate = document.querySelector(".date").value

    let URL = `https://skyscanner-skyscanner-flight-search-v1.p.rapidapi.com/apiservices/browsequotes/v1.0/US/USD/en-US/${originplace}-sky/${destinationplace}-sky/${outboundpartialdate}`

    httpRequest.onreadystatechange = processContents
    httpRequest.open("GET", URL)
    httpRequest.setRequestHeader("X-RapidAPI-Host", "skyscanner-skyscanner-flight-search-v1.p.rapidapi.com")
    httpRequest.setRequestHeader("X-RapidAPI-Key", "85397e8c0amsh409a2e3be20fce1p18f7c7jsnde35283a8ffb")
    httpRequest.send()
}

function processContents() {
    if(httpRequest.readyState === XMLHttpRequest.DONE){
        if (httpRequest.status === 200){
            let data = httpRequest.responseText

            if (data) {
                data = JSON.parse(data)

                if (data.Quotes) displayMinPrice(data.Quotes)
            }
        
        } else {
            alert("There was a problem with request")
        }
    }
}
function displayMinPrice(quotes) {
    let resultDisplay = document.querySelector(".row > .card-deck")
    let results = ''
    let count = 1

    for (let quote in quotes){
        if (quotes.hasOwnProperty(quote)){
            let direct = 'Direct Flight'
            if (!quotes[quote].Direct){
                direct = 'Indirect Flight'
            } 
            results += `<div class="card mb-4 shadow-sm">
                        <div class="card-header">
                            <h4 class="my-0 font-weight-normal">${direct}</h4>
                        </div>
                        <div class="card-body">
                            <h1 class="card-title pricing-card-title">$${quotes[quote].MinPrice}</h1>
                        </div>
                    </div>`
        }
    }
    resultDisplay.innerHTML = results
}









