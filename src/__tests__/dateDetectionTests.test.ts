import { detectFormatType } from '../dateHelpers';

describe('Standard Format Detection', () => {
  test('Detects AMERICAN Format', () => {
    expect(detectFormatType('01/01/2018')).toEqual('AMERICAN');
  });

  test('Detects EUROPEAN Format', () => {
    expect(detectFormatType('01/01/2018', true, ['AMERICAN'])).toEqual('EUROPEAN');
  });

  test('Detects JULIAN Format', () => {
    expect(detectFormatType('18-001')).toEqual('JULIAN');
  });

  test('Detects NEWSHAM Format', () => {
    expect(detectFormatType('12000', true, ['THOUSAND'])).toEqual('NEWSHAM');
  });

  test('Detects REGULAR Format', () => {
    expect(detectFormatType('2018-01-01')).toEqual('REGULAR');
  });

  test('Detects THOUSAND Format', () => {
    expect(detectFormatType('17000')).toEqual('THOUSAND');
  });

  test('Detects AMERICAN with standard shortcut if EUROPEAN and REGULAR ruled out', () => {
    expect(detectFormatType('09/02/18', true, ['EUROPEAN', 'REGULAR'])).toEqual('AMERICAN');
  });

  test('Detects EUROPEAN with standard shortcut if AMERICAN and REGULAR ruled out', () => {
    expect(detectFormatType('09/02/18', true, ['AMERICAN', 'REGULAR'])).toEqual('EUROPEAN');
  });

  test('Detects REGULAR with standard shortcut if EUROPEAN and AMERICAN ruled out', () => {
    expect(detectFormatType('09/02/18', true, ['EUROPEAN', 'AMERICAN'])).toEqual('REGULAR');
  });

  test('Throws an error with standard shortcut and JULIAN, THOUSAND, or NEWSHAM formats', () => {
    expect(() => detectFormatType('09/02/18', true, ['THOUSAND', 'NEWSHAM'])).toThrowError('INVALID DATE');
    expect(() => detectFormatType('09/02/18', true, ['JULIAN', 'NEWSHAM'])).toThrowError('INVALID DATE');
    expect(() => detectFormatType('09/02/18', true, ['THOUSAND', 'JULIAN'])).toThrowError('INVALID DATE');
  });

  test('Detects THOUSAND for input of 1 if no ignoredFormats', () => {
    expect(detectFormatType('1')).toEqual('THOUSAND');
  });

  test('Detects JULIAN for input of 1 if THOUSAND ignored', () => {
    expect(detectFormatType('1', true, ['THOUSAND'])).toEqual('JULIAN');
  });

  test('Detects NEWSHAM for input of 1 if THOUSAND and JULIAN', () => {
    expect(detectFormatType('1', true, ['THOUSAND', 'JULIAN'])).toEqual('NEWSHAM');
  });

  test('Detects THOUSAND for input of 01 if no ignoredFormats', () => {
    expect(detectFormatType('01')).toEqual('THOUSAND');
  });

  test('Detects THOUSAND for input of 001 if no ignoredFormats', () => {
    expect(detectFormatType('001')).toEqual('THOUSAND');
  });
});

describe('Percent Format Detection', () => {
  test('Detects %b%d Format', () => {
    expect(detectFormatType('Jan01', false)).toEqual('%b%d');
  });

  test('Detects %b%d%y Format', () => {
    expect(detectFormatType('Jan0118', false)).toEqual('%b%d%y');
  });

  test('Detect %b%d%Y Format', () => {
    expect(detectFormatType('Jan012018', false)).toEqual('%b%d%Y');
  });

  test('Detect %d%b Format', () => {
    expect(detectFormatType('01Jan', false)).toEqual('%d%b');
  });

  test('Detect %d%b%y Format', () => {
    expect(detectFormatType('01Jan18', false)).toEqual('%d%b%y');
  });

  test('Detect %d%b%Y Format', () => {
    expect(detectFormatType('01Jan2018', false)).toEqual('%d%b%Y');
  });

  test('Detect %d-%m-%y Format', () => {
    expect(detectFormatType('01-01-18', false)).toEqual('%d-%m-%y');
  });

  test('Detect %d-%m-%Y Format', () => {
    expect(detectFormatType('01-01-2018', false)).toEqual('%d-%m-%Y');
  });

  test('Detect %m-%d Format', () => {
    expect(detectFormatType('01-01', false)).toEqual('%m-%d');
  });

  test('Detect %m-%d-%y Format', () => {
    const conflictingFormats = ['%d-%m-%y', '%y-%m-%d'];
    expect(detectFormatType('01-01-18', false, conflictingFormats)).toEqual('%m-%d-%y');
  });

  test('Detect %m-%d-%Y Format', () => {
    const conflictingFormats = ['%d-%m-%Y'];
    expect(detectFormatType('01-01-2018', false, conflictingFormats)).toEqual('%m-%d-%Y');
  });

  test('Detect %j Format', () => {
    const conflictingFormats = [];
    expect(detectFormatType('001', false, conflictingFormats)).toEqual('%j')
  });

  test('Detect %J Format', () => {
    expect(detectFormatType('18-001', false)).toEqual('%J');
  });

  test('Detect %N Format', () => {
    const conflictingFormats = ['%T'];
    expect(detectFormatType('12000', false, conflictingFormats)).toEqual('%N');
  });

  test('Detect %n Format', () => {
    const conflictingFormats = ['%j', '%t'];
    expect(detectFormatType('001', false, conflictingFormats)).toEqual('%n');
  });

  test('Detect %t Format', () => {
    const conflictingFormats = ['%j', '%n'];
    expect(detectFormatType('001', false, conflictingFormats)).toEqual('%t');
  });

  test('Detect %T Format', () => {
    const conflictingFormats = ['%N'];
    expect(detectFormatType('18000', false, conflictingFormats)).toEqual('%T');
  });

  test('Detect %y-%m-%d Format', () => {
    const conflictingFormats = ['%d-%m-%y', '%m-%d-%y'];
    expect(detectFormatType('18-01-01', false, conflictingFormats)).toEqual('%y-%m-%d');
  });

  test('Detect %Y-%m-%d Format', () => {
    expect(detectFormatType('2018-01-01', false)).toEqual('%Y-%m-%d');
  });
});
