var dataString = false;
var isDown = false;
var movingElement = "";
var columnInput = document.getElementById("nCol");
var rowInput = document.getElementById("nRow");
var nCols = 4;
var nRows = 4;
var zStrength = document.getElementById("zStrength");
var zStrengthValue = 20;
var images =   [["vert1.jpg","1 / 1 / 3 / 2;","1/2"],
                ["lookbook10.jpg","3 / 3 / 4 / 5;", "2/1"],
                ["hor3.jpg","1 / 2 / 2 / 3;", "1/1"],
                ["hor2.jpg","2 / 2 / 4 / 3;", "1/2" ],
                ["lookbook6.jpg","3 / 1 / 4 / 2;","1/1"],
                ["hor11.jpg","1 / 3 / 3 / 5;","2/2"]
               ];
        
var nImages = images.length;
for(let j = 1; j < (nRows+1); j++){
    for(let i = 1; i < (nCols+1); i++){
        createFiller(j + "/" + i + "/" + (j+1) + "/" + (i+1));
    }
}
var but = document.getElementById("htmlgenerator");
but.addEventListener("click",generateHTML)
var but2 = document.getElementById("autofill");
but2.addEventListener("click",fillGrid)
var but3 = document.getElementById("clearall");
but3.addEventListener("click",removeAllImgs)
var clearPaletteButton = document.getElementById("clearpalette");
clearPaletteButton.addEventListener("click",clearPalette)
var addImgsButton = document.getElementById("addToPalette");
addImgsButton.addEventListener("click",function(e){
    let inp = document.getElementById("get-files")
    inp.click()
})
var replacetextbut = document.getElementById("replacebutton");
replacetextbut.addEventListener("click",generateHTML)
var replacetextbut2 = document.getElementById("replacebutton2");
replacetextbut2.addEventListener("click",() => {
                                dataString = true;
                                generateHTML();
                                dataString = false;
                            })
var replacetextbut3 = document.getElementById("replacebutton3");
replacetextbut3.addEventListener("click",() => {
                                dataString = false;
                                generateHTML();
                            })


var slider = document.getElementById("myRange");
// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  let grid = document.getElementById('grid-gen');
  //console.log(this.value)
  grid.style.width = this.value + "%";
} 
function clipCSS(){
    const cssarea = document.getElementById("csstext");
    cssarea.select();
    cssarea.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(cssarea.value);
}
function clipHTML(){
    const htmlarea = document.getElementById("htmltext");
    htmlarea.select();
    htmlarea.setSelectionRange(0, 99999); /* For mobile devices */
    navigator.clipboard.writeText(htmlarea.value);
}
function closeCodeBlock(e){
    const codeblock = document.getElementById("codeblock");
    codeblock.style.display = "none";
}
function generateHTML(){
    var images = document.getElementsByClassName("grid-img");
    const gridContainer = '        <div class="grid-gen" id="grid-gen">\n            <div class="grid-container" id="grid-container">\n';
    var outputString = gridContainer;
    const divClosingTag = '</div>';
    const headerHTML = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Result Grid</title>
        <link rel="stylesheet" href="gallerystyle.css">
      </head>
    <body>\n`;
    for(let i = 0; i < images.length; i++){
        let frame = images[i].parentElement.parentElement;
        let top = images[i].style.top;
        let left = images[i].style.left;
        if(images[i].style.top == "" && images[i].style.left == ""){
            let imgRect = images[i].getBoundingClientRect();
            let contRect = images[i].parentElement.getBoundingClientRect();
            //console.log(parseInt(window.getComputedStyle(images[i]).getPropertyValue("left"),10))
            //console.log(imgRect)
            //top = (imgRect.top / contRect.height * 100)+ "%";
            //left = (imgRect.left / contRect.width * 100)+ "%";
            top = 0 + "%";
            left = 0 + "%";

            //console.log(`Top: ${top} Left: ${left}`)
        }
        //let path = images[i].src;
        let path = images[i].alt;
        let newPath = document.querySelector("#pathreplace").value
        if(newPath != "" && newPath){
            let temp = images[i].alt.split("/");
            if(temp.length == 1){
                path = newPath + temp[0]
            }else{
                path = newPath + temp[temp.length - 1]
            } 
        }
        if(dataString){
            path = images[i].src
        }

        var imgDiv = ' '.repeat(16) + `<div class="image-frame" style="grid-area: ${frame.style["grid-area"]}; aspect-ratio: ${frame.style["aspect-ratio"]};">\n`
        let contentDiv = ' '.repeat(20) + `<div class="content">\n`;
        var imgTag = ' '.repeat(24) + `<img id="${images[i].id}" class="${images[i].className}"\n` +
                    ' '.repeat(24) + ` src="${path}"\n ` +
                    ' '.repeat(24) + `style="height: ${images[i].style.height}; width: ${images[i].style.width};\n ` +
                    ' '.repeat(24) + `top: ${top}; left: ${left}">\n`;
       outputString = outputString + imgDiv + contentDiv + imgTag + ' '.repeat(20) + '</div>\n' + ' '.repeat(16) +'</div>\n';
    }
    outputString = headerHTML + outputString + ' '.repeat(12) + "</div>\n" + ' '.repeat(8) + divClosingTag + "\n    </body>\n</html>";
    //console.log(outputString);
    const htmldiv = document.getElementById("codeblock");
    const htmlarea = document.getElementById("htmltext");
    const cssarea = document.getElementById("csstext");
    htmldiv.style.display = "inline-block";
    htmlarea.value = outputString;
    var cssString = `.grid-gen {
        margin: auto;
        width: 100%;
        float: left;
        -moz-user-select: none;
        user-select: none;
    }\n
    .grid-container {
        display: grid;
        grid-template-columns: repeat(${nCols}, 1fr);
        background-color: #E6E6FA;
        padding: 8px;
    }\n
    .image-frame {
        position: relative;
        overflow: hidden;
        backface-visibility: hidden;
    }\n
    .content {
        box-sizing: border-box;
        -moz-box-sizing: border-box;
        -webkit-box-sizing: border-box;
        position: absolute;
        height: calc(100% - 3px);
        width: calc(100% - 3px);
        padding: 3px;
        overflow: hidden;
        backface-visibility: hidden;
    }\n
    .grid-img {
        position: absolute;
        left: 0px;
        top: 0px;
    }`;     
    cssarea.value = cssString;

}
function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}
function sFact(num)
{
    var rval=1;
    for (var i = 2; i <= num; i++)
        rval = rval * i;
    return rval;
}

function argMax(array) {
    return [].reduce.call(array, (m, c, i, arr) => c > arr[m] ? i : m, 0)
  }
