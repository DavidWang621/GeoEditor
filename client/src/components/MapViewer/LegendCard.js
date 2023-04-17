import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../../store'
import Box from '@mui/material/Box';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import { Typography } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import SquareIcon from '@mui/icons-material/Square';
import InputGroup from 'react-bootstrap/InputGroup';
import 'bootstrap/dist/css/bootstrap.min.css';
import EditLegendTPS from '../../transactions/EditLegendTPS'

function LegendCard(props) {
    const { store, setStore} = useContext(GlobalStoreContext);

    const { index, legendObj } = props;
    const {color, legendText} = props.legendObj

    const [text,setText] = useState(legendText)
    function handleUserNameClick() {

        //store.showPublishedListsFilteredUsers(commentObj.user);
    }

    const handleChangeColor= (color)=>{
        let index = index

        console.log("this is the color")
        console.log(color)

    }
    function handleChangeLegendColor(index) {

        // console.log("start of click")
        // let newMap = {...store}
        // newMap.colorwheelHandler = "lets goooo"
        //
        // let deep  =  JSON.parse(JSON.stringify(newMap))
        //
        // console.log("poopy head")
        // console.log(newMap)
        // setStore(deep)
        //
        // console.log("store right after idk")
        // console.log(store)
        // store.changeModal("MAP_PICK_COLOR_WHEEL")

    }

    let colorString= legendObj.color;

    const handleChange = (event) => {
        setText(event.target.value)
    }

    const handleBlur = () => {
        //jstps transaction right here ig lol
        if(legendText === text)
            return //no transaction if on blur is the same text
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "edit",
            oldText: legendText,
            newText: text,
            oldIndex: index,
        }
        store.jstps.addTransaction(new EditLegendTPS(mappedData))
    }

    const handleDelete = () => {
        //jstps
        let mappedData = {
            store: store,
            setStore: setStore,
            type: "delete",
            oldText: text,
            oldColor: color,
            oldIndex: index,
        }
        store.jstps.addTransaction(new EditLegendTPS(mappedData))

    }

    return (
        <Box style={{ height: "10vh" }} >

            <InputGroup className="mb-3">
                <input type="text" className="form-control" id="validationCustom01" value={text}
                       onChange={handleChange}
                       onBlur={handleBlur}
                       required />
                {/*<BorderColorIcon className="material-icons" sx={{"&:hover": {fill: "rgba(255,240,10,0.8)"}} } style={{fontSize:"1.6rem"}}/>*/}
                <SquareIcon className="material-icons" onClick={handleChangeLegendColor} sx={{color:colorString,
                    paddingTop: "1%",
                }}/>

                <DeleteIcon className="material-icons" sx={{
                    paddingTop: "1%",
                    "&:hover": {fill: "rgba(255,240,10,0.8)"}}}
                    onClick = {handleDelete}
                />



            </InputGroup>


        </Box>
    );
}

export default LegendCard;