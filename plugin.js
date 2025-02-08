
window.addEventListener('load', function() {
    function checkAndOverride() {
        if (typeof tcart__getProductsInfoById === 'function') {
            console.log('Функция найдена, переопределяем!');
            tcart__getProductsInfoById = function(t, endpoint = "store.tildacdn.com", timeout = 20000, callback = null) {
                console.log('Функция переопределена!');
            
            const e = t.map(item => item.gen_uid);  
            const r = Date.now();
            let o = {
                productsuid: e,
                c: r
            };
            
            if (!window.t_store_endpoint) {
                window.t_store_endpoint = endpoint;
                try {
                    const a = document.getElementById("allrecords").getAttribute("data-tilda-root-zone");
                    if (a) window.t_store_endpoint = "store.tildaapi." + a;
                } catch (c) {}
            }
            
            const url = `https://${window.t_store_endpoint}/api/getproductsbyuid/`;
            o = JSON.stringify(o);
            
            const i = new XMLHttpRequest();
            i.onload = function() {
                if (i.readyState === i.DONE && i.status === 200) {
                    if (typeof i.responseText === "string" && i.responseText.startsWith("{")) {
                        try {
                            const response = JSON.parse(i.responseText);
                            if (typeof response === "object" && response !== null) {
                                const r = response.products;
                                let o = [];
                                t.forEach(item => {
                                    const index = r.map(product => product.uid).indexOf(parseInt(item.gen_uid, 10));
                                    const a = r[index];
                                    if (a) {
                                        let imgUrl = "";
                                        if (a.gallery) {
                                            const gallery = JSON.parse(a.gallery);
                                            if (gallery.length) {
                                                imgUrl = gallery[0].img;
                                            }
                                        }
                                        const editions = a.editions;
                                        const editionIndex = editions.map(product => product.uid).indexOf(parseInt(item.uid, 10));
                                        const edition = editions[editionIndex];
                                        edition.gen_uid = item.gen_uid;
                                        edition.name = item.name;
                                        edition.quantity = item.quantity;
                                        edition.options = item.options;
                                        edition.amount = item.quantity * item.price;
                                        if (!edition.img && imgUrl) {
                                            edition.img = imgUrl;
                                        }
                                        o.push(edition);
                                    }
                                });

                                if (callback && typeof callback === "function") {
                                    callback(i.responseText);
                                }
                                
                            } else {
                                console.log("Can't get products array by uid list");

                                if (callback && typeof callback === "function") {
                                    callback(i.responseText);
                                }
                                
                            }
                        } catch (c) {
                            console.log("Can't parse response for products by uid list");

                            if (callback && typeof callback === "function") {
                                callback(i.responseText);
                            }
                            
                        }
                    } else {
                        console.log("Invalid response format");
                    }
                }
            };
            
            i.ontimeout = i.onerror = function() {
                console.log(`Can't get getproductsbyuid. Requesting uids: ${e}`);
            };
            
            i.open("POST", url);
            i.timeout = timeout;
            i.send(o);
        };
        } else {
            console.log('Функция не найдена. Попробуем еще раз!');
            setTimeout(checkAndOverride, 500); // Повторим через 500 мс
        }
    }

    checkAndOverride(); // Изначальный вызов проверки
});
