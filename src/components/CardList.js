import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { Card } from "./Card.js";

const CardList = (props) => 
  {

    const date = new Date();
    const today = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;
    let rotDates = []

    const [isMounted, setIsMounted] = useState(false)
    const [cards, setCards] = useState([]);
    const [enteredName, setEnteredName] = useState('')
    const [enteredQuestion, setEnteredQuestion] = useState('')
    const [chosenQuestion, setChosenQuestion] = useState(null)
    const [chosenKey, setChosenKey] = useState(null)
    

    const deleteCard = (id) =>{
      setCards((prevCards) => {
        let data = prevCards.filter(card => card.id !== id)
        if (updateCards(data)){
          return data
        }
        else{
          prevCards
        }
        
      });
      
    }


    const moveCard = useCallback((dragIndex, hoverIndex) => {
      setCards((prevCards) =>{
      
        let data = update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex]]
          ]
        })

        if (updateCards(data)){
          return data
        }
        else{
          prevCards
        }

    });
    }, []);


    const startSprint = () =>{
      setCards((prevCards) => {
        let tempCards = [...prevCards];
        let tempItem = tempCards.shift()
        tempItem.date = today
        tempCards.push(tempItem)

        if (updateCards(tempCards)){
          return tempCards
        }
        else{
          prevCards
        }
        
      });
      
    }


    const fetchData = async () => {
        const response = await  fetch('https://standup-6faab-default-rtdb.firebaseio.com/names.json');
        
        const data = await response.json();

        if (data!=null && response.ok){
          setCards(data)
        }
        setIsMounted(true)

      }


    const updateCards = async (data) =>{
      const response =  await fetch('https://standup-6faab-default-rtdb.firebaseio.com/names.json', {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok){
        return true
      }
      else{
        return false
      }
    }
    

    const submitHandler = (event) =>{
      event.preventDefault()
      let id = 1
      if (cards.length>0){
        id=cards[cards.length - 1].id
      }
      setCards((prevCards) => {
        let data = [...prevCards, {"id":id+1,"text":enteredName, "date":null}]
        if (updateCards(data)){
          return data
        }
        else{
          prevCards
        }
        
      });
      
      setEnteredName('')
    }


    const addQuestion = async (event) =>{
      event.preventDefault()

      const response =  await fetch('https://standup-6faab-default-rtdb.firebaseio.com/questions.json', {
        method: 'POST',
        body: JSON.stringify({"question":enteredQuestion}),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      setEnteredQuestion('')
    }


    const setUpDates = () => {

      let d = new Date();
      let day = d.getDay(),
      diff = d.getDate() - day + (day == 0 ? -6:1); // adjust when day is sunday
      let start = new Date(d.setDate(diff));
      var finish = new Date();
      finish.setDate(start.getDate() + 4);


      let begin = (start.getMonth()+1)+"/"+start.getDate()
      let end = (finish.getMonth()+1)+"/"+finish.getDate()
      let currDate = begin+" - "+end

      rotDates.push(currDate)


      for (var i = 1; i <10; i++) {
        
        start.setDate(start.getDate()+7);
        finish.setDate(finish.getDate()+7);

        begin = (start.getMonth()+1)+"/"+start.getDate()
        end = (finish.getMonth()+1)+"/"+finish.getDate()
        currDate = begin+" - "+end
        rotDates.push(currDate)
      }

    }


    const nameInputChangeHandler = (event) => {
      setEnteredName(event.target.value);
    };


    const questionInputChangeHandler = (event) => {
      setEnteredQuestion(event.target.value);
    };


    const handleGenerateQuestion = async (event) => {
      event.preventDefault()

      const response = await  fetch('https://standup-6faab-default-rtdb.firebaseio.com/questions.json');
        
      const data = await response.json();
      if (data===null){
        return
      }

   
      var keys = Object.keys(data);
      let qKey = keys[ keys.length * Math.random() << 0]
      let question = data[qKey]
      setChosenQuestion(question.question)
      setChosenKey(qKey)
    }


    const handleUseQuestion = async (event) => {
      event.preventDefault()

      const response =  await fetch(`https://standup-6faab-default-rtdb.firebaseio.com/questions/${chosenKey}.json`, {
        method: 'DELETE',
      });

      props.pickQuestion(chosenQuestion)
      props.switchPicker()
    }


    useEffect(() => {

      fetchData()
      setUpDates()
      
      },[]);


    const renderCard = useCallback((card, index) => {
      return (
        <Card
        key={card.id}
        index={index}
        id={card.id}
        text={card.text}
        moveCard={moveCard}
        deleteCard={deleteCard}
        startSprint={startSprint}
        date={card.date}
        rotDate={rotDates[index]}

        />
      );
    }, []);

    

    return (
      <div>
        {/* <h1>Sprint lead tracker</h1> */}
        <div className="chosenQuestion">{chosenQuestion}</div>
        <button className="questionButton" onClick={handleGenerateQuestion}>Generate random question</button>
        {chosenQuestion && <button className="questionButton" onClick={handleUseQuestion}>Use question</button>}
        {isMounted && <div>
        {cards&&<div className="NameList">{cards.map((card, i) => renderCard(card, i))}</div>}
        <div className="addForms">
        <form className="standupForms" onSubmit={submitHandler}>
        <div className="newCardInput">
        <label htmlFor="name">Add new name:</label>
        <input
          type='text'
          id='name'
          onChange={nameInputChangeHandler}
          value={enteredName}
        />
        
          <button type="submit">
            Add
          </button>
          </div>
      </form>
      <form className="standupForms" onSubmit={addQuestion}>
        <div className="newCardInput">
        <label htmlFor="name">Add new question:</label>
        <textarea
          type='text'
          id='name'
          onChange={questionInputChangeHandler}
          value={enteredQuestion}
        />
        
          <button type="submit">
            Add
          </button>
          </div>
      </form>
      </div>
      </div>}
      </div>
    );
  }


export default CardList;
