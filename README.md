# 🚀 MyWebCompanion Backend
##🗒️ Prerequisites
### Step 1: Clone the repository
```bash
git clone https://github.com/hdmnetwork/MyWebCompanion-Server-NGQL.git
```
### Step 2: Navigate to the project directory
```bash
cd MyWebCompanion-Server-NGQL
```
### Step 3: Install dependencies
```bash
yarn
```
### Step 4: Set up environment variables
```bash
cp .env.example .env
```
### Step 5: Complete the .env file
Fill in the `.env` file with the necessary information.
> 💡 **Tip**: Ask your colleagues for any missing access keys or information.
## 🐋 Docker Deployment
### Option 1: Recommended Method
1. Create a Docker network:
```bash
docker network create mwc-network
```
2. Install Docker extension for VS Code
3. Open the `docker-compose.yml` file and use the play button next to the `hdm-mwc-api` and `mysql` services to run them individually.
### Option 2: Command Line Method
1. Create a Docker network:
```bash
docker network create mwc-network
```
2. Deploy the backend using Docker Compose:
```bash
cd MyWebCompanion-Server-NGQL
docker-compose up -d
```
3. Deploy the frontend using Docker Compose:
```bash
cd MyWebCompanion-Client-React
docker-compose up -d
```
## 📊 Import David's Data (Optional)
1. First, create a David account on the frontend!
2. Navigate to the backend folder:
```bash
cd MyWebCompanion-Server-NGQL
```
3. Run the script to import the data:
```bash
yarn start:cli -- importLegacy -e <email>
```
> **Note**: You can pass the `-k` option to keep existing data. Without this option, existing data (notes, links, link groups) will be deleted before importing.
## 💻 Development Commands
### Start the development server (if not using hdm-mwc-api service):
```bash
yarn run start
```
### Access the database:
```bash
npx prisma studio
```
### After merging (to avoid errors):
```bash
npx prisma migrate dev
npx prisma generate
```
## 🔎 Need Help?
Don't hesitate to contact the development team if you encounter any difficulties!
## 💻 Happy coding!