import update from "immutability-helper";
import { useCallback, useState, useEffect } from "react";
import { Card } from "./Card.js";

const CardList = (props) => 
  {
    const date = new Date();
    const today = `${date.getMonth()+1}/${date.getDate()}/${date.getFullYear()}`;

    const [isMounted, setIsMounted] = useState(false)
    const [cards, setCards] = useState([]);
    const [enteredName, setEnteredName] = useState('')
    

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
        console.log(tempItem)
        tempCards.push(tempItem)

        if (updateCards(tempCards)){
          return tempCards
        }
        else{
          prevCards
        }
        
      });
      props.switchPicker()
      
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


    const nameInputChangeHandler = (event) => {
      setEnteredName(event.target.value);
    };


    useEffect(() => {

      fetchData()
      
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

        />
      );
    }, []);

    

    return (
      <div>
        <h1>Sprint lead tracker</h1>
        {isMounted && <div>
        {cards&&<div className="NameList">{cards.map((card, i) => renderCard(card, i))}</div>}
        <form onSubmit={submitHandler}>
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
      </div>}
      </div>
    );
  }


export default CardList;
