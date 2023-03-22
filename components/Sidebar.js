import { FixedSizeList } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import TrackTile from "./TrackTile";

import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIosNew';

import styles from "./Sidebar.module.css";
import { useEffect, useState, useRef } from "react";
import { Chip, IconButton, Slide } from "@mui/material";

export default function Sidebar({ loading, list, activeMarkerIndex, setActiveMarkerIndex }) {
  const [show, setShow] = useState(true);
  const listRef = useRef(null);
  const Item = ({ index, style }) => {
    return (

    <div onClick={() => setActiveMarkerIndex(index)} style={{...style, cursor: "pointer"}}>
      <TrackTile loading={loading} track={list[index]} selected={(activeMarkerIndex === index)}/>
    </div>
  )};

  const scrollToItem = (index) => {
    listRef.current.scrollToItem(index);
  };

  useEffect(() => {
    if (activeMarkerIndex != null) {
      scrollToItem(activeMarkerIndex);
    }
  }, [activeMarkerIndex])

  return (

    <>
    { !show &&
    <IconButton sx={{position: "fixed", top: "50%", left: "0px", zIndex: "0"}} onClick={() => setShow(!show)} ><ArrowForwardIosIcon /></IconButton>
    }
    <Slide in={show} direction="right">
    <div
        className={styles.sidebarContainer}
        >
        { show && <IconButton sx={{position: "fixed", top: "50%", left: "360px", zIndex: "1000"}} onClick={() => setShow(!show)} ><ArrowBackIosIcon /></IconButton>}

        {/* <div className={styles.scrollableRow}>
          <Chip label="recently played"/>
          <Chip label="liked songs" variant="outlined"/>
          <Chip label="CRAZY PLAYLIST" variant="outlined"/>
          <Chip label="hello" variant="outlined"/>
          <Chip label="hello" variant="outlined"/>
          <Chip label="hello" variant="outlined"/>
          </div> */}

      <AutoSizer disableWidth>
        {({ height }) => {
          return (
            <FixedSizeList
            className={styles.list}
              height={height - 1} // -62 - 1 if including scrollableRow
              width={340}
              itemSize={110}
              itemCount={list.length}
              ref={listRef}
              // overscanCount={5}
            >
              {Item}
            </FixedSizeList>
          );
        }}
      </AutoSizer>
      </div>
      </Slide>
      </>
  );
}
