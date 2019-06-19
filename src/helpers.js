import moment from "moment";
import {pipe, map, toPairs, flatten, sort, sortBy, prop, filter, zip, groupBy, fromPairs, descend, join} from "ramda";

const secondsInDay = 24 * 3600

export const daysOfTheWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']

export const transformToSortedWeekTimes =
  pipe(toPairs, map(([day,times]) => map(({type, value}) => ({
    type,
    value: value + daysOfTheWeek.indexOf(day) * secondsInDay
  }), times)), flatten, sortBy(prop('value')))

const filterByType = filterType => filter(({type}) => type === filterType)

export const pairCorrespondingOpeningAndClosingTimes = times =>
  pipe(zip, map(([a, b]) => ({
    [a.type]: a.value,
    [b.type]: b.value
  })))(filterByType('open')(times), filterByType('close')(times))

export const groupToDayByOpeningTime = times => {
  const resultTimes = groupBy(({open}) => daysOfTheWeek[Math.floor(open / secondsInDay)], times)
  const resultTimesWithDayTimes = map(map(map(times => times % secondsInDay)), resultTimes) // converse back times from week to day ones
  const initialDays = pipe(map((dayName) => [dayName, []]), fromPairs)(daysOfTheWeek)
  return {
    ...initialDays,
    ...resultTimesWithDayTimes
  }
}

export const getOpeningTimes = pipe(transformToSortedWeekTimes, pairCorrespondingOpeningAndClosingTimes, groupToDayByOpeningTime)

const formatUnixTime = timeInSeconds => {
  const utcTime = moment.unix(timeInSeconds).utc()
  if (utcTime.minutes() === 0) {
    return utcTime.format('h A')
  } else {
    return utcTime.format('h:mm A')
  }
}

export const singleTimeRangeOpeningToDisplayFormat = pipe(
  toPairs,
  sort(descend(prop(0))),
  map(([days, times]) => times),
  map(formatUnixTime),
  join(' - ')
)

export const getCurrentDayOfTheWeek = () => daysOfTheWeek[moment().day() - 1]
// to shift day by one, as moment treats Sunday as first day of the week