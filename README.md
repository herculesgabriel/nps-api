# NPS API
### Node app developed during NLW

## What is NLW?
NLW is an event provided by Rocketseat where you can learn a lot and get together with people looking for using technology to change their lives.

## Cool things on the project:
- Handlebars: deal with templates
- Nodemailer: node library to easily deal with mailing
- TypeORM: ORM libray to make database interaction easier
- Yup: deal with data validation
- TypeScript
- Jest

## Installation

Download the repository:
```git bash
$ git clone git@github.com:herculesgabriel/nps-api.git

// or
$ git clone https://github.com/herculesgabriel/nps-api.git
```

Go into folder:
```bash
cd nps-api
```

Install dependencies:
```bash
npm install

// or using yarn
yarn
```

Run migrations:
```bash
npm run typeorm migration:run

// or using yarn
yarn typeorm migration:run
```

Run it:
```bash
npm run dev

// or using yarn
yarn dev
```
