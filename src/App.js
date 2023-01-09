import "./App.css";
import { ReactComponent as PlayListIcon } from "./assets/PlaylistIcon.svg";
import { ReactComponent as TVShowIcon } from "./assets/TVShowIcon.svg";
import { ReactComponent as SearchIcon } from "./assets/SearchIcon.svg";
import { ReactComponent as MyListIcon } from "./assets/MyListIcon.svg";
import { ReactComponent as MovieIcon } from "./assets/MovieIcon.svg";

import { ReactComponent as WatchLaterIcon } from "./assets/WatchLaterIcon.svg";
import { ReactComponent as RecommendedIcon } from "./assets/RecommendedIcon.svg";

import { ReactComponent as SettingsIcon } from "./assets/SettingsIcon.svg";
import { ReactComponent as LogoutIcon } from "./assets/LogoutIcon.svg";
import { ReactComponent as SunIcon } from "./assets/SunIcon.svg";
import { ReactComponent as ThreeDotIcon } from "./assets/ThreeDotIcon.svg";

import { ReactComponent as PlayIcon } from "./assets/PlayIcon.svg";
import { ReactComponent as AddIcon } from "./assets/AddIcon.svg";
import { useContext, useState , createContext, useRef, useLayoutEffect, useEffect, useMemo} from "react";

import { Button } from "@mui/material";

import { data } from "./data";

const SelectedContext = createContext({});
function NavigationSection(props){
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {props.children}
    </div>
  );
}

function NavigationListItem({ name, Icon }) {
  const { selected, onClick } = useContext(SelectedContext);
  const isSelected = selected === name;
  return (
    <div
      style={{
        marginLeft: "52px",
        display: "flex",
        gap: "12px",
        alignItems: "center",
        cursor: "pointer",
      }}
      onClick={onClick(name)}
    >
      <Icon
        className={`${isSelected ? "selected-svg" : ""}`}
        fill={isSelected ? "black" : "#D4D7DD"}
      />
      <p
        style={{
          color: isSelected ? "#00E0FF" : "#D4D7DD",
          fontSize: "15px",
          fontWeight: "600",
          lineHeight: "37px",
        }}
      >
        {name}
      </p>
    </div>
  );
}

function SearchBarComponent({onCloseClick, onInputChange, inputValue}){
  return (
    <>
      <input
        type="text"
        style={{
          backgroundColor: "transparent",
          border: "none",
          width: "100%",
          margin: "12px",
          lineHeight: "24px",
          fontWeight: "600",
          fontSize: "21px",
          color: "#D4D7DD",
        }}
        value={inputValue}
        onChange={onInputChange}
      />
      <div
        style={{ color: "#D4D7DD", paddingRight: "16px" }}
        onClick={onCloseClick}
      >
        X
      </div>
    </>
  );
}

function Divider() {
  return (
    <hr style={{ backgroundColor: "#394B61", height: "1px", border: "none" }} />
  );
}
const initialActiveIndex = {
  set: false,
  rowIndex: null,
  cardIndex: null,
}

function App() {
  
  const cardContent = useRef(null);
  const [cards, setCards] = useState([]);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filterText,setFilterText] = useState("");
  const [activeIndex, setActiveIndex] = useState({ ...initialActiveIndex });
  function handleNavigationIconClicked(selectedName){
    return ()=>{
      setSelected(selectedName);
    }
  }

  useLayoutEffect(()=>{
    setCards(getCardsByRow(data,cardContent.current?.getBoundingClientRect().width));
  },[filterText])

  useEffect(()=>{
    setActiveIndex({ ...initialActiveIndex });
  },[filterText])

  function getCardsByRow(cards, width) {
    const cardsByRow = [];
    if (!width) return cardsByRow
    let i = 0;
    let j = 0;
    const count = Math.floor(width / 210);
    while (i < cards.length) {
      cardsByRow[j] = [];
      while (i < cards.length) {
        if (cards[i].Title.toLowerCase().includes(filterText.toLowerCase())) {
          cardsByRow[j].push(cards[i]);
        }
        i++;
        if(i%count === 0)break;
      }
      j++;
    }
    return cardsByRow
  }

  function handleSearchIconClick(){
    setShowSearchBar(true);
  }
  function hideSearchBar(e){
    e.stopPropagation();
    setShowSearchBar(false);
  }

  function handleSearchInputChange(e){
    setFilterText(e.target.value);
  }

  const card = useMemo(()=>activeIndex.set &&cards[activeIndex.rowIndex][activeIndex.cardIndex],[activeIndex])
  return (
    <div className="App">
      <LeftNavbar
        selected={selected}
        handleNavigationIconClicked={handleNavigationIconClicked}
        setActiveIndex={setActiveIndex}
        setShowSearchBar={setShowSearchBar}
      />
      <PageContent
        handleSearchIconClick={handleSearchIconClick}
        showSearchBar={showSearchBar}
        hideSearchBar={hideSearchBar}
        handleSearchInputChange={handleSearchInputChange}
        filterText={filterText}
        cardContent={cardContent}
        cards={cards}
        setActiveIndex={setActiveIndex}
        activeIndex={activeIndex}
        card={card}
      />
    </div>
  );
}

