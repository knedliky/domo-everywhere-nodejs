const axios = require('axios');
const { findUser, getUser } = require('../../../src/services/userService');

jest.mock('axios');

describe('getUser', () => {
    it('should fetch user data successfully', async () => {
        const username = 'test';
        const accessToken = 'mocked-access-token';
        const datasetResponse = {
            data: {
                numRows: 1,
                columns: ['username', 'embed_id', 'column', 'operator', 'values'],
                rows: [
                    ['test', 'embed123', 'column1', 'operator1', 'value1, value2'],
                ],
            },
        };

        axios.get.mockResolvedValueOnce({ data: { access_token: accessToken } });
        axios.post.mockResolvedValueOnce(datasetResponse);

        const user = await getUser(username);

        expect(axios.get).toHaveBeenCalledWith(expect.any(String), {
            headers: {
                Authorization: expect.any(String),
            },
        });
        expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {
            headers: {
                Authorization: expect.any(String),
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
        });
        expect(user).toEqual({
            username: 'test',
            embedId: 'embed123',
            column: 'column1',
            operator: 'operator1',
            values: ['value1', 'value2'],
        });
    });

    it('should return null if user data is not found', async () => {
        const username = 'nonexistentuser';
        const accessToken = 'mocked-access-token';
        const datasetResponse = {
            data: {
                numRows: 0,
                columns: [],
                rows: [],
            },
        };

        axios.get.mockResolvedValueOnce({ data: { access_token: accessToken } });
        axios.post.mockResolvedValueOnce(datasetResponse);

        const user = await getUser(username);

        expect(user).toBeNull();
    });

    it('should throw an error if API request fails', async () => {
        const username = 'invaliduser';
        const errorMessage = 'API request failed';

        axios.get.mockRejectedValueOnce(new Error(errorMessage));

        await expect(getUser(username)).rejects.toThrow(errorMessage);
    });
});