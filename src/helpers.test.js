import {
  getOpeningTimes,
  transformToSortedWeekTimes,
  pairCorrespondingOpeningAndClosingTimes,
  groupToDayByOpeningTime,
  singleTimeRangeOpeningToDisplayFormat
} from './helpers'
import openingTimesJson from './opening_times.json'

describe('transformToWeekTimes', () => {
  it('transform times to use week time and sort them by opening times', () => {
    expect(transformToSortedWeekTimes({
      monday: [
        {
          type: "open",
          value: 32400
        },
        {
          type: "close",
          value: 72000
        }],
      tuesday: [
        {
          type: "close",
          value: 72000
        },
        {
          type: "open",
          value: 32400
        }]
    })).toEqual([
      {
        type: "open",
        value: 32400
      },
      {
        type: "close",
        value: 72000
      },
      {
        type: "open",
        value: 118800
      },
      {
        type: "close",
        value: 158400
      }
    ])
  })
})

describe('pairCorrespondingOpeningAndClosingTimes', () => {
  it('put times in pairs consisting of opening and corresponding closing time', () => {
    expect(pairCorrespondingOpeningAndClosingTimes([
      {
        type: "open",
        value: 32400
      },
      {
        type: "close",
        value: 72000
      },
      {
        type: "open",
        value: 118800
      },
      {
        type: "close",
        value: 158400
      }
    ])).toEqual([
      {
        open: 32400,
        close: 72000,
      }, {
        open: 118800,
        close: 158400
      }
    ])
  })
})

describe('groupToDayByOpeningTime', () => {
  expect(groupToDayByOpeningTime([
    {
      open: 32400,
      close: 72000,
    }, {
      open: 118800,
      close: 158400
    }])).toEqual({
    monday: [{
      open: 32400,
      close: 72000,
    }],
    tuesday: [{
      open: 32400,
      close: 72000
    }],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  })
})

describe('getOpeningTimes', () => {
  it('works for one opening range for a day', () => {
    expect(getOpeningTimes({
      monday: [
        {
          type: "open",
          value: 32400
        },
        {
          type: "close",
          value: 72000
        }]
    })).toEqual({
      monday: [{
        open: 32400,
        close: 72000,
      }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    })
  })

  it('returns empty array for empty days input', () => {
    expect(getOpeningTimes({
      monday: []
    })).toEqual({
      monday: [],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    })
  })

  it('works for the case of multiple opening times on single day', () => {
    expect(getOpeningTimes({
      monday: [
        {
          type: "open",
          value: 32400
        },
        {
          type: "close",
          value: 39600
        },
        {
          type: "open",
          value: 57600
        },
        {
          type: "close",
          value: 82800
        }]
    })).toEqual({
      monday: [{
        open: 32400,
        close: 39600,
      }, {
        open: 57600,
        close: 82800,
      }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    })
  })

  it('works for multiple days', () => {
    expect(getOpeningTimes({
      monday: [
        {
          type: "open",
          value: 32400
        },
        {
          type: "close",
          value: 39600
        }],
      tuesday: [
        {
          type: "open",
          value: 57600
        },
        {
          type: "close",
          value: 82800
        }]
    })).toEqual({
      monday: [{
        open: 32400,
        close: 39600,
      }],
      tuesday: [{
        open: 57600,
        close: 82800,
      }],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    })
  })

  it('works in case when closing time is already on the next day', () => {
    expect(getOpeningTimes({
      monday: [
        {
          type: "open",
          value: 32400
        }],
      tuesday: [
        {
          type: "close",
          value: 3600
        }]
    })).toEqual({
      monday: [{
        open: 32400,
        close: 3600,
      }],
      tuesday: [],
      wednesday: [],
      thursday: [],
      friday: [],
      saturday: [],
      sunday: []
    })
  })

  it('works for more complex input', () => {
    expect(getOpeningTimes(openingTimesJson))
      .toEqual({
        monday: [],
        tuesday: [{
          open: 36000,
          close: 64800
        }],
        wednesday: [],
        thursday: [{
          open: 36000,
          close: 64800
        }],
        friday: [{
          open: 36000,
          close: 3600
        }],
        saturday: [{
          open: 36000,
          close: 3600
        }],
        sunday: [{
          open: 43200,
          close: 75600
        }]
      })
  })
})

describe('singleTimeRangeOpeningToDisplayFormat', () => {
  it('return times in correct 12 hour format as strings', () => {
    expect(singleTimeRangeOpeningToDisplayFormat({
      open: 32400,
      close: 72000
    })).toEqual('9 AM - 8 PM')
  })

  it('display minutes part if neccesary', () => {
    expect(singleTimeRangeOpeningToDisplayFormat({
      open: 34200,
      close: 75600
    })).toEqual('9:30 AM - 9 PM')
  })

  it('works regardless of order of input object props', () => {
    expect(singleTimeRangeOpeningToDisplayFormat({
      close: 3600,
      open: 72000
    })).toEqual('8 PM - 1 AM')
  })
})