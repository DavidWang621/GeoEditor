import {useEffect, useRef, useState} from "react";
import { useLeafletContext } from "@react-leaflet/core";
import "@geoman-io/leaflet-geoman-free";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import './geomanButton.css';

function GeomanJsWrapper(props) {
    //with this we can actually customize all of the buttons
    //we can also add a custom merge button as well.
    const context = useLeafletContext();
    const isInitialRender = useRef(true);// in react, when refs are changed component dont re-render

    useEffect( () => {
        if(isInitialRender.current) {// skip initial execution of useEffect
            isInitialRender.current = false;// set it to false so subsequent changes of dependency arr will make useEffect to execute
            return;
        }
        const L = context.layerContainer || context.map;
        const map = L.pm.map
        const leafletContainer = L

        const mergeButtonAction = [
            'merge',
            {
                text: 'merge selected region',
                onClick: () => {
                    props.merge()
                },
            },
        ]

        const customButtonNameList = [
            "merge", "addRegion", "addLegend", "changeBackgroundColor", "changeRegionColor",
            "changeBorderColor", "addText",
            "editVertex", "moveRegion", "splitRegion", "deleteRegion", "undo", "redo"
        ]
        const actionsList = [

        ]
        let onClickFunction = []

        for(let index in customButtonNameList){
            let name = customButtonNameList[index]
            let action = actionsList[index]
            let onClickHandler = onClickFunction[index]

            map.pm.Toolbar.createCustomControl({
                className:name,
                name: name,
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
                drawPolygon: false,
                drawCircle: false,
                drawCircleMarker:false,

                rotateMode: false, //last 4 that are removed are below
                removalMode:false,
                cutPolygon:false,
                dragMode:false,
            });
            L.pm.setGlobalOptions({
                continueDrawing: true,
                editable: false,
                limitMarkersToCount: 50,
                removeVertexOn: "contextmenu" //right click on verticies to remove
            });
            console.log("mount ")

    }, [context]);
};

export default GeomanJsWrapper;