import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";


const style = {
  border: "1px solid gray",
  borderRadius: "3px",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "pointer",
  display: "inline-flex"
};
export const Card = ({ id, text, index, moveCard, deleteCard, startSprint, date }) => {
  const ref = useRef(null);
  const [{ handlerId }, drop] = useDrop({
    accept: "card",
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId()
      };
    },
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      const clientOffset = monitor.getClientOffset();

      const hoverClientY = clientOffset.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      moveCard(dragIndex, hoverIndex);

      item.index = hoverIndex;
    }
  });

  const [{ isDragging }, drag] = useDrag({
    type: "card",
    item: () => {
      return { id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  });
  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));

  const handleDeleteClick = () =>{
    deleteCard(id)
  }

  const handleStartSprint = () =>{
    startSprint()
  }

  const handleStarts = () =>{
    startS()
  }

  return (
    <div className="Card" ref={ref} style={{ opacity }} data-handler-id={handlerId}>
      <div className="NameLabel">{text}
      <br></br>
      {date&&<p className="dateLabel">{date}</p>}</div>
      <div className="NameButtons">
        {index===0&&<button className="SkipButton" onClick={handleStartSprint}>Start standup</button>}
        <button className="RemoveButton" onClick={handleDeleteClick}>Remove</button>
      </div>
    </div>
    
  );
};
