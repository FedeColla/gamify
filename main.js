let fecha = new Date(2024 , 10, 17, 18);
let msDate = fecha.getTime();

let textDays = document.querySelector("#days");
let textHours = document.querySelector("#hours");
let textMinutes = document.querySelector("#minutes");
let textSeconds = document.querySelector("#seconds");
let counter = document.querySelector("#counter");

let intervalo = setInterval(()=> {
    let today = new Date().getTime();
    let distance = msDate - today;

    let msByDay = 1000 * 60 * 60 *24;
    let msByHour = 1000 * 60 * 60;
    let msByMinute = 1000 * 60;
    let msBySeconds = 1000;

    let days = Math.floor(distance / msByDay);
    let hours = Math.floor((distance % msByDay) / msByHour);
    let minutes = Math.floor((distance % msByHour) / msByMinute);
    let seconds = Math.floor((distance % msByMinute) / msBySeconds);

    textDays.innerText = days < 10 ? "0" + days:days;
    textHours.innerText = hours < 10 ? "0" + hours:hours;
    textMinutes.innerText = minutes < 10 ? "0" + minutes:minutes;
    textSeconds.innerText = seconds < 10 ? "0" + seconds:seconds;

}, 1000)

document.addEventListener('DOMContentLoaded', () =>{
    const APIKEY = "bca288be990b4300af502dea4df7556f";
    const url = `https://api.rawg.io/api/games?key=${APIKEY}&dates=2020-01-01,2024-05-30&ordering=-added`;

    
    function toast() {
        Toastify({
            text: "GAME ADDED",
            duration: 3000,
            destination: "./e-commerce-list.html",
            close: false,
            avatar: './assets/check_box.svg',
            gravity: "top",
            position: "right",
            stopOnFocus: false,
            style: {
              background: "linear-gradient(to bottom, #77FEF5, #3EC598)",
              color: "#1E1E1E",
              fontWeight: "600",
            },
            onClick: function(){} 
          }).showToast();
    }

    const cardContainer = document.querySelector(".card-container");
    const heroCard = document.querySelector(".hero-card");
    const notification = document.querySelector(".notification");

    let cart;
    const storageSaveLS = JSON.parse(localStorage.getItem('cartStorage'));
    if (storageSaveLS) {
        cart = storageSaveLS;
        cartCounter()
    } else{
        cart = [];
    }

    async function getApi() {
        let resp  = await fetch(url);
        let data = await resp.json();

        if (cardContainer) {
            data.results.forEach((post) => {
                let id = post.id;
                let imgBackground = post.background_image;
                let rating = post.rating;
                let genre = post.genres[0].name;
                let name = post.name;
                let platform = [post.platforms[0].platform.name,post.platforms[1].platform.name];
                let platforms = platform.join(" | ");
                let price = Math.floor(Math.random() * 92) + 8;
                let discount = Math.floor(Math.random() * 21) + 5;
                let oldPrice = Math.floor(price + (price * (discount / 100)));
    
                let gameCard = document.createElement("div");
                gameCard.classList.add('game-card');
                gameCard.id = id;
                gameCard.innerHTML = `
                <div class="hero-card">
                    <img class="portrait" src="${imgBackground}">
                    <div class="chips">
                        <div class="chip">
                            <p class="chip-text">${rating}</p>
                            <img src="" alt="rating:${rating}" id="status">
                        </div>
                        <div class="chip status-information">
                            <p class="chip-text">${genre}</p>
                            <img src="/assets/category.svg" alt="${genre}">
                        </div>
                    </div>
                    <div class="hero-gradient"></div>
                </div>
                <div class="content-card">
                    <div class="heading">
                        <div class="texts">
                            <h3>${name}</h3>
                            <p>${platforms}</p>
                        </div>
                        <div class="options">
                            <div class="prices">
                                <h4>${'$' + price}</h4>
                                <div class="discount_resoult">
                                    <div class="chip-discocunt">
                                        <p>${'-' + discount + '%'}</p>
                                    </div>
                                    <h5>${'$' + oldPrice}</h5>
                                </div>
                            </div>
                            <i class="fa-regular fa-heart" id="fav_button"></i>
                        </div>
                    </div>
                    <div class="actions">
                        <button class="cta"><i class="fa-solid fa-plus"></i></i>Add to cart</button>
                    </div>
                </div>
                `
    
                cardContainer.append(gameCard);
    
                //Acá planteo todo lo necesario para el efecto hover/press de las cards
                const cta = gameCard.querySelector(".cta");
                const heroGradient = gameCard.querySelector(".hero-gradient");
                const contentCard = gameCard.querySelector(".content-card");
                const portraitCard = gameCard.querySelector(".portrait");
                const favButton = gameCard.querySelector("#fav_button");
                
                favButton.addEventListener('click', () => {
                    favButton.classList.toggle("fa-solid");
                });
    
                gameCard.addEventListener('mouseover', () => {
                    cta.classList.add("hover");
                    heroGradient.classList.add("hover");
                    contentCard.classList.add("hover");
                    portraitCard.classList.add("hover");
                });
    
                gameCard.addEventListener('mouseout', () => {
                    cta.classList.remove("hover");
                    heroGradient.classList.remove("hover");
                    contentCard.classList.remove("hover");
                    portraitCard.classList.remove("hover");
                });
    
                //valoraciones/status highScore-lowScore
                const ratingChip = gameCard.querySelector('.chip');
                const statusImg = gameCard.querySelector('#status');
    
                if (rating >= 4) {
                    ratingChip.classList.add("status-highScore");
                    statusImg.src = "/assets/smily_star.svg";
                } else {
                    ratingChip.classList.add("status-lowScore");
                    statusImg.src = "/assets/sad_star.svg";
                }
    
                function addCart() { //sumo juegos al carrito
                    const alreadyExistsIndex = cart.findIndex(product => product.ID === id);
    
                    if(alreadyExistsIndex !== -1){
                        cart[alreadyExistsIndex].Unit +=1;
    
                    } else {
                        cart.push({
                            ID: id,
                            Image: imgBackground,
                            Name: name,
                            Price: price,
                            Discount: discount,
                            Unit: 1
                        });
                    } 
                    localStorage.setItem('cartStorage', JSON.stringify(cart));
            
                }
                
                cta.addEventListener('click', () => {
                    addCart();
                    toast();
                    console.log(cart)
                    cartCounter()
                });       
    
            });
        }
    }
    function cartCounter() {
        const storageSave = JSON.parse(localStorage.getItem('cartStorage')) || [];
        let totalUnits = storageSave.reduce((acc, product) => acc + product.Unit, 0);
        let counterNotification = totalUnits;
        if (notification) {
            notification.innerText = counterNotification;
            notification.style.display = counterNotification > 0 ? "block" : "none";
        }

    }

    getApi();

});