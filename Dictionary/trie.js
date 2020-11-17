
// Returns a new node for trie
function makeNode(ch) {
   this.ch =ch;
   this.isTerminal = false;
   this.map = {}; // gonna store a mapping
   this.words = []; // list of words
   this.meaning = ""; //meanings of the word
}

// add to trie

async function add(str, i, root) {
    
    if(i===str.length){
        root.isTerminal = true;

         const promise = await fetch(`https://dictionaryapi.com/api/v3/references/sd3/json/${str}?key=46807624-2b09-44db-8673-96b46dbc30cf`);
         const data = await promise.json();
         let defn = data[0].shortdef[0];
      
         root.meaning = defn;
        //console.log(str, root.meaning);
        return;
    }

    if(!root.map[str[i]])
        root.map[str[i]]= new makeNode(str[i]);
    
    root.words.push(str); // while we are word, example: geek and we get to g, itll push the e.
    //console.log(root.map);

    add(str, i+1, root.map[str[i]]);
}

function search(str, i, root) {
    if(i===str.length)
        return root.words;
    
    if(!root.map[str[i]])
        return[];
    
    return search(str, i+1, root.map[str[i]]);
}

function lookMeaning(str,i,root){
    if(i===str.length)
        return root.meaning;
    if(!root.map[str[i]])
        return[];
    
    return lookMeaning(str, i+1, root.map[str[i]]);
}
