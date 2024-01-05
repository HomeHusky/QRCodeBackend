module.exports = {
    'user': process.env.DB_USER,
    'password': process.env.DB_PASSWORD,
    'server': process.env.DB_HOST,
    'port': 1433,
    'database': process.env.DB_DATABASE,
    'dialect': 'mssql',
    'encrypt': false,
    'pool': {
        'max': 10,
        'min': 0,
        'idleTimeoutMillis': 60000000
    },
    'requestTimeout': 60000000
}