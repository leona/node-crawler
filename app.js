var async = require('async');
var request = require('request');
var md5 = require('MD5');
var fs = require('node-fs');

var crawler = {
    site_store: [],
    
    initiate: function(max_procs, url, depth) {
        
        this.fetchBody(url, function(body) {
            this.site_store = crawler.parseUrl(body);
            this.site_store = crawler.cleanArray(this.site_store);
            var iter_count  = 0;
   
            while (this.site_store.length < depth) {
                var work_array = [];
                var iter_stop;
                
                if (this.site_store.length > iter_count + max_procs) {
                    iter_stop = iter_count + max_procs;
                } else {
                    iter_stop = this.site_store.length;
                }
                
                work_array = this.site_store.slice(iter_count, iter_stop);
         
                async.map(work_array, crawler.thread, function(err, results){
                    console.log(err);
                });
                
                //for(i = 0;i < work_array.length;i++) {
                    fs.readFile(crawler.datPath(), 'utf8', function (err, data) {
                      if (err) {
                        return console.log('No urls parsed: ' + err);
                      }
                      this.site_store.push(data.split("\n"));
                    });
                
                //}
                
                break;
            }
        });
    },
    thread: function(item, callback) {
        crawler.fetchBody(item, function(body) {
            crawler.site_store = crawler.parseUrl(body);
         
            if (typeof crawler.site_store != "undefined" && crawler.site_store != null && crawler.site_store.length > 0)
                fs.writeFile(crawler.datPath(item), crawler.site_store.join("\n")); 
        })
    },
    parseUrl: function(body) {
        if (typeof body !== 'undefined')
            return body.match(/(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig);
    },
    fetchBody: function(url, callback) {
        request.get(url).on('response', function(response) {
            var body = '';
         
            response.on('data', function(chunk) {
                body += chunk;
            });
            response.on('end', function() {
                callback(body);
                return;
            });
        });
    },
    datPath: function(url) {
        return __dirname + '/store/dat_';
        return __dirname + '/store/dat_' + md5(url);
    },
    cleanArray: function(arr) {
        return arr.filter(function(value, index, self) { 
            return self.indexOf(value) === index;
        });
    }
}
crawler.initiate(200, 'https://news.layervault.com/', 300);
