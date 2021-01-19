
console.log("Text")
var testConstants = {
    crossSecArea: 0.0001, // m
    initLenght: 0.05, // m
    maxForce:5194000, //N
    maxLength: 0.02, //m
    lengthUnit: 1000, // m-> mm
    percentError: 1,
}

var materialProperties = [
    {
        name: "ABS Plastic",
        YoungMod: 2.31, //GPa
        breakStrain: 28.8,//%
        yieldStrain: 3.2,//%
        matweb: "http://www.matweb.com/search/DataSheet.aspx?MatGUID=eb7a78f5948d481c9493a67f0d089646"
    },
    {
        name: "Aluminium",
        YoungMod: 77.4, //GPa
        breakStrain: 9.94, //%
        yieldStrain: 8.30, //%
        matweb: "http://www.matweb.com/search/DataSheet.aspx?MatGUID=ab8aeb2d293041c4a844e397b5cfbd4e"
    },
    {
        name: "Stainless steel",
        YoungMod: 196, //GPa
        breakStrain: 26.5,//%
        yieldStrain: 22.7, //%
        matweb: "http://www.matweb.com/search/DataSheet.aspx?MatGUID=71396e57ff5940b791ece120e4d563e0"
    },
    
]

var dropdown = document.querySelector("#material-choice");
for(let i = 0; i< materialProperties.length; i++){
    var x = document.createElement("OPTION");
    x.label = materialProperties[i].name;
    dropdown.add(x);
}
dropdown.onchange = setMaterial;

var simTimer;
//window.setInterval(calcStress, 500);
var canvas = document.querySelector("#myCanvas");
var forceNumber = document.querySelector("#force");
var lengthNumber = document.querySelector("#length");
var outputData = document.querySelector("#data-output");
var testPieceImg = document.querySelector("#test-piece-img");
testPieceImg.style.height = '50px';
testPieceImg.style.width = '100px';

testPieceImg.style.height = '250px';

var baseImgHeight = 250;
var ctx = canvas.getContext("2d");

var t = 0;

var currMaterial = 0;

var currForce = 0;
var currLength = 0

var yieldOffset = 0;
var yieldedLength = 0;

setMaterial();



function calcStress(){
    
    

     //N
    stress = currForce/testConstants.crossSecArea;
    strain = stress/(materialProperties[currMaterial].YoungMod*1000000000);
    currLength = strain * testConstants.initLenght*testConstants.lengthUnit;
    //console.log(currForce,stress, strain);
    yieldedLength = currLength + (2*Math.random()-1)*currLength*testConstants.percentError/100;
    
    if(strain > materialProperties[currMaterial].yieldStrain/100){
        t += 0.001;
        //yieldOffset = currLength*Math.sin(t*Math.pi);
        //yieldedLength-= yieldOffset;
        //yieldedLength = currLength*(1-Math.sin(t*3.14*0.5));
        //console.log("YIELD!");
        //console.log((t*Math.Pi*0.5));
        stopSimulation();
    }
    if(strain > materialProperties[currMaterial].breakStrain/100){
        stopSimulation();
    }
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);


    forceNumber.innerHTML = "Dragkraft: " + currForce + " N";
    lengthNumber.innerHTML = "Skillnad i längd " + yieldedLength + "mm";

    outputData.innerHTML += "<tr><th>" + currForce.toLocaleString().replace(/\s+/g, '')+ "</th>" + "<th>"+ yieldedLength.toLocaleString()+"</th>" + "</th></tr>"

    ctx.lineTo(currForce*canvas.width/testConstants.maxForce,canvas.height-yieldedLength*canvas.height/(testConstants.maxLength*testConstants.lengthUnit));
    ctx.stroke();

    ctx.font = "20px Arial"; 
    ctx.fillText(testConstants.maxLength + " m",10,30);
    ctx.fillText(testConstants.maxForce.toFixed(0) + " N",400,490);
    testPieceImg.style.height = baseImgHeight + yieldedLength*25 + 'px';
    currForce += 0.01*testConstants.maxForce;
    //console.log(currForce*100,500-currLength*100);

}


function setMaterial(){
    //console.log("Setting material");
    currMaterial = dropdown.selectedIndex;
    mF = 0.3*testConstants.crossSecArea*materialProperties[currMaterial].YoungMod*1000000000;
    testConstants.maxForce = mF;
    
    clearData();
}

function startSimulation(){
    simTimer = window.setInterval(calcStress, 300);
}
function stopSimulation(){
    window.clearInterval(simTimer);
}

function clearData(){
    
    currForce = 0;
    currLength = 0;
    t=0;

    outputData.innerHTML = "";
    ctx.moveTo(0,500);
    ctx.beginPath();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    forceNumber.innerHTML ="";
    lengthNumber.innerHTML = "";
    
    ctx.stroke();
    ctx.font = "20px Arial"; 
    ctx.fillText(testConstants.maxLength + " m",10,30);
    ctx.fillText(testConstants.maxForce.toFixed(0) + " N",400,490);
    
}

function lerp(a,b,t){
    return a+t*(b-a);
}