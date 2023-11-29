const axios = require('axios');
const { API_HOST, ACCESS_TOKEN_URL } = require('../config/constants.js');

async function getUser(username) {
    const response = await axios.get(ACCESS_TOKEN_URL, {
        headers: {
            "Authorization": "Basic " + Buffer.from(process.env.CLIENT_ID + ":" + process.env.CLIENT_SECRET).toString("base64")
        }
    });
    const accessToken = response.data.access_token;
    const datasetResponse = await axios.post(`${API_HOST}/v1/datasets/query/execute/${process.env.AUTH_DATASET_ID}`, {
        "sql": "SELECT * FROM table where username = '" + username + "'"
    }, {
        headers: {
            "Authorization": `Bearer ${accessToken}`,
            "Content-Type": 'application/json',
            "Accept": 'application/json',
        },
    });

    if (datasetResponse.data.numRows == 1) {
        const columnNames = datasetResponse.data.columns;
        const data = datasetResponse.data.rows;

        const [user] = data.map(row => {
            const userId = row[columnNames.indexOf('username')];
            const embedId = row[columnNames.indexOf('embed_id')];
            const column = row[columnNames.indexOf('column')];
            const operator = row[columnNames.indexOf('operator')];
            const values = row[columnNames.indexOf('values')].split(',').map(value => value.trim());

            return {
                username: userId,
                config: {
                    visualization1: {
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        embedId: embedId,
                        filters: [{
                            "column": column,
                            "operator": operator,
                            "values": values
                        }]
                    },
                }
            }
        });
        return user;
    }
    return null;
}

async function findUser(username, callback) {
    const user = await getUser(username);
    if (user) {
        return callback(null, user)
    }
    return callback(null)
}

module.exports = findUser;