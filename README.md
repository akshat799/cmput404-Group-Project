# CMPUT404-project-socialconnection

CMPUT404-project-socialconnection

See project.org (plain-text/org-mode) for a description of the project.

- **Video Demo:** https://www.youtube.com/watch?v=D0KUJdRMXtg
- **Application Link:** [https://social-connection.herokuapp.com/](https://social-connection.herokuapp.com/) 

## Running the Program Locally

socialconnection has two components, a backend and a frontend.

### Running the Backend

⚠️ **Note**: Make sure to have python3 and postgreSQL installed. Reference to
Please refer to our [socialconnection](https://github.com/akshat799/cmput404-Group-Project/wiki/postgreSQL-Instruction)
to learn more about installing and setting up the database.
Go into a terminal window in the root directory of this repository and run

```
python3 -m venv venv
source venv/bin/activate
cd backend/socialnetwork
pip install -r requirements.txt
python3 manage.py runserver
```

Please contact any of the project member to get the `.env` file

### Running the Frontend

⚠️ **Note**: Make sure you have npm installed. If server is not running, the webpage will throw an error.
Go into a terminal window in the root directory of this repository and run

```
cd frontend/socialmediaclient
npm install
npm run dev
```

- For more information about the frontend including references, and client startup, please see our [README](./frontend/socialmediaclient/README.md).
- Please contact any of the project member to get the `.env` file for the client.
- AJAX Documentation is found [here]().

## Running the Test

⚠️ **Note**: Make sure to have python3 and postgreSQL installed. 
Go into a terminal window in the root directory of this repository and run

```
python3 -m venv venv
source venv/bin/activate
cd backend/socialnetwork
pip install -r requirements.txt
python3 manage.py test --keepdb
```

### Frontend and Backend Host

- **Frontend host URL (Client)**: [https://social-connection.herokuapp.com/](https://social-connection.herokuapp.com/)

- **Backend host URL (Server)**: [https://cmput404team18-backend.herokuapp.com/backendapi/](https://cmput404team18-backend.herokuapp.com/backendapi/)

# Repo Contributors

Team Members:

    Akshat Gulati
    Jianbang Chen
    Raghav Chandak
    Jasmine
    Shubham

# Teams with Node Connections

    Team 17
    Team 15
    Team 05


# Project Creation Contributors / Licensing

LICENSE, README.md and project.org files are inherited [Professor Abram Hindle's repo](https://github.com/abramhindle/CMPUT404-project-socialdistribution).

All text is licensed under the CC-BY-SA 4.0 http://creativecommons.org/licenses/by-sa/4.0/deed.en_US

Contributors:

    Karim Baaba
    Ali Sajedi
    Kyle Richelhoff
    Chris Pavlicek
    Derek Dowling
    Olexiy Berjanskii
    Erin Torbiak
    Abram Hindle
    Braedy Kuzma
    Nhan Nguyen

# References


API DOCUMENTATION 
==================

https://github.com/jwadhwa213/cmput404-Group-Project/wiki
