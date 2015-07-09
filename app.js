var async = require('async');
var http = require('http');
var request = require('request');
var md5 = require('MD5');
var fs = require('node-fs');

var crawler = {
    site_store: [],
    
    initiate: function(max_procs, url, depth) {
        this.fetchBody(url, function(body) {
            var this.site_store = crawler.parseUrl(body);
            var iter_count  = this.site_store.length;
            
            while (crawler.site_store < depth) {
                var work_array = [];
                
                async.map(work_array, crawler.thread, function(err, results){
                    console.log('finished');
                });
            }
        });
    },
    thread: function() {
        
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
        return __dirname + '/store/dat_' + md5(url);
    }
}
crawler.initiate(200, 'http://leonharvey.com/', 20);
/*
async.map(test, proc.fetchBody, function(err, results){
    console.log('finished');
});
*/
/* 
app.get('/', function(req, res) {
   

    async.parallel([
        proc.thread,
        proc.thread
    ], function(err, results) {
        //console.log(err, results);
        //console.log(results);
    });
    
    res.send('Hello World!');
});
*/