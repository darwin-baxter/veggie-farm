const http = require('http');
const fs = require('fs');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require("./modules/replaceTemplate");
const tempOverview = fs.readFileSync(`${__dirname}/templates/temp-overview.html`, "utf-8");
const tempCard = fs.readFileSync(`${__dirname}/templates/temp-card.html`, "utf-8");
const tempProduct = fs.readFileSync(`${__dirname}/templates/temp-product.html`, "utf-8");

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);
const slug = dataObj.map(ele => slugify(ele.productName,{lower:true}));
console.log(slug);
const server = http.createServer((req, res) => {
    //console.log(req.url); //prints out all the extra part of url after the base or home address
    //cosole.log(url.parse(req.url,true)); //prints out the info received from the url parsed into a Json
    //object, containing various key value attributes.
    //We need true there in the parse function in order to parse the query into an object
    const query =JSON.parse(JSON.stringify(url.parse(req.url,true).query)); 
    const pathname = url.parse(req.url,true).pathname;

    if (pathname === '/' || pathname === '/overview') {
        const cardsHtml = dataObj.map(ele => replaceTemplate(tempCard, ele)).join('');
        const output = tempOverview.replace("{%ProductCards%}", cardsHtml)
        res.end(output);
    }
    else if (pathname === "/product") {
        const product = dataObj[query.id];
        const output= replaceTemplate(tempProduct,product);
        res.writeHead(200, { 'Content-type': 'text/html' });
        res.end(output);
    }
    else if (pathname === "/api") {
        res.writeHead(200, { 'Content-type': 'application/json' });
        res.end(data);
    }
    else {
        res.writeHead(404, { 'Content-type': 'text/html', 'my-own-header': "Hello World" });
        //In native node u have to make the browser aware of what is heading its way
        res.end("<h1> Page not Found </h1>");//res.send() is an express method
    }
})

server.listen("3000", () => { console.log("Server up and running at 3000") });