function makeGrid2(){
    let rItems = document.querySelectorAll(".reserve-item");
    let nItems = rItems.length;
    let fillers = document.querySelectorAll(".filler");
    if(nItems < 2 || fillers.length < (nRows*nCols)){return}
    let splitPoints = [[1, 1, nRows, nCols]]
    console.log(nRows, nCols)
    let tried = [];

    outerLoop:
        for(let i = 0; i < nItems-1; i++){
            let splitPointIdx = Math.floor(Math.random() * splitPoints.length);
            currentSubArray = splitPoints[splitPointIdx]
            //let maxDim = argMax([currentSubArray[2],currentSubArray[3]]);
            let t = [0, 1];
            let maxDim = t[Math.floor(Math.random() * 2)]
            console.log("maxDim:",maxDim)
            
            while(((currentSubArray[3] == 1) && (maxDim == 1)) || ((currentSubArray[2] == 1) && (maxDim == 0)) ){
                if(!tried.includes(splitPointIdx)){
                    tried.push(splitPointIdx)
                }
                if(tried.length == splitPoints.length){
                    console.log("No more additional splits are possible.")
                    break outerLoop;
                }
                let maxDim = t[Math.floor(Math.random() * 2)]
                console.log("maxDim:",maxDim)
                splitPointIdx = Math.floor(Math.random() * splitPoints.length);
                currentSubArray = splitPoints[splitPointIdx]
                console.log("cannot be divided, trying next one...")
            }
            splitPoints.splice(splitPointIdx, 1) //remove selected area
            console.log("currentSubArray:",currentSubArray);
            if(maxDim == 1){
                let halfCols = Math.floor(currentSubArray[3]/2);
                splitPoints.push([currentSubArray[0],currentSubArray[1],currentSubArray[2],currentSubArray[3] - halfCols])
                splitPoints.push([currentSubArray[0],currentSubArray[1]+currentSubArray[3] - halfCols,currentSubArray[2],halfCols])
            }else{
                let halfCols = Math.floor(currentSubArray[2]/2);
                splitPoints.push([currentSubArray[0],currentSubArray[1],currentSubArray[2] - halfCols,currentSubArray[3]])
                splitPoints.push([currentSubArray[0]+currentSubArray[2] - halfCols,currentSubArray[1], halfCols, currentSubArray[3]])
            }

            console.table(splitPoints)
        }
    
    
    
    console.log(fillers.length,"num of fillers")
    fillers.forEach(filler =>{ filler.remove()});
    for(let i = 0; i < splitPoints.length; i++){
        let cArea = splitPoints[i];
        let gridArea = ` ${cArea[0]} / ${cArea[1]} / ` + 
                       `${cArea[0] + cArea[2]} / ${cArea[1] + cArea[3]}`
        let ar = `${cArea[3]} / ${cArea[2]}`
        //console.log(rItems, rItems.firstChild)
        createGridItem(rItems[i].firstChild.src, rItems[i].firstChild.alt ,gridArea, ar, i)
    }
    rItems.forEach(rItem =>{ rItem.remove()});

}
function clearPalette(){
    let reserveItems = document.querySelectorAll(".reserve-item")
    
    reserveItems.forEach(item => {
        item.remove()
    })
    let inp = document.getElementById("get-files");
    inp.value = '';
}

function randomFill(){
    //let numSpaces = document.getElementsByClassName('filler').length
    //let numItems = document.getElementsByClassName('reserve-item').length
    let numSpaces = 16;
    let numItems = 7;
    //let numPerms = sFact(numItems)/(sFact((numItems - 3)))
    let numPerms = numItems**3;
    if(numItems < 1){
        return
    }
    console.log("test:",document.querySelectorAll('[style^="grid-area: 4 / 4 / 5 / 5"]'))
    var permutations = [];
    console.log("number of permutations:", numPerms)
    console.log([[1,2,3],[3,2,1]].includes(3))
    while(permutations.length < numPerms){
        let x1 = randomIntFromInterval(0, numItems);
        let x2 = randomIntFromInterval(0, numItems);
        let x3 = randomIntFromInterval(0, numItems);
        if(!permutations.some(row => JSON.stringify(row) === JSON.stringify([x1,x2,x3]))){
            permutations.push([x1,x2,x3]);
            if((x1 + x2 + x3) == numItems && (1*x1 + 2*x2 + 4*x3) == numSpaces){
                console.log(`Found in ${permutations.length} loops.`)
                console.log(`x1=${x1} x2=${x2} x3=${x3}`)
                let result = Array(x1).fill(1).concat(Array(x2).fill(2),Array(x3).fill(4));
                console.log(result)
                return result;
            }
        }
    }
    console.log("solution not found!")
}
rowInput.addEventListener('change', (event) => {
    console.log("Row change triggers: ", nRows ,"->", rowInput.value)
    let newNRows = parseInt(rowInput.value, 10)
    if(newNRows > nRows){
        console.log("More rows requested")
        for(let j = 1; j < (newNRows - nRows + 1); j++){
            for(let i = 1;  i < (nCols+1); i++){
                createFiller(`${nRows+j}/${i}/${nRows+j+1}/${i+1}`);
            }
        }
        nRows = newNRows;
        console.log(document.querySelectorAll(".filler"))
    }else{
        let gridImgs = document.querySelectorAll(".image-frame");
        gridImgs.forEach(img => {
            for(let i = 0; i < (nRows - newNRows); i++)
                if(img.style["grid-row-end"] == `${nRows-i+1}`){
                    if(img.style["grid-row-start"] == `${nRows-i}`){
                        console.log("Removing image...")
                        removeImg(img);
                    }else{
                        console.log("Shrinking image rowwise...")
                        shrink(img, true);
                    }
                }
            }
        );

        let fillers = document.querySelectorAll(".filler");
        fillers.forEach(filler => {
            for(let i = 0; i < (nRows - newNRows); i++){
                if(filler.style["grid-row-end"] == `${nRows+1 - i}`){
                    //console.log("Removing filler due to row condition...")
                    filler.remove();
                }
            }
        });
        nRows = newNRows
    }


})

columnInput.addEventListener('change', (event) => {
    console.log("number of columns:", columnInput.value)
    var colInput = parseInt(columnInput.value,10)
    if(colInput > 6){
        console.log("More than 6 columns not permitted! You are now benchod!")
        return
    }
    if(colInput > nCols){
        let gridCont = document.getElementById("grid-container");
        gridCont.style["grid-template-columns"] = `repeat(${colInput}, 1fr)`
        for(let j = 1; j < (colInput - nCols + 1); j++){
            for(let i = 1;  i < (nRows+1); i++){
                createFiller(`${i}/${nCols+j}/${i+1}/${nCols+j+1}`);
            }
        }
        nCols = colInput;
    }else{

        let gridImgs = document.querySelectorAll(".image-frame");
        console.log(parseInt(colInput)+2)

        gridImgs.forEach(img => {
            if(img.style["grid-column-end"] == `${colInput+2}`){
                if(img.style["grid-column-start"] == `${colInput+1}`){
                    console.log("Removing image...")
                    removeImg(img);
                }else{
                    console.log("Shrinking image columnwise...")
                    shrink(img);
                }

            }
        });
        let fillers = document.querySelectorAll(".filler");
        fillers.forEach(filler => {
            if(filler.style["grid-column-end"] == `${colInput+2}`){
                console.log("Removing filler...")
                filler.remove();
            }
        });
        let gridCont = document.getElementById("grid-container");
        gridCont.style["grid-template-columns"] = `repeat(${colInput}, 1fr)`
        nCols = colInput
    }
})

zStrength.addEventListener('change',(event) => {
    console.log("zoom multiplier:", zStrength.value)
    zStrengthValue = parseInt(zStrength.value,10);

})

