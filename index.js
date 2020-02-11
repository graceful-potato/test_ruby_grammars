const fs = require('fs');
const path = require('path');
const vsctm = require('vscode-textmate');

// Load test ruby file
const content = fs.readFileSync('./Test/end_distinction.rb').toString().split("\n");

function loadGrammar(scopeName) {
	let grammarPath = null;
	if (scopeName === 'source.original.ruby') {
		grammarPath = path.resolve(__dirname, 'Syntaxes', 'RubyOriginal.plist');
	} else if (scopeName === 'source.combined.ruby') {
		grammarPath = path.resolve(__dirname, 'Syntaxes', 'RubyCombined.plist');
	} else if (scopeName === 'source.splited.ruby') {
		grammarPath = path.resolve(__dirname, 'Syntaxes', 'RubySplited.plist');
	} else {
		return null;
  }
  
	return Promise.resolve(vsctm.parseRawGrammar(fs.readFileSync(grammarPath).toString(), grammarPath));
}

const test = async (scope, message) => {
  const registry = new vsctm.Registry({loadGrammar: loadGrammar});
  const grammar = await registry.loadGrammar(scope)
  const t0 = Date.now()
  // --------
  for (let i = 0; i < 10; i++) {
    let ruleStack = vsctm.INITIAL;
    for (let i = 0; i < content.length; i++) {
        const line = content[i];
        const lineTokens = grammar.tokenizeLine(line, ruleStack);
        ruleStack = lineTokens.ruleStack;
    }
  }
  // --------
  const t1 = Date.now()


  console.log(message);
  console.log(`Tokenizing ${content.length} lines`)
  console.log('Took', ((t1 - t0) / 10), 'milliseconds');
  console.log('---------------------------------------------------------------------')
}


test('source.original.ruby', 'Original ruby grammar file')
test('source.combined.ruby', 'Ruby grammar file with combined if/unless and while/until rules')
test('source.splited.ruby', 'Ruby grammar file with splited if/unless and while/until rules')
