//Notes: added http module, fixed json formating, changed table row code, added post
var http = require('http');
var express = require('express');
var app3 = express();
var mongoDB = require('mongoskin');

// Verbindung zur mongoDB

var db =mongoDB.db('mongodb://localhost/mydb?auto_reconnect=true',{
    safe: true
});

// Collection "planeten" binden

db.bind("planeten");

var planetenCollection = db.planeten;

/* Dokumente einfügen*/

planetenCollection.insert(
    {
    pname: "Uranus", 
    du: "51100",
    dist:"2877000000"},
    {
    pname: "Mars", 
    du: "6800",
    dist:"227900000"},
    {
    pname: "Venus", 
    du: "12100",
    dist:"108200000"});