function PageContent({
  handleSearchIconClick,
  showSearchBar,
  hideSearchBar,
  handleSearchInputChange,
  filterText,
  cardContent,
  cards,
  card,
  setActiveIndex,
  activeIndex,
}) {
  return (
    <div
      className="content"
      style={{
        backgroundColor: "#273244",
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        paddingLeft: "275px",
        boxSizing: "border-box",
      }}
    >
      <div
        style={{
          height: "136px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 48px",
        }}
      >
        <div style={{ cursor: "pointer" }} onClick={handleSearchIconClick}>
          <div
            style={{
              backgroundColor: showSearchBar ? "#1A2536" : "transparent",
              width: showSearchBar ? "567px" : "0",
              height: "55px",
              borderRadius: "8px",
              transition: "all 0.5s",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <div style={{ paddingLeft: "16px" }}>
              <SearchIcon fill="#D4D7DD" height="23" width="23" />
            </div>
            {showSearchBar ? (
              <>
                <SearchBarComponent
                  onCloseClick={hideSearchBar}
                  onInputChange={handleSearchInputChange}
                  inputValue={filterText}
                />
              </>
            ) : null}
          </div>
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <SunIcon />
          <ThreeDotIcon />
        </div>
      </div>
      {/* Card Content */}
      <div
        ref={cardContent}
        style={{
          display: "flex",
          flexDirection: "column",
          padding: "0 48px",
          width: "100%",
          boxSizing: "border-box",
          overflow: "scroll",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* Calculate Rows */}
          {cards.map((item, index) => {
            const fullCards =
              item.length ===
              Math.floor(
                cardContent.current.getBoundingClientRect().width / 198
              );
            return (
              <RectangularCard
                key={index}
                index={index}
                setActiveIndex={setActiveIndex}
                active={activeIndex.rowIndex === index}
                cards={item}
                activeCard={card}
                rowFull={fullCards}
              />
            );
          })}
          {/* <CardRow cards={cards} /> */}
        </div>
      </div>
    </div>
  );
}

function LeftNavbar({
  setActiveIndex,
  setShowSearchBar,
  selected,
  handleNavigationIconClicked,
}) {
  return (
    <div
      style={{
        backgroundColor: "#1F2A3C",
        position: "absolute",
        width: "275px",
        height: "100%",
      }}
      className="navbar"
    >
      {/* User Profile Pic */}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "11px",
          justifyContent: "center",
          alignContent: "center",
          marginTop: "42px",
          cursor: "pointer",
        }}
        onClick={() => {
          setActiveIndex({ ...initialActiveIndex });
          setShowSearchBar(false);
        }}
      >
        <div
          style={{
            height: "91px",
            width: "91px",
            borderRadius: "50%",
            aspectRatio: 1,
            margin: "0 auto",
            overflow: "hidden",
          }}
        >
          <img
            style={{ width: "91px" }}
            src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8cmFuZG9tJTIwcGVvcGxlfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
          />
        </div>
        <p
          style={{
            color: "#D4D7DD",
            lineHeight: "27.24px",
            fontWeight: "600",
            fontSize: "20px",
            textAlign: "center",
          }}
        >
          Eric Hoffman
        </p>
      </div>
      <Divider />
      {/* Navigation Options */}
      <SelectedContext.Provider
        value={{ selected, onClick: handleNavigationIconClicked }}
      >
        <NavigationSection>
          <NavigationListItem name="Discover" Icon={SearchIcon} />
          <NavigationListItem name="Playlist" Icon={PlayListIcon} />
          <NavigationListItem name="Movie" Icon={MovieIcon} />
          <NavigationListItem name="TV Shows" Icon={TVShowIcon} />
          <NavigationListItem name="My List" Icon={MyListIcon} />
        </NavigationSection>
        <Divider />
        {/* Watch Options */}
        <NavigationSection>
          <NavigationListItem name="Watch Later" Icon={WatchLaterIcon} />
          <NavigationListItem name="Recommended" Icon={RecommendedIcon} />
        </NavigationSection>
        <Divider />
        {/* User Options */}
        <NavigationSection>
          <NavigationListItem name="Settings" Icon={SettingsIcon} />
          <NavigationListItem name="Logout" Icon={LogoutIcon} />
        </NavigationSection>
      </SelectedContext.Provider>
    </div>
  );
}

function RectangularCard({active, cards, activeCard , rowFull, index, setActiveIndex}){
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <ActiveCard active={active} card={activeCard} />
      <div
        className="card"
        style={{
          display: "flex",
          ...(rowFull
            ? {
                justifyContent: "space-between",
              }
            : {
                gap: "20px",
              }),
        }}
      >
        <CardRow
          cards={cards}
          rowIndex={index}
          setActiveIndex={setActiveIndex}
        />
      </div>
    </div>
  );
}

