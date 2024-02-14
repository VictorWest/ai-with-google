import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";
import { useState, useEffect} from "react";
import SearchIcon from '@mui/icons-material/Search';
import { Zoom } from "@mui/material";
import DoubleArrowRoundedIcon from '@mui/icons-material/DoubleArrowRounded';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  customZoom: {
    width: 0,
    whiteSpace: 'nowrap',
    animation: '$growFromLeft 0.5s forwards', 
  },
  '@keyframes growFromLeft': {
    from: {
      width: 0,
    },
    to: {
      width: '100%', 
    },
  },
}));


function App() {
  let newPrompt
  const classes = useStyles();
  const [initialRender, setInitialRender] = useState(true);

  useEffect(() => {
    if (initialRender) {
      setInitialRender(false);
    }
  }, [initialRender]);
  const MODEL_NAME = "gemini-pro";
  const API_KEY = "AIzaSyBoA9M6I_XdUC_tONYh111O7wt8_YlO-Q8";
  const [input, setinput] = useState("")
  function handleChange(e){
    setinput(e.target.value)
  }
  async function run() {
    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  
    const generationConfig = {
      temperature: 0.9,
      topK: 1,
      topP: 1,
      maxOutputTokens: 2048,
    };
  
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
  
    const parts = [
      
      {text: input},
    ];
  
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
  
    const response = result.response;
    console.log(response.text());
    document.querySelector(".response > p").innerText = response.text()
    if(response.text() != ""){
          document.querySelector("button").removeAttribute("disabled")
    }
  }
  
  function addInput(e){
    e.preventDefault();
    newPrompt = input;
    document.querySelector("button").setAttribute("disabled", true)
    run()
  }
  function refreshWindow(){
    location.reload()
  }
  return (
    <div className="main">
      <div className="main-input">
      <Zoom in={true} timeout={700}>
        <h1>AI<DoubleArrowRoundedIcon fontSize="xlarge"/><span>WITH <span>GEMINI
          </span></span></h1>
      </Zoom>
          <div className="container">
          <div className="chat-container">
          <Zoom in={!initialRender} style={{ transitionDelay: '0.3s' }}>
            <div className={classes.customZoom}>
                <input className="chat-box" id="chat-box" contentEditable={true} placeholder="Message Gemini..." onChange={handleChange}></input>   
            </div>
          </Zoom>

            
          </div>

            <button type="submit" id="submit" onClick={addInput}>
              <Zoom in= {true}>
                <SearchIcon />
              </Zoom>
            </button>      
          </div>
            <p className="new" onClick={refreshWindow}>New Chat</p>
        </div>
        <div className="main-response">
          <div className="response-box">
            <div className="response"><p>Awaiting Gemini...</p></div>
            </div>
        </div>
    </div>
  )
}

export default App
