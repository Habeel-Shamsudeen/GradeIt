const { Parser, Language } = require('web-tree-sitter');


async function initParser() {
  await Parser.init();
  const parser = new Parser();

  
  const Python = await Language.load("./node_modules/tree-sitter-python/tree-sitter-python.wasm");
  const JavaScript = await Language.load("./node_modules/tree-sitter-javascript/tree-sitter-javascript.wasm");

 
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

  const pythonCode = `
  from sklearn.datasets import load_iris
import matplotlib.pyplot as plt

from sklearn import tree
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
from sklearn.metrics import (
    precision_score,
    accuracy_score,
    confusion_matrix,
    ConfusionMatrixDisplay,
    f1_score,
    recall_score
)

iris = load_iris()
x = iris.data 

y = iris.target

x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.33)

model = DecisionTreeClassifier(criterion="entropy", max_depth=3)

model.fit(x_train,y_train)

y_pred = model.predict(x_test)

uk_pred = model.predict([[3.4,3.5,3.2,1.4]])
print("Predicted class value from unknow data:",iris.target_names[uk_pred])

accuray = accuracy_score(y_pred, y_test)
print("Accuracy:", accuray)

f1 = f1_score(y_pred, y_test,average='weighted')
print("F1 Score:", f1)

precision = precision_score(y_pred,y_test,average='weighted')
print("precision Score:", precision)

recallScore = recall_score(y_test, y_pred, average='weighted')
print("recall Score:", recallScore)

tree.plot_tree(model, proportion=True)
plt.show()

  `;

  console.log(await normalizeVariables(pythonCode, "python"));

  const jsCode = `
  function multiply(x, y) {
      let product = x * y;
      return product;
  }
  `;

  console.log(await normalizeVariables(jsCode, "js"));
}

initParser().catch(console.error);
