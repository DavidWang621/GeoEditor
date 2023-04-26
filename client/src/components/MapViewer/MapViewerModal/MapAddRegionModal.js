import { useContext,useState } from 'react'
import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import GlobalStoreContext, {CurrentModal} from "../../../store";
import VertexTPS from "../../../transactions/VertexTPS";
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

function MapAddRegionModal(props) {
    const { store,setStore } = useContext(GlobalStoreContext);
    const [addRegionName, setAddRegionName] = useState("");

    function handleAddRegionName(event) {



        store.changeModal("NONE");
        console.log("This is where the handle add new region name occurs")
        console.log(store)
        console.log(store.polygonData)



        let transactionMappedData = {
            type: "add",
            store: store,
            setStore: setStore,
            newPolygon: store.polygonData,
            newRegionName: addRegionName,
            update:store.updateEditor,
        }
        store.jstps.addTransaction(new VertexTPS(transactionMappedData))

    }
    function handleCloseModal(event) {
        store.changeModal("NONE");
    }
    function handleUpdateSearch(event) {
        setAddRegionName(event.target.value);
    }

    return (
        <Modal
            open={store.currentModal === CurrentModal.MAP_ADD_REGION_NAME}
            onClick={handleCloseModal}
        >
            <Box sx={style}
                 onClick={e => e.stopPropagation()}

            >

                <Box
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center" style={{backgroundColor:"#f1f1f1", color:"#000000"}}>

                    <Typography style={{fontSize:"2rem"}} sx={{marginBottom:"5%"}}>
                        <strong>Enter New Region Name</strong>
                    </Typography>
                    <TextField type="text" id="outlined-basic"  variant="outlined" onChange={
                        handleUpdateSearch} height="2.2vw" placeholder="Enter Name" style={{background:"#ffffff",width:"50%"}}
                               inputProps={{
                                   style: {
                                       fontSize:"1rem",
                                       height: "0vw"
                                   }}} />
                    <Box>
                        <input type="button"
                               class="modal-confirm-button"
                               onClick={() => {
                                   handleAddRegionName();}}
                               value='Confirm' />
                        <input type="button"
                               class="modal-cancel-button"
                               onClick={() => {
                                   handleCloseModal();}}
                               value='Cancel' />
                    </Box>
                </Box>



            </Box>
        </Modal>
    );
}
export default MapAddRegionModal;