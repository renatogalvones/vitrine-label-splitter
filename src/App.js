import { useRef, useState, useEffect } from 'react';
import './App.css';

function App() {
  const inputFileRef = useRef();
  const [fileContents, setFileContents] = useState('');
  const [output, setOutput] = useState([]);
  const [buttonActiveIndex, setButtonActiveIndex] = useState(0);

  useEffect(() => {
    let sum = 0;
    let labelBlocks = [];
    let blockIndex = 0;
    let apiLimit = 50;
    let splitted = fileContents.split('^XZ');

    splitted.forEach(labelText => {
      const match = labelText.match(/\^PQ(\d+)/gm);
      if (match) {
        let quantity = match ? Number(match[0].replace('^PQ','')) : 0;

        if ((sum + quantity) <= apiLimit * (blockIndex + 1)) {
          labelBlocks[blockIndex] = (labelBlocks[blockIndex] || '') + `${labelText}^XZ`;
          if ((sum + quantity) === apiLimit * (blockIndex + 1)) blockIndex++;
        } else {
          let missingToLimit = (apiLimit * (blockIndex + 1)) - sum;
          let restOfQuantity = quantity - missingToLimit;
          labelBlocks[blockIndex] = (labelBlocks[blockIndex] || '') + `${labelText.replace(match, `^PQ${missingToLimit}`)}^XZ`;
          blockIndex++;
          labelBlocks[blockIndex] = (labelBlocks[blockIndex] || '') + `${labelText.replace(match, `^PQ${restOfQuantity}`)}^XZ`;
        }
        sum += Number(quantity);
      }
    });

    setOutput(labelBlocks);
  }, [fileContents]);

  const onChangeInputRef = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = (event) => setFileContents(event.target.result);
    fileReader.readAsText(e.target.files[0]);
  }

  const copyToClipboard = async (content) => {
    await navigator.clipboard.writeText(content);
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl text-center pt-10">Separador de etiquetas 1.0</h1>
      <div className="flex  h-screen">
        <div className="flex flex-col justify-center w-2/4 h-5/6">
          <input className="text-xs mb-8" type="file" ref={inputFileRef} onChange={onChangeInputRef} />
          <textarea name="" id="" value={fileContents} className="border rounded-lg text-xs p-2 h-4/6"></textarea>
        </div>
        <div className="flex flex-col justify-center w-2/4 pl-10 h-5/6">
          {output.map((content, index) =>
            <button
              className={`rounded-lg border p-2 text-xs mt-3 w-2/4 self-center bg-cyan-200 text-cyan-700 ${buttonActiveIndex-1 === index && 'bg-lime-400 font-bold'}`}
              onClick={() => {
                copyToClipboard(content);
                setButtonActiveIndex(index + 1);
              }}
            >
              {`Copiar etiquetas ${index*50}-${(index+1)*50}`}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
