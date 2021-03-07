import React,{useState} from 'react'
import {DragDropContext,Draggable,Droppable} from 'react-beautiful-dnd'
import {v4 as uuid} from 'uuid'

import "../css/Kanban.css"

const items = [
    {id:uuid(),content:'Task 1'},
    {id:uuid(),content:'Task 2'}
]

const columns = {
       [uuid()] : {
            name :"todo",
            items:items
        },
        [uuid()] :{
            
            name :"in progress",
            items:[]
        },
        [uuid()] :{
            
            name :"Done",
            items:[]
        },
        [uuid()] :{
            
            name :"Issues",
            items:[]
        }
    }

const onDropEnd = (result,cols,setCols) =>{
    if(!result.destination) return;
    const {source,destination} = result;
    if(source.droppableId===destination.droppableId){
        const column = cols[source.droppableId]
        const copiedItems = [...column.items]
        const [removed] = copiedItems.splice(source.index,1)
        copiedItems.splice(destination.index,0,removed)
        column["items"] = copiedItems;
        setCols({...cols,[source.droppableId]:{...column,items:copiedItems}});
    }else{
        const srcCol = cols[source.droppableId]
        const destCol = cols[destination.droppableId]
        const srcItems = [...srcCol.items]
        const destItems = [...destCol.items]
        const[removed] = srcItems.splice(source.index,1)
        destItems.splice(destination.index,0,removed)
        setCols({...cols,
                    [source.droppableId]:{...srcCol,items:srcItems},
                    [destination.droppableId]:{...destCol,items:destItems}
                })
    }
}

const Kanban = () => {

    const[cols,setCols] = useState(columns)

    return (
        <div className="kanban-board">
            <DragDropContext onDragEnd={result=>onDropEnd(result,cols,setCols)}>
                {
                    Object.entries(cols).map(([id,column]) =>(
                        <div className="column-container">
                            <h2 className="column-title">{column.name.toUpperCase()}</h2>
                        <Droppable droppableId={id} key={id} >
                            {
                                (provided,snapshot)=>{
                                    return(
                                        <div {...provided.droppableProps} 
                                            ref={provided.innerRef} 
                                            className={snapshot.isDraggingOver?"column-items-container drag-over":"column-items-container"}
                                            >
                                                {
                                                    column.items.map((item,index)=>(
                                                        <Draggable key={item.id} draggableId={item.id} index={index}>
                                                            {
                                                                (provided,snapshot)=>(
                                                                    <div 
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className={snapshot.isDragging?"item-card dragging":"item-card"}
                                                                    
                                                                    style={{
                                                                        ...provided.draggableProps.style                                                    
                                                                    }}
                                                                    >
                                                                        <span>{item.content}</span>
                                                                        
                                                                    </div>
                                                                )
                                                            }
                                                        </Draggable>
                                                    ))
                                                }
                                                {provided.placeholder}
                                            </div>
                                    )
                                }
                            }
                            
                        </Droppable>
                        </div>
                    ))
                }
            </DragDropContext>
        </div>
    )
}

export default Kanban
