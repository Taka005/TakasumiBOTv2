const kuromoji = require("kuromoji");

module.exports = class Markov{
  constructor(maxChar){
    this.tree = {};
    this.maxChar = maxChar;
  }

  analyze(text){
    return new Promise((resolve,reject)=>{
      kuromoji.builder({ dicPath: "node_modules/kuromoji/dict" }).build((err,tokenizer)=>{
        if(err) reject(err);
  
        resolve(tokenizer.tokenize(text));
      });
    });
  }

  pick(obj){
    if(obj instanceof Array){
      return obj[Math.floor(Math.random()*obj.length)];
    }else if(obj instanceof Object){
      return this.pick(Object.keys(obj));
    }
  }

  pickPart(tokens,pos){
    const part = tokens.filter(token=>token.pos === pos);
    return this.pick(part)?.surface_form||null;
  }

  async train(values){
    for(let i = 0;i < values.length;i++){
      const tokens = await this.analyze(values[i]);
      const words = tokens.map(token=>token.surface_form);
  
      for(let j = 0;j < words.length;j++){
        const currentWord = words[j]||null;
        const nextWord = words[j + 1]||null;
        const followWord = words[j + 2]||null;
  
        if(!this.tree[currentWord]){
          this.tree[currentWord] = {};
        }
  
        if(!this.tree[currentWord][nextWord]){
          this.tree[currentWord][nextWord] = [];
        }
  
        this.tree[currentWord][nextWord].push(followWord);
      }
    }
  }

  async make(){
    let output = "";
    let firstWord, nextWord;

    while(!firstWord){
      const randomLine = this.pick(this.tree);
      const tokens = await this.analyze(randomLine);
      firstWord = this.pickPart(tokens,"名詞");
    }

    nextWord = this.pick(this.tree[firstWord]);

    output += firstWord;
    
    for(;;){
      const currentWord = firstWord;
      const followWord = nextWord;
      
      firstWord = nextWord;
      nextWord = this.pick(this.tree[currentWord][followWord]);
      output += firstWord;

      if(output.length > this.maxChar&&/[。．！？]$/.test(output)) break;

      if(!nextWord) break;
    }

    return output;
  }
}