function fillGrid(){
    let startArray = Array.from(Array(nRows), _ => Array(nCols).fill(0));
    let images = document.querySelectorAll(".reserve-item");
    if(images.length == 0){return} // return if nothing in palette
    let fillers = document.querySelectorAll(".filler");
    let imageFrames = document.querySelectorAll(".image-frame");
    // Fills array in indicate existing images 
    imageFrames.forEach((img, i)  => {
        console.log("for each existing image:")
        var s = [
                parseInt(img.style["grid-row-start"],10),
                parseInt(img.style["grid-column-start"],10),
                parseInt(img.style["grid-row-end"],10),
                parseInt(img.style["grid-column-end"],10)
                ];
                for(let r = 0; r < (s[2] - s[0]); r++){
                    for(let c = 0; c < (s[3] - s[1]); c++){
                        startArray[s[0]-1+r][s[1]-1+c] = i+1
                    }
                }

                
    })
    console.table(startArray)
    let cX = 0;
    let cY = 0;
    let options = [1]
    let optionIndex = 0;
    let currentOption = 0;
    let count = 0;
    let maxCount = 5;
    let areas = [];
    //assigns deep copy of the array to gridArray
    let gridArray = JSON.parse(JSON.stringify(startArray));
    // 0 indicates position of filler/empty frames.
    console.log(exists(gridArray, 0))
    // Loop breaks when there are no more 0's. If all images are added and there are still empty spaces,
    // then try again max-count(5) times to get no more empty spaces
    // you could precheck if its even possible to get all the space filled. (nCols*nRows) > (images.length*4)
    // where 4 is the max number of spaces an image can possibly take in this case.
    // What if there are already images in the grid so you should subtract the number non zeros from nCols*nRows
    if((nCols*nRows) > (images.length*4)){maxCount = 1}
    let lastImageIndex = images.length;
    while(exists(gridArray, 0) && count < maxCount){
        gridArray = JSON.parse(JSON.stringify(startArray))
        areas = []
        images.forEach((_, i) => {
            console.log(i)
            options = [1]
            optionIndex = 0;
            currentOption = 0;
            cX = 0;
            cY = 0;
            // Finds coords of an empty spot to put new image
            inner:
                for(let row = 0; row < gridArray.length; row++){
                    for(let col = 0; col < gridArray[0].length; col++){
                        if(gridArray[row][col] == 0){
                            console.log(row, col)
                            cX = row;
                            cY = col;
                            break inner;
                        }
                        if(row == (gridArray.length-1) && col == (gridArray[0].length-1)){
                            console.log("No more space for images.")
                            // returns from images.forEach once
                            if(i < lastImageIndex){
                                lastImageIndex = i;
                            }
                            return;
                        }

                    }
                }

            console.log(`Starting at ${cX},${cY}`)
            if((cX+1) < gridArray.length){
                if(gridArray[cX+1][cY] == 0){
                    options.push(21)
                } // right
            }
            if((cY+1) < gridArray[0].length){
                if(gridArray[cX][cY+1] == 0){
                    options.push(12)
                } // down
            }
            if((cY+1) < gridArray[0].length  && (cX+1) < gridArray.length){
                if(gridArray[cX+1][cY] == 0 && gridArray[cX][cY+1] == 0 && gridArray[cX+1][cY+1] == 0){
                    options.push(4)
                } // diag
            }

            optionIndex = Math.floor(Math.random() * options.length);
            currentOption = options[optionIndex]
            console.log(options)
            console.log("current option:", currentOption)
            switch(currentOption){
                case 1:
                    gridArray[cX][cY] = i+1;
                    areas.push([`${cX+1} / ${cY+1} / ${cX+2} / ${cY+2}`, "1 / 1"])
                    break;
                case 21:
                    gridArray[cX][cY] = i+1;
                    gridArray[cX+1][cY] = i+1;
                    areas.push([`${cX+1} / ${cY+1} / ${cX+3} / ${cY+2}`, "1 / 2"])
                    break;
                case 12:
                    gridArray[cX][cY] = i+1;
                    gridArray[cX][cY+1] = i+1;
                    areas.push([`${cX+1} / ${cY+1} / ${cX+2} / ${cY+3}`, "2 / 1"])
                    break;
                case 4:
                    gridArray[cX][cY] = i+1;
                    gridArray[cX+1][cY] = i+1;
                    gridArray[cX][cY+1] = i+1;
                    gridArray[cX+1][cY+1] = i+1;
                    areas.push([`${cX+1} / ${cY+1} / ${cX+3} / ${cY+3}`, "2 / 2"])
                    break;
                default:
                    console.log("something went wrong")

            }
        // console.table(gridArray)
        })
        count++;
    }
    console.table(gridArray)
    let fillerCoords = [];
    //get coords of 0's that are left
    for(let row = 0; row < gridArray.length; row++){
        for(let col = 0; col < gridArray[0].length; col++){
            if(gridArray[row][col] == 0){
                fillerCoords.push(`${row+1},${col+1}`)
            }
        }
    }
    var imgIdList = []; 
    [...document.getElementsByClassName("grid-img")].forEach(img => {
        imgIdList.push(parseInt(img.id.split(/(\d+)/)[1],10));
    })
    var newIdNum = imgIdList.length;


    // remove all fillers only where the new images are placed.
    fillers.forEach(filler => {
        if(!fillerCoords.includes(filler.style["grid-row-start"] + "," + filler.style["grid-column-start"])){
            filler.remove()
        }
    })
    areas.forEach((area, i) => {
        console.log("For area:" , area)
        while(imgIdList.includes(newIdNum)){
            newIdNum = newIdNum + 1
            console.log("in loop")
        }
        createGridItem(images[i].firstChild.src, images[i].firstChild.alt, area[0], area[1], newIdNum)
        imgIdList.push(newIdNum)
    })
    //remove palette items
    images.forEach((image,i) => {
        if(i < lastImageIndex){
            image.remove()
        }
    })
    

}
function exists(arr, search) {
    return arr.some(row => row.includes(search));
}
function addFiles(){
    var files = Array.from(document.getElementById("get-files").files);
    var reserves = document.getElementById("reserves");
    console.log(files);
    files.forEach((file, i) => {
        console.log(file.name)
        var reader = new FileReader();
        reader.addEventListener('load', (event) => {
            createReserveItem(event.target.result, file.name, reserves, i);
        })
        reader.readAsDataURL(file);
    })
    reserves.style.border = "2px solid black";

}

