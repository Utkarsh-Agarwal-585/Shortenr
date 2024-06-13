# Shortenr
Shortenr is a tool designed to shorten URLs, ensuring they remain active for only 5 minutes.

## Installation

Clone the project

```bash
  git clone https://github.com/Utkarsh-Agarwal-585/Shortenr.git
```

Install dependencies and run the server

```bash
  npm i
```

```bash
  npm run dev
```

It will Start the server on `port:3000`



## Environment Variables

To run this project, you will need to add the environment variables to your .env file.

For reference, check Sample [.env file](./.env.example)

## Using Prisma Migrate

To migrate the db or schema
```
npx prisma generate 
``` 
```
npx prisma db push
``` 

Note: Instead of `init` use any commit message

## MongoDB Cluster

Create a cluster and database in MongoDB to store the application's data.