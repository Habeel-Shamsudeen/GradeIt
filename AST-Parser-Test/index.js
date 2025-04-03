const { Parser, Language } = require('web-tree-sitter');

async function initParser() {
  await Parser.init();
  const parser = new Parser();
  
  const Python = await Language.load("./node_modules/tree-sitter-python/tree-sitter-python.wasm");
  const JavaScript = await Language.load("./node_modules/tree-sitter-javascript/tree-sitter-javascript.wasm");
 
  // Function to normalize variables in code
  async function normalizeVariables(code, lang) {
      let varMap = new Map();
      let funcCount = 1, varCount = 1;
      
      parser.setLanguage(lang === "python" ? Python : JavaScript);
      const tree = parser.parse(code);
      
      function traverse(node) {
          for (let i = 0; i < node.childCount; i++) {
              let child = node.child(i);
              
              if (child.type === "function_definition" || child.type === "function_declaration") {
                  let funcNameNode = child.child(1);
                  if (funcNameNode) {
                      let oldName = funcNameNode.text;
                      if (!varMap.has(oldName)) {
                          varMap.set(oldName, `func${funcCount++}`);
                      }
                  }
              }

              // Rename variables
              if (child.type === "identifier") {
                  let oldName = child.text;
                  if (!varMap.has(oldName)) {
                      varMap.set(oldName, `var${varCount++}`);
                  }
              }

              // Recursively traverse
              traverse(child);
          }
      }

      traverse(tree.rootNode);

      let newCode = code;
      for (let [oldName, newName] of varMap.entries()) {
          newCode = newCode.replace(new RegExp(`\\b${oldName}\\b`, "g"), newName);
      }

      return newCode;
  }
  
  function extractASTSequence(tree) {
      const nodeTypes = [];
      
      function traverseForTypes(node) {
          nodeTypes.push(node.type);
          for (let i = 0; i < node.childCount; i++) {
              traverseForTypes(node.child(i));
          }
      }
      
      traverseForTypes(tree.rootNode);
      return nodeTypes;
  }
  
  
  function generateNGrams(sequence, n) {
      const ngrams = [];
      for (let i = 0; i <= sequence.length - n; i++) {
          ngrams.push(sequence.slice(i, i + n).join('|'));
      }
      return ngrams;
  }
  
  
  function jaccardSimilarity(set1, set2) {
      const intersection = new Set([...set1].filter(x => set2.has(x)));
      const union = new Set([...set1, ...set2]);
      
      return intersection.size / union.size;
  }
  
  
  async function calculateSimilarity(code1, code2, language, method = "both") {
      parser.setLanguage(language === "python" ? Python : JavaScript);
      
      // Normalize variables in both code snippets
      const normalizedCode1 = await normalizeVariables(code1, language);
      const normalizedCode2 = await normalizeVariables(code2, language);
      
      // Parse the normalized code
      const tree1 = parser.parse(normalizedCode1);
      const tree2 = parser.parse(normalizedCode2);
      
      let astSimilarity = 0;
      let ngramSimilarity = 0;
      
      // AST-based similarity
      if (method === "ast" || method === "both") {
          const sequence1 = extractASTSequence(tree1);
          const sequence2 = extractASTSequence(tree2);
          
          // Calculate similarity based on the full AST structure
          const set1 = new Set(sequence1);
          const set2 = new Set(sequence2);
          
          astSimilarity = jaccardSimilarity(set1, set2);
      }
      
      if (method === "ngram" || method === "both") {
          const n = 3; // Can be adjusted
          
          const sequence1 = extractASTSequence(tree1);
          const sequence2 = extractASTSequence(tree2);
          
         
          const ngrams1 = generateNGrams(sequence1, n);
          const ngrams2 = generateNGrams(sequence2, n);
          
          const ngramSet1 = new Set(ngrams1);
          const ngramSet2 = new Set(ngrams2);
          
          ngramSimilarity = jaccardSimilarity(ngramSet1, ngramSet2);
      }
      
      if (method === "ast") {
          return { similarity: astSimilarity, method: "AST-based" };
      } else if (method === "ngram") {
          return { similarity: ngramSimilarity, method: "N-gram-based" };
      } else {
          const combinedSimilarity = (astSimilarity * 0.6) + (ngramSimilarity * 0.4);
          return {
              similarity: combinedSimilarity,
              astSimilarity,
              ngramSimilarity,
              method: "Combined"
          };
      }
  }
  
  const pythonCode1 = `
  a = 5
  b = 7
  print(a + b)
  `;
  
  const pythonCode2 = `
  x = 5
  y = 7
  print(x + y)
  `;
  
  const pythonCode3 = `
  a = 10
  b = 20
  c = a * b
  print(c)
  `;
  
  const jsCode1 = `
  function multiply(x, y) {
      let product = x * y;
      return product;
  }
  `;
  
  const jsCode2 = `
  function calc(a, b) {
      let result = a * b;
      return result;
  }
  `;
  
  const jsCode3 = `
  function add(a, b) {
      return a + b;
  }
  `;
  
  async function runTests() {
      console.log("Python code similarity tests:");
      console.log("Similar code (different variable names):");
      console.log(await calculateSimilarity(pythonCode1, pythonCode2, "python"));
      
      console.log("\nDifferent code (different operations):");
      console.log(await calculateSimilarity(pythonCode1, pythonCode3, "python"));
      
      console.log("\nJavaScript code similarity tests:");
      console.log("Similar code (different function/variable names):");
      console.log(await calculateSimilarity(jsCode1, jsCode2, "js"));
      
      console.log("\nDifferent code (different operations):");
      console.log(await calculateSimilarity(jsCode1, jsCode3, "js"));
  }
  
  runTests().catch(console.error);
}

initParser().catch(console.error);