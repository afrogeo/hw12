var http = require('http');
var url = require('url');
var port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://comp20:nikodeedo@cluster0.jyaa0.mongodb.net/companies?retryWrites=true&w=majority"


http.createServer(function(req,res) {
    res.writeHead(200, {'Content-Type':'text/html'});
    var qobj = url.parse(req.url,true).query;
    var company = qobj.comp;
    var ticker = qobj.tick;


    if (company) {
        MongoClient.connect(uri, { useUnifiedTopology: true},
            function(err,db)  {
                if (err) { console.log("CONNECTION ERR: " + err); return;}

                var dbo = db.db("companies");
                var coll = dbo.collection('companies');
                const query = {Company: company}
                
                coll.find(query).toArray(function(err,items) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        if (items.length == 0) {
                            res.write("<h2> No company " + company + " found! </h2>");
                        } else {
                            res.write("<h2> Companies: ");
                            for (i=0;i<items.length;i++) {
                                res.write(i + ": " + items[i].Company + "StickeR: " +
                                items[i].Ticker + "</h2>");
                            }
                        }
                    }
                    db.close();
                });
                console.log("Success!");
        });      

    } else {
        MongoClient.connect(uri, { useUnifiedTopology: true},
            function(err,db)  {
                if (err) { console.log("CONNECTION ERR: " + err); return;}

                var dbo = db.db("companies");
                var coll = dbo.collection('companies');
                const query = {Ticker: ticker}
                
                coll.find(query).toArray(function(err,items) {
                    if (err) {
                        console.log("Error: " + err);
                    } else {
                        if (items.length == 0) {
                            res.write("<h2> No companies with ticker " + ticker + " found! </h2>");
                        } else {
                            res.write("<h2> Companies: ");
                            for (i=0;i<items.length;i++) {
                                res.write(i + ": " + items[i].Company + " StickeR: " +
                                items[i].Ticker + "<h2>");
                            }
                        }
                    }
                    db.close();
                });
                console.log("Success!");
        });      
    }

}).listen(port);