function createReserveItem(name, fileName, reserves, id){
    var item = document.createElement("div");
    item.setAttribute("class","reserve-item");
    item.setAttribute("draggable","true");
    item.setAttribute("id", "rItem" + id);
    var itemImg = document.createElement("img");
    itemImg.setAttribute("src",name);
    itemImg.setAttribute("alt",fileName);
    itemImg.setAttribute("height","100%");
    itemImg.setAttribute("width","40px");
    itemImg.setAttribute("display","inline-block");
    itemImg.setAttribute("align","left");
    itemImg.setAttribute("draggable","false");
    var itemName = document.createElement("div");
    itemName.setAttribute("display","inline-block");
    itemName.setAttribute("vertical-align","top");
    itemName.setAttribute("class","top");
    itemName.innerHTML = fileName;
    item.appendChild(itemImg);
    item.appendChild(itemName);
    item.addEventListener("dragstart",reserveItemDrag);
    reserves.appendChild(item);
}
function createGridItem(image_name, fileName, location, ar, i){
    var image_grid = document.createElement('div');
    image_grid.setAttribute("class","image-frame");
    image_grid.setAttribute("style","grid-area:" + location + ";aspect-ratio:" + ar);
    image_grid.setAttribute("draggable","false");
    var hideMenu = document.createElement('div');
    hideMenu.setAttribute("class","hide");
    hideMenu.style["max-width"] = 50 + "%";
    hideMenu.style["height"] = "auto";
    
    var magp = document.createElement('img');
    magp.setAttribute("id",`magp${i}`);
    magp.setAttribute("class","magnify-img");
    magp.setAttribute("src","Icons/icons8-zoom-in-30.png");
    //magp.setAttribute("style","width: 30px; height: 33px;");
    magp.setAttribute("draggable","false");

    hideMenu.appendChild(magp);
    
    var magm = document.createElement('img');
    magm.setAttribute("id",`magm${i}`);
    magm.setAttribute("class","magnify-img");
    magm.setAttribute("src","Icons/icons8-zoom-out-30.png");
    //magm.setAttribute("style","width: 30px; height: 33px;");
    magm.setAttribute("draggable","false");
    
    hideMenu.appendChild(magm);
    
    var lockE = document.createElement('img');
    lockE.setAttribute("id",`lock${i}`);
    lockE.setAttribute("class","lock");
    lockE.setAttribute("src","Icons/icons8-lock-24.png");
    //lockE.setAttribute("style","width: 30px; height: 33px;");
    lockE.setAttribute("draggable","false");
    
    hideMenu.appendChild(lockE);
    
    var shrinkE = document.createElement('img');
    shrinkE.setAttribute("id",`shrink${i}`);
    shrinkE.setAttribute("class","shrink");
    shrinkE.setAttribute("src","Icons/icons8-shrink-48.png");
    //shrinkE.setAttribute("style","width: 30px; height: 33px;");
    shrinkE.setAttribute("draggable","false");
    hideMenu.appendChild(shrinkE);
    
    var exitE = document.createElement('img');
    exitE.setAttribute("id",`exit${i}`);
    exitE.setAttribute("class","exit");
    exitE.setAttribute("src","Icons/icons8-close-48.png");
    //exitE.setAttribute("style","width: 30px; height: 33px;");
    exitE.setAttribute("draggable","false");
    
    hideMenu.appendChild(exitE);
    
    var arrowDown = document.createElement('div');
    arrowDown.setAttribute("class","hide");
    arrowDown.setAttribute("style","top:90%;right:50%;margin-top:auto;height:9%");
    var downImg = document.createElement('img');
    downImg.setAttribute("id",`expanddown${i}`);
    downImg.setAttribute("class","expanddown");
    downImg.setAttribute("src","Icons/icons8-chevron-down-48.png");
    downImg.setAttribute("style","width: 85%; height: 85%;");
    downImg.setAttribute("draggable","false");

    arrowDown.appendChild(downImg);
    var arrowRight = document.createElement('div');
    arrowRight.setAttribute("class","hide");
    arrowRight.setAttribute("style","top:45%;right:0;margin-top:auto;height:9%");
    var rightImg = document.createElement('img');
    rightImg.setAttribute("id",`expandright${i}`);
    rightImg.setAttribute("class","expandright");
    rightImg.setAttribute("src","Icons/icons8-chevron-right-48.png");
    rightImg.setAttribute("style","width: 100%; height: 100%;");
    rightImg.setAttribute("draggable","false");
    
    arrowRight.appendChild(rightImg);
    var mainImage = document.createElement('img');
    mainImage.setAttribute("id",`grid-img${i}`);
    mainImage.setAttribute("class","grid-img");
    mainImage.setAttribute("src",image_name);
    mainImage.setAttribute("draggable","true");
    mainImage.setAttribute("alt", fileName);
    var contentDiv = document.createElement("div");
    contentDiv.setAttribute("class","content");
    contentDiv.appendChild(mainImage);
    contentDiv.appendChild(hideMenu);
    contentDiv.appendChild(arrowDown);
    contentDiv.appendChild(arrowRight);
    image_grid.appendChild(contentDiv);

    
    var container = document.getElementById("grid-container");
    
    container.appendChild(image_grid);
    //mainImage.addEventListener('mousedown', mouseDown, true);
    //mainImage.addEventListener("dragstart", dontDrag);
    mainImage.addEventListener("dragstart", drag);
    mainImage.addEventListener("dragover", allowDrop);
    mainImage.addEventListener("drop", drop);
    mainImage.addEventListener('dragleave', handleDragLeave);
    mainImage.onload = centerHelper;
    
    shrinkE.addEventListener("click", shrink);
    exitE.addEventListener("click", removeImg);
    lockE.addEventListener("click", lock);
    
    rightImg.addEventListener("click", expand);
    downImg.addEventListener("click", expand);
    magp.addEventListener("click", zoom);
    magm.addEventListener("click", zoom);
    //eventlisteners don't work when on elements that are not yet part of the document?
    //don't give the variable holding an element the same name as the eventlistener function name.
    
}
function dontDrag(e) {
    e.preventDefault()
}
function centerImage(e){
    //console.log("image being centered")
    if(!e.className){
        var img = e.target;
        var h = parseInt(window.getComputedStyle(img).getPropertyValue("height"),10);
        var w = parseInt(window.getComputedStyle(img).getPropertyValue("width"),10);
    }else{
        var img = e;
        //console.log(e.className, "is image not parent")
        var h = parseInt(img.style.height,10);
        var w = parseInt(img.style.width,10);
        if(!h && !w){
            console.log("undefined! height and width, using.. natural vars")
            h = img.naturalHeight;
            w = img.naturalWidth;
        }

    }
    //console.log(h,"h:w",w);
    var containerW = parseInt(window.getComputedStyle(img.parentElement).getPropertyValue("width"),10);
    var containerH = parseInt(window.getComputedStyle(img.parentElement).getPropertyValue("height"),10);
    var middleX = Math.round(-1*((w/2)-(containerW/2)))
    var middleY = Math.round(-1*((h/2)-(containerH/2)))
    var middleXP = middleX / containerW * 100;
    var middleYP = middleY / containerH * 100;
    img.style.top = middleYP + "%";
    img.style.left = middleXP + "%";
    //console.log(img.style.left + ":"+ img.style.top)
}
function centerHelper(e){
    console.log("from helper")
    if(!e.className){
        var img = e.target;
        //console.log("from event")
    }else{
        var img = e;
        //console.log("from explicit call")
    }
    let imgRect = img.getBoundingClientRect();
    let contRect = img.parentElement.parentElement.getBoundingClientRect();
    let contRect2 = img.parentElement.getBoundingClientRect();
    //console.log("before anything:",contRect)
    // var h = parseInt(img.style.height,10);
    // var w = parseInt(img.style.width,10);
    
    // console.log("helper:",h,"h:w", w)

    //var containerW = parseInt(window.getComputedStyle(img.parentElement).getPropertyValue("width"),10);
    //var containerH = parseInt(window.getComputedStyle(img.parentElement).getPropertyValue("height"),10);
    var naturalAR = img.naturalHeight/img.naturalWidth
    var aspectRIMG = imgRect.height/imgRect.width;
    var aspectRCont = contRect.height/contRect.width;
    //console.log("for img:", img.id)
    //console.log(`natAR: ${naturalAR}\n image rect AR: ${aspectRIMG} \n container rect AR: ${aspectRCont} `)
    if (aspectRCont < aspectRIMG){
        var h = (imgRect.height/imgRect.width)*contRect.width
        var w = contRect.width
        //console.log("one")
    }else{
        var w = ((imgRect.width/imgRect.height)*(contRect.height))+(imgRect.width/imgRect.height)*4
        var h = contRect.height+4
        //console.log("two")
    }
    //console.log(h/w)
    //console.log(w , "w:h", h)
    //console.log(contRect2.width, "cw:ch", contRect2.height)
    var hPercent = h / contRect2.height * 100;
    var wPercent = w / contRect2.width * 100;
    img.style.height = hPercent + "%";
    img.style.width = wPercent + "%";
    //img.style.top = (50 / contRect.height * 100) + "%";
    //img.style.left = (50 / contRect.width * 100) + "%";
    //img.style.left = 50 + "px";
    //img.style.left = 50 + "px";
    //console.log(hPercent, "h%:w%", wPercent)
    //console.log("image",img.getBoundingClientRect())
    //console.log("content",img.parentElement.parentElement.getBoundingClientRect())
    centerImage(e);
}
function handleDragLeave(ev) {
  ev.preventDefault();
  console.log("leaving drag:", ev.currentTarget.id)
  //ev.currentTarget.parentElement.style.border = "2px solid transparent"; // this / e.target is previous target element.
}
function handleFillerDragLeave(ev) {
  //ev.currentTarget.style.border = "2px solid transparent"; // this / e.target is previous target element.
}
function allowDrop (ev) {
    ev.preventDefault ();
    //ev.currentTarget.parentElement.style.border ="2px dashed #000";
}
function dropOverFiller (ev) {
    ev.preventDefault ();
    //ev.currentTarget.style.border ="2px dashed red";
}
function drag (ev) {
  //ev=ev || window.event;
  //pauseEvent(ev);
  //ev.preventDefault();
  //ev.currentTarget.parentElement.style.border = "2px dashed black";
  ev.dataTransfer.setData("text/plain", ev.target.id);
  console.log("starting to drag image:",ev.target.id," : ", ev.currentTarget.parentElement.className)
  
}
function reserveItemDrag(e){
  //ev.currentTarget.parentElement.style.border = "2px dashed #000;";
  e.dataTransfer.setData("text/plain", e.target.id);
  console.log("starting to drag reserve itme:",e.target.id)
}
function updateDimsNLocs(source, target){
    let sourceAr = source.naturalHeight/source.naturalWidth;
    let targetAr = target.naturalHeight/target.naturalWidth;
    let sourceRect = source.getBoundingClientRect()
    let targetRect = target.getBoundingClientRect()
    let sourceContRect = source.parentElement.getBoundingClientRect()
    let targetContRect = target.parentElement.getBoundingClientRect()
    
    { // console log output -------------
        console.log("updateDimsNLocs-------------")
        console.log("source:",source)
        console.log("target:",target)
        console.log(`source image current % width ${source.style.width}.\n` + 
                    `source Image current % height ${source.style.height}.`)
        console.log(`source image current px width ${sourceRect.width}.\n` + 
                    `source Image current px height ${sourceRect.height}.`)

        console.log(`source container current px width ${sourceContRect.width}.\n` + 
                    `source container current px height ${sourceContRect.height}.`)
        console.log( "natural aspect ratio: " + sourceAr)
        console.log( "correct height based on ar:",  sourceAr * sourceRect.width)
        
        console.log(`target image current % width ${target.style.width}.\n` + 
                    `target Image current % height ${target.style.height}.`)
        console.log(`target image current px width ${targetRect.width}.\n` + 
                    `target Image current px height ${targetRect.height}.`)

        console.log(`target container current px width ${targetContRect.width}.\n` + 
                    `target container current px height ${targetContRect.height}.`)
        console.log("New % = ", (((sourceRect.width)*sourceAr) / targetContRect.height * 100),"h%:w%",(((sourceRect.width) / (targetContRect.width)) * 100)) 
    }
    source.style.width  = (((sourceRect.width) / (targetContRect.width)) * 100)  + "%";
    source.style.height = (((sourceRect.width)*sourceAr) / targetContRect.height * 100) + "%";

    let test = source.parentElement.getBoundingClientRect()
    let test2 = source.parentElement.parentElement.getBoundingClientRect()
    console.log(test)
    console.log(test2)
    
    target.style.width  = (((targetRect.width) / (sourceContRect.width)) * 100)  + "%";
    target.style.height = (((targetRect.width*targetAr) / sourceContRect.height) * 100) + "%";
    console.log("updateDimsNLocs END ___________")
}
function drop (ev) {
  //ev.preventDefault();// prevents the opening of a dragged image in it's current tab
  console.log("drop triggers")
  var sourceItem = document.getElementById (ev.dataTransfer.getData("text")); // getData can only be accessed in drop not in hoverevents.
  //console.log("sourceItemClass:", sourceItem);
  if(!sourceItem){
      return
  }
  //ifStatement switches grid-area property between the parents of sourceitem and destinationitem respectively.
  if(sourceItem != ev.currentTarget){
    console.log("sourceItemClass:", sourceItem.className);
    var tempGA = sourceItem.parentElement.parentElement.style["grid-area"]
    var originalAR = sourceItem.parentElement.parentElement.style["aspect-ratio"]
    if(ev.currentTarget.className == "grid-img"){
        if(sourceItem.className != "reserve-item"){
            // Triggers when dropping an image on another image.
            updateDimsNLocs(sourceItem, ev.currentTarget)
            sourceItem.parentElement.parentElement.style["grid-area"] = ev.currentTarget.parentElement.parentElement.style["grid-area"];
            sourceItem.parentElement.parentElement.style["aspect-ratio"] = ev.currentTarget.parentElement.parentElement.style["aspect-ratio"];
            ev.currentTarget.parentElement.parentElement.style["grid-area"] = tempGA;
            ev.currentTarget.parentElement.parentElement.style["aspect-ratio"] = originalAR;
            zoom(sourceItem); //fits smaller image into its new image-frame size
            zoom(ev.currentTarget);
            //ev.currentTarget.parentElement.style.border = "2px solid transparent";  
        }else{
            // Triggers when dropping palette item on an image or a filler location
            //console.log(sourceItem,"dropping reserve item on target ",ev.currentTarget.src);
            var fileNameDiv = sourceItem.getElementsByTagName("div")[0];
            //var fileName = fileNameDiv.innerHTML;
            var img = sourceItem.getElementsByTagName("img")[0];
            console.log("Reserve item fileName:", img.alt)
            console.log("dimensions:", img.naturalWidth,"x",img.naturalHeight)
           
            //not sure if the pixel values here are going to be a problem yet
            ev.currentTarget.style.height = img.naturalHeight + "px";
            ev.currentTarget.style.width = img.naturalWidth + "px";
            console.log(ev.currentTarget.style);
            
            var targetPath = ev.currentTarget.src //.split("/");
            var targetFileName = ev.currentTarget.alt
            //temp = temp[temp.length - 1];
            ev.currentTarget.src = img.src;
            //ev.currentTarget.parentElement.style.border = "2px solid transparent";Og
            img.src = targetPath;
            img.parentElement.id = targetFileName;
            fileNameDiv.innerHTML = targetFileName;
            ev.currentTarget.alt = img.alt
            img.alt = targetFileName
        }
    }else{
        if(sourceItem.className == "reserve-item"){
            console.log("from reserve item to filler")
            var img = sourceItem.getElementsByTagName("img")[0];
            console.log("img",img)
            var imgIdList = []; 
            [...document.getElementsByClassName("grid-img")].forEach(img => {
                imgIdList.push(parseInt(img.id.split(/(\d+)/)[1],10));
            })

            var newIdNum = imgIdList.length;
            console.log("imgIdList: ",imgIdList);
            console.log("newIdNum: ",newIdNum);

            while(imgIdList.includes(newIdNum)){
                newIdNum = newIdNum + 1
                console.log("in loop")
            }
            console.log("id after loop:", newIdNum)
            console.log(img.alt)
            createGridItem(img.src, img.alt, ev.currentTarget.style["grid-area"],"1 / 1",newIdNum);
            console.log("target filler removed:",ev.currentTarget)
            ev.currentTarget.remove();
            sourceItem.remove();
            
        }else{
            // Triggers when moving image to filter location
            let sourceIFrame = sourceItem.parentElement.parentElement
            var s = [parseInt(sourceIFrame.style["grid-row-start"],10),
                     parseInt(sourceIFrame.style["grid-column-start"],10),
                     parseInt(sourceIFrame.style["grid-row-end"],10),
                     parseInt(sourceIFrame.style["grid-column-end"],10)
                ];
            console.log("From:", sourceItem, " To: ", ev.currentTarget)
            let sourceRect = sourceItem.getBoundingClientRect()
            let sourceAr = sourceItem.naturalHeight/sourceItem.naturalWidth;
            let targetContRect = ev.currentTarget.firstChild.getBoundingClientRect()
            sourceItem.style.width  = (((sourceRect.width) / (targetContRect.width)) * 100)  + "%";
            sourceItem.style.height = (((sourceRect.width)*sourceAr) / targetContRect.height * 100) + "%";

            sourceIFrame.style["grid-area"] = ev.currentTarget.style["grid-area"];
            sourceIFrame.style["aspect-ratio"] = ev.currentTarget.style["aspect-ratio"];
            var nRows = s[2] - s[0];
            var nColumns = s[3] - s[1];
            ev.currentTarget.style["grid-area"] = `${s[0]}/${s[1]}/${s[0]+1}/${s[1]+1}`;
            console.log("after switch currentTarget:",ev.currentTarget)
            for(let i = 0; i < nRows; i++){
                for(let j = 0; j < nColumns; j++){
                    if(i==0 && j == 0){continue;}
                    var cRow = s[0]+i
                    var cCol = s[1]+j
                    createFiller(`${cRow}/${cCol}/${cRow+1}/${cCol+1}`);
                }
            } 
            zoom(sourceItem);
            //ev.currentTarget.parentElement.style.border = "2px solid transparent";
        }
    }
  }else{
    //ev.currentTarget.parentElement.style.border = "2px solid transparent";
  }
  
}
function triggerInput(e){
    var file = e.target.parentElement.getElementsByClassName("input-image")[0];
    file.click();
}
function addImgFromFile(){
    nImages = nImages + 1;
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
        createGridItem(event.target.result, this.files[0].name ,this.parentElement.parentElement.style["grid-area"], "1/1", nImages);
    })
    reader.readAsDataURL(this.files[0]);
    console.log("filler to be removed:",this.parentElement.parentElement)
    this.parentElement.parentElement.remove();
}

