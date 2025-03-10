# To deploy the project, you need to follow the steps below:

## Prerequisites
1. Clone the backend repository:
```bash
git clone https://github.com/hdmnetwork/MyWebCompanion-Server-NGQL.git
```

2. Clone the frontend repository:
```bash
git clone https://github.com/hdmnetwork/MyWebCompanion-Client-React.git
```

3. Install the dependencies for the backend:
```bash
cd MyWebCompanion-Server-NGQL
yarn
```

4. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

5. Set the environment variables in the `.env` file:  
Complete the `.env` file with the necessary information.

6. Install the dependencies for the frontend:
```bash
cd MyWebCompanion-Client-React
yarn
```

7. Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```

8. Set the environment variables in the `.env` file:  
Complete the `.env` file with the necessary information.


## Docker deployment

1. Create a network:
```bash
docker network create mwc-network
```

2. Docker compose the backend:
```bash
cd MyWebCompanion-Server-NGQL
docker-compose up -d
```

3. Docker compose the frontend:
```bash
cd MyWebCompanion-Client-React
docker-compose up -d
```

## Import DAVID'S data

1. Create david account on the frontend !!!!

2. Go to the backend folder:
```bash
cd MyWebCompanion-Server-NGQL
```

3. Run the script to import the data:
```bash
yarn start:cli -- importLegacy -e <email>
```
You can pass the option `-k` to keep the existing data, if not, the data (notes, links, link groups) will be deleted before importing.

## Setup your reverse proxy

1. Setup your reverse proxy to redirect the requests to the backend and frontend containers.

## Access the application

1. Access the application in your browser with the URL you set up in the reverse proxy.





