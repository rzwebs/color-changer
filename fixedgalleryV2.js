    document.addEventListener('artBoardRendered', function () {
        let attr = $('#allrecords').attr('data-product-page');
    
        if (attr !== 'y') {
            $('.uc-loading-catalog').hide();
        }
    })

    // Создаём интервал для поиска атрибута
    let findGenUid = setInterval(function() {
        let attr = $('.js-store-product').attr('data-product-gen-uid');
        
        if (attr) {  // Если атрибут найден
            console.log('Found gen_uid:', attr);
            getProduct(attr);  // Вызываем функцию для получения продукта
            clearInterval(findGenUid);  // Останавливаем интервал
        } else {
            console.log('gen_uid не найден. Продолжаем искать...');
        }
    }, 500);

    function getProduct(attr) {
        let attempt = 0;  // Счётчик попыток
    
        // Создаём интервал для поиска продукта
        let interval = setInterval(function() {
            if (typeof tcart__getProductsInfoById === 'function') {
                console.log('Функция переопределена, вызываем её!');
    
                tcart__getProductsInfoById([{ gen_uid: attr }], "store.tildacdn.com", 20000, function(res) {
                    if (res) {
                        clearInterval(interval);
                        processProductData(res);  
                    } else {
                        console.log('Продукт не найден, пытаемся снова!');
                        attempt++;
    
                        // Если количество попыток превысило максимальное, останавливаем таймер
                        if (attempt >= 5) {
                            console.log('Не удалось найти продукт после 5 попыток.');
                            clearInterval(interval);  // Останавливаем таймер
                        }
                    }
                });
            } else {
                console.log('Функция tcart__getProductsInfoById не найдена!');
                clearInterval(interval);  // Останавливаем таймер, если функция не найдена
            }
        }, 500);  // Пытаемся каждые 5 секунд
    }
    
        async function processProductData(res) {
            console.log('процесс начался!');
            let response = JSON.parse(res);
            let bullets;
            
            if (window.innerWidth > 980) {
                bullets = document.querySelectorAll('.t-store__prod-popup__wrapper');
            } else {
                bullets = document.querySelectorAll('.t-slds__bullet');
            }

        
            for (let edition of response.products[0].editions) {
                console.log('эдишны нашлись!');
                let editionImg = edition.img;
                let editionColor = edition["Цвет"];
        
                for (let bullet of bullets) {
                    console.log('начинаем проходить буллиты!');
                    let bulletImg;
                    
                    if (window.innerWidth > 980) {
                        bulletImg = bullet.querySelector('.t-img').getAttribute('data-original');
                    } else {
                        bulletImg = bullet.querySelector('.t-slds__bgimg').getAttribute('data-original');
                    }
        
                    if (bulletImg === editionImg) {
                        bullet.setAttribute('data-color', editionColor);
                        console.log(`Добавлен атрибут data-color="${editionColor}" для буллита с изображением ${editionImg}`);
                    }
                }
            }
        
            findElements();
        }

        function findElements() {
            const activeColorInput = document.querySelectorAll('input[name="Цвет"]:checked');
            let bullets;
        
            if (window.innerWidth > 980) {
                bullets = document.querySelectorAll('.t-store__prod-popup__wrapper');
            } else {
                bullets = document.querySelectorAll('.t-slds__bullet');
            }
        
            if (activeColorInput.length > 0 && bullets.length > 0) {
                updateBullets(activeColorInput, bullets);
            } else {
                document.getElementById('rec855990183').style.display = "none";
            }
        }
        
        function updateBullets(activeColorInput, bullets) {
            const selectedColor = activeColorInput[0].value; // Получаем значение выбранного цвета
            let startShowing = false;
        
            bullets.forEach((bullet) => {
                // Если встретили следующий цвет, останавливаем показ
                if (bullet.dataset.color == selectedColor) {
                    startShowing = true;
                }
                
                if (bullet.dataset.color && bullet.dataset.color !== selectedColor && startShowing) {
                    startShowing = false;
                }
        
                // Если элемент должен быть показан, показываем его
                if (startShowing) {
                    bullet.style.display = window.innerWidth > 980 ? "inline-flex" : "inline-block";
                } else {
                    bullet.style.display = "none";
                }
        
                // Если встретили выбранный цвет, начинаем показ
                if (bullet.dataset.color === selectedColor) {
                    startShowing = true;
                }
            });
        
            // Скрываем элемент с id rec855990183
            document.getElementById('rec855990183').style.display = "none";
        }

document.addEventListener("click", function (event) {
    if (!event.isTrusted || !event.target.matches('input[name="Цвет"]')) return;

    const selectedColor = event.target.value;
    const wrappers = document.querySelectorAll('.t-store__prod-popup__wrapper');
    let startShowing = false;

    wrappers.forEach((wrapper) => {
        // Если встретили выбранный цвет, начинаем показ
        if (wrapper.dataset.color === selectedColor) {
            startShowing = true;
        }

        // Если встретили следующий цвет, останавливаем показ
        if (wrapper.dataset.color && wrapper.dataset.color !== selectedColor && startShowing) {
            startShowing = false;
        }

        // Если показ активен, показываем карточку
        if (startShowing) {
            if (window.innerWidth > 980) {
                wrapper.style.display = "inline-flex";
            } else {
                wrapper.style.display = "inline-block";
            }
        } else {
            // Иначе скрываем карточку
            wrapper.style.display = "none";
        }
    });
});