function createFiller(area){
    var filler = document.createElement('div');
    var contentDiv = document.createElement('div');
    contentDiv.setAttribute("class","content");
    contentDiv.setAttribute("style","border: 1px dotted black;")
    var uploadImg = document.createElement('img');
    uploadImg.setAttribute("src","Icons/icons8-image-100.png")
    uploadImg.setAttribute("style","position: absolute;  top: 50%;left: 50%;transform: translate(-50%, -50%); width: 50%;")
    uploadImg.setAttribute("draggable","false");
    var imgInput = document.createElement("input");
    imgInput.setAttribute("type","file");
    imgInput.setAttribute("accept","image/*")
    imgInput.setAttribute("class","input-image");
    imgInput.setAttribute("style","display:none;");
    uploadImg.addEventListener("click", triggerInput);
    imgInput.onchange =  addImgFromFile;
    contentDiv.appendChild(uploadImg);
    contentDiv.appendChild(imgInput);
    filler.appendChild(contentDiv);
    filler.setAttribute("class","filler");
    filler.style["grid-area"] = area;
    filler.style["aspect-ratio"] = "1/1";
    filler.addEventListener("drop", drop);
    filler.addEventListener("dragover", dropOverFiller);
    document.getElementById("grid-container").appendChild(filler);
    //console.log("filler created:",filler);
}
function expand(e){
    var imgFrame = e.target.parentElement.parentElement.parentElement
    var curImage = imgFrame.getElementsByClassName("grid-img")[0]
    console.log(curImage);
    var s = [parseInt(imgFrame.style["grid-row-start"],10),
             parseInt(imgFrame.style["grid-column-start"],10),
             parseInt(imgFrame.style["grid-row-end"],10),
             parseInt(imgFrame.style["grid-column-end"],10)
            ];
    //s = s.map(x => parseInt(x, 10))
    var fillers = [].slice.call(document.getElementsByClassName("filler"));
    var nRows = s[2] - s[0];
    var nColumns = s[3] - s[1];
    var requiredFillers = [];
    if(fillers != []){
        let imgRect = curImage.getBoundingClientRect();
        console.log(imgRect)
        console.log(curImage.parentElement.getBoundingClientRect())
        if(e.target.className == "expandright"){
            for(let i = 0;i < nRows; i++ ){
                console.log("nRows:",nRows)
                var t = fillers.find(filler => parseInt(filler.style["grid-row-start"],10) == s[0]+i &&
                                       parseInt(filler.style["grid-column-start"],10) == s[1]+nColumns)
                if(t){requiredFillers.push(t);}
                
            }
            console.log(requiredFillers)
            if(requiredFillers.length == nRows){
                console.log("enough fillers present")
                requiredFillers.forEach(f => f.remove());
                imgFrame.style["grid-column-end"] = s[3]+1;
                nRows = s[2] - s[0];
                nColumns = s[3]+1 - s[1];
                imgFrame.style["aspect-ratio"] = nColumns + "/" + nRows;
                let contRect = curImage.parentElement.getBoundingClientRect();
                curImage.style.width = ((imgRect.width / (contRect.width)) * 100) + "%";
                curImage.style.height = ((imgRect.height / (contRect.height)) * 100) + "%";
                console.log(((imgRect.height / (contRect.height)) * 100))
                zoom(curImage);
            }
        }else{
        //arrowDown
            for(let i = 0;i < nColumns; i++ ){
                var t = fillers.find(filler => parseInt(filler.style["grid-row-start"],10) == s[0]+nRows &&
                                               parseInt(filler.style["grid-column-start"],10) == s[1]+i)
                if(t){requiredFillers.push(t);}
                
            }
            console.log(requiredFillers)
            if(requiredFillers.length == nColumns){
                console.log("enough fillers present")
                requiredFillers.forEach(f => f.remove());
                imgFrame.style["grid-row-end"] = s[2]+1;
                nRows = s[2]+1 - s[0];
                nColumns = s[3] - s[1];
                imgFrame.style["aspect-ratio"] = nColumns + "/" + nRows;
                let contRect = curImage.parentElement.getBoundingClientRect();
                curImage.style.width = ((imgRect.width / (contRect.width)) * 100) + "%";
                curImage.style.height = ((imgRect.height / (contRect.height)) * 100) + "%";
                console.log(((imgRect.height / (contRect.height)) * 100))
                zoom(curImage);
            }
        }
    }
    
}
function shrink(e, rowWise){
    //make indepent of the number of columns
    if(e.target){
        var imgFrame = e.target.parentElement.parentElement.parentElement
        var curImage = e.target.parentElement.parentElement.firstChild;
    }else{
        var imgFrame = e;
        var curImage = e.firstChild.firstChild;
    }
    let imgRect = curImage.getBoundingClientRect();
    var s = [parseInt(imgFrame.style["grid-row-start"],10),
            parseInt(imgFrame.style["grid-column-start"],10),
            parseInt(imgFrame.style["grid-row-end"],10),
            parseInt(imgFrame.style["grid-column-end"],10)
            ];
    var nRows = s[2] - s[0];
    var nColumns = s[3] - s[1];
    var size = nRows*nColumns;
    var fillerAreas = [];
    var AR = "";
    if(size > 1){
        if(nColumns > 1 && !rowWise){
            for(let i = 0; i < nRows;i++){
                fillerAreas.push(`${s[0]+i}/${s[1]+(nColumns-1)}/${(s[0]+i+1)}/${s[3]}`)
            }
            s[3] = s[3]-1;
        }else{
            fillerAreas.push(`${s[0]+(nRows-1)}/${s[1]}/${s[2]}/${s[3]}`)
            s[2] = s[2]-1;
        }
        nRows = s[2] - s[0];
        nColumns = s[3] - s[1];
        //console.log("new ar:" + nColumns + "/" + nRows)
        imgFrame.style["grid-area"] = `${s[0]}/${s[1]}/${s[2]}/${s[3]}`
        imgFrame.style["aspect-ratio"]= nColumns + "/" + nRows;

        let contRect = curImage.parentElement.getBoundingClientRect();
        //console.log(imgRect)

        curImage.style.width = ((imgRect.width / (contRect.width)) * 100) + "%";
        curImage.style.height = ((imgRect.height / (contRect.height)) * 100) + "%";
        //console.log(((imgRect.height / (contRect.height)) * 100))
        zoom(curImage);
        fillerAreas.forEach(area => {
            createFiller(area);
        });
    }
}


