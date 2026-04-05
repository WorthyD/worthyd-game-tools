import {
  textMatchesEquality,
  numberMatchesEquality,
  dateMatchesEquality,
  stateMatchesEquality
} from './filter-matcher';
describe('Filter Matcher', () => {
  describe('textMatchesEquality', () => {
    it('should return false on empty values', () => {
      expect(textMatchesEquality(undefined, 'testing', 'contains')).toBe(false);
      expect(textMatchesEquality('testing', undefined, 'contains')).toBe(true);
      expect(textMatchesEquality('testing', '""', 'contains')).toBe(true);
    });

    it('should work with an OR', () => {
      expect(textMatchesEquality('testing', 'test OR fail', 'contains')).toBe(true);
      expect(textMatchesEquality('testing', 'test OR ""', 'contains')).toBe(true);
      expect(textMatchesEquality('undefined', 'test OR fail', 'contains')).toBe(false);
    });

    it('should work with an AND', () => {
      expect(textMatchesEquality('testing with fail', 'test AND fail', 'contains')).toBe(true);
      expect(textMatchesEquality('test', 'test AND fail', 'contains')).toBe(false);
    });
    it('should work with a contains', () => {
      expect(textMatchesEquality('testing with fail', 'test', 'contains')).toBe(true);
      expect(textMatchesEquality('with fail', 'test', 'contains')).toBe(false);
    });
    it('should work with a is ', () => {
      expect(textMatchesEquality('test', 'test', 'is')).toBe(true);
      expect(textMatchesEquality('testing', 'test', 'is')).toBe(false);
    });
    it('should work with a NotContains', () => {
      expect(textMatchesEquality('with fail', 'test', 'notContains')).toBe(true);
      expect(textMatchesEquality('test with fail', 'test', 'notContains')).toBe(false);
    });
    it('should work with a notIs', () => {
      expect(textMatchesEquality('testing', 'test', 'notIs')).toBe(true);
      expect(textMatchesEquality('test', 'test', 'notIs')).toBe(false);
    });
    it('should throw error', () => {
      expect(() => {
        textMatchesEquality('test', 'test', undefined);
      }).toThrow();
    });
  });

  describe('numberMatchesEquality', () => {
    it('should return true on undefined', () => {
      expect(numberMatchesEquality(1, undefined, 'equalTo')).toBe(true);
    });
    it('should work greater than', () => {
      expect(numberMatchesEquality(10, 5, 'greaterThan')).toBe(true);
      expect(numberMatchesEquality(10, 50, 'greaterThan')).toBe(false);
    });
    it('should work less than', () => {
      expect(numberMatchesEquality(5, 10, 'lessThan')).toBe(true);
      expect(numberMatchesEquality(50, 10, 'lessThan')).toBe(false);
    });
    it('should work equal to ', () => {
      expect(numberMatchesEquality(5, 5, 'equalTo')).toBe(true);
      expect(numberMatchesEquality(5, 10, 'equalTo')).toBe(false);
    });
    it('should throw error  ', () => {
      expect(() => {
        numberMatchesEquality(3, 3, undefined);
      }).toThrow();
    });
  });

  describe('dateMatchesEquality', () => {
    it('should work empty filters', () => {
      expect(dateMatchesEquality('1/1/2000', undefined, 'after')).toBe(true);
      expect(dateMatchesEquality(undefined, '1/1/2000', 'after')).toBe(false);
    });
    it('should work after', () => {
      expect(dateMatchesEquality('1/1/2000', '1/1/1900', 'after')).toBe(true);
      expect(dateMatchesEquality('1/1/2000', '1/1/2001', 'after')).toBe(false);
    });
    it('should work before', () => {
      expect(dateMatchesEquality('1/1/1900', '1/1/2000', 'before')).toBe(true);
      expect(dateMatchesEquality('1/1/2000', '1/1/1900', 'before')).toBe(false);
    });
    it('should work on', () => {
      expect(dateMatchesEquality('1/1/2000', '1/1/2000', 'on')).toBe(true);
      expect(dateMatchesEquality('1/1/2000', '1/2/2000', 'on')).toBe(false);
    });
    it('should throw error  ', () => {
      expect(() => {
        dateMatchesEquality('1/1/1900', '1/1/1900', undefined);
      }).toThrow();
    });
  });
  describe('stateMatchesEquality', () => {
    it('should empty', () => {
      expect(stateMatchesEquality(false, '', 'is')).toBe(true);
      expect(stateMatchesEquality(true, '', 'is')).toBe(true);
    });
    it('should work is', () => {
      expect(stateMatchesEquality(true, 'test', 'is')).toBe(true);
      expect(stateMatchesEquality(false, 'test', 'is')).toBe(false);
    });
    it('should work notIs', () => {
      expect(stateMatchesEquality(false, 'test', 'notIs')).toBe(true);
      expect(stateMatchesEquality(true, 'test', 'notIs')).toBe(false);
    });
    it('should throw error', () => {
      expect(() => {
        //@ts-ignore
        stateMatchesEquality(false, 'test', undefined);
      }).toThrow();
    });
  });
  // describe('textArrayMatchesEquality', () => {
  //   // it('should return false on empty values', () => {
  //   //   // expect(textArrayMatchesEquality([undefined], 'testing', 'contains')).toBe(false);
  //   //   // expect(textArrayMatchesEquality(['testing'], undefined, 'contains')).toBe(true);
  //   //   // expect(textArrayMatchesEquality(['testing'], '""', 'contains')).toBe(true);
  //   // });

  //   // it('should work with an OR', () => {
  //   //   // expect(textArrayMatchesEquality(['testing'], 'test OR fail', 'contains')).toBe(true);
  //   //   // expect(textArrayMatchesEquality(['testing'], 'test OR ""', 'contains')).toBe(true);
  //   //   // expect(textArrayMatchesEquality(['undefined'], 'test OR fail', 'contains')).toBe(false);
  //   // });

  //   // it('should work with an AND', () => {
  //   //   //expect(textArrayMatchesEquality(['test with fail'], 'test AND fail', 'contains')).toBe(true);
  //   //   //expect(textArrayMatchesEquality(['test'], 'test AND fail', 'contains')).toBe(false);
  //   // });
  //   // //it('should work standard', () => {
  //     //expect(textArrayMatchesEquality(['testing', 'with', 'fail'], 'test', 'contains')).toBe(true);
  //     //expect(textArrayMatchesEquality(['test'], 'fail', 'contains')).toBe(false);
  //   //});
  // });
});
