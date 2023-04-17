import {useEffect, useRef, useState, useContext} from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';
import { CurrentModal, GlobalStoreContext } from '../../store/index'
import EditLegendTPS from '../../transactions/EditLegendTPS'
function GeomanJsWrapper(props) {
    //with this we can actually customize all of the buttons
    //we can also add a custom merge button as well.
    const context = useLeafletContext();
    const isInitialRender = useRef(true);// in react, when refs are changed component dont re-render
    const { store,setStore } = useContext(GlobalStoreContext);
    const [update, setUpdate] = useState(1);
    const [added, setAdded] = useState(false);
    
    const [newPolygonFeature, setNewPolygonFeature]= useState(
        {
          "type": "Feature",
          "properties": {
            "name": "My Polygon"
          },
          "geometry": {
            "type": "Polygon",
            "coordinates": [[]
              
            ]
          }
        }
      )
    // useEffect (()=> {
    //     setUpdate(update=>update+1)
    // },[props.file])

    useEffect( () => {
        if(isInitialRender.current) {// skip initial execution of useEffect
            isInitialRender.current = false;// set it to false so subsequent changes of dependency arr will make useEffect to execute
            return;
        }
        const L = context.layerContainer || context.map;
        const map = L.pm.map
        const leafletContainer = L
        map.on('zoomend', function() {
            let centerArr =[]
            let center = map.getCenter()
            centerArr[0]=center.lat
            centerArr[1]=center.lng
            store.setZoomLevel(map.getZoom(),centerArr)
        });
        map.on('pm:drawstart', ({ workingLayer }) => {
            
            
            workingLayer.on('pm:vertexadded', (e) => {
                let newCoords=[]
                newCoords[0]=e.latlng.lng
                newCoords[1]=e.latlng.lat
                let newRegion= newPolygonFeature
                newRegion.geometry.coordinates[0].push(newCoords)
                setNewPolygonFeature(newRegion)
                //store.setRegionProperties(newRegion)
                //setNewPolygonFeature(newPolygonFeature.geometry.coordinates[0].push(newCoords))
              //console.log(newPolygonFeature)
              
            });
          });
          map.on('pm:drawend', (e) => {
            let sameFirstandLastCoords = newPolygonFeature
            if(newPolygonFeature.geometry.coordinates[0].length>0){
            let firstCoord = newPolygonFeature.geometry.coordinates[0][0];
            sameFirstandLastCoords.geometry.coordinates[0].push(firstCoord)
            props.file.features.push(sameFirstandLastCoords)
            
            
            let centerArr =[]
            let center = map.getCenter()
            centerArr[0]=center.lat
            centerArr[1]=center.lng
            
            
            props.updateViewer()
            props.updateEditor()
            store.setAddRegion(map.getZoom(),centerArr,"MAP_ADD_REGION_NAME")
            }
           
            });
    if (leafletContainer ){
        console.log("ADDING")
        setAdded(true);
        const mergeButtonAction = [
            'cancel',
            {
                text: 'merge selected region',
                onClick: () => {
                    console.log("merging button confirmation")
                    store.changeModal(CurrentModal.MAP_MERGE_REGION_NAME)
                },
            },
        ]

        const mergeButtonClick = () => {
            console.log("merge button toggle clicked")
            //on click we toggle to enable the selection of regions
            props.toggleSelectMode()
        }

        const extendedMenuActionCancel = [
            'cancel',
        ]


        const undoButtonClick = () =>{
            store.jstps.undoTransaction()
        }

        const redoButtonClick = () =>{
            store.jstps.doTransaction()
        }

        const handleAddLegend = () => {
            let mappedData = {
                store: store,
                type: "add",
                state: null,
                setStore: setStore,
            }
            store.jstps.addTransaction(new EditLegendTPS(mappedData))
        }


        //each of the right geoman buttons, [their names, extra menu after click, function on initial click]
       //null means no popup actions
        const customButtonCollection = [
            ["merge", mergeButtonAction,                mergeButtonClick ],
            //TODO: jstps for this one
            // ["addRegion", mergeButtonAction,            mergeButtonClick ], //i think this one is already done i guess
            ["addLegend", null, handleAddLegend ],
            ["changeBackgroundColor", mergeButtonAction,mergeButtonClick ],
            ["changeRegionColor", mergeButtonAction,    mergeButtonClick ],
            ["changeBorderColor", mergeButtonAction,    mergeButtonClick ],
            ["addText", mergeButtonAction,              mergeButtonClick ],
            ["editVertex", mergeButtonAction,           mergeButtonClick ],
            ["moveRegion", mergeButtonAction,           mergeButtonClick ],
            ["splitRegion", extendedMenuActionCancel,          mergeButtonClick ],
            ["deleteRegion", extendedMenuActionCancel,         mergeButtonClick ],
            ["undo", null,                 undoButtonClick ],
            ["redo", null,                 redoButtonClick ],
        ]
       
        for(let index in customButtonCollection){
            const [name,action,onClickHandler] = customButtonCollection[index]

            map.pm.Toolbar.createCustomControl({
                className:name,
                name: name,
                title: name,
                block: 'edit',
                actions: action,
                onClick: ()=>{onClickHandler()}
            });
        }




            L.pm.addControls({
                position: 'topleft',
                drawMarker: false,
                drawText: false,
                drawPolyline: false,
                drawRectangle: false,
                drawPolygon: true,
                drawCircle: false,
                drawCircleMarker:false,

                rotateMode: false, //last 4 that are removed are below
                removalMode:false,
                cutPolygon:false,
                dragMode:false,
                editMode:true
            });
            L.pm.setGlobalOptions({
                continueDrawing: true,
                editable: false,
                limitMarkersToCount: 50,
                removeVertexOn: "contextmenu" //right click on verticies to remove
            });
            console.log("mount ")
         
            
        }

    }, [context]);
};

export default GeomanJsWrapper;