function removeImg(e){  
    if(e.target){
        var imgFrame = e.target.parentElement.parentElement.parentElement
    }else{
        imgFrame = e;
    }
    var s = [parseInt(imgFrame.style["grid-row-start"],10),
             parseInt(imgFrame.style["grid-column-start"],10),
             parseInt(imgFrame.style["grid-row-end"],10),
             parseInt(imgFrame.style["grid-column-end"],10)
        ];
    var nRows = s[2] - s[0];
    var nColumns = s[3] - s[1];
    var imageSource = imgFrame.getElementsByClassName("grid-img")[0].src.split('/')
    
    console.log(imageSource[imageSource.length-1])
    createReserveItem(imgFrame.firstChild.firstChild.src, imgFrame.firstChild.firstChild.alt , document.getElementById("reserves"), imageSource[imageSource.length-1]);
    imgFrame.remove();
    for(let i = 0; i < nRows; i++){
        for(let j = 0; j < nColumns; j++){
            var cRow = s[0]+i
            var cCol = s[1]+j
            createFiller(`${cRow}/${cCol}/${cRow+1}/${cCol+1}`);
        }
    }
   
}
function removeAllImgs(){
    let imgFrames = document.querySelectorAll(".image-frame")
    imgFrames.forEach( imgframe => {
        removeImg(imgframe);
    })
}

