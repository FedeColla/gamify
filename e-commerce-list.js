let storageSave = JSON.parse(localStorage.getItem('cartStorage')) || [];

// console.log(storageSave);

const emptyMessage = document.querySelector('#emptyState_cart');
const controlMore = document.querySelector('#control_more');
const controlLess = document.querySelector('#control_less');
const unitNumber = document.querySelector('#unit_number');
const containerListBuy = document.querySelector('.content_list_buy');


function dialog() {
    Swal.fire({
        title: "Secces buy!",
        text: "You have new games to play, get started!",
        icon: "success",
        confirmButtonText: "Keep looking",
        color: "#fafafa",
        background: "#1E1E1E",
    });
}

if(storageSave && storageSave.length > 0){
    if (emptyMessage) {
        emptyMessage.classList.add('disabled');
    }


    const listBuy = document.createElement('table');
    const tableHead = document.createElement('thead');
    const tableTr = document.createElement('tr');

    let tableTitles = ["Games", "Units", "Prices", " "];

    tableTitles.forEach(title => {
        const tableTh = document.createElement('th');
        tableTh.innerText = title;
        tableTr.appendChild(tableTh);
    });

    tableHead.appendChild(tableTr);
    listBuy.appendChild(tableHead);

    const tableBody = document.createElement('tbody');

    storageSave.forEach(product => {

        const tableProductTr = document.createElement('tr');
        tableProductTr.innerHTML = `
            <td>
                <div class="hero-list">
                    <img class="portrait" src="${product.Image}" style="width:70px;height:70px;">
                    <h3>${product.Name}</h3>
                </div>
            </td>
            <td>
                <div class="units">
                <p class="controls extra_padding" id="control_less">-</p>
                <p id="unit_number">${product.Unit}</p>
                <p class="controls" id="control_more">+</p>
                </div>
            </td>
            <td>
                <div class="cart-list">
                    <h4 id="price_number">${'$' + product.Price * product.Unit}</h4>
                    <div class="chip-discocunt">
                        <p>${'-' + product.Discount + '%'}</p>
                    </div>
                </div>
            </td>
            <td>
                <span class="delete-icon" id=${product.ID}><i class="fa-regular fa-trash-can"></i></span>
            </td>
        `;
        
        const ctrlMore = tableProductTr.querySelector('#control_more');
        const ctrlLess = tableProductTr.querySelector('#control_less');
        const unitNumber = tableProductTr.querySelector('#unit_number');
        const priceNumber = tableProductTr.querySelector('#price_number');
        const deleteButton = tableProductTr.querySelector('.delete-icon');
    

        ctrlMore.addEventListener('click', () => {
            const storageProduct = storageSave.find(item => item.ID === product.ID);
            if (storageProduct) {
                storageProduct.Unit++; // Incrementar la unidad en el array
                let newPriceNumber= storageProduct.Price * storageProduct.Unit;
                priceNumber.textContent = newPriceNumber; // Actualizar el DOM
                unitNumber.textContent = storageProduct.Unit; // Actualizar el DOM
                localStorage.setItem('cartStorage', JSON.stringify(storageSave));
                updateTableFoot(storageSave);
            }
        });
    
        ctrlLess.addEventListener('click', () => {
            const storageProduct = storageSave.find(item => item.ID === product.ID);
            if (storageProduct && storageProduct.Unit > 0) {
                storageProduct.Unit--; // Decrementar la unidad en el array
                let newPriceNumber= storageProduct.Price * storageProduct.Unit;
                priceNumber.textContent = newPriceNumber; // Actualizar el DOM
                unitNumber.textContent = storageProduct.Unit; // Actualizar el DOM
                localStorage.setItem('cartStorage', JSON.stringify(storageSave));
                updateTableFoot(storageSave);
            } if (storageProduct && storageProduct.Unit === 0) {
                deleteProduct()
            }
        });

        function deleteProduct() {
            storageSave = storageSave.filter(item => item.ID !== product.ID);
            localStorage.setItem('cartStorage', JSON.stringify(storageSave));
            tableProductTr.remove();
            updateTableFoot(storageSave);

            if (storageSave.length === 0) {
                // containerListBuy.innerHTML = '';
                containerListBuy.classList.add('disabled');
                emptyMessage.classList.remove('disabled');
            }
        }

        deleteButton.addEventListener('click', () => {
            deleteProduct()
        });

        tableBody.appendChild(tableProductTr)
        listBuy.appendChild(tableBody);
    });

    const tableFoot = document.createElement('tfoot');
    listBuy.appendChild(tableFoot);
    updateTableFoot(storageSave)

    // Función para actualizar el pie de la tabla
     
    function updateTableFoot(storage) {
        let totalUnits = storage.reduce((accumulator, current) => accumulator + current.Unit, 0);
        let totalPrice = storage.reduce((accumulator, current) => accumulator + current.Price * current.Unit, 0);
    
        tableFoot.innerHTML = `
            <tr>
                <td>
                    <p>TOTAL:</p>
                </td>
                <td>
                    <div class="units">
                        <p>${totalUnits}</p>
                    </div>
                </td>
                <td>
                    <div class="cart-list">
                        <h4>${'$' + totalPrice}</h4>
                    </div>
                </td>
                <td>
                    <div class="actions">
                        <button class="cta" id='buy'>Buy</button>
                    </div>
                </td>
            </tr>
        `;

        if (containerListBuy && storage && storage.length > 0) {
            containerListBuy.appendChild(listBuy); 
            let ctaBuy = document.querySelector('#buy');
       
            ctaBuy.addEventListener('click', () => {
                dialog();
                localStorage.clear();
                containerListBuy.classList.add('disabled');
                emptyMessage.classList.remove('disabled');
            });
        }
    }
};
