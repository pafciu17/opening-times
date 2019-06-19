import React, { useState } from 'react';
import './App.css';
import {join, pipe, toPairs, map} from 'ramda'
import {getOpeningTimes, singleTimeRangeOpeningToDisplayFormat, getCurrentDayOfTheWeek} from './helpers'
import styled from 'styled-components';
import { ReactComponent as Clock } from './clock.svg';

const OpeningTimesHeader = styled.h1`
  text-align: left;
  font-size: 24px;
  line-height: 30px;
  color: #202125;
  margin: 0;
  border-bottom: 2px solid #000000;
  padding-bottom: 15px;
  & > svg {
    width: 16px;
    height: 16px;
    fill: rgba(32, 33, 37, 0.42);
    padding: 0 10px 0 3px;
  }
`

const TimesWrapper = styled.div`
  width: 360px;
  border-color: rgba(32, 33, 37, 0.42);
  border-width: 1px;
  border-style: solid;
  padding: 20px 32px 32px;
  border-radius: 10px;
  margin: auto;
`

const TimeRow = styled.div`
  font-size: 16px;
  color: #202125;
  font-weight: bold;
  line-height: 22px;
  padding: 6px 3px;
  display: flex;
  flex-flow: row wrap;
  border-bottom: 1px solid rgba(32, 33, 37, 0.08);
`

const ClosedTime = styled.span`
  font-weight: 400;
  color: rgba(32, 33, 37, 0.42)
`

const DayLabel = styled.span`
  flex: 50%;
  text-align: left;
  text-transform: capitalize;
`

const DayTimesWrapper = styled.span`
  flex: 50%;
  text-align: right;
  font-weight: 400;
`
const TodayLabel = styled.span`
  font-size: 12px;
  color: rgba(87, 204, 20, 1);
  text-transform: uppercase;
  padding-left: 5px;
`

const TimesInputWrapper = styled.div`
  width: 360px;
  margin: 10px auto;
  padding: 10px;
`

const ErrorInfo = styled.span`
  font-weight: bold;
  font-size: 16p;
  color: red;
  ${({ show }) => !show && `
    visibility: hidden;
  `}
`

const TimesInput = styled.textarea`
  display: block;
  width: 100%;
  height: 360px;
  ${({ isCorrect }) => !isCorrect && `
    border: 2px solid red;
  `}
`

const DayTimes = ({times}) => {
  if (!times || times.length === 0) {
    return <ClosedTime>Closed</ClosedTime>
  } else {
    return <span>
      {pipe(
        map(singleTimeRangeOpeningToDisplayFormat),
        join(', ')
      )(times)}
    </span>
  }
}

const DayTimeOpening = ({dayLabel, times, isToday}) => (
  <TimeRow>
    <DayLabel>
      {dayLabel} { isToday ? <TodayLabel>Today</TodayLabel> : null }
    </DayLabel>
    <DayTimesWrapper>
      <DayTimes times={times} />
    </DayTimesWrapper>
  </TimeRow>
)

const OpeningTimes = ({currentDayOfTheWeek, openingTimes}) => (
  <TimesWrapper>
    <OpeningTimesHeader>
      <Clock />
      Opening hours
    </OpeningTimesHeader>
    {map(([day, times]) =>
      <DayTimeOpening
        dayLabel={day}
        times={times}
        isToday={currentDayOfTheWeek===day}
      />, toPairs(openingTimes))}
  </TimesWrapper>
)

function App({ defaultOpeningTimes }) {
  const currentDayOfTheWeek = getCurrentDayOfTheWeek()
  const [openingTimesJson, setOpeningTimesJson] = useState(JSON.stringify(defaultOpeningTimes, null, 4));
  const [openingTimes, setOpeningTimes] = useState(defaultOpeningTimes);
  const [isJSONCorrect, setIsJSONCorrect] = useState(true);
  return (
    <div>
      <TimesInputWrapper>
        <ErrorInfo show={!isJSONCorrect}>JSON is invalid</ErrorInfo>
        <TimesInput value={openingTimesJson} isCorrect={isJSONCorrect} onChange={(event) => {
          setOpeningTimesJson(event.target.value)
          try {
            const openingTimeObject = JSON.parse(event.target.value); //also to check if json is valid
            setOpeningTimes(openingTimeObject)
            setIsJSONCorrect(true)
          } catch (e) {
            setIsJSONCorrect(false)
          }
        }}/>
      </TimesInputWrapper>
      <OpeningTimes
        openingTimes={getOpeningTimes(openingTimes)}
        currentDayOfTheWeek={currentDayOfTheWeek}
      />
    </div>
  );
}

export default App;