function lock(e){
    //console.log(e.target.src)
    var split_string = e.target.id.split(/(\d+)/);
    //console.log("Text:" + split_string[0] + " & Number:" + split_string[1]);
    var img = document.getElementById("grid-img"+split_string[1]);
    if (e.target.src.endsWith("Icons/icons8-open-lock-24.png")){
        e.target.src = "Icons/icons8-lock-24.png"
        console.log("locked");
        document.removeEventListener('mouseup', mouseUp, true);
        document.removeEventListener('mousemove', trackMouse, true);
        img.style.cursor = "move";
        img.removeEventListener('mousedown', mouseDown, true);
        img.removeEventListener('dragstart', dontDrag);
        img.setAttribute('draggable','true')
        img.addEventListener("dragstart", drag, true);
        
    }else{
        e.target.src = "Icons/icons8-open-lock-24.png";
        console.log("unlocked");
        img.addEventListener('mousedown', mouseDown, true);
        img.addEventListener("dragstart", dontDrag);
        img.setAttribute('draggable','false')
        img.style.cursor = "grab";
        img.removeEventListener("dragstart", drag);
        document.addEventListener('mouseup', mouseUp, true);
        document.addEventListener('mousemove', trackMouse, true);
    }
    //console.log(e.target.src);
}
function zoom(e){
    console.log(e, "zoom start");
    if(e.target){
        split_string = e.target.id.split(/(\d+)/);
        console.log("Text:" + split_string[0] + " & Number:" + split_string[1]);
        var img = document.getElementById("grid-img"+split_string[1]);
    }else{
        var img = e
    }
    var contRect = img.parentElement.getBoundingClientRect();
    var imgRect = img.getBoundingClientRect();
    var noFit = false;
    console.log((zStrengthValue/100))
    var mult = 1-(zStrengthValue/100);
    if(!e.target){
        mult = 1;
    }else if(split_string[0] == "magp"){
        mult = 1+(zStrengthValue/100)
    }
    // console.log(`Content Width: ${contRect.width.toFixed(2)} x Height: ${contRect.height.toFixed(2)}`)
    // console.log(`New Width: ${imgRect.width.toFixed(2)} * ${mult} = ${(imgRect.width*mult).toFixed(2)}`)
    // console.log(`New Height: ${imgRect.height.toFixed(2)} * ${mult} = ${(imgRect.height*mult).toFixed(2)}`)
    var newH = imgRect.height*mult
    var newW = imgRect.width*mult
    if (newH < contRect.height){
        newH = contRect.height
        newW = (imgRect.width/imgRect.height)*newH
        noFit = true;
        console.log("Fitted image to height of the container.")
    }
    if (newW < contRect.width){
        newW = contRect.width
        newH = (imgRect.height/imgRect.width)*newW
        noFit= true;
        console.log("Fitted image to width of the container.")
    }
    
    let curWMult = newW/imgRect.width
    let curHMult = newH/imgRect.height

    if(newW != imgRect.width && newH != imgRect.height){
        console.log("Size change necessary.")
        let Ar = img.naturalHeight/img.naturalWidth;
        console.log(`Final Width: ${newW.toFixed(2)} x Height: ${newH.toFixed(2)}`)
        
        let pW = ((newW / (contRect.width)) * 100)
        let pH = ((newH / (contRect.height)) * 100)
        console.log(`Width: ${pW.toFixed(2)}% x Height: ${pH.toFixed(2)}%`)

        console.log(`Width multiplier: ${curWMult} Height multiplier: ${curHMult}`)
        img.style.width  = pW + "%";
        img.style.height = pH + "%";
    }
    
    //console.log(imgRect)
    //console.log(parseInt(window.getComputedStyle(img).getPropertyValue("left"),10))
    // if(true){
        //If the image is smaller than the container the image should be centered.
        // console.log(newH,"nh:nw",newW);
        // var middleX = Math.round(-1*((newW/2)-(contRect.width/2)))
        // var middleY = Math.round(-1*((newH/2)-(contRect.height/2)))
        // img.style.top = (middleY / contRect.width * 100) + "%";
        // img.style.left = (middleX / contRect.height * 100) + "%";
    // }else{
        let curTop = parseInt(window.getComputedStyle(img).getPropertyValue("top"),10)
        let curLeft = parseInt(window.getComputedStyle(img).getPropertyValue("left"),10)
        if(curTop == 0 && curLeft == 0){
            console.log("Positioned at origin. returning...")
            console.log(contRect)
        }
        var prevTop = curTop - (contRect.height/2);
        var prevLeft = curLeft - (contRect.width/2);
        var middleX = (prevLeft*curWMult)+(contRect.width/2);
        var middleY = (prevTop*curHMult)+(contRect.height/2);

        imgRect = img.getBoundingClientRect();
        //console.log("For image:",img)
        //console.log(`currentTop: ${curTop}px currentLeft: ${curLeft}px`)
        //console.log(`half cont Height: ${(contRect.height/2).toFixed(2)}px half Width: ${(contRect.width/2).toFixed(2)}px`)
        //console.log("currentLocation - halfframe:",prevTop.toFixed(2), prevLeft.toFixed(2))   
        if(middleX > 0){
            console.log("too far in the right:", middleX)
            middleX = 0;
        }else if(middleX + imgRect.width < contRect.width){
            middleX = -(imgRect.width - contRect.width)
            console.log("Too far in the left.")
            console.log(`middleX + imgRect.width < contRect.width`)
            console.log(`${middleX.toFixed(2)} + ${imgRect.width.toFixed(2)} = ${(curLeft + imgRect.width).toFixed(2)} < ${contRect.width.toFixed(2)}`)
        }
        if(middleY > 0){
            console.log("too far in the down:",middleY)
            middleY = 0;
        }else if(middleY + imgRect.height < contRect.height){
            middleY = -(imgRect.height - contRect.height)
            console.log("too far in the up")
            console.log(`middleY + imgRect.height < contRect.height`)
            console.log(`${middleY.toFixed(2)} + ${imgRect.height.toFixed(2)} < ${contRect.height.toFixed(2)}`)
        }
        
        img.style.top = (middleY / contRect.height * 100) + "%";
        img.style.left = (middleX / contRect.width * 100) + "%";
    //console.log(`Left: ${middleX.toFixed(2)}px Top: ${middleY.toFixed(2)}px`)
    //}

}
function detectLeftButton(evt) {
    evt = evt || window.event;
    if ("buttons" in evt) {
        return evt.buttons == 1;
    }
        var button = evt.which || evt.button;
        return button == 1;
}
function mouseDown(e) {
    //e=e || window.event;
    //pauseEvent(e);
    e.preventDefault();

    split_string = e.target.id.split(/(\d+)/);
    //console.log("Text:" + split_string[0] + " & Number:" + split_string[1]);
    var lock = document.getElementById("lock"+split_string[1]);
    if(detectLeftButton(e) && lock.src.endsWith("Icons/icons8-open-lock-24.png")){
        isDown = true;
        movingElement = e.target.id;
        const offset = [
          e.currentTarget.offsetLeft - e.clientX,
          e.currentTarget.offsetTop - e.clientY
        ];

        //e.currentTarget.style.cursor = "grabbing"
        e.currentTarget.style.cursor = "-webkit-grabbing"
        console.log(e.currentTarget)
        e.currentTarget.setAttribute('data-offset', JSON.stringify(offset));
    }
    
    
}
function mouseUp(){
    isDown = false;
    console.log("unpressing on:",)
    if(movingElement != ""){
        let mElement = document.getElementById(movingElement)
        mElement.style.cursor = "-webkit-grab";
    }
    movingElement = "";
}
function trackMouse(e){
  //e.preventDefault();
  //var isDown =true;
  if(e.target.className != "grid-img"){
    return
  }
  if (isDown && movingElement == e.target.id) {
      //console.log("moving:",e.target)
      // var deltaX = e.movementX;
      // var deltaY = e.movementY;
      // var top = parseInt(window.getComputedStyle(e.target).getPropertyValue("top"),10);
      // var left = parseInt(window.getComputedStyle(e.target).getPropertyValue("left"),10);
      // var bounds = e.target.getBoundingClientRect();
      // console.log(bounds);
      // console.log("left bounds:",bounds.left,"top bouds:",bounds.top);
      //e.target.style.cursor = "grabbing"
      e.target.style.cursor = "-webkit-grabbing"
      var w = parseInt(window.getComputedStyle(e.target).getPropertyValue("width"),10);
      var h = parseInt(window.getComputedStyle(e.target).getPropertyValue("height"),10);
      // var mX = (parseInt(bounds.left,10) + deltaX);
      // var mY = (parseInt(bounds.top,10) + deltaY);
      //console.log(mX + "px:"+mY+"px")
      var containerW = parseInt(window.getComputedStyle(e.target.parentElement).getPropertyValue("width"),10);
      var containerH = parseInt(window.getComputedStyle(e.target.parentElement).getPropertyValue("height"),10);
      //var containerW = 300;
      //var containerH = 250;


      //e.target.style.left = mX + "px";
      //e.target.style.top = mY + "px";
      //console.log(w+":"+h)
        const mousePosition = {    
            x : e.clientX,
            y : e.clientY    
        };
        const offset = JSON.parse(e.target.getAttribute('data-offset'));
        var mX = (mousePosition.x + offset[0]);
        var mY = (mousePosition.y + offset[1]);
        //console.log("width: " + parseInt(e.target.style.width,10) + " height: " + e.target.style.height)
        // constrain image so it doesn't show white space after moving.
        if(mX < (-1*(w - containerW))){
            mX = -1*(w - containerW);
        }else if(mX >= 0){
            mX = 0;
        }
        if(mY < (-1*(h - containerH))){
            mY = -1*(h - containerH);
        }else if(mY >= 0){
            mY = 0;
        }
        
        //0console.log("px:" + mX + ":" + mY);
        var mXPercent = mX / containerW * 100;
        var mYPercent = mY / containerH * 100;
        //console.log("%:" + mXPercent + ":" + mYPercent)
        e.target.style.left = mXPercent + '%';
        e.target.style.top  = mYPercent + '%';
        
        
      //e.target.style.transform = `translate(${deltaX}px,${deltaY}px)`;
      //bounds = e.target.getBoundingClientRect();
      //console.log("After: left bounds:",bounds.left,"top bouds:",bounds.top);
 }
}
