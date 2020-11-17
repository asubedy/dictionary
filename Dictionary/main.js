let input = document.querySelector('#input');
let searchBtn = document.querySelector('#Search');
let notFound = document.querySelector('.notFound');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let loading = document.querySelector('.loading');
let logo = document.getElementById('logo');
let navbut = document.getElementById('navbut')

let mainMeaning=  "";

//for menu logo 
navbut.addEventListener('click',e =>{
    if(logo.classList.contains("fa-bars")){
    setTimeout(() => {
        logo.classList.remove("fa-bars");
        logo.classList.add(("fa-times"));
    }, 220);
    
    }
    else{
        setTimeout(() => {
            logo.classList.remove("fa-times");
            logo.classList.add(("fa-bars"));
        }, 220);
      
    }
})


let defTitle = document.querySelector('.defTitle');
let defAudio = document.querySelector('.defAudio');
let pos = document.querySelector('.pos')
let ex = document.querySelector('.ex')
let exTitle = document.querySelector('.exTitle')

let suggest = false


function suggestionListClick(word)
{
    audioBox.innerHTML = "";
    notFound.innerText = "";
    defBox.innerText = "";
    if (word === "") {
        alert("Word is required");
        return;
    }
    getData(word);
}

function driverFunc(e) {
    e.preventDefault();

    //clear Data
    audioBox.innerHTML = "";
    notFound.innerText = "";
    defBox.innerText = "";

    //get input data

    let word = input.value;

    //call API get data

    if (word === "") {
        alert("Word is required");
        return;
    }

    getData(word);
}

//searches if user presses enter
input.onkeypress = function (e) {
    if (!e) e = window.event;
    let keyCode = e.keyCode || e.which;
    if (keyCode == '13') {
        driverFunc(e)
    }
}


searchBtn.addEventListener('click', function (e) {
    driverFunc(e);
})


function meaningShow(meaning){
    mainMeaning = meaning;
    //console.log(meaning);

}

async function getData(word) {
   
   // console.log(mainMeaning);
    loading.style.display = 'block';
    //ajax call
    const response = await fetch(`https://dictionaryapi.com/api/v3/references/sd3/json/${word}?key=46807624-2b09-44db-8673-96b46dbc30cf`);

    const data = await response.json();


    //if empty result
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerText = "No result found";
        return;
    }
    console.log(data);

    // if results is suggestions

    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerText = 'Did you mean';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggest = document.createElement('button');
            suggest.classList.add('Suggested');
            suggest.innerText = element;
            suggest.style.border = "0px";

            //changing cursor to finger pointer
            suggest.addEventListener('mouseenter', e => {
                // console.log(`mouse enterd in ${suggest.innerText}`);

                suggest.style.cursor = "pointer";
                suggest.style.transform = "scale(1.1)";

                //search if the users click a suggestion
                suggest.addEventListener('click', function (e) {
                    console.log(`clicked on${suggest.innerText}`);
                    input.value = suggest.innerText;
                    driverFunc(e);
                    suggest = true;
                    //getData(input.value);
                })
            })
            //change the curor to normal pointer 
            suggest.addEventListener('mouseleave', function (e) {
                // console.log("Mouse left");
                suggest.style.transform = "scale(1)";
            })
            notFound.appendChild(suggest);
        })
        return;
    }
    else{
    //Result found
    //short definition
    //let sdefinition = data[0].shortdef[0];
    if(mainMeaning != ""){
    let sdefinition = mainMeaning;
    defBox.innerText = sdefinition;
    }
    else{
        let sdefinition = data[0].shortdef[0];
    defBox.innerText = sdefinition;
    }
    



    let pospeech = data[0].fl;
    pos.innerText = pospeech;
    loading.style.display = 'none';

    // let exam = data[0].dros[0]["drp"];
    // if (exam !== undefined){

    //     ex.innerText = exam;
    //     exTitle.innerText = "Example:"
    // }

    defTitle.innerText = 'Definition:';

    //sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        defAudio.innerText = 'Pronunciation:';
        renderSound(soundName);
    }
    }
}

function renderSound(soundName) {
    //https://media.merriam-webster.com/soundc11/
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key=80959456-80a1-40b6-a784-e647983e45c1`;

    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}

let maintext =""
let text = ""
function getSelectionText() {

  var activeEl = document.activeElement;
  var activeElTagName = activeEl.tagName.toLowerCase()
  if (
    (activeElTagName == "textarea") || (activeElTagName == "input" &&
    /^(?:text|search|password|tel|url)$/i.test(activeEl.type)) &&
    (typeof activeEl.selectionStart == "number")
  ) {
      text = activeEl.value.slice(activeEl.selectionStart, activeEl.selectionEnd);
      //if(text != ""){myFunction()}
      console.log(text);
  } else if (window.getSelection) {
      text = window.getSelection().toString();
      //if(text!= ""){myFunction()}
      text;
  } 
  maintext = text;
}
 input.addEventListener('focus',function(e){
   console.log(maintext)
   input.value = maintext
   console.log(input.value)

 })


 document.onmouseup = document.onkeyup =document.onselectionchange = function() {
   getSelectionText();
// if(document.getElementById("sel").value!=null){
//   search.value = document.getElementById("sel").value 
// }

};
