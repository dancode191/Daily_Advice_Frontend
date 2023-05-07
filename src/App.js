import './App.css';
import axios from "axios";
import { useState } from 'react';
import search from "../src/search.png"
import email from "../src/email.png"



function App() {
  const [advice, setAdvice] = useState('');
  const [searchText, setSearchText] = useState();
  const [searchResults, setSearchResults] = useState([]);
  const [ResultsEmail, setResultsEmail] = useState();
  const [userEmail, setUserEmail] = useState();
  const [error, setError] = useState();

  let adviceEmail = {
    To: userEmail,
    from_name: "daily advice",
    name: "Dan",
    message: advice? advice : ResultsEmail? ResultsEmail : 'nothing to show'
  }; 

  let adviceResultsEmail = '';
  let arrayResults = [];
  const Url = "https://daily-advice-backend.onrender.com"

  async function dropAdvice(){
    try{
      setAdvice('');
      setError('');
      setSearchResults([]);

      const response = await axios.get(Url+"/advice");
      setAdvice(response.data);
      
    }catch(err){
      console.log(err);
      if(err.response.status === 429){
        setError(err.response.data)
      }
      
    }
  }

  async function activeSearch(){
    
      axios.get(Url+"/searchWord", {params:{word: searchText}})
      .then((response)=>{
      
        arrayResults = response.data.slips;
        setSearchResults(arrayResults)

        arrayResults.forEach(element => {
          adviceResultsEmail = adviceResultsEmail + " | " + element.advice;
        });
        setAdvice('');
        setError('');
        setResultsEmail(adviceResultsEmail);
      })
      .catch((err)=>{
        console.log(err);
        setAdvice('');
        setResultsEmail('');
        setError("no results found..")
      })
  }

  function sendMail(){

    if(!error){
      if(userEmail){

        axios.post(Url+"/sendEmail", adviceEmail)
        .then((response)=>{
          console.log("sending mail results: "+response.status);
          setAdvice('');
          setResultsEmail('');
          setSearchResults([]);
          setError("Mail was sent successfuly :)")
          clearError()
        })
        .catch((err)=>{
          console.log("print error: " + err.text);
        })  

      }else{
        setError("Sorry no mail adress was enterd")
        clearError()
      }
    }else{
      setError("Sorry no results found to be sent by mail")
    }
  }
  
function clearError(){
  setTimeout(()=>{
    setError('');
  }, 3000)
  
}


  return (
    <div className="App">

        <div className="container">
          <input className="addEmail" type="email" placeholder=' Enter your email here'
              onChange={(e)=> setUserEmail(e.target.value)}>
          </input>
{/* advice box */}
          <div className="buttons-container">
            <button className='btn' onClick={dropAdvice}>Give Me Advice</button>
            <button className='SearchByTextBtn' onClick={()=>{
              const searchContainer = document.querySelector(".searchContainer");
              searchContainer.style.visibility = searchContainer.style.visibility === "visible" ? "hidden": "visible";
            }}>Search By Text</button>
          </div>

{/* search box */}
          <div className="searchContainer">
            <div className="searchBox">
              <input className='searchInput' type="text" onChange={(e)=> setSearchText(e.target.value)} />
              <button className='searchBtn' onClick={activeSearch}><img className='searchImg' src={search} alt="" /></button>
              <button className='emailBtn' onClick={sendMail}><img src={email} alt="email" /></button>
            </div>


          </div>
          {/* show error if no resutls found: */}
            {error && <>
              <p className='errorMessage'>{error}</p> 
            </>}
{/* search results display */}
          { searchResults && <>
            <div className="search-results-container">
            { 
              searchResults?.map(adv => {
                return (
                  <div key={adv.id} className='adivceOutput'>{adv.advice}</div>
                );
              })
            }
            </div>
          </>}

{/* adivce display */}
          <div className="adviceContainer">
            { advice && 
            <div className="adivceBox">
              <p>{advice}</p>
              <button className='emailBtn' onClick={sendMail}><img src={email} alt="email" /></button>
            </div>
            }
          </div>
          
        </div>
    </div>
  );
}

export default App;