function ActiveCard({active, card}){
  const [visible,setVisible] = useState(true);
  useEffect(()=>{
    // setVisible(false);
    // setTimeout(()=>{
      // setVisible(true);
    // },400)
  },[card])

  return (
    <>
    <div style={{
      position:'absolute',
      height: active ? "389px" : "0",
    }}>

    </div>
    <div
      style={{
        width: "100%",
        height: active ? "389px" : "0",
        backgroundColor: visible ? "#394B61" : "transparent",
        transition: "height 0.4s, visibility 0.4s",
        borderRadius: "11px",
        overflow: "hidden",
        display: "flex",
        visibility: visible ? "visible" : "hidden",
      }}
    >
      <img src={card.Poster} style={{ aspectRatio: 1 }} width="330.7px" />
      <div
        style={{
          paddingLeft: "44px",
          display: "flex",
          flexDirection: "column",
          paddingTop: "34px",
        }}
      >
        <p
          style={{
            paddingBottom: "9px",
            fontSize: "30px",
            lineHeight: "37px",
            fontWeight: 700,
          }}
        >
          {card.Title}
        </p>
        <div style={{ display: "flex", gap: "12px", paddingBottom: "24px" }}>
          <RatingComponent rating={card.imdbRating} visible={visible}/>
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              justifyContent: "flex-start",
            }}
          >
            <p>Year:</p>
            <p>Running Time:</p>
            <p>Directed by:</p>
            <p>Language:</p>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              justifyContent: "flex-start",
            }}
          >
            <p>{card.Year}</p>
            <p>{card.Runtime}</p>
            <p>{card.Director}</p>
            <p>{card.Language}</p>
          </div>
        </div>
        <p style={{ paddingTop: "25px", paddingBottom: "21px" }}>{card.Plot}</p>
        <div
          style={{
            display: "flex",
            flexGrow: 1,
            alignItems: "flex-end",
            paddingBottom: "25px",
            justifyContent: "flex-start",
            gap: "16px",
            justifySelf: "flex-end",
          }}
        >
          <div>
            <Button variant="contained" color="inherit">
              <span style={{ fontWeight: "600" }}>Play Movie</span>
            </Button>
          </div>
          <div style={{ color: "#00E0FF" }}>
            <Button variant="outlined" color="inherit">
              Watch Trailer
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>

  );
}

function RatingComponent({ rating, visible }) {
  const [width,setWidth] = useState(0)
  
  useEffect(()=>{
    const newWidth = (parseFloat(rating)/10 )* 111
    setWidth(newWidth);
  },[rating]);

  return (
    <>
      <div
        style={{
          width: "111px",
          height: "8px",
          borderRadius: "11px",
          overflow: "hidden",
          backgroundColor: "#283647",
        }}
      >
        <div
          style={{
            transition: visible ? "width 0.4s" : "width 0.8s",
            width: width,
            height: "100%",
            backgroundColor: "#00E0FF",
            borderRadius: "11px",
          }}
        ></div>
      </div>
      <p>{rating}</p>
    </>
  );
}

function CardRow(props){
  return props.cards.map((item, index) => (
    <div
      style={{
        height: "278px",
        width: "178px",
        borderRadius: "11px",
        backgroundColor: "#394B61",
        flexShrink: 0,
        cursor: "pointer",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        paddingTop: "10px",
        flexDirection: "column",
      }}
      onClick={() => {
        props.setActiveIndex({
          set: true,
          rowIndex: props.rowIndex,
          cardIndex: index,
        });
      }}
    >
      <div
        style={{
          height: "188px",
          width: "157px",
          overflow: "hidden",
          borderRadius: "6px",
        }}
      >
        <img style={{ width: "157px" }} src={item.Poster} />
      </div>
      <p
        style={{
          paddingTop: "12px",
          lineHeight: "20.43px",
          fontSize: "15px",
          width: "100%",
          paddingLeft: "10px",
          boxSizing: "border-box",
          fontWeight: 600,
          color: "#D4D7DD",
        }}
      >
        {item.Title}
      </p>
      <div
        style={{
          paddingTop: "12px",
          width: "100%",
          paddingLeft: "12px",
          boxSizing: "border-box",
          display: "flex",
          gap: "16px",
        }}
      >
        <PlayIcon />
        <AddIcon />
      </div>
    </div>
  ));
}

export default App;
