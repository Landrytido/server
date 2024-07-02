# How to use this boilerplate

There are several tutorial videos [here](https://drive.google.com/drive/folders/11jKS2VdiFqXFu3IMn8WSvtm78ff3Ox0F).

1. Copy all the files in a new folder (repository)
2. Install dependencies using `yarn`
3. Replace the project name in the `package.json`, line 2 `name`
4. Make sure your database is ready by running [Mysql 5.7](https://github.com/hdmnetwork/mysql5.7) and creating your database `create database myprojectdb`
5. Copy `.env.example` in `.env`
6. Replace all `{myprojectname}` occurrences by the project name (careful to name your database accordingly) in your `.env` file
7. Run project using `yarn start:dev`

## The file `.env` explained 

```
APP_ENV==/* Environment variable - keep it as "local" */
JWT_SECRET==/* The JWT secret key for encoding token s - Change it by another one, not required */
DATABASE_URL=/* The database URL - Replace it by your credentials */
API_PORT=/* API Port (3030) - do not change it */
WORKERS_PORT=/* Workers (3032) must run at different port for safety - do not change it */
GRAPHQL_PLAYGROUND_ENABLED=/* ensures the availability of the GraphQL playground */
CDN_ACCESS_KEY_ID= /* contains the public HDM CDN key id - do not change it - ask for it to your TL */
CDN_ACCESS_KEY= /* contains the public HDM CDN key - do not change it - ask for it to your TL */
CDN_PUBLIC_URL= /* contains the public HDM CDN URL - do not change it - ask for it to your TL */
```
