const puppeteer = require('puppeteer');

//Ler pagina do instagram 

async function start(){

    async function loadMore(page, selector){
        const moreButton = await page.$(selector);
        if(moreButton){
            console.log("MORE");
            await moreButton.click();
            await page.waitFor(selector, {timeout: 3000}).catch(() => {console.log("Timeout") });
            await loadMore(page, selector)
        }
    }
    
    //pegar comentário do intagram 

    async function getComments(page, selector){
        const comments = await page.$$eval(selector, links => links.map(link => link.innerText));
        return comments;
    }

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK/');
    await loadMore(page,'.dCJp8');

    const arrobas = await getComments(page, '.C4VMK span a');
    const counted = countArrobas(arrobas);
    const sorted = sort(counted)

    sorted.forEach(arroba => {console.log(arroba)});

    await browser.close();
}


//contar arrobas repetidas 

function countArrobas(arrobas){
    const count = {};
    arrobas.forEach(arroba => { count[arroba] = (count [arroba] || 0) + 1});
    return count;
}

//ordenar 

function sort(counted){
    const entries = [];

    for (prop in counted){
        entries.push([prop, counted[prop]]);
    }

    const sorted = entries.sort((a,b) => b[1] - a[1]);
    return sorted;    
}

start();