import { Configuration } from "../src/configuration";

jest.mock('fs');

describe('configuration', () => {
    beforeAll(() => {
        const testConfig = {
            url: 'test',
            country: 'US',
            state: 'WA',
            city: 'Seattle',
            department: 'Eng'
        };

        require('fs').__readFileSyncSetter(testConfig);
    });

    test('test configuration loading', () => {
        const config = Configuration.fromPath("");

        const expected = {
            url: 'test',
            country: 'US',
            state: 'WA',
            city: 'Seattle',
            department: 'Eng'
        };

        expect(config).toEqual(expected);
    });
});